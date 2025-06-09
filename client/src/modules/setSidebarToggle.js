export function removeSidebar(button) {
  const overlay = button.querySelector(
    ".header__nav__elementor--item__overlay"
  );
  const overlaySidebar = button.querySelector(
    ".header__nav__elementor--item__overlay__sidebar"
  );
  const overlayFadeOut = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: 500,
    easing: "ease-in-out",
  });

  const sidebarOut = overlaySidebar.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(100%)" }],
    { duration: 500, easing: "ease-in-out" }
  );

  Promise.all([sidebarOut.finished, overlayFadeOut.finished]).then(() => {
    button.classList.remove("active");
  });
}

function setSidebarToggle(id) {
  const button = document.getElementById(id);
  const openBtn = button.querySelector(".header__nav__elementor--item");
  const overlay = button.querySelector(
    ".header__nav__elementor--item__overlay"
  );
  const continueShoppingBtns = button.querySelectorAll(
    ".continue-shopping-btn"
  );
  const closeBtn = button.querySelector(".fa-xmark");

  if (button && openBtn && overlay && closeBtn) {
    if (continueShoppingBtns) {
      // Dong khi bam vao nut continue shopping
      continueShoppingBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          removeSidebar(button);
        });
      });
    }

    // Mở button
    openBtn.addEventListener("click", () => {
      button.classList.add("active");
    });

    // Đóng button khi bấm nút X
    closeBtn.addEventListener("click", () => {
      removeSidebar(button);
    });

    // Đóng button khi bấm vào nền overlay
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        removeSidebar(button);
      }
    });
  }
}

export default setSidebarToggle;
