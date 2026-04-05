// サーバーサイド設定
import nodeExternals from 'webpack-node-externals';

// クライアントサイド設定
import path from 'path';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import 'regenerator-runtime/runtime.js';

// ESモジュール環境で __dirname の代わりに import.meta.url を使ってパスを計算
const __dirname = new URL('.', import.meta.url).pathname;  // __dirname の代わりに import.meta.url を使用

export default {
    mode: 'development', // または 'production'
    entry: ['regenerator-runtime/runtime.js', './src/app.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new NodePolyfillPlugin()  // これでNode.jsの組み込みモジュールがバンドルされます
    ],
    resolve: {
        fallback: {
            "undici": "undici"  // "node:undici" を解決するための設定
        },
    },
    externals: [nodeExternals()],  // Node.js 組み込みモジュールと外部依存を除外
};
