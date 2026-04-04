import path from 'path';
import nodeExternals from 'webpack-node-externals';
import 'regenerator-runtime/runtime.js';

import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

// ESモジュール環境で __dirname の代わりに import.meta.url を使ってパスを計算
const __dirname = new URL('.', import.meta.url).pathname;

export default {
    mode: 'development', // または 'production'
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },

    plugins: [
        new NodePolyfillPlugin()  // これでNode.jsの組み込みモジュールがバンドルされます
    ],

    resolve: {
        fallback: {
            "undici": "undici" // "require.resolve('undici')" の代わりに直接指定
        },
    },

    type: 'module' // これはESモジュールを使用するために必須
};