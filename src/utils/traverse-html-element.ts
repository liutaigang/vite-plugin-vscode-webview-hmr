import { parse as htmlParser } from "node-html-parser";

export function traverseHtmlElement(html: string, traverser: (element: HTMLElement) => void): string {
  const root = htmlParser(html);
  const ndoesStack = [root] as unknown as Node[];

  while (ndoesStack.length > 0) {
    const elem = ndoesStack.pop()! as HTMLElement;
    if (elem.childNodes.length > 0) {
      ndoesStack.push(...elem.childNodes);
    }
    traverser(elem);
  }
  return root.toString();
}
