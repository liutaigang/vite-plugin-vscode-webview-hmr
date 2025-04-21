import { parse as htmlParser } from "node-html-parser";

export function injectScriptToHtml(html: string, injectScripts: string[]): string {
  const root = htmlParser(html);
  if (injectScripts) {
    const headElmement = root.querySelector("head")!;
    for (const script of injectScripts) {
      headElmement.insertAdjacentHTML("afterbegin", script);
    }
  }
  return root.toString();
}
