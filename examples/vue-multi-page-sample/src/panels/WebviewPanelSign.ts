import path from "node:path";
import { Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext, commands } from "vscode";
import { WebviewPanelBase } from "./WebviewPanelBase";
import { OPEN_MAIN_PAGE } from "../constants/command";

export class WebviewPanelSign extends WebviewPanelBase {
  private currentPanel: WebviewPanel | undefined;

  constructor(context: ExtensionContext) {
    super(context);
  }

  render() {
    if (this.currentPanel) {
      this.currentPanel.reveal(ViewColumn.One);
    } else {
      this.currentPanel = window.createWebviewPanel("showPanelView", "WebviewPanelSign", ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [Uri.joinPath(this.context.extensionUri, "out")],
      });

      this.currentPanel.webview.html = this._getWebviewContent(
        this.currentPanel.webview,
        this.context.extensionUri,
        path.join("out", "webview"),
        path.join("out", "webview", "sign.html"),
      );

      this._setWebviewMessageListener(this.currentPanel.webview);

      this.currentPanel.onDidDispose(() => {
        this.currentPanel = undefined;
      });

      const panelDisaposable = { dispose: () => this.currentPanel?.dispose() };
      this._disposables.push(panelDisaposable);
    }
  }

  _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage((message: any) => {
      const command = message.command;

      switch (command) {
        case "alert":
          const tipText = message.payload;
          window.showInformationMessage(tipText);
          break;
        case "goToMainPage":
          const isSelf = message.payload;
          commands.executeCommand(OPEN_MAIN_PAGE);
          if (isSelf) this.dispose();
          break;
      }
    });
  }
}
