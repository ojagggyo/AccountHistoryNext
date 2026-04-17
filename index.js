const Koa = require('koa');
const Router = require('@koa/router');
const axios = require('axios');
const path = require('path');
const koaStatic = require('koa-static');
const router = new Router();
const app = new Koa();

// 静的ファイルを提供するディレクトリ
const staticDir = path.join(__dirname, 'public');
console.log(`staticDir=${staticDir}`);

// 静的ファイルの提供
app.use(koaStatic(staticDir, {
  maxage: 60 * 60 * 1000,  // キャッシュ有効期間（ミリ秒）
  hidden: false,           // 隠しファイル（.で始まるファイル）を許可するか
  index: 'index.html',     // デフォルトのインデックスファイル
}));

// APIにアクセスされた際の処理
router.get('/hello', (ctx) => {
  ctx.body = 'Hello World!!';
});

// Upbit API
router.get('/upbit', async (ctx) => {
  const { pattern, callback } = ctx.query;

  if (!callback || callback.trim() === "") {
    ctx.status = 400;
    ctx.body = '必須パラメータが不足しています: pattern または callback';
    return;
  }

  try {
    const data = await getPrice(pattern);  // Upbitから価格を取得
    //ctx.contentType = 'application/javascript';  // JSONPのContent-Type
    ctx.type = 'application/javascript';
    ctx.body = `${callback}(${JSON.stringify(data)});`;  // JSONP形式で返す
  } catch (error) {
    ctx.status = 500;
    ctx.body = `Upbit APIエラー: ${error.message}`;
  }
});

// Huobi API
router.get('/huobi', async (ctx) => {
  const { pattern, callback } = ctx.query;

  if (!callback || callback.trim() === "") {
    ctx.status = 400;
    ctx.body = '必須パラメータが不足しています: pattern または callback';
    return;
  }

  try {
    const data = await getPriceHuobi(pattern);
    //ctx.contentType = 'application/javascript';  // JSONPのContent-Type
    ctx.type = 'application/javascript';
    ctx.body = `${callback}(${JSON.stringify(data)});`;  // JSONP形式で返す
   
  } catch (error) {
    ctx.status = 500;
    ctx.body = `Huobi APIエラー: ${error.message}`;
  }
});

// Bitpoint API
router.get('/bitpoint', async (ctx) => {
  const { pattern, callback } = ctx.query;

  if (!callback || callback.trim() === "") {
    ctx.status = 400;
    ctx.body = '必須パラメータが不足しています: pattern または callback';
    return;
  }

  try {
    const data = await getPriceBitpoint(pattern);
    //ctx.contentType = 'application/javascript';  // JSONPのContent-Type
    ctx.type = 'application/javascript';
    ctx.body = `${callback}(${JSON.stringify(data)});`;  // JSONP形式で返す
  } catch (error) {
    ctx.status = 500;
    ctx.body = `Huobi APIエラー: ${error.message}`;
  }
});

// Webhook - Upbitから価格を取得
async function getPrice(markets) {
  const url = `https://api.upbit.com/v1/ticker?markets=${markets}`;
  try {
    const response = await axios.get(url, { timeout: 5000 });  // タイムアウト設定（5秒）
    return response.data;
  } catch (error) {
    throw new Error('Upbitからデータを取得中にエラーが発生しました: ' + error.message);
  }
}

// Webhook - Huobiから価格を取得
async function getPriceHuobi(pattern) {
  const url = `https://api.huobi.pro/market/history/trade?symbol=${pattern}`;
  try {
    const response = await axios.get(url, { timeout: 5000 });  // タイムアウト設定（5秒）
    return response.data;
  } catch (error) {
    throw new Error('Huobiからデータを取得中にエラーが発生しました: ' + error.message);
  }
}

// Webhook - Bitpointから価格を取得
async function getPriceBitpoint(pattern) {
  const url = `https://smartapi.bitpoint.co.jp/bpj-smart-api/api/ticker/24hr?symbol=${pattern}`;
  try {
    const response = await axios.get(url, { timeout: 5000 });  // タイムアウト設定（5秒）
    return response.data;
  } catch (error) {
    throw new Error('Bitpointからデータを取得中にエラーが発生しました: ' + error.message);
  }
}

// エラーハンドリング
app.onerror = (err, ctx) => {
  console.error(`アプリケーションエラー: message=${err.message} stack=${err.stack} url=${ctx.request.url}`);
  console.error(`status=${err.status}`);
  ctx.status = err.status || 500;
  ctx.body = {
    message: 'サーバーエラーが発生しました。',
    error: err.message,
  };
};

// サーバー起動
app.use(router.routes());
app.use(router.allowedMethods());

// サーバーの起動
app.listen(3000, "0.0.0.0", () => {
  console.log('サーバーが起動しました!!');
});
