import type { AddressInfo } from "node:net";
import { URL } from "node:url";
import type { ViteDevServer } from "vite";

/**
 * @see https://github.com/vitejs/vite/blob/v4.0.1/packages/vite/src/node/constants.ts#L137-L147
 */
export function resolveHostname(hostname: string) {
  const loopbackHosts = new Set(["localhost", "127.0.0.1", "::1", "0000:0000:0000:0000:0000:0000:0000:0001"]);
  const wildcardHosts = new Set(["0.0.0.0", "::", "0000:0000:0000:0000:0000:0000:0000:0000"]);

  return loopbackHosts.has(hostname) || wildcardHosts.has(hostname) ? "localhost" : hostname;
}

export function resolveServerUrl(server: ViteDevServer, pathname = "") {
  const addressInfo = server.httpServer!.address();
  const isAddressInfo = (x: any): x is AddressInfo => x?.address;

  if (isAddressInfo(addressInfo)) {
    const { address, port } = addressInfo;
    const hostname = resolveHostname(address);

    const options = server.config.server;
    const protocol = options.https ? "https" : "http";
    const devBase = server.config.base;

    const openOrBase = typeof options.open === "string" ? options.open : devBase;
    const origin = openOrBase.startsWith("http") ? openOrBase : `${protocol}://${hostname}:${port}${openOrBase}`;
    const url = new URL(pathname, origin).toString();
    return url;
  }
}
