import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vscodeWebviewHmr from "vite-plugin-vscode-webview-hmr";

const inframeConfig = {
  mode: "iframe",
  logDir: "./log",
  indexScript: `
    <script>
      setTimeout(() => {
        const { safeSendMessageToFrontendView } = window["__vite-plugin-vscode-webview-hmr-devtools__"];
        safeSendMessageToFrontendView({command: "vite-plugin-vscode-webview-hmr:custom", message: 'nihao frontend view'});
      })
    </script>`,
  iframeScript: `
    <script>
      window.addEventListener('message', (event) => {
        const { command, message } = event.data;
        if (command === "vite-plugin-vscode-webview-hmr:custom") {
          console.log(message);
        }
      });
    </script>`,
};

const serveConfig = {
  logDir: "./log",
  linkDir: "src/assets",
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vscodeWebviewHmr(serveConfig)],
  build: {
    outDir: "../out/webview",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "./index.html"),
        sign: path.resolve(__dirname, "./sign.html"),
        about: path.resolve(__dirname, "./about.html"),
      },
      output: {
        entryFileNames: "[name]-[hash].js",
      },
    },
  },
});
