import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vscodeWebviewHmr from "vite-plugin-vscode-webview-hmr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vscodeWebviewHmr({
      logDir: "./log",
      indexScript: "<script>  console.log('=======hello index========') </script>",
      iframeScript: "<script> console.log('-------hello iframe-------') </script>",
    }),
  ],
  build: {
    outDir: "../out/webview",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "./index.html"),
        sign: path.resolve(__dirname, "./sign.html"),
        about: path.resolve(__dirname, "./about.html"),
        other: path.resolve(__dirname, "./src/pages/other/index.html"),
      },
      output: {
        entryFileNames: "[name]-[hash].js",
      },
    },
  },
});
