import priceFormat from "./priceFormat.js";

function addToCart(imgUrl, title, author, cost) {
  const wrapper = document.querySelector("#cart");
  const notify = wrapper.querySelector(".header__nav__elementor--item.notify");
  const wrapperFooter = wrapper.querySelector(
    ".elementor--item__overlay__sidebar__footer"
  );
  const wrapperCost = wrapper.querySelector(
    ".elementor--item__overlay__sidebar__total_cost"
  );
  const wrapperList = wrapper.querySelector(".sidebar__body__list");
  const wrapperListItem = document.createElement("div");

  wrapperListItem.classList.add("sidebar__body__list__item");
  wrapperListItem.innerHTML = `
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

  wrapperListItem.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("fa-trash") ||
      e.target.classList.contains("sidebar__body__list__item__trash")
    ) {
      const height = wrapperListItem.offsetHeight + "px";
      const style = getComputedStyle(wrapperListItem);
      const paddingTop = style.paddingTop;
      const paddingBottom = style.paddingBottom;

      const listItemFadeOut = wrapperListItem.animate(
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
        wrapperListItem.remove();
        window.dispatchEvent(
          new CustomEvent("cart:item-removed", {
            detail: {
              imgUrl,
              title,
              author,
              cost,
            },
          })
        );

        if (!(wrapperList.childNodes.length - 1)) {
          const wrapperCostFadeOut = wrapperCost.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            {
              duration: 400,
              easing: "ease-in-out",
            }
          );

          const footerListFadeOut = wrapperFooter.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            {
              duration: 400,
              easing: "ease-in-out",
            }
          );

          Promise.all([
            wrapperCostFadeOut.finished,
            footerListFadeOut.finished,
          ]).then(() => {
            wrapper.classList.add("empty");
          });
        }
        notify.setAttribute("data-count", wrapperList.childNodes.length - 1);
      };
    }
  });

  wrapperList.appendChild(wrapperListItem);
  window.dispatchEvent(
    new CustomEvent("cart:item-added", {
      detail: {
        imgUrl,
        title,
        author,
        cost,
      },
    })
  );
  const count = wrapperList.childNodes.length - 1;
  notify.setAttribute("data-count", count);
  if (count) {
    wrapper.classList.remove("empty");
  }
}

export default addToCart;
