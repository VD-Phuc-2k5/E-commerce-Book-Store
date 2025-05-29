import priceFormat from "./priceFormat.js";
import { removeAction } from "./redux.js";

// cart reducer
function wishListReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.data];
    case "REMOVE":
      return state.filter(
        (item) => JSON.stringify(item) !== JSON.stringify(action.data)
      );
    default:
      return state;
  }
}

// render
function addRemoveHanlde(data) {
  const wishListItems = document.querySelectorAll(
    "#wishlist .sidebar__body__list__item"
  );
  wishListItems.forEach((wishListItem, idx) => {
    wishListItem.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("fa-trash") ||
        e.target.classList.contains("sidebar__body__list__item__trash")
      ) {
        const height = wishListItem.offsetHeight + "px";
        const style = getComputedStyle(wishListItem);
        const paddingTop = style.paddingTop;
        const paddingBottom = style.paddingBottom;

        const wishItemFadeOut = wishListItem.animate(
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

        wishItemFadeOut.onfinish = () => {
          const action = removeAction(data[idx]);
          window.wishStore.dispatch(action);
          const product = document.querySelector(
            `#product-item${data[idx]?.id}`
          );
          const WishListBtn = product?.querySelector(".product__wishlist-btn");
          WishListBtn?.classList.remove("liked");
        };
      }
    });
  });
}

export function render(data) {
  const wishList = document.querySelector("#wishlist");
  const wishListWrap = wishList.querySelector(".sidebar__body__list");
  const wishListItemsDom = data
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
  wishListWrap.innerHTML = wishListItemsDom;
  addRemoveHanlde(data);
}

export function updateNotify(count) {
  const wishList = document.querySelector("#wishlist");
  const notify = wishList.querySelector(".header__nav__elementor--item.notify");
  const wishListFooter = wishList.querySelector(
    ".elementor--item__overlay__sidebar__footer"
  );
  notify.setAttribute("data-count", count);
  if (count) {
    wishList.classList.remove("empty");
  } else {
    const wishListFooterFadeOut = wishListFooter.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: 400,
        easing: "ease-in-out",
      }
    );

    wishListFooterFadeOut.onfinish = () => {
      wishList.classList.add("empty");
    };
  }
}

export default wishListReducer;
