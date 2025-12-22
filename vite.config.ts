// vite.config.js

import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

const libName = "kontent-smart-link";

export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  return {
    resolve: {
      extensions: [".ts", ".js"],
    },
    build: {
      sourcemap: true,
      minify: isProduction,
      outDir: "dist/bundles",
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "kontentSmartLink",
        formats: ["umd"],
        fileName: () => (isProduction ? `${libName}.min.js` : `${libName}.js`),
      },
      rollupOptions: {
        output: {
          exports: "auto",
          amd: {
            id: "KontentSmartLink",
          },
        },
      },
    },
    plugins: [
      visualizer({
        filename: "stats.html",
        open: false,
      }),
    ],
  };
});
