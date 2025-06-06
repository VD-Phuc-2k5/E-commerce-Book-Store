import pagination from "../../src/modules/pagination.js";
import priceFormat from "../../src/modules/priceFormat.js";
import { removeAction } from "../../src/modules/redux.js";
import { getCartStore, getWishStore } from "../../src/modules/store.js";

// Helper function to calculate shipping cost
function getShippingCost() {
  const shipMethods = Array.from(
    document.querySelectorAll('input[name="shipMethod"]')
  );
  const selectedMethod = shipMethods.find((shipMethod) => shipMethod.checked);
  return selectedMethod
    ? Number(selectedMethod.getAttribute("data-shippingCost"))
    : 0;
}

// Update summary (subtotal and total)
function updateSummary(cartItems) {
  const subTotal = document.querySelector("#subTotal");
  const total = document.querySelector("#total");

  const totalCost = cartItems.reduce(
    (total, { cost, quantity }) => total + Number(cost) * quantity,
    0
  );
  const shippingCost = getShippingCost();

  if (subTotal && total) {
    subTotal.innerHTML = priceFormat(totalCost);
    total.innerHTML = priceFormat(totalCost + shippingCost);
  }
}

// Update total cost in the table for each item
function updateItemTotal(cartItems) {
  const cartListWrapper = document.querySelector(
    ".cart-content__container__table tbody"
  );

  Array.from(cartListWrapper.children).forEach((row, idx) => {
    const totalCell = row.querySelector('[data-label="Total"]');
    const { cost, quantity } = cartItems[idx];
    if (totalCell) {
      totalCell.innerHTML = priceFormat(Number(cost) * quantity);
    }
  });
}

// Handle quantity updates
function handleQuantityChange(cartItems, cartListWrapper) {
  cartListWrapper.addEventListener("change", (e) => {
    if (e.target.matches("input[type='number']")) {
      const idx = Array.from(cartListWrapper.children).indexOf(
        e.target.closest("tr")
      );
      const quantity = Number(e.target.value);

      if (quantity >= 1) {
        cartItems[idx].quantity = quantity;
        updateItemTotal(cartItems);
        updateSummary(cartItems);
      } else {
        e.target.value = 1;
      }
    }
  });
}

// Handle shipping method changes
function handleShippingChange(cartItems) {
  const shipMethods = Array.from(
    document.querySelectorAll('input[name="shipMethod"]')
  );
  shipMethods.forEach((shipMethod) => {
    shipMethod.addEventListener("change", () => {
      updateSummary(cartItems);
    });
  });
}

// Handle item removal with animation
function handleRemoveItem(cartItems, cartListWrapper) {
  cartListWrapper.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-trash")) {
      const cartListItem = e.target.closest("tr");
      const idx = Array.from(cartListWrapper.children).indexOf(cartListItem);

      if (idx !== -1) {
        const height = `${cartListItem.offsetHeight}px`;
        const style = getComputedStyle(cartListItem);

        // Animate the removal of the item
        const cartItemFadeOut = cartListItem.animate(
          [
            {
              opacity: 1,
              height: height,
              paddingTop: style.paddingTop,
              paddingBottom: style.paddingBottom,
            },
            { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 },
          ],
          { duration: 500, easing: "ease-in-out" }
        );

        cartItemFadeOut.onfinish = () => {
          // Remove the item from the cartItems array
          const removedItem = cartItems.splice(idx, 1);

          // Dispatch the updated cartItems array to the store
          const action = removeAction(removedItem[0]);
          getCartStore().dispatch(action);

          // Remove the item from the DOM
          cartListItem.remove();
        };
      }
    }
  });
}

// Render cart items dynamically
function renderCartItems(cartItems, selector) {
  selector.innerHTML = "";
  const table = document.createElement("table");
  table.classList.add("cart-content__container__table");
  table.style = "width: 100%;";
  table.innerHTML = `
    <thead>
        <tr>
          <th>Thumbnail</th>
          <th>Product Title</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${cartItems
          .map(
            ({ id, imageUrl, title, cost, quantity }, idx) => `
              <tr>
                <td data-label="Thumbnail">
                  <img src="${imageUrl}" alt="thumbnail${idx}.jpg" />
                </td>
                <td data-label="Product Title">
                  <a href="/product?id=${id}">${title}</a>
                </td>
                <td data-label="Price">${priceFormat(Number(cost))}</td>
                <td data-label="Quantity">
                  <input type="number" value="${quantity}" min="1" required pattern="\\d*" />
                </td>
                <td data-label="Total">${priceFormat(
                  Number(cost) * quantity
                )}</td>
                <td data-label="Action">
                  <i class="fa-solid fa-trash" aria-label="Remove Item"></i>
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
  `;

  const cartListWrapper = table.querySelector("tbody");

  updateSummary(cartItems);
  updateNotify(cartItems?.length ?? 0);
  handleRemoveItem(cartItems, cartListWrapper);
  handleQuantityChange(cartItems, cartListWrapper);
  handleShippingChange(cartItems);

  // prevent default event of tag a
  const aEl = document.querySelectorAll("a");
  aEl.forEach((aDom) => {
    aDom.addEventListener("click", (e) => {
      e.preventDefault();
      window.appRouter.navigate(e.currentTarget.getAttribute("href"));
    });
  });

  selector.appendChild(table);
}

// Update cart notification (visibility)
function updateNotify(count) {
  const cartContainer = document.getElementById("cart-page-container");
  if (cartContainer) {
    cartContainer.classList.toggle("active", count > 0);
  }
}

// Subscribe to store updates
getCartStore().subscribe(() => {
  const state = getCartStore().getState();
  pagination(3, "cart", renderCartItems);
  updateNotify(state?.length ?? 0);
});

getCartStore().dispatch({});
