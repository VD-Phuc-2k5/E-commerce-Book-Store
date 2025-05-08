export class ComponentLoader extends HTMLElement {
  async connectedCallback() {
    const htmlPath = this.getAttribute("html"); // e.g. ../pages/shared/Header/Header.html
    const cssPaths = this.getAttribute("css")?.split(",") || [];

    try {
      const res = await fetch(htmlPath);
      const htmlText = await res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");
      const codeHtml = parser.parseFromString(doc.body.innerHTML, "text/html");

      // ✅ Base path of the component, e.g. ../pages/shared/Header/
      const componentDir = htmlPath.substring(0, htmlPath.lastIndexOf("/") + 1);
      // ✅ Path from component to index.html
      const currentDir = window.location.pathname.substring(
        0,
        window.location.pathname.lastIndexOf("/") + 1
      );
      // Convert to absolute URL so we can get relative path later
      const componentURL = new URL(componentDir, window.location.origin);
      const currentURL = new URL(currentDir, window.location.origin);
      // ✅ Fix image paths
      codeHtml.querySelectorAll("img").forEach((img) => {
        const originalSrc = img.getAttribute("src");

        if (
          originalSrc &&
          !originalSrc.startsWith("http") &&
          !originalSrc.startsWith("/") &&
          !originalSrc.startsWith("./") &&
          !originalSrc.startsWith("../")
        ) {
          img.setAttribute("src", componentDir + originalSrc);
        } else if (
          originalSrc?.startsWith("../") ||
          originalSrc?.startsWith("./")
        ) {
          const resolved = new URL(originalSrc, componentURL).pathname;
          const fixedPath = resolved.replace(currentURL.pathname, "");

          // ✅ If final path starts with "/", convert to "./"
          const finalPath = fixedPath.startsWith("/")
            ? "." + fixedPath
            : fixedPath;

          img.setAttribute("src", finalPath);
        } else if (originalSrc?.startsWith("/")) {
          // ✅ Direct "/abc/xyz" → "./abc/xyz"
          img.setAttribute("src", "." + originalSrc);
        }
      });

      this.replaceWith(codeHtml.body.firstChild);

      window.dispatchEvent(
        new CustomEvent("component-loaded", {
          detail: { htmlPath },
        })
      );

      // ✅ Load CSS
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
