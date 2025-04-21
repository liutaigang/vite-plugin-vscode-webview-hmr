import path from "node:path";
import type { PluginOption } from "vite";
import { insertElementToHtml, resolveServerUrl, safeWriteFileSync } from "../utils";
import { resolveIframeTemplate } from "../webview/resolve-iframe-template";
import { getVscodeScript } from "../webview/vscode-script";
import { createLogger, Logger } from "../logger";
import type { IframePluginOption } from "./plugin-option";
import { LOG_FILE_NAME, PLUGIN_NAME } from "../constants";
import { handleRollupOptionsInput } from "./handle-rollup-options-input";

export default function useIframePlugin(rawOptions: IframePluginOption = {}): PluginOption {
  const { logDir, indexScript, iframeScript } = rawOptions;
  let logger: Logger;
  let inputInfos: { indexOutDir: string; indexOutPath: string; indexPathname: string }[] = [];

  return [
    {
      name: PLUGIN_NAME,
      apply: "serve",
      configResolved(config) {
        const rootDir = config.root;
        const outDir = path.join(config.root, config.build.outDir);
        inputInfos = handleRollupOptionsInput(config.build.rollupOptions?.input, rootDir, outDir);

        logger = createLogger(path.join(rootDir, logDir ?? "./", LOG_FILE_NAME), !!logDir);
        logger.info("InputInfos: " + JSON.stringify(inputInfos));
      },
      configureServer(server) {
        if (!server || !server.httpServer) {
          logger.error("Without httpServer!");
          return;
        }
        server.httpServer?.once("listening", async () => {
          for (const { indexOutPath, indexPathname } of inputInfos) {
            const serverUrl = resolveServerUrl(server, indexPathname)!;
            let indexContent = resolveIframeTemplate({ serverUrl });
            if (indexScript) {
              indexContent = insertElementToHtml(indexContent, [indexScript], "beforeend");
            }
            try {
              safeWriteFileSync(indexOutPath, indexContent);
            } catch (error) {
              logger.error(String(error));
            }
          }
        });
      },
      transformIndexHtml(html) {
        const vscodeScript = getVscodeScript();
        let iframeHtml = insertElementToHtml(html, [vscodeScript]);
        if (iframeScript) {
          iframeHtml = insertElementToHtml(iframeHtml, [iframeScript], "beforeend");
        }
        return iframeHtml;
      },
    },
  ];
}
