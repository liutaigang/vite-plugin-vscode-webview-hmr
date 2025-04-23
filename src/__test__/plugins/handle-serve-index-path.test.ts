import { it } from "vitest";
import { handleServeIndexPath } from "../../plugins/handle-serve-index-path";

const htmlTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" >
    <meta vite-plugin-vscode-webview-hmr mode="serve">
    <script type="module">
      import { injectIntoGlobalHook } from "/@react-refresh";
      injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
    </script>
    <script type="module" src="/@vite/client"></script>
    <link rel="icon" type="image/svg+xml" href="/vite.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" >
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

const reasonHtmlTemplate = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" >
    <meta vite-plugin-vscode-webview-hmr mode="serve">
    <script type="module">
      import { injectIntoGlobalHook } from "http://localhost:5174/@react-refresh";
      injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
    </script>
    <script type="module" src="http://localhost:5174/@vite/client"></script>
    <link rel="icon" type="image/svg+xml" href="http://localhost:5174/vite.svg">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" >
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="http://localhost:5174/src/main.tsx"></script>
  </body>
</html>
`;

it("handleServeIndexPath", async ({ expect }) => {
  const result = handleServeIndexPath(htmlTemplate, "http://localhost:5174");
  expect(result).toEqual(reasonHtmlTemplate);
});
