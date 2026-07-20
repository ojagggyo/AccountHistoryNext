// webpack.server.js
import path from 'path';
import nodeExternals from 'webpack-node-externals';

export default {
  target: 'node',  // Node.js向けにバンドル
  entry: './src/server.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.bundle.js',
  },
  externals: [nodeExternals()],  // Node.js 組み込みモジュールと外部依存を除外
};
