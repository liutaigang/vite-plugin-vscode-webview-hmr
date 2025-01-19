import { parse as htmlParser } from "node-html-parser";

export function insertScriptToHtml(html: string, scripts: string[], postion: InsertPosition = "afterbegin"): string {
  const root = htmlParser(html);
  const head = root.querySelector("head")!;
  for (const script of scripts) {
    head.insertAdjacentHTML(postion, script);
  }
  return root.toString();
}
