import path from "node:path";

export function handleRollupOptionsInput(
  rollupOptionsInput: string | string[] | Record<string, string> | undefined,
  rootDir: string,
  outDir: string,
) {
  const inputPaths: string[] = [];
  if (rollupOptionsInput) {
    const inputs = typeof rollupOptionsInput === "string" ? [rollupOptionsInput] : rollupOptionsInput;
    for (const key of Object.keys(inputs)) {
      const value = (inputs as any)[key];
      inputPaths.push(value);
    }
  } else {
    inputPaths.push(path.join(rootDir, "index.html"));
  }

  return inputPaths.map((inputPath) => {
    const inputRelativePath = inputPath.slice(rootDir.length);
    const { dir, base, ext } = path.parse(inputRelativePath);
    let indexPathname = path.join(dir, base.slice(0, -1 * ext.length));
    if (indexPathname.endsWith("/index")) {
      indexPathname = indexPathname.slice(0, -6);
    }
    const indexOutDir = path.join(outDir, dir);
    const indexOutPath = path.join(outDir, dir, base);
    return {
      indexOutDir,
      indexOutPath,
      indexPathname,
    };
  });
}
