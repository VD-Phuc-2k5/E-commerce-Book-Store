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
    history.pushState(null, null, path);
    this.render();
  }

  render() {
    const path = window.location.pathname;
    const app = document.getElementById("app");
    app.innerHTML = "";

    const route = this.routes[path];
    if (!route) {
      app.textContent = "404 Not Found";
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
      const newScript = scriptTag.cloneNode(true);
      document.body.appendChild(newScript);
      this.currentScript = newScript;
    }

    app.appendChild(elDOM.cloneNode(true));
  }
}

export default Routes;
