import fs from "node:fs";
import path from "node:path";
import type { PluginOption } from "vite";
import { insertElementToHtml, resolveServerUrl, safeWriteFileSync } from "../utils";
import { createLogger, Logger } from "../logger";
import type { NativePluginOption } from "./plugin-option";
import { LOG_FILE_NAME, PLUGIN_META_ELEMENT, PLUGIN_NAME } from "../constants";
import { handleRollupOptionsInput } from "./handle-rollup-options-input";
import { handleServeIndexPath } from "./handle-serve-index-path";

const DEFAULT_LINK_DIR = "src";

export default function useServePlugin(rawOptions: NativePluginOption = {}): PluginOption {
  const { logDir, linkDir = DEFAULT_LINK_DIR } = rawOptions;
  let logger: Logger;
  let inputInfos: { indexOutDir: string; indexOutPath: string; indexPathname: string }[] = [];
  let rootDir: string;
  let outDir: string;

  return [
    {
      name: PLUGIN_NAME,
      apply: "serve",
      configResolved(config) {
        rootDir = config.root;
        outDir = path.join(config.root, config.build.outDir);
        inputInfos = handleRollupOptionsInput(config.build.rollupOptions?.input, rootDir, outDir);

        logger = createLogger(path.join(rootDir, logDir ?? "./", LOG_FILE_NAME), !!logDir);
        logger.info("InputInfos: " + JSON.stringify(inputInfos));
      },
      configureServer(server) {
        if (!server || !server.httpServer) {
          logger.error("Without httpServer!");
          return;
        }

        let linkFirstDir: string | undefined;
        server.httpServer?.once("listening", () => {
          const fetchAndHandleIndexHtml = () => {
            for (const { indexOutPath, indexPathname } of inputInfos) {
              const serverUrl = resolveServerUrl(server, indexPathname)!;
              fetch(serverUrl)
                .then((res) => {
                  if (!res.ok) {
                    throw new Error(`Response status: ${res.status}`);
                  }
                  return res.text();
                })
                .then((html) => {
                  const { origin } = new URL(serverUrl);
                  html = handleServeIndexPath(html, origin);
                  html = insertElementToHtml(html, [PLUGIN_META_ELEMENT], "afterbegin");
                  try {
                    safeWriteFileSync(indexOutPath, html);
                  } catch (error) {
                    logger.error(String(error));
                  }
                })
                .catch((err) => {
                  logger.error(String(err));
                });
            }

            const linkTarget = path.join(rootDir, linkDir);
            const linkAbsDir = path.join(outDir, linkDir);
            const linkAbsDirParent = path.join(linkAbsDir, "../");
            try {
              if (!fs.existsSync(linkAbsDirParent)) {
                linkFirstDir = fs.mkdirSync(linkAbsDirParent, { recursive: true });
              }
              fs.symlinkSync(linkTarget, linkAbsDir);
            } catch (error) {
              logger.error(String(error));
            }
          };
          setTimeout(fetchAndHandleIndexHtml);
        });

        const unlink = () => {
          const linkPath = path.join(outDir, linkDir);
          if (fs.existsSync(path.join(linkPath))) {
            fs.unlinkSync(linkPath);
          }
          if (linkFirstDir && fs.existsSync(linkFirstDir)) {
            fs.rmSync(linkFirstDir, { recursive: true });
          }
        };
        // 监听服务器关闭事件（正常退出）
        server.httpServer?.once("close", unlink);
        // 监听进程终止信号（如 Ctrl+C）
        process.on("SIGINT", () => server.httpServer?.close(unlink));
      },
    },
  ];
}
