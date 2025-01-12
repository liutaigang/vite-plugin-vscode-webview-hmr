# Vite-plugin-vscode-webview-hmr

[English](./README.md) | **中文**

vscode 的 webview 项目，在开发模式下，vite-plugin-vscode-webview-hmr 可用来支持热更新 `HMR`。

## 特性

- 零配置
- 零适配
- 支持单、多页面

## 安装

```bash
# pnpm
pnpm i vite-plugin-vscode-webview-hmr -D

# yarn
yarn vite-plugin-vscode-webview-hmr -D

# npm
npm i vite-plugin-vscode-webview-hmr -D
```

## 使用说明

只需在 vite.config.ts 配置文件中配置即可：

```
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vscodeWebviewHmr from "vite-plugin-vscode-webview-hmr";

export default defineConfig({
  plugins: [vue(), vscodeWebviewHmr()],
  build: {
    outDir: './dist'
  }
});
```

需要注意的是，在 vscode 的 webview 开发阶段，一般使用的是 build 模式，但是使用 vite-plugin-vscode-webview-hmr 后，需要使用 serve 模式开发。在该模式下 vite-plugin-vscode-webview-hmr 会在 outDir 所指的目录下生成一个 index.html 文件。这个文件可以被 extension 读取使用。

## 实现原理

很简单，使用 iframe 作为中间层来加载 webview 在 serve 模式下的服务，如图：
![](./pictures/principle_zh_CN.png)

## Debug 和 自定义插入脚本

## 参考

本项目参考 [vite-plugin-vscode](https://github.com/tomjs/vite-plugin-vscode) 开发
