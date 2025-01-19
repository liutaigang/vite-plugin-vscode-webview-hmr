import path from "node:path";
import fs from "node:fs";

export type LogLevel = "error" | "warn" | "info";

export class Logger {
  private static levels = ["error", "warn", "info"];
  private write;
  private logLevel: LogLevel = "info";

  constructor(logFilePath: string) {
    logFilePath = path.normalize(logFilePath);
    const stream = fs.createWriteStream(logFilePath, { flags: "a", encoding: "utf8", mode: 0o666 });
    stream.write("\n");
    this.write = (text: string) => {
      stream.write(text);
    };
  }

  setLevel(newLevel: LogLevel) {
    const has = Logger.levels.includes(newLevel);
    return has ? (this.logLevel = newLevel) : false;
  }

  log(message: string, level = this.logLevel) {
    message = this.format(level, new Date(), message);
    this.write(message + "\n");
    return message;
  }

  error(message: string) {
    this.log(message, "error");
  }

  warn(message: string) {
    this.log(message, "warn");
  }

  info(message: string) {
    this.log(message, "info");
  }

  private format(level: LogLevel, date: Date, message: string) {
    return [level, " [", date.toLocaleString(), "] ", message].join("");
  }
}

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
