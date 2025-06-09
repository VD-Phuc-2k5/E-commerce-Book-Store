function loaderMobileSidebar(id, title) {
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
                  <div class='sidebar__body__list'>
                      <div>
                        <i class="fa-solid fa-address-card"></i>
                        <a href="/about">About Us</a>
                      </div>
                      <div>
                        <i class="fa-solid fa-book"></i>
                        <a href="/all-books">All Book</a>
                      </div>
                      <div>
                        <i class="fa-solid fa-blog"></i>
                        <a href="/blog">Blog</a>
                      </div>
                      <div>
                        <i class="fa-solid fa-user"></i>
                        <a href="/account">My Account</a>
                      </div>
                  </div>
              </div>
  
              <div class='elementor--item__overlay__sidebar__total_cost'>
                  <span>Total:</span>
                  <span class="cart__total_price">0</span>
              </div>
          </div>
      `;

  wrapper.appendChild(wrapperOverlay);
}

export default loaderMobileSidebar;
