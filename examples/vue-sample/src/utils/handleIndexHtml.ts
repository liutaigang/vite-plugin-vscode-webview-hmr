import { parse as htmlParser } from "node-html-parser";
import path from "node:path";
import { Uri } from "vscode";

export type HandleIndexHtmlOptions = {
  webviewUri?: Uri;
  injectScripts?: string[];
};
/**
 * 
 * @param html 
 * @param options 
 * @returns 
 */
export function handleIndexHtml(html: string, options: HandleIndexHtmlOptions) {
  const { webviewUri, injectScripts = [] } = options;
  const root = htmlParser(html);

  if (webviewUri) {
    const tagToChange = {
      script: "src",
      link: "href",
    };

    for (const tag of Object.keys(tagToChange)) {
      const elements = root.querySelectorAll(tag);
      const attrKey = (tagToChange as any)[tag];

      for (const elem of elements) {
        const attrValue = elem.getAttribute(attrKey);
        if (attrValue) {
          const newAttrValue = path.join(webviewUri.toString(), attrValue);
          elem.setAttribute(attrKey, newAttrValue);
        }
      }
    }
  }

  if (injectScripts) {
    const headElmement = root.querySelector("head")!;
    for (const script of injectScripts) {
      headElmement.insertAdjacentHTML("afterbegin", script);
    }
  }

  return root.removeWhitespace().toString();
}
