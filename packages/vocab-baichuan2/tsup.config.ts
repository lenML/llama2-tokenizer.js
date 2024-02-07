import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: ["src/main.ts"],
    format: ["cjs", "esm", "iife"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: !options.watch,
    globalName: "VocabBaichuan2",
    keepNames: true,
  };
});
