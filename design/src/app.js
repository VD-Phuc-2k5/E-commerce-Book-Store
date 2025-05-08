import ComponentLoader from "./modules/loader-component.js";
import carouselLoader from "./modules/loader-carousel.js";

function App() {
  customElements.define("component-loader", ComponentLoader);
  window.addEventListener("component-loaded", () => {
    carouselLoader(20, 7000);
  });
}

App();
