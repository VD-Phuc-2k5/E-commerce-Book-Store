import priceFormat from "./priceFormat.js";
import { removeAction } from "./redux.js";
import { getCartStore } from "./store.js";

// cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.data];
    case "REMOVE":
      return state.filter((item) => item !== action.data);
    default:
      return state;
  }
}

// render
function addRemoveHanlde(data) {
  const cartListItems = document.querySelectorAll(".sidebar__body__list__item");
  cartListItems.forEach((cartListItem, idx) => {
    cartListItem.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("fa-trash") ||
        e.target.classList.contains("sidebar__body__list__item__trash")
      ) {
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
            duration: 300,
            easing: "ease-in-out",
          }
        );

        cartItemFadeOut.onfinish = () => {
          const action = removeAction(data[idx]);
          getCartStore().dispatch(action);
        };
      }
    });
  });
}

export function render(data) {
  const cart = document.querySelector("#cart");
  const cartList = cart.querySelector(".sidebar__body__list");
  const cartItemsDom = data
    .map(({ imageUrl, title, author, cost }) => {
      return `
            <div class="sidebar__body__list__item">
                <img
                    src='${imageUrl}'
                    alt='${imageUrl}'
                    class='sidebar__body__list__item__image'
                />
            
                <div class='sidebar__body__list__item__body'>
                    <div class='sidebar__body__list__item__body__title'>${title}</div>
                    <div class='sidebar__body__list__item__body__author'>By ${author}</div>
                    <div class='sidebar__body__list__item__body__cost'>${priceFormat(
                      Number(cost)
                    )}</div>
                </div>
            
                <div class='sidebar__body__list__item__trash'>
                    <i class='fa-solid fa-trash'></i>
                </div>
            </div>
        `;
    })
    .join("");
  cartList.innerHTML = cartItemsDom;
  addRemoveHanlde(data);
}

export function updateNotify(count) {
  const cart = document.querySelector("#cart");
  const notify = cart.querySelector(".header__nav__elementor--item.notify");
  const cartFooter = cart.querySelector(
    ".elementor--item__overlay__sidebar__footer"
  );
  const cartCost = cart.querySelector(
    ".elementor--item__overlay__sidebar__total_cost"
  );
  notify.setAttribute("data-count", count);
  if (count) {
    cart.classList.remove("empty");
  } else {
    const cartCostFadeOut = cartCost.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 400,
      easing: "ease-in-out",
    });

    const cartFooterFadeOut = cartFooter.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: 400,
        easing: "ease-in-out",
      }
    );

    Promise.all([cartCostFadeOut.finished, cartFooterFadeOut.finished]).then(
      () => {
        cart.classList.add("empty");
      }
    );
  }
}

export function updateTotalCost(cartItems) {
  const cart = document.querySelector("#cart");
  const totalCostDom = cart.querySelector(".cart__total_price");
  const totalCostFadeIn = totalCostDom.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    {
      duration: 350,
    }
  );
  const totalCost = cartItems.reduce(
    (prevCost, { cost: currCost }) => Number(currCost) + prevCost,
    0
  );
  totalCostFadeIn.onfinish = () => {
    totalCostDom.innerText = priceFormat(totalCost);
  };
}

export default cartReducer;
