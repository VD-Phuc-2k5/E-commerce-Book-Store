import priceFormat from "../../src/modules/priceFormat.js";
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
        const style = getComputedStyle(wishListItem);
        const isMobile = window.innerWidth < 576;

        wishListItem.style = `
            white-space: nowrap;
        `;

        let animationKeyframes;
        let animationOptions = {
          duration: 400,
          easing: "ease-out",
        };

        if (isMobile) {
          const height = wishListItem.offsetHeight + "px";
          const paddingTop = style.paddingTop;
          const paddingBottom = style.paddingBottom;

          animationKeyframes = [
            {
              opacity: 1,
              height,
              paddingTop,
              paddingBottom,
            },
            {
              opacity: 0,
              height: 0,
              paddingTop: 0,
              paddingBottom: 0,
            },
          ];
        } else {
          const width = wishListItem.offsetWidth + "px";
          const paddingLeft = style.paddingLeft;
          const paddingRight = style.paddingRight;

          animationKeyframes = [
            {
              opacity: 1,
              width,
              paddingLeft,
              paddingRight,
            },
            {
              opacity: 0,
              width: 0,
              paddingLeft: 0,
              paddingRight: 0,
            },
          ];
        }

        const wishItemFadeOut = wishListItem.animate(
          animationKeyframes,
          animationOptions
        );

        wishItemFadeOut.onfinish = () => {
          const currentIndex = idx;

          if (currentIndex > 0) {
            const prevItem = wishlistContainer.querySelectorAll(
              ".sidebar__body__list__item"
            )[currentIndex - 1];

            if (prevItem) {
              const prevOffsetTop = prevItem.offsetTop;

              requestAnimationFrame(() => {
                window.scrollTo({
                  top: prevOffsetTop - 20,
                  behavior: "smooth",
                });
              });
            }
          }

          const action = removeAction(data[currentIndex]);
          window.wishStore.dispatch(action);
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
                <div class="col-lg-4 col-md-6 col-12">
                    <div class="sidebar__body__list__item">
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
    removeWishListItemHanlde(state);
  }
}

window.wishStore.subscribe(() => {
  const state = window.wishStore.getState();
  render(state);
  updateNotify(state?.length ?? 0);
});

window.wishStore.dispatch({ type: "" });
