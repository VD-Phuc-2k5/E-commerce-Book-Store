import carouselLoader from "./modules/loader-carousel.js";
import ComponentRegister from "./modules/component-register.js";
import setSidebarToggle from "./modules/setSidebarToggle.js";
import loaderNavSidebar from "./modules/loader-nav-sidebar.js";
import loaderMobileSidebar from "./modules/loader-mobile-sidebar.js";
import { getCartStore, getWishStore } from "./modules/store.js";
import {
  render as cartRender,
  updateNotify as updateCartNotify,
  updateTotalCost,
} from "./modules/cart.js";
import {
  render as wishRender,
  updateNotify as updateWishNotify,
} from "./modules/wishlist.js";
import Routes from "./modules/routes.js";
import { showLoading, hideLoading } from "./modules/loadingPage.js";

async function App() {
  showLoading();

  await Promise.all([
    carouselLoader(10, 7000),
    loaderNavSidebar("cart", "Cart"),
    loaderNavSidebar("wishlist", "Wishlist"),
    loaderMobileSidebar("bars", "Bars"),
    setSidebarToggle("bars"),
    setSidebarToggle("cart"),
    setSidebarToggle("wishlist"),
  ]);

  const routes = (window.appRouter = new Routes());
  const routeRegisterQueue = [];
  let pendingComponentRegistrations = 0;
  let domContentLoaded = false;
  let homeComponentRegistered = false;
  let initialRenderDone = false;

  //  cartStore redux
  getCartStore().subscribe(async () => {
    const state = await getCartStore().getState();
    cartRender(state);
    updateCartNotify(state?.length ?? 0);
    updateTotalCost(state);
  });
  getCartStore().dispatch({ type: "" });

  // wishStore redux
  getWishStore().subscribe(() => {
    const state = getWishStore().getState();
    wishRender(state);
    updateWishNotify(state?.length ?? 0);
  });
  getWishStore().dispatch({ type: "" });

  // define component register
  customElements.define("component-register", ComponentRegister);

  window.addEventListener("popstate", () => {
    routes.render();
  });

  // Track component registration
  window.addEventListener("component-registering", () => {
    pendingComponentRegistrations++;
  });

  window.addEventListener("component-registed", (e) => {
    const { path, ...routeObj } = e.detail;
    routes.addRoutes(path, routeObj);
    routeRegisterQueue.push(path);
    pendingComponentRegistrations--;

    // Check if this is the home component
    if (path === "/" || path === "/home") {
      homeComponentRegistered = true;

      // If DOM is ready and we haven't rendered yet, render now
      if (domContentLoaded && !initialRenderDone) {
        initialRenderDone = true;
        routes.render();
        hideLoading();
      }
    }

    // If all components are registered and DOM is ready, ensure everything is rendered
    if (
      pendingComponentRegistrations <= 0 &&
      domContentLoaded &&
      !initialRenderDone
    ) {
      initialRenderDone = true;
      routes.render();
      hideLoading();
    }
  });

  // DOM ready event
  window.addEventListener("DOMContentLoaded", () => {
    domContentLoaded = true;

    // If home is already registered or no components are pending, render now
    if (
      (homeComponentRegistered || pendingComponentRegistrations <= 0) &&
      !initialRenderDone
    ) {
      initialRenderDone = true;
      routes.render();
      hideLoading();
    }
  });

  // Fallback timeout to ensure rendering happens even if there are issues
  setTimeout(() => {
    if (!initialRenderDone) {
      console.warn("Rendering timeout reached. Forcing render.");
      initialRenderDone = true;
      routes.render();
      hideLoading();
    }
  }, 5000);
}

App();
