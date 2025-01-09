# vscode-extension-webview-vue3-sample 项目模板

使用 vue3 + vite 来开发 vscode-extension 的 webview，可以使用 vue3 单文件组件，组合式 API 语法进行开发。

## 用法

第一次执行`npm run install:all`命令安装依赖

先执行`npm run dev`命令编译项目并监听变更

再按 F5 运行插件，webview-ui 下的变更可以通过重新加载 webview 界面看到，src 下的变更，可以通过重新加载扩展窗口（快捷键：Ctrl + R）看到

单独调试webview-ui，执行`npm run dev:web`

本项目参考 [vscode-webview-vite-vue-boilerplate](https://github.com/crper/vscode-webview-vite-vue-boilerplate) 项目开发
