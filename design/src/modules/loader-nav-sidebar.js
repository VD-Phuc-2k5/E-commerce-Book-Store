import priceFormat from "./priceFormat.js";

function updateTotalPrice(cart, totalPrice) {
  const totalPriceDom = cart.querySelector(".cart__total_price");
  const totalPriceFadeIn = totalPriceDom.animate(
    [{ opacity: 1 }, { opacity: 0 }],
    {
      duration: 350,
    }
  );
  totalPriceFadeIn.onfinish = () => {
    totalPriceDom.innerText = priceFormat(totalPrice);
  };
}

function loaderNavSidebar(id, title) {
  let totalPrice = 0;
  const wrapper = document.getElementById(`${id}`);
  const wrapperOverlay = document.createElement("div");
  wrapperOverlay.classList.add("header__nav__elementor--item__overlay");
  if (title === "Cart") {
    // Neu san pham duoc them vao gio hang thi cap nhat lai tong gia
    window.addEventListener("cart:item-added", (e) => {
      totalPrice += Number(e.detail.cost);
      updateTotalPrice(wrapper, totalPrice);
    });

    // Neu san pham duoc xoa khoi gio hang thi cap nhat lai tong gia
    window.addEventListener("cart:item-removed", (e) => {
      totalPrice -= Number(e.detail.cost);
      updateTotalPrice(wrapper, totalPrice);
    });
  }

  wrapperOverlay.innerHTML = `
        <div class='header__nav__elementor--item__overlay__sidebar'>
            <div class='elementor--item__overlay__sidebar__header'>
                <span>Your ${title}</span>
                <i class='fa-solid fa-xmark'></i>
            </div>

            <div class='elementor--item__overlay__sidebar__body'>
                <div class='sidebar__body__empty'>
                    <i class='fa-solid ${
                      title === "Cart" ? "fa-cart-shopping" : "fa-book"
                    }'></i>
                    <h4>Your ${String(title).toLowerCase()} is empty</h4>
                    <p>Looks like you haven't added any books to your ${String(
                      title
                    ).toLowerCase()} yet.</p>
                    <button class='continue-shopping-btn'>Continue Shopping</button>
                </div>

                <div class='sidebar__body__list'>
                    
                </div>
            </div>

            <div class='elementor--item__overlay__sidebar__total_cost'>
                <span>Total:</span>
                <span class="cart__total_price">${totalPrice}</span>
            </div>

            <div class='elementor--item__overlay__sidebar__footer'>
                <div>
                    <a href="/checkout">
                        <button>Checkout</button>
                    </a>
                    <a href="/${title.toLowerCase()}">
                        <button>View ${title}</button>
                    </a>
                </div>
                <button>
                    <span>or</span>
                    <span class='continue-shopping-btn'>Continue Shopping</span>
                </button>
            </div>
        </div>
    `;

  wrapper.appendChild(wrapperOverlay);
}

export default loaderNavSidebar;
