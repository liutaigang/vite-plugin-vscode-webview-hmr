# Vite-plugin-vscode-webview-hmr

**English** | [中文](./README.zh_CN.md)

When developing a webview project for VSCode and using Vite as the build tool, you can use **vite-plugin-vscode-webview-hmr** to enable hot module replacement (HMR) in the development mode.

## Features

- Zero configuration
- Zero adaptation
- Support for single and multi-page

## Installation

```bash
# pnpm
pnpm i vite-plugin-vscode-webview-hmr -D

# yarn
yarn add vite-plugin-vscode-webview-hmr -D

# npm
npm i vite-plugin-vscode-webview-hmr -D
```

## Usage

Just make a simple configuration in the vite.config.ts configuration file, such as:

```typescript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vscodeWebviewHmr from "vite-plugin-vscode-webview-hmr";

export default defineConfig({
  plugins: [vue(), vscodeWebviewHmr()],
  build: {
    outDir: "./dist",
  },
});
```

**It should be noted that** during the development stage of the webview in VSCode, the `build --watch` mode is typically used. However, after using the `vite-plugin-vscode-webview-hmr`, the `serve` mode should be adopted for development. Under this mode, `vite-plugin-vscode-webview-hmr` will generate an entry `.html` file in the directory specified by `outDir`, which replaces the entry `.html` file generated under the `build --watch` mode.

## Configurations

- **logDir**: Log directory. Optional. When a value is provided, log recording takes effect. It is used to record some important intermediate data during the execution of the plugin and is useful for debugging.
- **indexScript**: Entry file script. Optional. It is used to insert custom `<script>` script into the .html entry file generated by the plugin.
- **iframeScript**: Iframe file script. Optional. It is used to insert custom `<script>` script into the .html entry file generated in serve mode.

## Examples

Single-page example with Vue 3 + Vite: [vue-sample](https://github.com/liutaigang/vite-plugin-vscode-webview-hmr/tree/main/examples/vue-sample)

Multi-page example with Vue 3 + Vite: [vue-multi-page-sample](https://github.com/liutaigang/vite-plugin-vscode-webview-hmr/tree/main/examples/vue-multi-page-sample)

## References

Part of the code for this project is based on the development of [vite-plugin-vscode](https://github.com/tomjs/vite-plugin-vscode). Special thanks.
