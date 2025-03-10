// vite.config.js
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

const libName = 'kontent-smart-link';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    resolve: {
      extensions: ['.ts', '.js'],
    },
    build: {
      sourcemap: true,
      minify: isProduction,
      outDir: 'build/dist',
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'KontentSmartLink',
        formats: ['umd'],
        fileName: () => (isProduction ? `${libName}.min.js` : `${libName}.js`),
      },
      rollupOptions: {
        output: {
          exports: 'auto',
          amd: {
            id: 'KontentSmartLink',
          },
        },
      },
    },
    plugins: [
      visualizer({
        filename: 'stats.html',
        open: false,
      }),
    ],
  };
});
