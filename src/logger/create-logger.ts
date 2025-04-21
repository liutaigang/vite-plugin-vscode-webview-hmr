import path from "node:path";
import fs from "node:fs";
import { Logger } from "./logger";

export function createLogger(logFilePath: string, enable = true): Logger {
  if (enable) {
    const { dir } = path.parse(logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    return new Logger(logFilePath);
  } else {
    return new Proxy({} as any, {
      get: function () {
        return () => {};
      },
    }) as Logger;
  }
}
