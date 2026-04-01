import Koa from 'koa';
import Router from '@koa/router';
import axios from 'axios';

const router = new Router();
const app = new Koa();

import koaStatic from 'koa-static';
app.use(koaStatic('./public'));

// Hello API
router.get('/hello', (ctx) => {
  console.log('hello');
  ctx.body = 'Hello World!!';
});

// Upbit API
router.get('/upbit', async (ctx) => {
  const query = ctx.query;
  const pattern = query.pattern;
  const callbackName = query.callback;

  if (!pattern || !callbackName) {
    ctx.status = 400;
    ctx.body = '必須パラメータが不足しています: pattern または callback';
    return;
  }

  try {
    const s = await getPrice(pattern);
    console.log("upbit=", s);
    ctx.contentType = 'application/javascript';  // JSONPのContent-Type
    ctx.body = `${callbackName}(${JSON.stringify(s)})`;  // JSONP形式
  } catch (error) {
    ctx.status = 500;
    ctx.body = `Upbit APIエラー: ${error.message}`;
  }
});

// Huobi API
router.get('/huobi', async (ctx) => {
  const query = ctx.query;
  const pattern = query.pattern;
  const callbackName = query.callback;

  if (!pattern || !callbackName) {
    ctx.status = 400;
    ctx.body = '必須パラメータが不足しています: pattern または callback';
    return;
  }

  try {
    const s = await getPriceHuobi(pattern);
    console.log("huobi=", s);
    ctx.contentType = 'application/javascript';  // JSONPのContent-Type
    ctx.body = `${callbackName}(${JSON.stringify(s)})`;  // JSONP形式
  } catch (error) {
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

// サーバー起動
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000, "0.0.0.0");
console.log('サーバーが起動しました!!');