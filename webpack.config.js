import path from 'path';
import nodeExternals from 'webpack-node-externals';

// ESモジュール環境で __dirname の代わりに import.meta.url を使ってパスを計算
const __dirname = new URL('.', import.meta.url).pathname;

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), // __dirname の代わりに新しく定義したパスを使用
    filename: 'bundle.js',
  },
  externals: [nodeExternals()],
};