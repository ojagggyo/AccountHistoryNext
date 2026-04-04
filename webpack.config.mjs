import path from 'path';
import 'regenerator-runtime/runtime.js';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
//import nodeExternals from 'webpack-node-externals';

// ESモジュール環境で __dirname の代わりに import.meta.url を使ってパスを計算
const __dirname = new URL('.', import.meta.url).pathname;

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
            "undici": "undici"  // "node:undici" を解決するために設定
        }
    },

    externals: {
        //"undici": "undici"  // "node:undici" を外部モジュールとして扱う
    }
};