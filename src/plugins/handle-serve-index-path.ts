import { traverseHtmlElement } from "../utils";

export function handleServeIndexPath(indexHtml: string, serverUrlOrigin: string): string {
  return traverseHtmlElement(indexHtml, (element) => {
    const tagName = element.tagName;

    if (tagName === "SCRIPT") {
      const srcAttr = typeof element.getAttribute === "function" ? element.getAttribute("src") : null;
      const scriptContent = element.innerText;
      if (srcAttr) {
        element.setAttribute("src", join(serverUrlOrigin, srcAttr));
      } else if (scriptContent) {
        element.textContent = scriptContent.replace(
          /(["'])(\/).*(["'])/g,
          (match) => `"${join(serverUrlOrigin, match.slice(1, -1))}"`,
        );
      }
    } else if (tagName === "LINK") {
      const hrefAttr = typeof element.getAttribute === "function" ? element.getAttribute("href") : null;
      if (hrefAttr) {
        element.setAttribute("href", join(serverUrlOrigin, hrefAttr));
      }
    }
  });
}

function join(...urls: string[]) {
  const pures = urls.map((item) => {
    if (item.startsWith("./")) {
      item = item.slice(2);
    } else if (item.startsWith("/")) {
      item = item.slice(1);
    } else if (item.endsWith("/")) {
      item = item.slice(0, -1);
    }
    return item;
  });
  return pures.join("/");
}
