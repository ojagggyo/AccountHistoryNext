import Koa from 'koa';
import Router from '@koa/router';
import axios from 'axios';

const router = new Router();
const app = new Koa();


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
  const s = await getPrice(pattern);
  console.log("upbit=", s);
  ctx.contentType = 'application/json';
  ctx.body = `${callbackName}('${s}')`;
});

// Huobi API
router.get('/huobi', async (ctx) => {
  const query = ctx.query;
  const pattern = query.pattern;
  const callbackName = query.callback;
  const s = await getPriceHuobi(pattern);
  console.log("huobi=", s);
  ctx.contentType = 'application/json';
  ctx.body = `${callbackName}('${s}')`;
});

// Webhook - get price from Upbit
async function getPrice(markets) {
  return new Promise((resolve, reject) => {
    let url = "https://api.upbit.com/v1/ticker?markets=" + markets;
    const options = {
      method: 'GET',
      url: url,
      headers: {}
    };
    axios(options, function (error, response) {
      if (error) throw new Error(error);
      resolve(response.body);
    });
  });
}

// Webhook - get price from Huobi
async function getPriceHuobi(pattern) {
  return new Promise((resolve, reject) => {
    let url = "https://api.huobi.pro/market/history/trade?symbol=" + pattern;
    const options = {
      method: 'GET',
      url: url,
      headers: {}
    };
    axios(options, function (error, response) {
      if (error) throw new Error(error);
      resolve(response.body);
    });
  });
}

// Start server
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000, "0.0.0.0");
console.log('Server started!!');