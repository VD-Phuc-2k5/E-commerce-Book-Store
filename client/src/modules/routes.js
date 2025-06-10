import { removeSidebar } from "./setSidebarToggle.js";

class Routes {
  constructor() {
    this.routes = {};
    this.currentCSSLinks = [];
    this.currentScript = null;
    this.pendingCSSLoads = 0;
    this.initialRenderComplete = false;
  }

  addRoutes(path, routeObj) {
    this.routes[path] = routeObj;
    // Render ngay nếu đây là đường dẫn hiện tại và chưa render lần đầu
    if (window.location.pathname === path && !this.initialRenderComplete) {
      this.render();
    }
  }

  navigate(path) {
    // Điều chỉnh cuộn trang và đóng sidebar nếu cần
    window.scrollTo(0, 0);
    ["cart", "wishlist", "bars"].forEach((id) => {
      const element = document.getElementById(id);
      if (element?.classList.contains("active")) {
        removeSidebar(element);
      }
    });

    const currentPath = window.location.pathname;
    if (currentPath === path) return;

    history.pushState(null, null, path);
    this.render();
    document.body.style.overflowY = "auto";
  }

  render() {
    const path = window.location.pathname;
    const app = document.getElementById("app");
    const route = this.routes[path];

    // Xóa nội dung nếu đã render lần đầu hoặc không có route phù hợp
    if (this.initialRenderComplete || !route) {
      app.innerHTML = "";
    }

    if (!route) {
      this.handleNotFound(app, path);
      return;
    }

    const { elDOM, cssTags = [], scriptTag } = route;

    // Xóa các thẻ CSS cũ
    this.currentCSSLinks.forEach((link) => link.remove());
    this.currentCSSLinks = [];

    // Đặt lại bộ đếm CSS đang tải
    this.pendingCSSLoads = cssTags.length;

    if (this.pendingCSSLoads === 0) {
      this.completeRender(app, elDOM, scriptTag);
      return;
    }

    // Thêm các thẻ CSS mới và theo dõi việc tải
    cssTags.forEach((tag) => {
      const newLink = tag.cloneNode(true);
      newLink.onload = newLink.onerror = () =>
        this.handleCSSLoaded(app, elDOM, scriptTag);
      document.head.appendChild(newLink);
      this.currentCSSLinks.push(newLink);
    });
  }

  handleCSSLoaded(app, elDOM, scriptTag) {
    if (--this.pendingCSSLoads === 0) {
      this.completeRender(app, elDOM, scriptTag);
    }
  }

  completeRender(app, elDOM, scriptTag) {
    // Xóa script cũ nếu có
    this.currentScript?.remove();
    this.currentScript = null;

    // Thêm script mới nếu có
    if (scriptTag) {
      const newScript = document.createElement("script");
      newScript.type = "module";
      newScript.src = scriptTag.src ? `${scriptTag.src}?_=${Date.now()}` : null;
      newScript.textContent = scriptTag.textContent || "";
      document.body.appendChild(newScript);
      this.currentScript = newScript;
    }

    // Thêm nội dung mới vào app
    app.innerHTML = "";
    app.appendChild(elDOM.cloneNode(true));

    this.initialRenderComplete = true;

    // Ngăn chặn hành vi mặc định của thẻ `<a>` và điều hướng
    document.querySelectorAll("a").forEach((aDom) => {
      aDom.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigate(encodeURI(e.currentTarget.getAttribute("href")));
      });
    });
  }

  handleNotFound(app, path) {
    if (this.initialRenderComplete) {
      app.innerHTML = `
        <div class="not-found-page">
          <img class="not-found-page__img" src="./assets/img/404-error.png" alt="error.png" />
          <h1 class="not-found-page__title">404 Not Found</h1>
        </div>
      `;
    } else {
      setTimeout(() => {
        if (!this.routes[path]) {
          app.innerHTML = `
            <div class="not-found-page">
              <img class="not-found-page__img" src="./assets/img/404-error.png" alt="error.png" />
              <h1 class="not-found-page__title">404 Not Found</h1>
            </div>
          `;
          this.initialRenderComplete = true;
        }
      }, 1000);
    }
  }
}

export default Routes;
