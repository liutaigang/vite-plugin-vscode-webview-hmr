import fs from "node:fs";
import path from "node:path";
import type { PluginOption, BuildOptions } from "vite";
import { insertScriptToHtml, resolveServerUrl } from "./utils";
import { resolveTemplate } from "./webview/template";
import { getVscodeScript } from "./webview/vscode-script";
import { createLogger, Logger } from "./logger";

const LOG_FILE_NAME = "vite-plugin-vscode-webview-hmr.log";

export type PluginOptions = {
  logDir?: string;
  indexScript?: string;
  iframeScript?: string;
};

export default function usePlugin(rawOptions: PluginOptions = {}): PluginOption {
  const { logDir, indexScript, iframeScript } = rawOptions;
  let logger: Logger;
  let outDir: string;
  let rootDir: string;
  let rollupOptionsInput: string | string[] | Record<string, string> | undefined;
  return [
    {
      name: "vite-plugin-vscode-webview-hmr",
      apply: "serve",
      configResolved(config) {
        outDir = path.join(config.root, config.build.outDir);
        rootDir = config.root;
        rollupOptionsInput = config.build.rollupOptions?.input;

        logger = createLogger(path.join(rootDir, logDir ?? "./", LOG_FILE_NAME), !!logDir);
        logger.info("outDir: " + outDir);
        logger.info("rootDir: " + rootDir);
        logger.info("rollupOptionsInput: " + JSON.stringify(rollupOptionsInput));
      },
      configureServer(server) {
        if (!server || !server.httpServer) {
          logger.error("without httpServer!");
          return;
        }
        server.httpServer?.once("listening", async () => {
          const inputPaths: string[] = [];
          if (rollupOptionsInput) {
            const inputs = typeof rollupOptionsInput === "string" ? [rollupOptionsInput] : rollupOptionsInput;
            for (const key of Object.keys(inputs)) {
              const value = (inputs as any)[key];
              inputPaths.push(value);
            }
          } else {
            inputPaths.push(path.join(rootDir, "index.html"));
          }

          for (const inputPath of inputPaths) {
            const inputRelativePath = inputPath.slice(rootDir.length);
            const { dir, base, ext } = path.parse(inputRelativePath);
            const indexUrlPath = path.join(dir, base.slice(0, -1 * ext.length));
            const indexOutDir = path.join(outDir, dir);
            const indexOutPath = path.join(outDir, dir, base);
            const serverUrl = resolveServerUrl(server, indexUrlPath)!;
            let indexContent = resolveTemplate({ serverUrl });
            if (indexScript) {
              indexContent = insertScriptToHtml(indexContent, [indexScript]);
            }

            logger.info("inputPath: " + inputPath);
            logger.info("inputRelativePath: " + inputRelativePath);
            logger.info("indexUrlPath: " + indexUrlPath);
            logger.info("indexOutDir: " + indexOutDir);
            logger.info("indexOutPath: " + indexOutPath);
            logger.info("serverUrl: " + serverUrl);
            if (!fs.existsSync(indexOutDir)) fs.mkdirSync(indexOutDir, { recursive: true });
            fs.writeFileSync(indexOutPath, indexContent, { encoding: "utf-8" });
          }
        });
      },
      transformIndexHtml(html) {
        const vscodeScript = getVscodeScript();
        let iframeHtml = insertScriptToHtml(html, [vscodeScript]);
        if (iframeScript) {
          iframeHtml = insertScriptToHtml(iframeHtml, [iframeScript]);
        }
        return iframeHtml;
      },
    },
  ];
}
