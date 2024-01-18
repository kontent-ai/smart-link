const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');

module.exports = (env, argv) => {
  return merge(
    common(env, argv),
    {
      output: {
        path: path.join(__dirname, 'dist'),
        filename: argv.mode === 'production' ? '[name].min.js' : '[name].js',
        libraryExport: 'default',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: 'KontentSmartLink',
      },
    },
  );
};
