import { parse as htmlParser } from "node-html-parser";

export function insertElementToHtml(
  html: string,
  elements: string[],
  insertPostion: InsertPosition = "afterbegin",
  insertElement: "body" | "head" = "head",
): string {
  const root = htmlParser(html);
  const head = root.querySelector(insertElement)!;
  for (const element of elements) {
    head.insertAdjacentHTML(insertPostion, element);
  }
  return root.toString();
}
