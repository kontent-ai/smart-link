const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const libName = 'kontent-smart-link';

module.exports = (env, argv) => ({
  entry: {
    [`${libName}.umd`]: './src/index.ts',
    [`${libName}.styles`]: './src/scss/styles.scss',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: [
          path.resolve(__dirname, 'src'),
        ],
        options: {
          configFile: require.resolve('./tsconfig.webpack.json'),
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  optimization: {
    minimize: argv.mode === 'production',
  },
  plugins: [
    new BundleAnalyzerPlugin({
      statsFilename: 'stats.json',
      generateStatsFile: true,
      analyzerMode: 'disabled',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
});
