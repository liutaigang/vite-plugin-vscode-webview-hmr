import { defineConfig } from "tsup";
import pkg from "./package.json";

export default defineConfig(() => {
  return [
    {
      entry: ["src/index.ts"],
      format: ["esm", "cjs"],
      external: ["vite"].concat(Object.keys(pkg.dependencies || {})),
      splitting: false,
      clean: false,
      dts: true,
      loader: {
        ".html": "text",
      },
    },
  ];
});
