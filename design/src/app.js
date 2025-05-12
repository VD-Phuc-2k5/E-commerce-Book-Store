import carouselLoader from "./modules/loader-carousel.js";
import ComponentRegister from "./modules/component-register.js";
import Routes from "./modules/routes.js";

function App() {
  carouselLoader(10, 1000000);
  const routes = new Routes();
  // define component register
  customElements.define("component-register", ComponentRegister);

  window.addEventListener("popstate", routes.render);
  window.addEventListener("component-registed", (e) => {
    const { path, ...routeObj } = e.detail;
    routes.addRoutes(path, routeObj);
    if (path == "/") routes.render();
  });
}

App();
