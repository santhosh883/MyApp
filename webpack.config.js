var webpack = require('webpack');
var path = require('path');
var BUILD_DIR = path.resolve(__dirname, 'dist');
var node = path.resolve(__dirname, 'node_modules/');
var BASE_DIR = path.resolve(__dirname, '');

var config = {
  context: __dirname,
  entry: './index.js',
  //watch when developing locally(within DataDesk-React)
  //watch: true,
  devServer: {
    contentBase: BASE_DIR,
    watchContentBase: true,
    publicPath: '/dist/',
    hot: true,
    port: 9000,
    watchOptions: {
      poll: 1000,
      aggregateTimeout: 300,
    },
    inline: true,
  },
  target: 'web', // in order to ignore built-in modules like path, fs, etc.
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        include: BASE_DIR,
        loader: ['style-loader', 'css-loader'],
      },
      {
        test: /\.css$/,
        loader: 'style-loader',
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      },
      {
        test: /\.json$/,
        loader: ['style-loader', 'json-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dsit/',
    filename: 'bundle.min.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      _: 'underscore',
      React: 'react',
      ReactDOM: 'react-dom',
    }),
  ],
};

module.exports = config;
