const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const libName = 'kontent-smart-link';

module.exports = (env, argv) => ({
  entry: {
    [`${libName}.umd`]: './src/index.ts',
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
  ],
});
