import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import path from "node:path";
import fs from "node:fs";
import { getUri } from "../utils/getUri";
import { handleIndexHtml } from "../utils/handleIndexHtml";

const VSCODE_WEBVIEW_HMR_MARK = "vite-plugin-vscode-webview-hmr";

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class VueWebviewPanel {
  public static currentPanel: VueWebviewPanel | undefined;
  private readonly _panel: WebviewPanel;
  private _disposables: Disposable[] = [];

  /**
   * The VueBoilerplatePanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel;

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview);
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: Uri) {
    if (VueWebviewPanel.currentPanel) {
      // If the webview panel already exists reveal it
      VueWebviewPanel.currentPanel._panel.reveal(ViewColumn.One);
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = window.createWebviewPanel(
        // Panel view type
        "showPanelView",
        // Panel title
        "Vite-Vue-Webview",
        // The editor column the panel should be displayed in
        ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
          retainContextWhenHidden: true,
          // Restrict the webview to only load resources from the `out` and `webview-ui/dist` directories
          localResourceRoots: [Uri.joinPath(extensionUri, "out"), Uri.joinPath(extensionUri, "webview-ui/dist")],
        },
      );

      VueWebviewPanel.currentPanel = new VueWebviewPanel(panel, extensionUri);
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    VueWebviewPanel.currentPanel = undefined;

    // Dispose of the current webview panel
    this._panel.dispose();

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the Vue webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const htmlPath = path.join(extensionUri.fsPath, "out", "webview", "index.html");
    const htmlText = fs.readFileSync(htmlPath, { encoding: "utf8" }).toString();

    /**
     * 判断 index.html 文本中是否包含 VSCODE_WEBVIEW_HMR_MARK， 如果包含的话，webview 处于开发模式，并使用了 vite-plugin-vscode-webview-hmr 插件，否则，处于生产模式
     * Check whether the index.html text contains VSCODE_WEBVIEW_HMR_MARK. If yes, webview is in development mode and uses the vite-plugin-vscode-webview-hmr plug-in; otherwise, it is in production mode
     */
    if (htmlText.includes(VSCODE_WEBVIEW_HMR_MARK)) {
      return htmlText;
    } else {
      /**
       * 主要的作用是：1、将 script、link 标签中的 src、href 的值，重新赋予正确的路径值，2、将上述 injectScript 的内容插入 index.html 中
       * The main functions are as follows: 1. Reassign the script, src, and href values in the link tag to the correct path values; 2. Insert the above injectScript contents into index.html
       */
      const webviewUri = getUri(webview, extensionUri, ["out", "webview"]);
      const injectScript = `<script id="_webviewUrlScript"> window.__WEBVIEW_URL__ = "${webviewUri.toString()}"</script>`;
      const modifiedHtml = handleIndexHtml(htmlText, { webviewUri, injectScripts: [injectScript] });
      return modifiedHtml;
    }
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        const text = message.text;

        switch (command) {
          case "alert":
            window.showInformationMessage(text);
            return;
        }
      },
      undefined,
      this._disposables,
    );
  }
}
