# Vue 3 + Vite Multi-Page Template

**English** | [中文](./README.zh_CN.md)

Hot updates in the development mode using the **vite-plugin-vscode-webview-hmr** plugin

## Usage

For the first run, in the top-level workspace, execute the `pnpm i` command to install dependencies, and then run `npm run build` to package the plugin code.

In the current workspace, execute the `npm run dev` command to compile the project and monitor changes.

Press F5 to start debugging this sample and execute the command: `vue-multi-page-sample.main-page.open`

Modify the code of the view in the `./webview-ui/` directory, and you will be able to see the real-time changes of the view in the debug window.
