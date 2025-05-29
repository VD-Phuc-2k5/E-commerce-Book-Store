import priceFormat from "../../src/modules/priceFormat.js";
import { removeAction } from "../../src/modules/redux.js";

// Cache DOM elements to avoid redundant queries
const subTotal = document.querySelector("#subTotal");
const total = document.querySelector("#total");
const cartListWrapper = document.querySelector(
  ".cart-content__container__table tbody"
);
const cartContainer = document.getElementById("cart-page-container");
const shipMethods = Array.from(
  document.querySelectorAll('input[name="shipMethod"]')
);

// Helper function to calculate shipping cost
function getShippingCost() {
  const selectedMethod = shipMethods.find((shipMethod) => shipMethod.checked);
  return selectedMethod
    ? Number(selectedMethod.getAttribute("data-shippingCost"))
    : 0;
}

// Update summary (subtotal and total)
function updateSummary(cartItems) {
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
  Array.from(cartListWrapper.children).forEach((row, idx) => {
    const totalCell = row.querySelector('[data-label="Total"]');
    const { cost, quantity } = cartItems[idx];
    if (totalCell) {
      totalCell.innerHTML = priceFormat(Number(cost) * quantity);
    }
  });
}

// Handle quantity updates
function handleQuantityChange(cartItems) {
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
  shipMethods.forEach((shipMethod) => {
    shipMethod.addEventListener("change", () => {
      updateSummary(cartItems); // Recalculate totals when shipping method changes
    });
  });
}

// Handle item removal with animation
function handleRemoveItem(cartItems) {
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
          window.cartStore.dispatch(action);

          // Remove the item from the DOM
          cartListItem.remove();

          // Scroll to the previous item smoothly
          const prevItem = cartListWrapper.children[idx - 1];
          const prevOffsetTop = prevItem?.offsetTop || 0;
          window.scrollTo({ top: prevOffsetTop, behavior: "smooth" });
        };
      }
    }
  });
}

// Render cart items dynamically
function renderCartItems(cartItems) {
  if (cartListWrapper) {
    cartListWrapper.innerHTML = cartItems
      .map(
        ({ imageUrl, title, cost, quantity }, idx) => `
          <tr>
            <td data-label="Thumbnail">
              <img src="${imageUrl}" alt="thumbnail${idx}.jpg" />
            </td>
            <td data-label="Product Title">
              <a href="#">${title}</a>
            </td>
            <td data-label="Price">${priceFormat(Number(cost))}</td>
            <td data-label="Quantity">
              <input type="number" value="${quantity}" min="1" required pattern="\\d*" />
            </td>
            <td data-label="Total">${priceFormat(Number(cost) * quantity)}</td>
            <td data-label="Action">
              <i class="fa-solid fa-trash" aria-label="Remove Item"></i>
            </td>
          </tr>
        `
      )
      .join("");

    updateSummary(cartItems);
  }
}

// Update cart notification (visibility)
function updateNotify(count) {
  if (cartContainer) {
    cartContainer.classList.toggle("active", count > 0);
  }
}

// Subscribe to store updates
window.cartStore.subscribe(() => {
  const state = window.cartStore.getState();
  renderCartItems(state);
  updateNotify(state?.length ?? 0);
});

// Initialize cart functionality
function initializeCart() {
  const state = window.cartStore.getState();
  renderCartItems(state);
  handleQuantityChange(state);
  handleShippingChange(state); // Add shipping method change handler
  handleRemoveItem(state);
  updateNotify(state?.length ?? 0);

  // Dispatch an empty action to trigger the initial render
  window.cartStore.dispatch({});
}

initializeCart();
