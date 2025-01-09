// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { window, commands, ExtensionContext } from "vscode";

import { VueWebviewPanel } from "./panels/VueWebviewPanel";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-extension-webview-vue-sample" is now active!');

  context.subscriptions.push(
    commands.registerCommand("vue3-webview.open", () => {
      VueWebviewPanel.render(context.extensionUri);
    }),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
