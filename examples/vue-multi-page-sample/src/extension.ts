import { commands, ExtensionContext } from "vscode";
import { WebviewPanelMain } from "./panels/WebviewPanelMain";
import { WebviewPanelSign } from "./panels/WebviewPanelSign";
import { WebviewPanelAbout } from "./panels/WebviewPanelAbout";
import { OPEN_ABOUT_PAGE, OPEN_MAIN_PAGE, OPEN_SIGN_PAGE } from "./constants/command";

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "vscode-extension-webview-vue-sample" is now active!');

  const webviewPanelMain = new WebviewPanelMain(context);
  context.subscriptions.push(
    commands.registerCommand(OPEN_MAIN_PAGE, () => {
      webviewPanelMain.render();
    }),
    { dispose: () => webviewPanelMain.dispose() },
  );

  const webviewPanelSign = new WebviewPanelSign(context);
  context.subscriptions.push(
    commands.registerCommand(OPEN_SIGN_PAGE, () => {
      webviewPanelSign.render();
    }),
    { dispose: () => webviewPanelSign.dispose() },
  );

  const webviewPanelAbout = new WebviewPanelAbout(context);
  context.subscriptions.push(
    commands.registerCommand(OPEN_ABOUT_PAGE, () => {
      webviewPanelAbout.render();
    }),
    { dispose: () => webviewPanelAbout.dispose() },
  );
}

export function deactivate() {}
