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




-------------------------------------
const Koa = require('koa');
const Router = require('@koa/router');
const axios = require('axios');
const router = new Router();
const app = new Koa();
const koaStatic = require('koa-static');
const path= require('path');
const fs = require('fs');

// 静的ファイルを提供するディレクトリ
const staticDir = path.join(__dirname, 'public');
console.log(`staticDir=${staticDir}`);

app.use(koaStatic(staticDir, {
  maxage: 60 * 60 * 1000,  // キャッシュ有効期間（ミリ秒）
  hidden: false,           // 隠しファイル（.で始まるファイル）を許可するか
  index: 'index.html'      // デフォルトのインデックスファイル
}));

//app.use(koaStatic('./public'));
//app.use(koaStatic(staticDir));
app.use(async (ctx, next) => {
  console.log(`アクセスされたパス: ${ctx.path} - メソッド: ${ctx.method}`);
  
  // スラッシュを取り除いて比較（末尾のスラッシュを削除）
  const normalizedPath = ctx.path.endsWith('/') ? ctx.path.slice(0, -1) : ctx.path;
  const allowedPaths = ['/hello', '/upbit', '/huobi','/'];  // 許可するURLパス
  if (allowedPaths.includes(normalizedPath)) {
    //console.log(`API はnext: ${ctx.path}`);
    await next(); 
    return;
  }

// 静的ファイルが送信された後にレスポンスが正常に送信されたことを確認
  ctx.res.on('finish', () => {
    console.log(`レスポンスが正常に送信されました: ${ctx.path}`);
  });

  try {
    // 静的ファイルが存在しない場合、404を返す
    const filePath = path.join(staticDir, ctx.path);
    console.log(`ctx.path=${ctx.path}`);
    console.log(`filePath=${filePath}`);
    if (!fs.existsSync(filePath)) {
      console.log(`ファイルが存在しません: ${filePath}`);
      ctx.status = 404;
      ctx.body = 'ファイルが見つかりません';
      return;
    }

    // 存在する場合のみ、koa-staticで提供
    await koaStatic(staticDir)(ctx, next);

  } catch (error) {
    console.error(`エラーが発生しました: ${error.message}`);
    ctx.status = 500;
    ctx.body = 'サーバーエラー';
  }
});

// Hello API
router.get('/hello', (ctx) => {
  console.log('hello');
  ctx.body = 'Hello World!!';
});

// Upbit API
router.get('/upbit', async (ctx) => {
  console.log("***upbit***");
  ctx.res.on('finish', () => {
    console.log('レスポンスが正常に送信されました');
  });


  const query = ctx.query;
  const pattern = query.pattern;
  const callbackName = query.callback;

  if (!callbackName || callbackName.trim() === "") {
    console.log("***upbit error***");
    ctx.status = 400;
    ctx.body = '必須パラメータが不足しています: pattern または callback';
    return;
  }

  try {
    const s = await getPrice(pattern);
    //console.log("upbit=", s);
    ctx.contentType = 'application/javascript';  // JSONPのContent-Type
    ctx.body = `${callbackName}(${JSON.stringify(s)})`;  // JSONP形式
  } catch (error) {
    console.log("***upbit exception***");
    ctx.status = 500;
    ctx.body = `Upbit APIエラー: ${error.message}`;
  }
});

// Huobi API
router.get('/huobi', async (ctx) => {
  console.log("***huobi***");
  ctx.res.on('finish', () => {
    console.log('レスポンスが正常に送信されました');
  });

  const query = ctx.query;
  const pattern = query.pattern;
  const callbackName = query.callback;

  if (!callbackName || callbackName.trim() === "") {
    console.log("***huobi error***");
    ctx.status = 400;
    ctx.body = '必須パラメータが不足しています: pattern または callback';
    return;
  }

  try {
    console.log("***huobi getPriceHuobi before***");
    const s = await getPriceHuobi(pattern);
    //console.log("huobi=", s);
    ctx.contentType = 'application/javascript';  // JSONPのContent-Type
    ctx.body = `${callbackName}(${JSON.stringify(s)})`;  // JSONP形式

    console.log(`***huobi bode=${ctx.body}***`);
  } catch (error) {
    console.log("***huobi exception***");
    ctx.status = 500;
    ctx.body = `Huobi APIエラー: ${error.message}`;
  }
});

// Webhook - Upbitから価格を取得
async function getPrice(markets) {
  const url = `https://api.upbit.com/v1/ticker?markets=${markets}`;
  try {
    const response = await axios.get(url, {
      timeout: 5000  // タイムアウト設定（5秒）
    });
    return response.data;
  } catch (error) {
    throw new Error('Upbitからデータを取得中にエラーが発生しました: ' + error.message);
  }
}

// Webhook - Huobiから価格を取得
async function getPriceHuobi(pattern) {
  const url = `https://api.huobi.pro/market/history/trade?symbol=${pattern}`;
  try {
    const response = await axios.get(url, {
      timeout: 5000  // タイムアウト設定（5秒）
    });
    return response.data;
  } catch (error) {
    throw new Error('Huobiからデータを取得中にエラーが発生しました: ' + error.message);
  }
}

// '/' パスにアクセスされたときにindex.htmlを返す
router.get('/', async (ctx) => {
  const indexPath = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(indexPath);
  } else {
    ctx.status = 404;
    ctx.body = 'index.html が見つかりません';
  }
});

app.onerror = (err, ctx) => {
  // ログにエラーを記録
  console.log(`アプリケーションエラー: message=${err.message} stack=${err.stack} url=${ctx.request.url}`);
  // クライアントへのレスポンス
  ctx.status = err.status || 500;
  ctx.body = {
    message: 'サーバーエラーが発生しました。',
    error: err.message,
  };
};


// サーバー起動
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000, "0.0.0.0");
console.log('サーバーが起動しました!!');
