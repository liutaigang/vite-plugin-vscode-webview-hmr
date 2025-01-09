import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { usePlugin } from "vite-plugin-vscode-webview-hmr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), usePlugin()],
  build: {
    outDir: "../out/webview",
  },
});
