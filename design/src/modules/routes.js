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
    // Nếu đây là đường dẫn hiện tại và chưa render lần đầu, render ngay
    if (window.location.pathname === path && !this.initialRenderComplete) {
      this.render();
    }
  }

  navigate(path) {
    window.scrollTo(0, 0);
    const cart = document.getElementById("cart");
    const wishList = document.getElementById("wishlist");

    if (cart && cart.classList.contains("active")) {
      removeSidebar(cart);
    }

    if (wishList && wishList.classList.contains("active")) {
      removeSidebar(wishList);
    }

    const n = window.location.href.split("/").length - 1;
    const currPath = `/${window.location.href.split("/")[n ?? 0]}`;

    if (currPath === path) {
      return;
    }
    history.pushState(null, null, path);
    this.render();
  }

  render() {
    const path = window.location.pathname;
    const app = document.getElementById("app");

    // Chỉ xóa nội dung nếu đã render lần đầu hoặc không có route phù hợp
    const route = this.routes[path];
    if (this.initialRenderComplete || !route) {
      app.innerHTML = "";
    }

    if (!route) {
      // Chỉ hiển thị trang 404 nếu đã render lần đầu hoặc sau timeout
      if (this.initialRenderComplete) {
        app.innerHTML = `
          <div class="not-found-page">
            <img class="not-found-page__img" src="./assets/img/404-error.png" alt="error.png" />
            <h1 class="not-found-page__title">404 Not Found</h1>
          </div>
        `;
      } else {
        // Đối với lần render đầu tiên, đợi một khoảng thời gian trước khi hiển thị 404
        setTimeout(() => {
          // Kiểm tra lại xem route đã được đăng ký chưa
          const updatedRoute = this.routes[path];
          if (!updatedRoute) {
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
      return;
    }

    const { elDOM, cssTags = [], scriptTag } = route;

    // Xóa các thẻ CSS cũ
    this.currentCSSLinks.forEach((link) => link.remove());
    this.currentCSSLinks = [];

    // Đặt lại bộ đếm CSS đang tải
    this.pendingCSSLoads = cssTags.length;

    // Nếu không có CSS nào cần tải
    if (this.pendingCSSLoads === 0) {
      this.completeRender(app, elDOM, scriptTag);
      return;
    }

    // Thêm các thẻ CSS mới và theo dõi việc tải
    cssTags.forEach((tag) => {
      const newLink = tag.cloneNode(true);
      // Thêm sự kiện để theo dõi khi CSS được tải xong
      newLink.onload = () => this.handleCSSLoaded(app, elDOM, scriptTag);
      newLink.onerror = () => this.handleCSSLoaded(app, elDOM, scriptTag);

      document.head.appendChild(newLink);
      this.currentCSSLinks.push(newLink);
    });
  }

  handleCSSLoaded(app, elDOM, scriptTag) {
    this.pendingCSSLoads--;
    // Nếu tất cả CSS đã được tải xong, tiếp tục render
    if (this.pendingCSSLoads === 0) {
      this.completeRender(app, elDOM, scriptTag);
    }
  }

  completeRender(app, elDOM, scriptTag) {
    // Xóa script cũ nếu có
    if (this.currentScript) {
      this.currentScript.remove();
      this.currentScript = null;
    }

    // Thêm script mới nếu có
    if (scriptTag) {
      const newScript = document.createElement("script");
      newScript.type = "module";

      if (scriptTag.src) {
        const cacheBuster = `?_=${Date.now()}`;
        newScript.src = scriptTag.src + cacheBuster;
      } else {
        newScript.textContent = scriptTag.textContent;
      }

      document.body.appendChild(newScript);
      this.currentScript = newScript;
    }

    // Xóa nội dung app trước khi thêm nội dung mới
    app.innerHTML = "";

    // Thêm elDOM vào app
    const clonedElDOM = elDOM.cloneNode(true);
    app.appendChild(clonedElDOM);

    // Đánh dấu đã render lần đầu
    this.initialRenderComplete = true;

    // prevent default event of tag a
    const aEl = document.querySelectorAll("a");
    aEl.forEach((aDom) => {
      aDom.addEventListener("click", (e) => {
        e.preventDefault();
        this.navigate(e.currentTarget.getAttribute("href"));
      });
    });
  }
}

export default Routes;
