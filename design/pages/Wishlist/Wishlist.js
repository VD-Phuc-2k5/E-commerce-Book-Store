import priceFormat from "../../src/modules/priceFormat.js";
import { getWishStore } from "../../src/modules/store.js";
import { removeAction } from "../../src/modules/redux.js";

function updateNotify(count) {
  const wishList = document.querySelector(".container > #wishlist");
  if (wishList) {
    if (count) {
      wishList.classList.remove("empty");
    } else {
      wishList.classList.add("empty");
    }
  }
}

function removeWishListItemHanlde(data) {
  const wishlistContainer = document.querySelector("#wishListContainer");
  const wishListItems = wishlistContainer.querySelectorAll(
    ".sidebar__body__list__item"
  );
  wishListItems.forEach((wishListItem, idx) => {
    wishListItem.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("fa-trash") ||
        e.target.classList.contains("sidebar__body__list__item__trash")
      ) {
        wishListItem.style = `
            white-space: nowrap;
        `;

        let animationKeyframes;
        let animationOptions = {
          duration: 500,
          easing: "ease-in-out",
        };

        animationKeyframes = [
          {
            opacity: 1,
          },
          {
            opacity: 0,
          },
        ];

        const wishItemFadeOut = wishListItem.animate(
          animationKeyframes,
          animationOptions
        );

        wishItemFadeOut.onfinish = () => {
          const action = removeAction(data[idx]);
          wishListItem.remove();
          getWishStore().dispatch(action);
        };
      }
    });
  });
}

function render(state) {
  const wishlistContainer = document.querySelector("#wishListContainer");
  if (wishlistContainer) {
    wishlistContainer.innerHTML = state
      ?.map(
        (item) => `
                <div class="col-lg-6 col-12">
                    <div class="sidebar__body__list__item" data-link="/product?id=${
                      item.id
                    }">
                        <img src="${item.imageUrl}" alt="${item.imageUrl}"
                            class="sidebar__body__list__item__image" />
    
                        <div class="sidebar__body__list__item__body">
                            <div class="sidebar__body__list__item__body__title">
                                ${item.title}
                            </div>
                            <div class="sidebar__body__list__item__body__author">
                                By ${item.author}
                            </div>
                            <div class="sidebar__body__list__item__body__cost">
                                ${priceFormat(Number(item.cost))}
                            </div>
                        </div>
    
                        <div class="sidebar__body__list__item__trash">
                            <i class="fa-solid fa-trash"></i>
                        </div>
                    </div>
                </div>
            `
      )
      .join("");
    const wishListItems = document.querySelectorAll(
      ".sidebar__body__list__item"
    );
    wishListItems.forEach((wishListItem) => {
      wishListItem.addEventListener("click", (e) => {
        if (
          !e.target.classList.contains("sidebar__body__list__item__trash") &&
          !e.target.classList.contains("fa-trash")
        ) {
          window.appRouter.navigate(wishListItem.getAttribute("data-link"));
        }
      });
    });
    removeWishListItemHanlde(state);
  }
}

getWishStore().subscribe(() => {
  const state = getWishStore().getState();
  render(state);
  updateNotify(state?.length ?? 0);
});

getWishStore().dispatch({ type: "" });
