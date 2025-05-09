import carouselLoader from "./modules/loader-carousel.js";
import ComponentRegister from "./modules/component-register.js";
import Routes from "./modules/routes.js";

function App() {
  carouselLoader(20, 7000);
  const routes = new Routes();
  // define component register
  customElements.define("component-register", ComponentRegister);

  // prevent default event of tag a
  const aEl = document.querySelectorAll("a");
  aEl.forEach((aDom) => {
    aDom.addEventListener("click", (e) => {
      e.preventDefault();
      routes.navigate(e.currentTarget.getAttribute("href"));
    });
  });

  window.addEventListener("popstate", routes.render);
  window.addEventListener("component-registed", (e) => {
    const { path, ...routeObj } = e.detail;
    routes.addRoutes(path, routeObj);
    routes.render();
  });
}

App();
