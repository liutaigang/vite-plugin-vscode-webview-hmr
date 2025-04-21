import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vscodeWebviewHmr from "vite-plugin-vscode-webview-hmr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vscodeWebviewHmr({ logDir: "./" })],
  build: {
    outDir: "../out/webview",
  },
});
