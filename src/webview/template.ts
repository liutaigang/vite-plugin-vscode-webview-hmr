import template from "./template.html";

export type TemplateOptions = {
  serverUrl: string;
};

const SERVER_URL_TAG = "__SERVER_URL__";

export const resolveTemplate = (options: TemplateOptions) => {
  return template.replaceAll(SERVER_URL_TAG, options.serverUrl);
};
