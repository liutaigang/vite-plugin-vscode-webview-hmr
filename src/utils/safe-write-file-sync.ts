import fs from "node:fs";
import path from "node:path";

export function safeWriteFileSync(file: string, data: string | NodeJS.ArrayBufferView) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(file, data, { encoding: "utf-8" });
}
