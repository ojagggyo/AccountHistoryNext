// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

module.exports = {
    mode: 'development',
    target: 'web', // これを追加
    // Uncaught (in promise) ReferenceError: regeneratorRuntime is not defined
    entry: ['regenerator-runtime/runtime.js', './src/app.js'],
    // 出力の設定
    output: {
        // 出力するファイル名
        filename: 'bundle.js',
        // 出力先のパス（絶対パスを指定する必要がある）
        path: path.join(__dirname, 'public')
    },

    externals: {
        'node:undici': 'commonjs node:undici',
    },
};