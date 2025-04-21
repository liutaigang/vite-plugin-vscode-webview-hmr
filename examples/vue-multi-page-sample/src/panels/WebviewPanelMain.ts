import path from "node:path";
import { Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext, commands } from "vscode";
import { WebviewPanelBase } from "./WebviewPanelBase";
import { OPEN_ABOUT_PAGE, OPEN_MAIN_PAGE, OPEN_SIGN_PAGE } from "../constants/command";

export class WebviewPanelMain extends WebviewPanelBase {
  private currentPanel: WebviewPanel | undefined;

  constructor(context: ExtensionContext) {
    super(context);
  }

  render() {
    if (this.currentPanel) {
      this.currentPanel.reveal(ViewColumn.One);
    } else {
      this.currentPanel = window.createWebviewPanel("showPanelView", "WebviewPanelMain", ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [Uri.joinPath(this.context.extensionUri, "out")],
      });

      this.currentPanel.webview.html = this._getWebviewContent(
        this.currentPanel.webview,
        this.context.extensionUri,
        path.join("out", "webview"),
        path.join("out", "webview", "index.html"),
      );

      this._setWebviewMessageListener(this.currentPanel.webview);

      const timer = setInterval(() => {
        const message = {
          command: "dateProductor",
          payload: new Date(),
        };
        this.currentPanel?.webview.postMessage(message);
      }, 1_000);

      this.currentPanel.onDidDispose(() => {
        this.currentPanel = undefined;
      });

      const panelDisaposable = {
        dispose: () => {
          this.currentPanel?.dispose();
          clearTimeout(timer);
        },
      };
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
        case "openSignPage":
          commands.executeCommand(OPEN_SIGN_PAGE);
          break;
        case "openAboutPage":
          commands.executeCommand(OPEN_ABOUT_PAGE);
          break;
      }
    });
  }
}
