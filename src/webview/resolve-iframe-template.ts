import template from "./iframe-template.html";

export type IframeTemplateOptions = {
  serverUrl: string;
};

const SERVER_URL_TAG = "__SERVER_URL__";

export const resolveIframeTemplate = (options: IframeTemplateOptions) => {
  return template.replaceAll(SERVER_URL_TAG, options.serverUrl);
};
