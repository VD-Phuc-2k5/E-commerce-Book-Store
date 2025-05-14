import carouselLoader from "./modules/loader-carousel.js";
import ComponentRegister from "./modules/component-register.js";
import setSidebarToggle from "./modules/setSidebarToggle.js";
import loaderNavSidebar from "./modules/loader-nav-sidebar.js";
import Routes from "./modules/routes.js";

function App() {
  carouselLoader(10, 7000);
  loaderNavSidebar("cart", "Cart");
  loaderNavSidebar("wishlist", "Wishlist");
  setSidebarToggle("cart");
  setSidebarToggle("wishlist");
  const routes = new Routes();
  const routeRegisterQueue = [];
  // define component register
  customElements.define("component-register", ComponentRegister);

  window.addEventListener("popstate", () => {
    routes.render();
  });

  window.addEventListener("component-registed", (e) => {
    const { path, ...routeObj } = e.detail;
    routes.addRoutes(path, routeObj);
    routeRegisterQueue.push(path);

    if (window.location.pathname === path) routes.render();
  });

  // fallback render in case no route matches (404)
  window.addEventListener("DOMContentLoaded", () => {
    const matchedRoute = routeRegisterQueue.find(
      (path) => path === window.location.pathname
    );
    if (!matchedRoute) {
      routes.render();
    }
  });

  history.scrollRestoration = "manual";
}

App();
