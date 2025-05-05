import ComponentLoader from "./modules/loader-component.js";

function App() {
  customElements.define("component-loader", ComponentLoader);
}

App();
