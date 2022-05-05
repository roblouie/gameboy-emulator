const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/example.ts',
  // devtool: 'inline-source-map',
  devServer: {
    hot: true,
    https: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    port: 8100,
    host: '0.0.0.0'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Gameboy',
      template: './index.html'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /.spec.ts/],
      },
      {
        test: [/\.node.js$/],
        include: [ path.resolve(__dirname, './src')],
        use: 'raw-loader',
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'example-dist'),
  },
};
