const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.config');

const libName = 'kontent-smart-link.legacy';

module.exports = (env, argv) => {
  return merge(
    common(env, argv),
    {
      entry: {
        [`${libName}.umd`]: './src/index.ts',
        [`${libName}.styles`]: './src/scss/styles.scss',
      },
      output: {
        path: path.join(__dirname, 'dist'),
        filename: argv.mode === 'production' ? '[name].min.js' : '[name].js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: 'KontentSmartLink',
      },
      optimization: {
        minimize: argv.mode === 'production',
      },
    },
  );
};
