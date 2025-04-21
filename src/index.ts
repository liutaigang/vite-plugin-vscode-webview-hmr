import type { PluginOption } from "vite";
import { PluginOption as SelfPluginOption } from "./plugins/plugin-option";
import useIframePlugin from "./plugins/use-iframe-plugin";
import useNativePlugin from "./plugins/use-native-plugin";

export default function usePlugin(options: SelfPluginOption = {}): PluginOption {
  const { mode } = options;
  return mode === "iframe" ? useIframePlugin(options) : useNativePlugin(options);
}
