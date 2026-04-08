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
      // === externals: node:undici をバンドルから完全除外 ===
    externals: {
        // ✅ 正しい記法：文字列として指定（正規表現や関数でも可、但し文字列が最簡）
        'node:undici': 'commonjs node:undici',
        '@steemit/steem-js': 'steem' // 外部依存として設定
    },
};