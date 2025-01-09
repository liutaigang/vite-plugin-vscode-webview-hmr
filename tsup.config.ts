import { defineConfig } from "tsup";
import pkg from "./package.json";

export default defineConfig(() => {
  return [
    {
      entry: ["src/index.ts"],
      format: ["esm", "cjs"],
      target: ["es2021", "node16"],
      external: ["vite"].concat(Object.keys(pkg.dependencies || {})),
      shims: true,
      clean: false,
      dts: true,
      splitting: true,
      loader: {
        ".html": "text",
      },
    },
  ];
});
