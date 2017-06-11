var path = require('path');
var webpack = require('webpack');

module.exports = {
  cache: true,
  devtool: 'source-map',
  entry: {
    app: path.join(__dirname) + '/app.js'
  },
  output: {
    path: path.join(__dirname) + '/public',
    publicPath: '/',
    filename: 'bundle.js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|dist)/,
      }
    ]
  }
}
