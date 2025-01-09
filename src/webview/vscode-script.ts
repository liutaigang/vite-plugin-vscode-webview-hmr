export const vscodeScript = `
<script id="_vscodeApiScript" vite-plugin-vscode-webview-hmr>
    const COMMAND_ON_MESSAGE = 'vite-plugin-vscode-webview-hmr:onmessage';
    const COMMAND_ON_UPDATE_STATE = 'vite-plugin-vscode-webview-hmr:on-update-state';
    const COMMAND_SYNC_WEBVIEW_STATE_TO_IFRAME = "vite-plugin-vscode-webview-hmr:sync-webview-state-to-iframe";

    // 处理 webview 发来的 html 和 body 元素的信息
    // Process the html and body element information sent by webview
    window.addEventListener('message', function messageHandler(event) {
        const { command, message } = event.data;
        if (command === COMMAND_SYNC_WEBVIEW_STATE_TO_IFRAME) {
           const { style, body, root } = message;

           document.documentElement.style.cssText = root.cssText;
           document.body.className = body.className;
           Object.keys(body.dataset).forEach(key => {
             document.body.dataset[key] = body.dataset[key];
           });
       
           const defaultStylesElement = document.createElement('style');
           defaultStylesElement.id = '_defaultStyles';
           defaultStylesElement.textContent = style;
           document.head.appendChild(defaultStylesElement);
        }
    });

    // 模仿 webview 的 acquireVsCodeApi 方法
    // Imitate the acquireVsCodeApi method of webview
    globalThis.acquireVsCodeApi = (function() {
        let state = undefined;
        let acquired = false;

        return () => {
            if (acquired && !false) {
                throw new Error('An instance of the VS Code API has already been acquired');
            }
            acquired = true;
            const postMessage = window.parent.postMessage.bind(window.parent);
            return Object.freeze({
                postMessage: function(message, transfer) {
                    postMessage({ message, command: COMMAND_ON_MESSAGE }, '*', transfer);
                },
                setState: function(newState) {
                    state = newState;
                    postMessage({ message: JSON.stringify(newState), command: COMMAND_ON_UPDATE_STATE }, '*');
                    return newState;
                },
                getState: function() {
                    return state;
                }
            });
        };
    })();
    // delete window.parent;
    delete window.top;
    delete window.frameElement;
</script>`;

export const insertVscodeScriptToHtml = (html: string): string => {
  return html.replace(/<head>/i, `<head>${vscodeScript}`);
};
