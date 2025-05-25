function loaderNavSidebar(id, title) {
  const wrapper = document.getElementById(`${id}`);
  const wrapperOverlay = document.createElement("div");
  wrapperOverlay.classList.add("header__nav__elementor--item__overlay");
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
                <span class="cart__total_price">0</span>
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
                    <a href="/">
                        <span class='continue-shopping-btn'>Continue Shopping</span>
                    </a>
                </button>
            </div>
        </div>
    `;

  wrapper.appendChild(wrapperOverlay);
}

export default loaderNavSidebar;
