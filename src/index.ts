import fs from "node:fs";
import path from "node:path";
import type { PluginOption } from "vite";
import { resolveServerUrl } from "./utils";
import { resolveTemplate } from "./webview/template";
import { insertVscodeScriptToHtml } from "./webview/vscode-script";

export type Options = {};

export default function usePlugin(rawOptions: Options = {}): PluginOption {
  let outDir: string;
  return [
    {
      name: "vite-plugin-vscode-webview-hmr",
      apply: "serve",
      configResolved(config) {
        outDir = path.join(config.root, config.build.outDir);
      },
      configureServer(server) {
        if (!server || !server.httpServer) {
          return;
        }
        server.httpServer?.once("listening", async () => {
          const serverUrl = resolveServerUrl(server)!;
          const indexContent = resolveTemplate({ serverUrl });
          const indexPath = path.join(outDir, "index.html");
          if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
          }
          fs.writeFileSync(indexPath, indexContent, { encoding: "utf-8" });
        });
      },
      transformIndexHtml(html) {
        const htmlWithVs = insertVscodeScriptToHtml(html);
        return htmlWithVs;
      },
    },
  ];
}
