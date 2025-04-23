import type { PluginOption } from "vite";
import { PluginOption as SelfPluginOption } from "./plugins/plugin-option";
import useIframePlugin from "./plugins/use-iframe-plugin";
import useServePlugin from "./plugins/use-serve-plugin";

export default function usePlugin(options: SelfPluginOption = {}): PluginOption {
  const { mode } = options;
  return mode === "iframe" ? useIframePlugin(options) : useServePlugin(options);
}
