class ComponentRegister extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    // Thông báo rằng một component đang bắt đầu quá trình đăng ký
    window.dispatchEvent(new CustomEvent("component-registering"));

    const htmlPath = this.getAttribute("html");
    const cssPaths = this.getAttribute("css")?.split(",") || [];
    const jsPath = this.getAttribute("js");
    const path = this.getAttribute("path") || "/";

    try {
      // Tạo các thẻ link CSS
      const cssLinks = cssPaths
        .map((path) => {
          if (!document.querySelector(`link[href="${path}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = path;
            return link;
          }
          return null;
        })
        .filter((link) => link !== null);

      // Tải nội dung HTML
      const res = await fetch(htmlPath);
      const htmlText = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const codeHtml = parser.parseFromString(doc.body.innerHTML, "text/html");

      // Tạo thẻ script
      const jsLink = document.createElement("script");
      jsLink.src = jsPath;
      jsLink.type = "module";

      // Xóa component register khỏi DOM
      this.remove();

      // Thông báo rằng component đã được đăng ký thành công
      window.dispatchEvent(
        new CustomEvent("component-registed", {
          detail: {
            cssTags: cssLinks,
            scriptTag: jsLink,
            elDOM: codeHtml.body.firstChild,
            path,
          },
        })
      );
    } catch (err) {
      console.error(`Error loading component: ${htmlPath}`, err);

      window.dispatchEvent(
        new CustomEvent("component-register-error", {
          detail: {
            path,
            error: err.message,
          },
        })
      );
    }
  }
}

export default ComponentRegister;
