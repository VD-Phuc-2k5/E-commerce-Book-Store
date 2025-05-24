import carouselLoader from "./modules/loader-carousel.js";
import ComponentRegister from "./modules/component-register.js";
import setSidebarToggle from "./modules/setSidebarToggle.js";
import loaderNavSidebar from "./modules/loader-nav-sidebar.js";
import { createStore, storeData } from "./modules/redux.js";
import cartReducer, {
  render as cartRender,
  updateNotify as updateCartNotify,
  updateTotalCost,
} from "./modules/cart.js";
import wishListReducer, {
  render as wishRender,
  updateNotify as updateWishNotify,
} from "./modules/wishlist.js";
import Routes from "./modules/routes.js";

function App() {
  carouselLoader(10, 7000);
  loaderNavSidebar("cart", "Cart");
  loaderNavSidebar("wishlist", "Wishlist");
  setSidebarToggle("cart");
  setSidebarToggle("wishlist");
  const routes = new Routes();
  const routeRegisterQueue = [];
  const cartStore = (window.cartStore = createStore(cartReducer));
  cartStore.subscribe(() => {
    cartRender(cartStore.getState());
    updateCartNotify(cartStore.getState()?.length ?? 0);
    updateTotalCost(cartStore.getState());
    storeData("cartItems", cartStore.getState());
  });

  const wishStore = (window.wishStore = createStore(wishListReducer));
  wishStore.subscribe(() => {
    wishRender(wishStore.getState());
    updateWishNotify(wishStore.getState()?.length ?? 0);
    storeData("wishListItems", wishStore.getState());
  });
  // render cart item
  cartStore.dispatch({});

  // render wish item
  wishStore.dispatch({});

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
