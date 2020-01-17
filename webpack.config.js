const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const SRC_PATH = path.resolve(__dirname, 'src');
const BUILD_PATH = path.resolve(__dirname, 'build');

const config = {
  stats: 'minimal',
  target: 'web',
  entry: path.join(SRC_PATH, 'index.js'),
  output: {
    path: BUILD_PATH,
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    contentBase: BUILD_PATH,
    writeToDisk: true,
  },
  devtool: 'source-map',
};

module.exports = (env, argv) => {
  if (argv.hot) {
    // contenthash isn't available when hot reloading.
    config.output.filename = '[name].[hash].js';
  }

  if (argv.mode === 'development') {
    config.entry = path.join(SRC_PATH, 'examples', 'index.js');
    config.plugins = [
      new HtmlWebpackPlugin({
        template: path.join(SRC_PATH, 'examples', 'index.html'),
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
      ...config.plugins,
    ];
  }

  if (argv.mode === 'production') {
    config.devtool = false;
    config.optimization.minimize = true;
    config.optimization.minimizer = [
      new TerserPlugin({
        extractComments: 'all',
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          keep_classnames: true,
          keep_fnames: true,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        sourceMap: true,
      }),
    ];
  }

  return config;
};
