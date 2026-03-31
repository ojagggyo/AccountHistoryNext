import {steem} from '@steemit/steem-js';  // steemライブラリをインポート

// APIのエンドポイントを設定
steem.api.setOptions({ url: 'https://api.steememory.com' });

//OK
async function getTick(){
  //let o = await callAsync('market_history_api','get_ticker',[] )
  let o  = await steem.api.callAsync('market_history_api.get_ticker');
	const steemsbd = 1 / parseFloat(o.latest)
  console.log('steemsbd:', steemsbd);
}


const callAsync  =  async (api, method, params) => {
    return new Promise((resolve, reject) => {
		(async() => {
            steem.api.callAsync(api,method,params).then(
                function(result) {
                    resolve(result)
                },
                function(error) {
                    reject(error)
                }
            )
        })();
    });
}

async function getAccountInfo(accountName) {
  try {
    // アカウント情報を取得
    const accountInfo = await steem.api.getAccountsAsync([accountName]);
    if (accountInfo.length > 0) {
      console.log('Account Information:');
      console.log(accountInfo[0]);
    } else {
      console.log('Account not found.');
    }
  } catch (error) {
    console.error('Error fetching account info:', error);
  }
}


//const result = await steem.api.callAsync('get_account_history', ['yasu', -1, 1]);
//console.log('result:', result);

//--- OK ---
getTick();

//--- OK ---
//let accounts = await client.database.getAccounts([username]);
const accounts = await steem.api.getAccountsAsync(['yasu']);
console.log('accounts:', accounts);

//--- OK ---
//let globalProperties = await client.database.getDynamicGlobalProperties();//★
let globalProperties = await steem.api.getDynamicGlobalPropertiesAsync();
console.log(globalProperties);

//--- OK ---
//ret = await client.database.call('get_account_history',[username, firstValue, limit]);
const ret2 = await steem.api.getAccountHistoryAsync("yasu", -1, 3);
console.log(ret2);

//--- OK ---
async function getVotingPower(username) {
	return new Promise((resolve, reject) => {
    steem.api.getAccountsAsync(['yasu']).then(accounts =>{
      resolve(accounts[0].voting_power/ 100);
    });
	});
}
const ret3 = await getVotingPower('yasu');
console.log(ret3);
