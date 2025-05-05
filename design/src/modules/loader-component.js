// src/component-loader.js
export class ComponentLoader extends HTMLElement {
  async connectedCallback() {
    const htmlPath = this.getAttribute("html");
    const cssPaths = this.getAttribute("css")?.split(",") || [];

    try {
      const res = await fetch(htmlPath);
      const htmlText = await res.text();

      // Parse the HTML to extract <body> content only
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const bodyInnerHTML = doc.body.innerHTML;

      // Create a wrapper div and set content
      const wrapper = document.createElement("div");
      wrapper.innerHTML = bodyInnerHTML;

      // Replace <component-loader> with content
      this.replaceWith(wrapper);

      // Dynamically load CSS files
      cssPaths.forEach((path) => {
        if (!document.querySelector(`link[href="${path}"]`)) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = path;
          document.head.appendChild(link);
        }
      });
    } catch (err) {
      this.innerHTML = `<p style="color: red;">Error loading ${htmlPath}</p>`;
      console.error(`Error loading component: ${htmlPath}`, err);
    }
  }
}

export default ComponentLoader;
