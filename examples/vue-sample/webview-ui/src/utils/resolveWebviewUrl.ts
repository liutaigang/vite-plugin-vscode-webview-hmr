import path from "path-browserify";

const WEBVIEW_URL = (window as any).__WEBVIEW_URL__;
export function resolveWebviewUrl(...restPaths: string[]) {
  return WEBVIEW_URL == null ? path.join(...restPaths) : path.join(WEBVIEW_URL, ...restPaths);
}
