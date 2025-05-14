import priceFormat from "./priceFormat.js";

function addToWishList(imgUrl, title, author, cost) {
  const wishListWrap = document.querySelector("#wishlist");
  const notify = wishListWrap.querySelector(
    ".header__nav__elementor--item.notify"
  );
  const wishlist = wishListWrap.querySelector(".sidebar__body__list");
  // tao wishlist item
  const wishlistItem = document.createElement("div");
  wishlistItem.classList.add("sidebar__body__list__item");
  wishlistItem.innerHTML = `
    <img
        src='${imgUrl}'
        alt='${imgUrl}'
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
  `;

  // xoa san pham khoi dom khi bam vao trash btn
  const trashBtn = wishlistItem.querySelector(".fa-trash");
  wishlistItem.addEventListener("click", (e) => {
    if (e.target === trashBtn) {
      const height = wishlistItem.offsetHeight + "px";
      const style = getComputedStyle(wishlistItem);
      const paddingTop = style.paddingTop;
      const paddingBottom = style.paddingBottom;

      const listItemFadeOut = wishlistItem.animate(
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

      listItemFadeOut.onfinish = () => {
        wishlistItem.remove();
        if (!(wishlist.childNodes.length - 1)) {
          wishListWrap.classList.add("empty");
        }
        notify.setAttribute("data-count", wishlist.childNodes.length - 1);
      };
    }
  });

  // them san pham vao DOM
  wishlist.appendChild(wishlistItem);

  // cap nhat lai trang thai thong bao
  function updateCount() {
    const count = wishlist.childNodes.length - 1;
    notify.setAttribute("data-count", count);
    if (count) {
      wishListWrap.classList.remove("empty");
    }
  }

  updateCount();

  return () => {
    wishlistItem.remove();
    updateCount();
  };
}

export default addToWishList;
