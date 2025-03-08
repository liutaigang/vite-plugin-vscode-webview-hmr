# Vite-plugin-vscode-webview-hmr

[English](./README.md) | **中文**

开发 vscode 的 webview 项目，使用 vite 作为构建工具时，可用 **vite-plugin-vscode-webview-hmr** 来实现开发模式下的热更新（HMR）。

## 特性

- 零配置
- 零适配
- 支持单、多页面

## 安装

```bash
# pnpm
pnpm i vite-plugin-vscode-webview-hmr -D

# yarn
yarn add vite-plugin-vscode-webview-hmr -D

# npm
npm i vite-plugin-vscode-webview-hmr -D
```

## 使用

只需在 vite.config.ts 配置文件中简单配置即可，如：

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

**需要注意的是**，在 vscode 的 webview 开发阶段，一般使用的是 `build --watch` 模式，但是使用 vite-plugin-vscode-webview-hmr 后，需要使用 `serve` 模式开发。在该模式下 vite-plugin-vscode-webview-hmr 会在 outDir 所指的目录下生成一个 .html 的入口文件，用于替代 `build --watch` 模式下生成的 .html 的入口文件。

## 插件配置项

- **logDir**: 日志地址。可选项。有值时日志记录开始生效。用于记录插件执行过程中的一些重要的中间数据，处理 bug 时使用。
- **indexScript**: 入口文件脚本。可选项。用于将自定义的`<script>`脚本插入到插件生成的 .html 入口文件中。
- **iframeScript**: iframe 文件脚本。可选项。用于将自定义的`<script>`脚本插入到 serve 模式下生成的 .html 入口文件中。

## 示例

vue3 + vite 的单页面示例：[vue-sample](https://github.com/liutaigang/vite-plugin-vscode-webview-hmr/tree/main/examples/vue-sample)

vue3 + vite 的多页面示例：[vue-multi-page-sample](https://github.com/liutaigang/vite-plugin-vscode-webview-hmr/tree/main/examples/vue-multi-page-sample)

其他示例：[vscode-webview-extension-example](https://github.com/liutaigang/vscode-webview-extension-example)

## 参考

本项目部分代码参考 [vite-plugin-vscode](https://github.com/tomjs/vite-plugin-vscode) 开发，特此感谢。
