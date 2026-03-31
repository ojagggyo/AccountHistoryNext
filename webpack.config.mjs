import path from 'path';
import nodeExternals from 'webpack-node-externals';
import 'regenerator-runtime/runtime.js';

// ESモジュール環境で __dirname の代わりに import.meta.url を使ってパスを計算
const __dirname = new URL('.', import.meta.url).pathname;

export default {

    mode: 'development', // または 'production'
    entry: './src/app.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
};
