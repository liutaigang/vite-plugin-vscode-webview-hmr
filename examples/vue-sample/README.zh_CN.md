# vue3 + vite 单页面模板

[English](./README.md) | **中文**

使用 **vite-plugin-vscode-webview-hmr** 插件开发模式的热更新

## 用法

第一次运行，在顶层的工作空间下，执行 `pnpm i` 命令安装依赖，再执行 `npm run build` 打包插件代码

在当前的工作空间下执行 `npm run dev` 命令编译项目并监听变更

按 F5 开启本示例的调试，执行指令：`vue3-webview.open`

修改 ./webview-ui/ 中视图的代码，即可看到调试窗口中的视图的实时变化

## 参考

本示例参考 [vscode-extension-webview-vue-sample](https://github.com/TangGuoNiuBi/vscode-extension-webview-vue-sample)
