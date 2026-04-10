# ojagggyo-AccountHistoryNext



npm install @steemit/steem-js@1.0.14


https://github.com/steemit/steem-js/blob/next/docs/README.md


https://steemit.com/steem/@ety001/steem-js-v1-0-9-alpha-release-coming








// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
//const path = require('path');
//const nodeExternals = require('webpack-node-externals');
import path from 'path';
import nodeExternals from 'webpack-node-externals';

export default  {
    // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
    mode: 'development',
    // エントリーポイントの設定
    //entry: './src/app.js',
    // Uncaught (in promise) ReferenceError: regeneratorRuntime is not defined
    entry: ['regenerator-runtime/runtime.js', './src/app.js'],
    // 出力の設定
    output: {
        // 出力するファイル名
        filename: 'bundle.js',
        // 出力先のパス（絶対パスを指定する必要がある）
        path: path.join(__dirname, 'public')
    },

    externals: [nodeExternals()],  // Node.jsのモジュールを外部依存として扱う
    resolve: {
        fallback: {
            "undici": require.resolve("undici"), // undiciを明示的に指定
        },
    },
};










cat webpack.config.js
// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

module.exports = {
    // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
    mode: 'development',
    // エントリーポイントの設定
    //entry: './src/app.js',
    // Uncaught (in promise) ReferenceError: regeneratorRuntime is not defined
    entry: ['regenerator-runtime/runtime.js', './src/app.js'],
    // 出力の設定
    output: {
        // 出力するファイル名
        filename: 'bundle.js',
        // 出力先のパス（絶対パスを指定する必要がある）
        path: path.join(__dirname, 'public')
    },
};



%SystemRoot%\system32\WindowsPowerShell\v1.0\powershell.exe
power
d:
cd D:\GitHub\AccountHistoryNext
Get-ExecutionPolicy
Set-ExecutionPolicy RemoteSigned
Unblock-File -Path "D:\Program Files\nodejs\npm.ps1"