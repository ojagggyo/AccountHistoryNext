"use strict";

const path = require('path');
const Koa = require('koa')
const {koaBody} = require('koa-body');
const Router = require('koa-router');

const router = new Router();
const app = new Koa();


//2025.10.18 ins-start
const session = require('koa-session').default;
// セッションキー（安全のため .env に置くのが理想）
app.keys = ['your-secret-session-key'];
// koa-session の設定
const CONFIG = {
  key: 'steem:sess',       // Cookie名
  maxAge: 1000 * 30,  // 有効期限 30秒
  httpOnly: true,          // JSから参照できないようにする
  signed: true,            // 署名付きCookie
  renew: true              // アクセス時に延長
};
// セッションを有効化
app.use(session(CONFIG, app));
//2025.10.18 ins-end


const serve = require('koa-static')
app.use(serve('./public'))
//koa.use(serve(path.join(__dirname, 'public'))); 

router.get('/hello', (ctx, next) => {
    console.log('hello')
    ctx.body = 'Hello World!!';
});

router.get('/upbit', async (ctx, next) =>  {
    const query = ctx.query;
    const pattern = query.pattern;//patternパラメータ
    const callbackName = query.callback;//callbackパラメータ
    const s = await getPrice(pattern);
    console.log("upbit=",s);
    ctx.contentType = 'application/json';
    ctx.body = `${callbackName}('${s}')` 
});

router.get('/huobi', async (ctx, next) =>  {
  const query = ctx.query;
  const pattern = query.pattern;//patternパラメータ
  const callbackName = query.callback;//callbackパラメータ
  const s = await getPriceHuobi(pattern);
  console.log("huobi=",s);
  ctx.contentType = 'application/json';
  ctx.body = `${callbackName}('${s}')` 
});

/*

//--------------------------------------------------------------------------------
//2025.10.17 ins-start
function generateNonce() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now();
}
router.get('/get-nonce', async (ctx, next) =>  {
  const nonce = generateNonce();
  ctx.contentType = 'application/json';
  ctx.body = `{"success": "true", "nonce": "${nonce}"}`;
});

const dsteem = require('dsteem');
const { Client, cryptoUtils, Signature, PublicKey} = dsteem;
const client = new Client('https://api.steememory.com');

async function verifySignature(username, message, signedMessage) {
  // 1️⃣ メッセージを Buffer に変換
  const messageBuffer = Buffer.from(message, 'utf8');

  // 2️⃣ Steem Keychain は SHA256(message) を署名しているので同じくハッシュ化
  const digest = cryptoUtils.sha256(messageBuffer);

  // 3️⃣ 署名オブジェクト生成
  const signature = Signature.fromString(signedMessage);

  // 4️⃣ 公開鍵を復元（※ recover は digest を Buffer で渡す）
  const recoveredPubKey = PublicKey.from(signature.recover(digest)).toString();

  // 5️⃣ アカウント情報を取得
  const accounts = await client.database.getAccounts([username]);
  if (!accounts.length) throw new Error('ユーザーが存在しません');

  // 6️⃣ posting 公開鍵を取得
  const postingKeys = accounts[0].posting.key_auths.map(k => k[0]);

  // 7️⃣ 一致判定
  return postingKeys.includes(recoveredPubKey);
}
router.post('/verify-login', koaBody(), async ctx => {
    ctx.body = JSON.stringify(ctx.request.body)
    //console.log(ctx.body);

   const { username, message, signed_message } = ctx.request.body; 
   console.log(username);
   console.log(message);
   console.log(signed_message);

   const isValid = await verifySignature(username,message,signed_message);
   console.log(isValid);
});
//2025.10.17 ins-end
//--------------------------------------------------------------------------------


//2025.10.18 ins-start
const crypto = require('crypto');
// POST/JSON を受け取る設定
app.use(koaBody());
// 一時的にnonceを保存（本番ではRedisなどを推奨）
const nonces = new Map();
// ------------------------------
// ① nonceを発行するエンドポイント
// ------------------------------
router.get('/get-nonce3', async (ctx) => {
  const username = ctx.query.username;
  if (!username) {
    ctx.status = 400;
    ctx.body = { error: 'username is required' };
    return;
  }
  // ランダムなnonceを生成
  const nonce = crypto.randomBytes(16).toString('hex');
  nonces.set(username, nonce);
  ctx.body = { nonce };
});

// ------------------------------
// ② 署名検証するエンドポイント
// ------------------------------
router.post('/verify3', async (ctx) => {
  const { username, message, signature } = ctx.request.body;
  if (!username || !message || !signature) {
    ctx.status = 400;
    ctx.body = { error: 'Missing parameters' };
    return;
  }
  const storedNonce = nonces.get(username);
  if (!storedNonce) {
    ctx.status = 400;
    ctx.body = { error: 'Nonce not found. Please request again.' };
    return;
  }
  // 正しいメッセージ形式を確認
  const expectedMessage = `Login to mysite with nonce: ${storedNonce}`;
  if (message !== expectedMessage) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid message content' };
    return;
  }
  try {

console.info("username",username)
console.info("message",message)
console.info("signature",signature)



    // メッセージのハッシュを計算
    const hash = dsteem.cryptoUtils.sha256(message);

console.info(hash)
console.info(hash.length)

    // 署名から公開鍵を復元
    const recoveredKey = dsteem.Signature.fromString(signature).recover(hash);

console.info(recoveredKey)
console.info(recoveredKey.length)

    const recoveredPubKey = recoveredKey.toString();

console.info(recoveredPubKey)

    // Steemアカウントのキーを取得
    const accounts = await client.database.getAccounts([username]);
    if (!accounts || accounts.length === 0) {
      ctx.status = 400;
      ctx.body = { error: 'Account not found on Steem' };
      return;
    }
    const account = accounts[0];
    const postingKeys = account.posting.key_auths.map(k => k[0]);
    const activeKeys = account.active.key_auths.map(k => k[0]);
    const ownerKeys = account.owner.key_auths.map(k => k[0]);
    // 公開鍵が一致するか確認
    const isMatch =
      postingKeys.includes(recoveredPubKey) ||
      activeKeys.includes(recoveredPubKey) ||
      ownerKeys.includes(recoveredPubKey);
    if (isMatch) {
      // 成功 → nonce削除
      nonces.delete(username);
      ctx.session.username = username; // ✅ セッションにユーザー名を保存
      ctx.body = { success: true, username };
    } else {
      ctx.body = { success: false, error: 'Signature does not match any account keys' };
    }
  } catch (err) {
    console.error(err);
    ctx.body = { success: false, error: err.message };
  }
});
//2025.10.18 ins-end


//2025.10.18 ins-start #SESSION
router.post('/logout', async (ctx) => {
  ctx.session = null; // ✅ セッションを削除
  ctx.body = { success: true };
});
router.get('/profile', async (ctx) => {
  if (!ctx.session.username) {
    ctx.status = 401;
    ctx.body = { error: 'ログインが必要です' };
    return;
  }
  ctx.body = { message: `こんにちは ${ctx.session.username} さん！` };
});
//2025.10.18 ins-end #SESSION

*/


app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, "0.0.0.0");
console.log('Server started!!');

async function getPrice(markets) {
	return new Promise((resolve, reject) => {
		let url = "https://api.upbit.com/v1/ticker?markets=" + markets;
        var request = require('request');
        var options = {
          'method': 'GET',
          'url': url,
          'headers': {
          }
        };
        request(options, function (error, response) {
          if (error) throw new Error(error);
          resolve(response.body);
        });
	});
};

async function getPriceHuobi(pattern) {//pattern sbdusdt
	return new Promise((resolve, reject) => {
		let url = "https://api.huobi.pro/market/history/trade?symbol="+pattern;
        var request = require('request');
        var options = {
          'method': 'GET',
          'url': url,
          'headers': {
          }
        };
        request(options, function (error, response) {
          if (error) throw new Error(error);
          resolve(response.body);
        });
	});
};