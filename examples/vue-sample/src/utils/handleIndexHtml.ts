import { parse as htmlParser } from "node-html-parser";
import path from "node:path";
import { Uri } from "vscode";

export function handleIndexHtml(html: string, webviewUri: Uri): string {
  const root = htmlParser(html);

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

  return root.toString();
}
