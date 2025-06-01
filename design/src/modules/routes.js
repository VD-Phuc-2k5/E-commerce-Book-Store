import { showLoading, hideLoading } from "./loadingPage.js";
import { removeSidebar } from "./setSidebarToggle.js";

class Routes {
  constructor() {
    this.routes = {};
    this.currentCSSLinks = [];
    this.currentScript = null;
  }

  addRoutes(path, routeObj) {
    this.routes[path] = routeObj;
  }

  navigate(path) {
    window.scrollTo(0, 0);
    const cart = document.getElementById("cart");
    const wishList = document.getElementById("wishlist");

    if (cart && cart.classList.contains("active")) {
      removeSidebar(cart);
    }

    if (wishList && wishList.classList.contains("active")) {
      removeSidebar(wishList);
    }

    const n = window.location.href.split("/").length - 1;
    const currPath = `/${window.location.href.split("/")[n ?? 0]}`;

    if (currPath === path) {
      return;
    }
    history.pushState(null, null, path);
    this.render();
  }

  render() {
    showLoading();
    const path = window.location.pathname;
    const app = document.getElementById("app");
    app.innerHTML = "";

    const route = this.routes[path];
    if (!route) {
      app.innerHTML = `
        <div class="not-found-page">
          <img class="not-found-page__img" src="./assets/img/404-error.png" alt="error.png" />
          <h1 class="not-found-page__title">404 Not Found</h1>
        </div>
      `;
      hideLoading();
      return;
    }

    const { elDOM, cssTags = [], scriptTag } = route;

    // Xóa các thẻ CSS cũ
    this.currentCSSLinks.forEach((link) => link.remove());
    this.currentCSSLinks = [];

    // Thêm các thẻ CSS mới
    cssTags.forEach((tag) => {
      const newLink = tag.cloneNode(true);
      document.head.appendChild(newLink);
      this.currentCSSLinks.push(newLink);
    });

    // Xóa script cũ nếu có
    if (this.currentScript) {
      this.currentScript.remove();
      this.currentScript = null;
    }

    // Thêm script mới nếu có
    if (scriptTag) {
      const newScript = document.createElement("script");
      newScript.type = "module";

      if (scriptTag.src) {
        const cacheBuster = `?_=${Date.now()}`;
        newScript.src = scriptTag.src + cacheBuster;
      } else {
        newScript.textContent = scriptTag.textContent;
      }

      document.body.appendChild(newScript);
      this.currentScript = newScript;
    }

    // Thêm elDOM vào app
    const clonedElDOM = elDOM.cloneNode(true);
    app.appendChild(clonedElDOM);
    hideLoading();

    // prevent default event of tag a
    const aEl = document.querySelectorAll("a");
    aEl.forEach((aDom) => {
      aDom.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigate(e.currentTarget.getAttribute("href"));
      });
    });
  }
}

export default Routes;
