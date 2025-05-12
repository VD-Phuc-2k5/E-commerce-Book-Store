import createFireworks from "./createFireworks.js";

function setFireworks(className) {
  const wishlistBtns = document.querySelectorAll(`.${className}`);
  if (wishlistBtns) {
    const nColor = 2;
    const colors = ["#28F77D", "#365947"];

    wishlistBtns.forEach((wishlistBtn) => {
      wishlistBtn.addEventListener("click", () => {
        wishlistBtn.classList.toggle("liked");
        if (wishlistBtn.classList.contains("liked")) {
          createFireworks(wishlistBtn, colors, nColor);
        }
      });
    });
  }
}

export default setFireworks;
