import carouselLoader from "./modules/loader-carousel.js";
import ComponentRegister from "./modules/component-register.js";
import setSidebarToggle from "./modules/setSidebarToggle.js";
import loaderNavSidebar from "./modules/loader-nav-sidebar.js";
import { storeData } from "./modules/redux.js";
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

  Promise.all([
    carouselLoader(10, 7000),
    loaderNavSidebar("cart", "Cart"),
    loaderNavSidebar("wishlist", "Wishlist"),
    setSidebarToggle("cart"),
    setSidebarToggle("wishlist"),
  ]);

  const routes = (window.appRouter = new Routes());
  const routeRegisterQueue = [];
  let pendingComponentRegistrations = 0;
  let domContentLoaded = false;

  //  cartStore redux
  getCartStore().subscribe(() => {
    const state = getCartStore().getState();
    cartRender(state);
    updateCartNotify(state?.length ?? 0);
    updateTotalCost(state);
    storeData("cartItems", state);
  });
  getCartStore().dispatch({ type: "" });

  // wishStore redux
  getWishStore().subscribe(() => {
    const state = getWishStore().getState();
    wishRender(state);
    updateWishNotify(state?.length ?? 0);
    storeData("wishListItems", state);
  });
  getWishStore().dispatch({ type: "" });

  // define component register
  customElements.define("component-register", ComponentRegister);

  window.addEventListener("popstate", () => {
    routes.render();
  });

  // Theo dõi số lượng component đang được đăng ký
  window.addEventListener("component-registering", () => {
    pendingComponentRegistrations++;
  });

  window.addEventListener("component-registed", (e) => {
    const { path, ...routeObj } = e.detail;
    routes.addRoutes(path, routeObj);
    routeRegisterQueue.push(path);
    pendingComponentRegistrations--;
    // Kiểm tra nếu tất cả component đã đăng ký và DOM đã sẵn sàng
    checkAndRender();
  });

  // Kiểm tra và render khi tất cả component đã đăng ký
  function checkAndRender() {
    if (domContentLoaded && pendingComponentRegistrations <= 0) {
      routes.render();
      hideLoading();
    }
  }

  // Đánh dấu rằng DOM đã sẵn sàng
  window.addEventListener("DOMContentLoaded", () => {
    domContentLoaded = true;
    // Nếu không có component nào đang chờ đăng ký, render ngay
    checkAndRender();
  });

  // Đảm bảo trang sẽ được render sau 5 giây, ngay cả khi có vấn đề
  setTimeout(() => {
    if (!domContentLoaded || pendingComponentRegistrations > 0) {
      pendingComponentRegistrations = 0;
      routes.render();
      hideLoading();
    }
  }, 5000);

  history.scrollRestoration = "auto";
}

App();
