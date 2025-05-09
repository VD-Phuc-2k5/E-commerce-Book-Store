class ComponentRegister extends HTMLElement {
  async connectedCallback() {
    const htmlPath = this.getAttribute("html");
    const cssPaths = this.getAttribute("css")?.split(",") || [];
    const jsPath = this.getAttribute("js");
    const path = this.getAttribute("path") || "/";

    try {
      const cssLinks = cssPaths.map((path) => {
        if (!document.querySelector(`link[href="${path}"]`)) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = path;
          return link;
        }
      });

      const res = await fetch(htmlPath);
      const htmlText = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const codeHtml = parser.parseFromString(doc.body.innerHTML, "text/html");

      const jsLink = document.createElement("script");
      jsLink.src = jsPath;
      jsLink.type = "module";

      this.remove();

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
    }
  }
}

export default ComponentRegister;
