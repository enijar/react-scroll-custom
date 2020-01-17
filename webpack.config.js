const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const SRC_PATH = path.resolve(__dirname, 'src');
const BUILD_PATH = path.resolve(__dirname, 'build');

const config = {
  stats: 'minimal',
  target: 'web',
  entry: path.join(SRC_PATH, 'lib', 'index.js'),
  output: {
    path: BUILD_PATH,
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },
  plugins: [
    new ExtractTextPlugin('react-scroll.css'),
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      }
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
    config.output.filename = 'react-scroll.js';
    config.externals = {
      react: 'react',
      reactDOM: 'react-dom',
    };
  }

  return config;
};
