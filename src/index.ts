import fs from "node:fs";
import path from "node:path";
import type { PluginOption, BuildOptions } from "vite";
import { resolveServerUrl } from "./utils";
import { resolveTemplate } from "./webview/template";
import { insertVscodeScriptToHtml } from "./webview/vscode-script";

export type PluginOptions = {};

export default function usePlugin(rawOptions: PluginOptions = {}): PluginOption {
  let outDir: string;
  let rootDir: string;
  let rollupOptions: BuildOptions["rollupOptions"];
  return [
    {
      name: "vite-plugin-vscode-webview-hmr",
      apply: "serve",
      configResolved(config) {
        outDir = path.join(config.root, config.build.outDir);
        rootDir = config.root;
        rollupOptions = config.build.rollupOptions;
      },
      configureServer(server) {
        if (!server || !server.httpServer) {
          return;
        }
        server.httpServer?.once("listening", async () => {
          const inputPaths: string[] = [];
          if (rollupOptions?.input) {
            for (const key of Object.keys(rollupOptions.input!)) {
              const value = (rollupOptions.input as any)[key];
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
            const indexContent = resolveTemplate({ serverUrl });

            console.log("------------------------------------------");
            console.log("rootDir", rootDir);
            console.log("inputPath", inputPath);
            console.log("inputRelativePath", inputRelativePath);
            console.log("indexUrlPath", indexUrlPath);
            console.log("indexOutDir", indexOutDir);
            console.log("indexOutPath", indexOutPath);
            if (!fs.existsSync(indexOutDir)) {
              fs.mkdirSync(indexOutDir, { recursive: true });
            }
            fs.writeFileSync(indexOutPath, indexContent, { encoding: "utf-8" });
          }
        });
      },
      transformIndexHtml(html) {
        const htmlWithVs = insertVscodeScriptToHtml(html);
        return htmlWithVs;
      },
    },
  ];
}
