export type PluginMode = "serve" | "iframe"; // "serve" as default

export type NativePluginOption = {
  mode?: PluginMode;
  logDir?: string;
  linkDir?: string; // "src" as default
};

export type IframePluginOption = {
  mode?: PluginMode;
  logDir?: string;
  indexScript?: string;
  iframeScript?: string;
};

export type PluginOption = NativePluginOption | IframePluginOption;
