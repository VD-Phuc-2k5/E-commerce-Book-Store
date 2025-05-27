import priceFormat from "../../src/modules/priceFormat.js";
import { removeAction } from "../../src/modules/redux.js";

function removeCartItemHandler(cartItems) {
  const cartListItems = document.querySelector(
    ".cart-content__container__table tbody"
  ).children;
  if (cartListItems) {
    Array.from(cartListItems).forEach((cartListItem, idx) => {
      cartListItem.addEventListener("click", (e) => {
        if (e.target.classList.contains("fa-trash")) {
          const height = cartListItem.offsetHeight + "px";
          const style = getComputedStyle(cartListItem);
          const paddingTop = style.paddingTop;
          const paddingBottom = style.paddingBottom;

          const cartItemFadeOut = cartListItem.animate(
            [
              {
                opacity: 1,
                height: height,
                paddingTop: paddingTop,
                paddingBottom: paddingBottom,
              },
              { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 },
            ],
            {
              duration: 500,
              easing: "ease-in-out",
            }
          );

          cartItemFadeOut.onfinish = () => {
            const action = removeAction(cartItems[idx]);
            window.cartStore.dispatch(action);
            const currentIndex = idx;
            const prevItem = document.querySelector(
              ".cart-content__container__table tbody"
            ).children[currentIndex - 1];
            console.log(prevItem);
            const prevOffsetTop = prevItem?.offsetTop;
            requestAnimationFrame(() => {
              window.scrollTo({
                top: prevItem ? prevOffsetTop : 0,
                behavior: "smooth",
              });
            });
          };
        }
      });
    });
  }
}

function renderCartItems(cartItems) {
  const cartListWrapper = document.querySelector(
    ".cart-content__container__table tbody"
  );

  if (cartListWrapper) {
    cartListWrapper.innerHTML = cartItems
      .map(
        ({ imageUrl, title, cost }, idx) => `
      <tr>
        <td data-label="Thumbnail">
          <img
            src="${imageUrl}"
            alt="thumbnail${idx}.jpg"
        </td>
        <td data-label="Product Title">${title}</td>
        <td data-label="Price">${priceFormat(Number(cost))}</td>
        <td data-label="Quantity">
          <input type="number" value="1" min="1" required />
        </td>
        <td data-label="Total">${priceFormat(Number(cost))}</td>
        <td data-label="Action">
          <i class="fa-solid fa-trash"></i>
        </td>
      </tr>
    `
      )
      .join("");
    removeCartItemHandler(cartItems);
  }
}

function updateNotify(count) {
  const cartContainer = document.getElementById("cart-page-container");

  if (cartContainer) {
    if (count) {
      cartContainer.classList.add("active");
    } else {
      cartContainer.classList.remove("active");
    }
  }
}

window.cartStore.subscribe(() => {
  const state = window.cartStore.getState();
  renderCartItems(state);
  updateNotify(state?.length ?? 0);
});

// Dispatch an empty action to trigger the initial render
window.cartStore.dispatch({});

/*
  const fullCart = document.getElementById("cart-content");
*/

// function renderCartFromData() {
//   const emptyCart = document.getElementById("empty-cart");
//   const fullCart = document.getElementById("cart-content");
//   const tbody = document.querySelector(
//     ".cart-content__container__list__table tbody"
//   );

//   tbody.innerHTML = "";

//   if (cartList.length === 0) {
//     emptyCart.style.display = "block";
//     fullCart.style.display = "none";
//     return;
//   } else {
//     emptyCart.style.display = "none";
//     fullCart.style.display = "block";

//     cartList.forEach((item, index) => {
//       const price = parseInt(item.cost);
//       const quantity = 1;
//       const subtotal = price * quantity;

//       const itemHTML = `
//                 <tr class="cart-form__cart-item cart-item" data-id="${item.id}">
//                     <td class="product-thumbnail">
//                         <a href="#">
//                             <img src="${
//                               item.imageUrl
//                             }" width="100" height="100">
//                         </a>
//                     </td>
//                     <td class="product-name"><a href="#">${item.title}</a></td>
//                     <td class="product-price" data-price="${price}">
//                         <span class="Price">
//                             <bdi>${priceFormat(
//                               price
//                             )}&nbsp;<span id="currency-icon">₫</span></bdi>
//                         </span>
//                     </td>
//                     <td class="product-quantity">
//                         <div class="quantity">
//                             <label for="quantity_${index}" class="render-text">${
//         item.title
//       } quantity</label>
//                             <input type="number" id="quantity_${index}" class="input-text quantity-input" value="${quantity}" min="1" step="1">
//                         </div>
//                     </td>
//                     <td class="product-subtotal">
//                     <span class="Price subtotal">
//                         <bdi>${priceFormat(
//                           subtotal
//                         )}&nbsp;<span id="currency-icon">₫</span></bdi>
//                     </span>
//                     </td>
//                     <td class="product-remove">
//                     <a href="#" class="remove" aria-label="Remove ${
//                       item.title
//                     } from cart">
//                         <i class="fas fa-times"></i>
//                     </a>
//                     </td>
//                 </tr>

//             `;
//       tbody.insertAdjacentHTML("beforeend", itemHTML);
//     });

//     // Xử lý sự kiện cập nhật subtotal khi thay đổi số lượng
//     const quantityInputs = tbody.querySelectorAll(".quantity-input");
//     quantityInputs.forEach((input) => {
//       input.addEventListener("input", function () {
//         const row = input.closest("tr");
//         const price = parseInt(
//           row.querySelector(".product-price").dataset.price
//         );
//         const quantity = parseInt(input.value) || 0;
//         const subtotal = price * quantity;

//         const subtotalElement = row.querySelector(".subtotal bdi");
//         subtotalElement.innerHTML = `${priceFormat(
//           subtotal
//         )}&nbsp;<span id="currency-icon">₫</span>`;
//         updateSummary();
//       });
//     });

//     // Xử lý sự kiện xóa sản phẩm
//     const removeButtons = tbody.querySelectorAll(".remove");
//     removeButtons.forEach((button) => {
//       button.addEventListener("click", function (e) {
//         e.preventDefault();
//         const row = button.closest("tr");
//         const id = parseInt(row.dataset.id);
//         const index = cartList.findIndex((item) => item.id === id);
//         if (index !== -1) {
//           cartList.splice(index, 1);
//           renderCartFromData(); // render lại sau khi xóa
//           updateSummary(); //update giá sau khi xóa
//         }
//       });
//     });
//   }
// }

// function updateSummary() {
//   const rows = document.querySelectorAll(".cart-form__cart-item");
//   let subtotal = 0;

//   rows.forEach((row) => {
//     const price = parseInt(row.querySelector(".product-price").dataset.price);
//     const quantity = parseInt(row.querySelector(".quantity-input").value) || 0;
//     subtotal += price * quantity;
//   });

//   const subtotalElement = document.querySelector(
//     ".subtotals .product-subtotal bdi"
//   );
//   if (subtotalElement) {
//     subtotalElement.innerHTML = `${priceFormat(
//       subtotal
//     )}&nbsp;<span id="currency-icon">₫</span>`;
//   }

//   const shipping = document.getElementById("shipping_pickup1").checked
//     ? 35000
//     : 0;

//   const total = subtotal + shipping;

//   const totalElem = document.querySelector(".order-total .Price bdi");
//   if (totalElem) {
//     totalElem.innerHTML = `${priceFormat(
//       total
//     )}&nbsp;<span id="currency-icon">₫</span>`;
//   }
// }

// function App() {
//   renderCartFromData();
//   updateSummary();
//   document
//     .querySelectorAll('input[name="shipping_method"]')
//     .forEach((radio) => {
//       radio.addEventListener("change", updateSummary);
//     });
// }

// App();
