import { Disposable, Webview, WebviewPanel, Uri, ExtensionContext } from "vscode";
import path from "node:path";
import fs from "node:fs";
import { getUri } from "../utils/getUri";
import { handleIndexHtml } from "../utils/handleIndexHtml";

const VSCODE_WEBVIEW_HMR_MARK = "vite-plugin-vscode-webview-hmr";

export abstract class WebviewPanelBase {
  protected _disposables: Disposable[] = [];
  constructor(protected context: ExtensionContext) {}

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  abstract render(): void;

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  dispose() {
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
  protected _getWebviewContent(webview: Webview, extensionUri: Uri, outDir: string, entryPath: string): string {
    const htmlPath = path.join(extensionUri.fsPath, entryPath);
    const htmlText = fs.readFileSync(htmlPath, { encoding: "utf8" }).toString();

    /**
     * Check whether the index.html text contains VSCODE_WEBVIEW_HMR_MARK
     */
    if (htmlText.includes(VSCODE_WEBVIEW_HMR_MARK)) {
      return htmlText;
    } else {
      /**
       * The main functions are as follows: 1. Reassign the script, src, and href values in the link tag to the correct path values; 2. Insert the above injectScript contents into index.html
       */
      const webviewUri = getUri(webview, extensionUri, [outDir]);
      const injectScript = `<script id="_webviewUrlScript"> window.__WEBVIEW_URL__ = "${webviewUri.toString()}"</script>`;
      const modifiedHtml = handleIndexHtml(htmlText, { webviewUri, injectScripts: [injectScript] });
      return modifiedHtml;
    }
  }
}
