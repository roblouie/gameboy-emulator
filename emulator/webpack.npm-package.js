const path = require('path');

module.exports = {
  entry: './src/gameboy.ts',
  mode: 'production',
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
    extensions: ['.tsx', '.ts'],
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