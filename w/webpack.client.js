// webpack.client.js
import path from 'path';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

export default {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new NodePolyfillPlugin()  // Node.jsの組み込みモジュールをポリフィル
  ],
  resolve: {
    fallback: {
      "undici": "undici"  // "node:undici" を解決するための設定
    },
  }
};
