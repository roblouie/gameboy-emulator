const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/gameboy.ts',
  mode: 'production',
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/apu/ring-buffer/ring-buffer-player-node.js' }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/, /.spec.ts/],
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
    filename: 'gameboy.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'gameboy',
      type: 'umd'
    }
  },
};