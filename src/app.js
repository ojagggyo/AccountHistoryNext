//require("regenerator-runtime/runtime");
import 'regenerator-runtime/runtime.js';

//const dsteem = require('dsteem');
//let client = new dsteem.Client('https://api.steememory.com');
import {steem} from '@steemit/steem-js';  // steemライブラリをインポート
steem.api.setOptions({ url: 'https://api.steememory.com' });

let _get_account_history_limit = 100
let _get_account_history_keyword

let globalProperties;
let krwsteem;
let krwsbd;
let krwtrx;
let krwbtc;
let krweth;
let btcsteem;
let krwjpy;
let krwusd;
let usdtsbd;//2025/01/12
let usdtbtc;//2025/01/12
let steemsbd;//2025/01/18

async function getTick(){

	console.log("*** getTick start ***",steemsbd);

    //let o = await callAsync('market_history_api','get_ticker',[] )
	let o = await steem.api.callAsync('market_history_api.get_ticker');
	steemsbd = 1 / parseFloat(o.latest)
	console.log("*** getTick end ***",steemsbd);
}

//-----------------------------------------------------------------------

const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//-----------------------------------------------------------------------

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function donokuraimae(date){
	let date1 = new Date(date);
	date1.setHours(date1.getHours() + 9);
	var now = new Date();
	sa = now - date1;
	if(sa >= 31556925130*2){return Math.floor(sa / 31556925130)+' years ago';}//365.242189*3600*24*1000
	if(sa >= 2360591558*2){return Math.floor(sa / 2360591558)+' months ago';}//27.32166155*3600*24*1000
	if(sa >= 86400000*2){return Math.floor(sa / 86400000)+' days ago';}
	if(sa >= 3600000*2){return Math.floor(sa / 3600000)+' hours ago';}
	if(sa >= 60000*2){return Math.floor(sa / 60000)+' minutes ago';}
	if(sa >= 1000*2){return Math.floor(sa / 1000)+' seconds ago';}
	return 'just now';
}

function vestToSteem(vest){//★

	//数値の時と、文字列（99.9 VESTS）の時がある
	let vesting = 0.0;
	if(typeof vest == 'string'){
		vesting = parseFloat(vest.replace(" VESTS", ""));	
	}else{
		vesting = vest;
	}
	
	let total_vesting_shares = parseFloat(globalProperties.total_vesting_shares.replace(" VESTS", ""));
	let total_vesting_fund_steem = parseFloat(globalProperties.total_vesting_fund_steem.replace(" STEEM", ""));
	let k = total_vesting_fund_steem / total_vesting_shares;
	let sp = vesting * k;//保持しているSP
	return sp;
}
	
function ellipsis(s){
	return s.length > 40 ? (s).slice(0,40)+"…" : s;
}

function getUserName(){

  let hash = window.location.hash;// #username
  if (hash == null || hash.trim().length == 0){
	  return "";
  }
  hash = hash.substr(1);//#を取る
  hash = decodeURI(hash).trim();//デコード、トリム]
  return hash;
}

// ---------- emoji ----------
let emoji_upvote = "";
let emoji_downvote = "";
let emoji_author_reward = "";
let emoji_curation_reward = "";
let emoji_authored = "";
let emoji_replied = "";
let emoji_transfer = "";
let emoji_delegate_vesting_shares = "";
let emoji_undelegate_vesting_shares = "";
let emoji_claim_reward_balance = "";
let emoji_comment_benefactor_reward = "";
let emoji_index = Math.floor( Math.random() * 4 );	;
function emoji(){
emoji_index = ++emoji_index % 4;
switch(emoji_index)
{
case 0:
emoji_upvote = "👍";
emoji_downvote = "👎";
emoji_author_reward = "💰";
emoji_curation_reward = "💰";
emoji_authored = "🤙";
emoji_replied = "✋";
emoji_transfer = "";
emoji_delegate_vesting_shares = "";
emoji_undelegate_vesting_shares = "";
emoji_claim_reward_balance = "";
emoji_comment_benefactor_reward = "💰";
break;
case 1:
emoji_upvote = "😍";
emoji_downvote = "😭";
emoji_author_reward = "😁";
emoji_curation_reward = "😁";
emoji_authored = "🙂";
emoji_replied = "😄";
emoji_transfer = "";
emoji_delegate_vesting_shares = "";
emoji_undelegate_vesting_shares = "";
emoji_claim_reward_balance = "";
emoji_comment_benefactor_reward = "😁";
break;	
case 2:
		//🚀🛰️🛸🌌�🛰️📡🚀 🛸🪐⭐"
emoji_upvote = "🚀";
emoji_downvote = "🕳️";
emoji_author_reward = "⭐";
emoji_curation_reward = "⭐";
emoji_authored = "🛸";
emoji_replied = "🛸";
emoji_transfer = "";
emoji_delegate_vesting_shares = "";
emoji_undelegate_vesting_shares = "";
emoji_claim_reward_balance = "";
emoji_comment_benefactor_reward = "⭐";
break;
case 3:
		//🍓🍉🍈🍇🍊🍒🍓"
emoji_upvote = "🍉";
emoji_downvote = "🍏";
emoji_author_reward = "🍊";
emoji_curation_reward = "🍊";
emoji_authored = "🍒";
emoji_replied = "🍒";
emoji_transfer = "";
emoji_delegate_vesting_shares = "";
emoji_undelegate_vesting_shares = "";
emoji_claim_reward_balance = "";
emoji_comment_benefactor_reward = "🍊";
break;
}
}

// ---------- power ---------- 
async function getEffectivePower(username){
	//let globalProperties = await client.database.getDynamicGlobalProperties();//★
  let globalProperties = await steem.api.getDynamicGlobalPropertiesAsync();

	let total_vesting_shares = parseFloat(globalProperties.total_vesting_shares.replace(" VESTS", ""));
	let total_vesting_fund_steem = parseFloat(globalProperties.total_vesting_fund_steem.replace(" STEEM", ""));
	let k = total_vesting_fund_steem / total_vesting_shares;
	//let accounts = await client.api.getAccounts([username]);//★
	//let accounts = await client.database.getAccounts([username]);
  let accounts = await steem.api.getAccountsAsync([username]);
	
	let vesting_shares = parseFloat(accounts[0].vesting_shares.replace(" VESTS", ""));
	let received_vesting_shares = parseFloat(accounts[0].received_vesting_shares.replace(" VESTS", ""));
	let delegated_vesting_shares = parseFloat(accounts[0].delegated_vesting_shares.replace(" VESTS", ""));
	let sp = vesting_shares * k;//保持しているSP
	let sp1 = received_vesting_shares * k;//委任されたSP
	let sp2 = delegated_vesting_shares * k;//委任したSP
	return {sp:sp, received_sp: sp1, delegated_sp: sp2};
}

function effectivepower(username,id1, id2, id3){
	if(arguments.length == 1){
		id1 = "effectivepowervalue";
		id2 = "effectivepowerdetail";
		id3 = "effectivepower";
	}
	getEffectivePower(username).then(result => {
		document.getElementById(id1).text = 
			numberWithCommas((result.sp + result.received_sp - result.delegated_sp).toFixed(0)) + " SP" ;//★
		document.getElementById(id2).text = 
			'('
			+ numberWithCommas((result.sp).toFixed(0))
			+ ((result.received_sp == 0) ? '' : ' + ' + numberWithCommas((result.received_sp).toFixed(0)))
			+ ((result.delegated_sp == 0) ? '' : ' - ' + numberWithCommas((result.delegated_sp).toFixed(0)))
			+ ')';
		if(id3){
			document.getElementById(id3).max = result.sp + result.received_sp;
			document.getElementById(id3).value = result.sp + result.received_sp - result.delegated_sp;
		}
	}).catch(err => {
		console.log("call getEffectivePower",username);
		console.log(err);
	});	
}

/*
async function getVotingPower(username) {
	return new Promise((resolve, reject) => {
		client.rc.getVPMana(username).then(vPMana =>
			{			
				resolve(vPMana.percentage / 100) 
			}
		)
	});
}
*/
async function getVotingPower(username) {
	return new Promise((resolve, reject) => {
    steem.api.getAccountsAsync(['yasu']).then(accounts =>{
      resolve(accounts[0].voting_power/ 100);
    });
	});
}

function votingpower(username, id1, id2){
	if(arguments.length == 1){
		id1 = "votingpowervalue";
		id2 = "votingpower";
	}
	getVotingPower(username).then(result => {
		document.getElementById(id1).text = result.toFixed(2) + ' %';//20250907
		if(id2){
			document.getElementById(id2).value = result;
		}
	}).catch(err => {
		console.log("call getVotingPower",username);
		console.log(err);
	});
}

	
function steemAmountFormat(steem, sbd, sp, v = 3) {
	let s = "";
	let lines = [];
	if(steem > 0){ lines.push(numberWithCommas(steem.toFixed(v)) + " STEEM"); }
	if(sbd > 0){ lines.push(numberWithCommas(sbd.toFixed(v)) + " SBD"); }
	if(sp > 0){ lines.push(numberWithCommas(sp.toFixed(v)) + " SP"); }
	switch(lines.length){
	case 1:
		s = lines[0];
		break;
	case 2:
		s = lines[0] + ' and ' + lines[1];
		break;
	case 3:
		s = lines[0] + ', ' + lines[1] + ' and ' + lines[2];
		break;
	}
	return s;
}	
	
function krwAmountFormat(steemAmount, sbdAmount, spAmount, krw_steem, krw_sbd) {
	if(krw_steem == 0) return "";
	// return ' <a class=gray>(' 
	// 	+ numberWithCommas((steemAmount * krw_steem + sbdAmount * krw_sbd + spAmount * krw_steem).toFixed(0)) //★
	// 	+ ' KRW)</a>';
	return ' <a class="red">('
	+ '<span class=under1>'
	+ '₩' 
	+ numberWithCommas((steemAmount * krw_steem + sbdAmount * Math.min(krw_sbd,usdtsbd/krwusd) + spAmount * krw_steem).toFixed(0))
	+ '</span>'
	+ ' '
	+ '<span class=under1>'
	+ '&yen;'
	+ numberWithCommas(((steemAmount * krw_steem + sbdAmount * Math.min(krw_sbd,usdtsbd/krwusd) + spAmount * krw_steem) * krwjpy).toFixed(0))
	+ '</span>'
	+ ' '
	+ '<span class=under1>'
	+ '$'
	+ numberWithCommas(((steemAmount * krw_steem + sbdAmount * Math.min(krw_sbd,usdtsbd/krwusd) + spAmount * krw_steem) * krwusd).toFixed(2))
	+ '</span>'
	+ ')</a>';	
}
	
//reputation
function log10(str) {
    return Math.log10(str);
}

function repLog10(str) {
    let rep = String(str);
    const neg = rep.charAt(0) === '-';
    rep = neg ? rep.substring(1) : rep;
    let out = log10(rep);
    if (isNaN(out)) out = 0;
    out = Math.max(out - 9, 0); // @ -9, $0.50 earned is approx magnitude 1
    out = (neg ? -1 : 1) * out;
    out = out * 9 + 25; // 9 points per magnitude. center at 25  
    return out;
};

async function getReputation(username){
	return new Promise((resolve, reject) => {
		//client.database.getAccounts([username])
    steem.api.getAccountsAsync([username])
		.then(res => {
			if (res.len == 0) reject(0);
			resolve(repLog10(res[0].reputation));
		}).catch(err => {
			reject(err);
		})
	});
}

 async function reputation(username, id){
	getReputation(username).then(result => {
		document.getElementById(id).text = result.toFixed(3);
	})
	.catch(err => {
		console.log("call getReputation",username,id);
		console.log(err);
	});	
}


// ---------- witness ----------
//2025.10.10
async function getProxy(username){
	return new Promise((resolve, reject) => {
		//client.database.getAccounts([username]).then(res =>{
    steem.api.getAccountsAsync([username]).then(res =>{

			if (res.length == 0) reject("res.length == 0");

			resolve({
				proxy: res[0].proxy,
				witness_votes: res[0].witness_votes,
			});
		}).catch(err=>{reject(err)})
	});
}

if (typeof window !== 'undefined') {
window.jumpRanking = function(witness) {
	var a = document.createElement('a');
	a.href = `https://steememory.com/chart/ranking.html?user=${witness}`
	a.target = '_blank';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}
}

function makeRanking(witnessList){
	let str=""
    for(var witness of witnessList){
		str+=` <a class='black' href=javascript:jumpRanking('${witness}')>${witness}</a>`
    }
	return str
}

async function getWitness(username){
	//プロキシ有無判定
	let account = await getProxy(username)
	if( account.proxy == "") {
		//プロキシ指定なし
		if(account.witness_votes.length == 0){
			return "(total: 0)"
		}else{
			return makeRanking(account.witness_votes)+ " (total: "+account.witness_votes.length+")"
		}		
	}else{
		//プロキシ指定あり
		return "[proxy: " + account.proxy + "] " + await getWitness(account.proxy)
	}
}

function witness(username){

	getWitness(username).then(result => {
		document.getElementById("witness").innerHTML = result ;
	}).catch(err => {
		console.log("call getWitness",username);
		console.log(err);
	});
}

// ---------- age ----------
function diffYMDH(from, to) {
  // Dateオブジェクトに変換
  let start = new Date(from);
  let end = new Date(to);

  // 逆順なら入れ替え
  if (start > end) [start, end] = [end, start];

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  let hours = end.getHours() - start.getHours();

  // 時間が負なら日付から借りる
  if (hours < 0) {
    days--;
    hours += 24;
  }

  // 日が負なら月から借りる
  if (days < 0) {
    months--;
    // 前月の最終日の日数を取得
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }

  // 月が負なら年から借りる
  if (months < 0) {
    years--;
    months += 12;
  }

  // 日数が負の場合に月や年から借りる処理を強化
  if (days < 0) {
    months--;
    // 前月の最終日の日数を加算
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }

  return { years, months, days, hours };
}  

/*
function diffYMD(from, to) {
  // Dateオブジェクトに変換
  let start = new Date(from);
  let end = new Date(to);

  // 順序を保証
  if (start > end) {
    [start, end] = [end, start];
  }

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  // 日がマイナスなら前月から借りる
  if (days < 0) {
    months--;

    // 前月の最終日
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // 月がマイナスなら前年から借りる
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}
*/
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function editDate(d){
	// years
	let s = ((d.years == 0)?"":d.years + ((d.years == 1)?" year":" years"))

	// months
	let months = ((d.months == 0)?"":d.months + ((d.months == 1)?" month":" months"))
	if(s != "" && months != ""){
		s += ", "
	}
	s += months

	// days
	let days = ((d.days == 0)?"":d.days + ((d.days == 1)?" day":" days"))
	if(s != "" && days != ""){
		s += ", "
	}
	s += days

	// hours
	if(d.hours){
		let hours = ((d.hours == 0)?"":d.hours + ((d.hours == 1)?" hour":" hours"))
		if(s != "" && hours != ""){
			s += ", "
		}
		s += hours
	}

	return s
}

//27.3217
async function getAge(username){
	return new Promise((resolve, reject) => {
		//client.database.getAccounts([username]).then(res =>{
    steem.api.getAccountsAsync([username]).then(res =>{

			if (res.length == 0) reject("res.length == 0");
			let date1 = new Date(res[0].created);
			date1.setHours(date1.getHours() + 9);
			var now = new Date();

			// 2025.12.14 rep start
			let diff = diffYMDH(formatDate(date1), formatDate(now))
			resolve({
				diff: diff
			});
			// 2025.12.14 rep end

		}).catch(err=>{reject(err)})
	});
}

 function age(username){
	getAge(username).then(result => {

		// 2025.12.14 rep start
		console.log(result.diff)
		console.log(editDate(result.diff));			
		document.getElementById("age").text = editDate(result.diff);
		// 2025.12.14 rep end

	}).catch(err => {
		console.log("call getAge",username);
		console.log(err);
	});	
}


// ---------- wallet ----------
async function getWalllet(username){
	//let globalProperties = await client.database.getDynamicGlobalProperties();//★
  let globalProperties = await steem.api.getDynamicGlobalPropertiesAsync();

	let total_vesting_shares = parseFloat(globalProperties.total_vesting_shares.replace(" VESTS", ""));
	let total_vesting_fund_steem = parseFloat(globalProperties.total_vesting_fund_steem.replace(" STEEM", ""));
	let k = total_vesting_fund_steem / total_vesting_shares;
	return new Promise((resolve, reject) => {
		//client.database.getAccounts([username]).then(res =>{
    steem.api.getAccountsAsync([username]).then(res =>{

			if (res.length == 0) reject("res.length == 0");
			resolve({
				steem: parseFloat(res[0].balance),
				sbd: parseFloat(res[0].sbd_balance),
				sp: parseFloat(res[0].vesting_shares) * k
			});
		}).catch(err=>{reject(err)})
	});
}

function wallet(username){
	getWalllet(username).then(result => {
		document.getElementById("wallet").innerHTML = 
			steemAmountFormat(result.steem, result.sbd , result.sp, 3) + ' ' +
			krwAmountFormat(result.steem, result.sbd , result.sp, krwsteem, krwsbd) 
	}).catch(err => {
		console.log("call getWalllet",username);
		console.log(err);
	});	
}



	
//reward
let total_count = {};
let total_sbd_payout = {};
let total_steem_payout = {};
let total_vesting_payout = {};
let total_sp_payout = {};
function getReward(record){
	const username = document.getElementById("username").value
	let sbd_payout = 0;
	let steem_payout = 0;
	let vesting_payout = 0;
	let op = record[1].op[0];
	if(op == "comment_benefactor_reward" && record[1].op[1].benefactor == username){
		sbd_payout = parseFloat(record[1].op[1].sbd_payout);
		steem_payout = parseFloat(record[1].op[1].steem_payout);
		vesting_payout = parseFloat(record[1].op[1].vesting_payout);
	}else if(op == "author_reward"){
		sbd_payout = parseFloat(record[1].op[1].sbd_payout);
		steem_payout = parseFloat(record[1].op[1].steem_payout);
		vesting_payout = parseFloat(record[1].op[1].vesting_payout);
	}else if(op == "curation_reward"){
		sbd_payout = 0;
		steem_payout = 0;
		vesting_payout = parseFloat(record[1].op[1].reward);
	}else if(op == "producer_reward"){
		sbd_payout = 0;
		steem_payout = 0;
		vesting_payout = parseFloat(record[1].op[1].vesting_shares);
	}else {
		return false;
	}
	

	
	if(total_count[op] === void 0){
		total_count[op] = 1;
		total_sbd_payout[op] = sbd_payout;
		total_steem_payout[op] = steem_payout;
		total_vesting_payout[op] = vesting_payout;
		total_sp_payout[op] = vestToSteem(vesting_payout);
	}else{
		total_count[op] += 1;
		total_sbd_payout[op] += sbd_payout;
		total_steem_payout[op] += steem_payout;
		total_vesting_payout[op] += vesting_payout;
		total_sp_payout[op] += vestToSteem(vesting_payout);
	}
	return true;
}
	
//Donation
let total_donation_count = {};
let total_donation_sbd = {};
let total_donation_steem = {};
let total_donation_vesting = {};
let total_donation_sp = {};
function getReward_donation(record){
	const username = document.getElementById("username").value
	let sbd = 0;
	let steem = 0;
	let vesting = 0;
	let op = record[1].op[0];
	if(op == "comment_benefactor_reward" && record[1].op[1].benefactor != username){//Donation
		op = "donation";
		sbd = parseFloat(record[1].op[1].sbd_payout);
		steem = parseFloat(record[1].op[1].steem_payout);
		vesting = parseFloat(record[1].op[1].vesting_payout);
	}else {
		return false;
	}
	

	if(total_donation_count[op] === void 0){
		total_donation_count[op] = 1;
		total_donation_sbd[op] = sbd;
		total_donation_steem[op] = steem;
		total_donation_vesting[op] = vesting;
		total_donation_sp[op] = vestToSteem(vesting);
	}else{
		total_donation_count[op] += 1;
		total_donation_sbd[op] += sbd;
		total_donation_steem[op] += steem;
		total_donation_vesting[op] += vesting;
		total_donation_sp[op] += vestToSteem(vesting);
	}
	return true;
}

//Power up/down
let total_powerupdown_count = {};
let total_powerupdown_steem = {};
let total_powerupdown_vesting = {};
let total_powerupdown_sp = {};
function getReward_powerupdown(record){

	let steem = 0;
	let vesting = 0;
	let op = record[1].op[0];
	if(op == "transfer_to_vesting"){//Power up
		op = "power_up";
		steem = parseFloat(record[1].op[1].amount);
	}else if(op == "fill_vesting_withdraw"){//Power down
		op = "power_down";
		steem = parseFloat(record[1].op[1].deposited);
	}else {
		return false;
	}
	
	if(total_powerupdown_count[op] === void 0){
		total_powerupdown_count[op] = 1;
		total_powerupdown_steem[op] = steem;
		total_powerupdown_vesting[op] = vesting;
		total_powerupdown_sp[op] = vestToSteem(vesting);
	}else{
		total_powerupdown_count[op] += 1;
		total_powerupdown_steem[op] += steem;
		total_powerupdown_vesting[op] += vesting;
		total_powerupdown_sp[op] += vestToSteem(vesting);
	}
	return true;
}
	
	
//---------- Price ----------
async function getPrice(name, markets) {
    return new Promise((resolve, reject) => {

		window['get'+name] = async function(data){

			console.log("getPrice");
			const jsonString = JSON.stringify(data);
			console.log(jsonString);
			console.log(JSON.parse(jsonString));

			let price = JSON.parse(jsonString)[0].trade_price
			resolve(price);
		}
		let sc = document.createElement("script");
		sc.id = name;
		sc.src = "https://steememory.com/ah/upbit/?callback="+'get'+name+"&pattern=" + markets;
		document.body.appendChild(sc);
		document.getElementById(sc.id).remove();
	});
}
async function getPriceHuobi(name, markets) {
    return new Promise((resolve, reject) => {

		window['get'+name] = async function(data){

			const jsonString = JSON.stringify(data);
			console.log("xxx");
			console.log(jsonString);
			console.log(JSON.parse(jsonString));

			let price = JSON.parse(jsonString).data[0].data[0].price

			resolve(price);
		}
		let sc = document.createElement("script");
		sc.id = name;
		sc.src = "https://steememory.com/ah/huobi/?callback="+'get'+name+"&pattern=" + markets;
		document.body.appendChild(sc);
		document.getElementById(sc.id).remove();
	});
}

function getPriceWise(source,target) {
	return new Promise((resolve) => {

		$.ajaxSetup({
    		headers : {   
		 		'Authorization': 'Bearer f3fb5cf0-12c4-4d91-bc02-ead6f9604f29',
			}
		});
		let url = `https://api.wise.com/v1/rates?source=${source}&target=${target}`;
		var p = $.getJSON(url, function(data) {
			let rate = data[0].rate;

			resolve(rate);
		})
		.done(function() { 
		})
		.fail(function(jqXHR, textStatus, errorThrown) { 

			resolve(-100);
		})
		.always(function() { 
		});
	});
}
	
//transfer
let total_transfer_count = {};
let total_transfer_steem = {};
let total_transfer_sbd = {};
function getTransferAmount(record){
	const username = document.getElementById("username").value
	let transfer_steem = 0;
	let transfer_sbd = 0;
	let amount = record[1].op[1].amount;
	let op = record[1].op[0];
	if(op == "transfer" && record[1].op[1].from == username){
		op = op + "_out";
		if(amount.endsWith('STEEM')){
			transfer_steem = parseFloat(record[1].op[1].amount);
		}else{
			transfer_sbd = parseFloat(record[1].op[1].amount);
		}
	}else if(op == "transfer" && record[1].op[1].to == username){
		op = op + "_in";
		if(amount.endsWith('STEEM')){
			transfer_steem = parseFloat(record[1].op[1].amount);
		}else{
			transfer_sbd = parseFloat(record[1].op[1].amount);
		}
	}else {
		return false;
	}
	
	if(total_transfer_count[op] === void 0){
		total_transfer_count[op] = 1;
		total_transfer_steem[op] = transfer_steem;
		total_transfer_sbd[op] = transfer_sbd;
		
	}else{
		total_transfer_count[op] += 1;
		total_transfer_steem[op] += transfer_steem;
		total_transfer_sbd[op] += transfer_sbd;
	}
	return true;
}

// ---------- ----------

if (typeof window !== 'undefined') {
window.clickBtn = async (days) => {
	
	let username = document.getElementById("username").value.trimEnd();
	document.getElementById("username").value = username;
	window.location.hash = '#' + username;
	
	emoji();
	document.getElementById("witness").innerText = "";//2025.10.10
	document.getElementById("progress").innerText = "";
	document.getElementById("author_reward").innerText = "";
	document.getElementById("curation_reward").innerText = "";
	document.getElementById("producer_reward").innerText = "";//2023.04.29
	document.getElementById("comment_benefactor_reward").innerText = "";
	document.getElementById("transfer_in").innerText = "";
	document.getElementById("transfer_out").innerText = "";
	document.getElementById("donation").innerText = "";
	document.getElementById("power_up").innerText = "";
	document.getElementById("power_down").innerText = "";
	document.getElementById("text").innerText = "just a moment.";
	
	document.getElementById("title_reward").style.display = "none";
	document.getElementById("title_transfer").style.display = "none";
	document.getElementById("title_power_up").style.display = "none";
	document.getElementById("title_donation").style.display = "none";

	//payout
	total_count = {};
	total_sbd_payout = {};
	total_steem_payout = {};
	total_vesting_payout = {};
	total_sp_payout = {};
	
	//transfer
	total_transfer_count = {};
	total_transfer_sbd = {};
	total_transfer_steem = {};
	
	//donation
	total_donation_count = {};
	total_donation_sbd = {};
	total_donation_steem = {};
	total_donation_vesting = {};
	total_donation_sp = {};

	//power up/down
	total_powerupdown_count = {};
	total_powerupdown_steem = {};
	total_powerupdown_vesting = {};
	total_powerupdown_sp = {};

	aaa(days).then(result => {
		makeTable(result);
		result_copy = result;
	}).catch(err => {
		document.getElementById("text").innerText = err;
		console.log("call aaa",days);
		console.log(err);
		alert(err);
	});
}
}

if (typeof window !== 'undefined') {
//function inputChange(event){
window.inputChange = async (event) => {	
    jdenticon.update("#identicon", document.getElementById("username").value);
}
}

/* ---------------------------------------------------------------------- */

// ---------- userlink ----------
function setUsername(username){
    let nameList = getUsernames(); 
    let index = nameList.indexOf( username );
    if(index >= 0){
        nameList.splice(index, 1);  
    }
    nameList.push(username);
    //document.cookie = "usernames=" + encodeURIComponent(nameList.join(",")) + ";max-age=86400";//60秒
	document.cookie = "usernames=" + encodeURIComponent(nameList.join(",")) + ";max-age=3600";//秒
}
    
function getUsernames(){
    let cookies = document.cookie;
    let lines = cookies.split(';');
    for(var line of lines){
        let elementList = line.split('=');
        let key = elementList[0];
        if( key != 'usernames'){continue;}
        let csv = decodeURIComponent(elementList[1]);        
        return csv.split(',');
    }
    return [];
}

function userlink(){
  let nameList = getUsernames();
  let s = "";
  let name = "";
  while(name = nameList.pop()){
  	s = s + "<a href=javascript:clickUserLink('" + name + "'); class=black>" + name + "</a> ";
  }

  document.getElementById("userlink").innerHTML = s;
}

	
// ---------- ----------	
function getPostingJsonMetadata(username) {
    return new Promise((resolve, reject) => {
		//client.database.getAccounts([username]).then(res=>{
    steem.api.getAccountsAsync([username]).then(res=>{

			if (res.length == 0) reject("res.length == 0");
			const posting_json_metadata = res[0].posting_json_metadata ;
			resolve(JSON.parse(posting_json_metadata));
		}).catch(err=>{reject(err)})
    });

}
 function postingJsonMetadataAbout(username, id){
	getPostingJsonMetadata(username).then(result => {
		if(result.profile.about){
			document.getElementById(id).text = result.profile.about;
		}
	}).catch(err => {
		console.log("call getPostingJsonMetadata",username);
		console.log(err);
	});	
}


async function postingJsonMetadataImage(id, author, permlink){
    let o = await callAsync('condenser_api','get_content',[author, permlink] )

    let imageList = JSON.parse(o.json_metadata).image
	if(imageList){
		document.getElementById(id).text = imageList.join(" ")
	}
}


// ---------- ----------
function makeLine(record){
	let indenticon_type = 'small';//small, large
	let body = '';
	let identicon =  '';
	let time = `<a class=gray title="${new Date(record[1].timestamp+"Z").toLocaleString()}">${donokuraimae(record[1].timestamp)}</a>`

	// let hide_flag = false;//2023.05.04
	// let only_flag = false;//2023.05.04
	if(record[1].op[0] == 'vote'){
		const username = document.getElementById("username").value;
		const voter = record[1].op[1].voter;
		const author = record[1].op[1].author;
		const permlink = record[1].op[1].permlink;
		const weight = record[1].op[1].weight;
		//アップボート者が自分の場合は、アイコンを表示しない
		if(voter == username){
			identicon = `<canvas class=small id=${username} width=24 height=24 data-jdenticon-value=${username}></canvas>`;
		}else{
			identicon = `<img class=maru id=${record[0]} width=24 height=24 src=https://steemitimages.com/u/${voter}/avatar />`;//2023.05.14
		}		
		body = (
			voter == username ? 
				voter 
				: 
				'<a href=' + window.location.pathname + '#' + voter + ' target=' + voter  
				+ ' onmouseover=showTooltip(event) onmouseout=hideTooltip(event)'
				+ ' data-username='+ voter
				+ '>' + voter +  '</a>'
			)
			+ " " + record[1].op[0] + " "
			//+ (weight >= 0 ? (voter == username ? '' : emoji_upvote) : emoji_downvote)
			+ (weight >= 0 ? (voter == username ? 
				`<img class=shikaku id=${author} width=24 height=24 src=https://steemitimages.com/u/${author}/avatar />` 
				: '') 
				: emoji_downvote)
			+ ' <a href=https://steemit.com/'
			+ '@' + author + '/' + permlink
			+ ' onmouseover=showTooltip_post(event) onmouseout=hideTooltip_post(event)'
			+ ' data-author='+ author
			+ ' data-permlink='+ permlink
			+ '>'
			+ ellipsis('@' + author + '/' + permlink) 
			+ '</a>' 
			+ ' (' + weight/100 + '%)';
	}
	else if(record[1].op[0] == 'curation_reward'){
		const curator = record[1].op[1].curator;
		const comment_author = record[1].op[1].comment_author;
		const comment_permlink = record[1].op[1].comment_permlink;
		const reward = record[1].op[1].reward;		
		identicon = '<canvas class=small id=' + record[0] + ' width=24 height=24 data-jdenticon-value=' + curator + '></canvas>';
		body = curator 
			+ " " + record[1].op[0] + " "
			+ emoji_curation_reward 
			+ ' ' + vestToSteem(reward).toFixed(3) + ' SP' 
			+ ' for <a href=https://steemit.com/@' + comment_author + '/' + comment_permlink 
			+ ' onmouseover=showTooltip_post(event) onmouseout=hideTooltip_post(event)'
			+ ' data-author='+ comment_author
			+ ' data-permlink='+ comment_permlink
			+ '>' 
			+ ellipsis('@' + comment_author + '/' + comment_permlink)
			+ '</a>' ;
	}
	else if(record[1].op[0] == 'comment_benefactor_reward'){
		const benefactor = record[1].op[1].benefactor;
		const author = record[1].op[1].author;
		const permlink = record[1].op[1].permlink;
		const sbd_payout = record[1].op[1].sbd_payout;
		const steem_payout = record[1].op[1].steem_payout;
		const vesting_payout = record[1].op[1].vesting_payout;
		identicon = '<canvas class=small id=' + record[0] + ' width=24 height=24 data-jdenticon-value=' + benefactor + '></canvas>';
		body = benefactor 
			+ " " + record[1].op[0] + " "
			+ emoji_comment_benefactor_reward
			+ ' ' + sbd_payout + ' and ' + vestToSteem(vesting_payout).toFixed(3) + ' SP'
			+ ' for <a href=https://steemit.com/@' + author + '/' + permlink
			+ ' onmouseover=showTooltip_post(event) onmouseout=hideTooltip_post(event)'
			+ ' data-author='+ author
			+ ' data-permlink='+ permlink
			+ '>' 
			+ ellipsis('@' + author + '/' + permlink) + '</a>' ;
	}
	else if(record[1].op[0] == 'comment' && record[1].op[1].parent_author == ''){
		const author = record[1].op[1].author;
		const permlink = record[1].op[1].permlink;
		identicon = `<img class=maru id=${record[0]} width=48 height=48 src=https://steemitimages.com/u/${author}/avatar />`;//2023.05.14
		body = author 
			+ " " + record[1].op[0] + " "
			+ emoji_authored + ' <a href=https://steemit.com/@' + author + '/' + permlink 
			+ ' onmouseover=showTooltip_post(event) onmouseout=hideTooltip_post(event)'
			+ ' data-author='+ author
			+ ' data-permlink='+ permlink		
			+ '>' 
			+ ellipsis('@' + author + '/' + permlink) + '</a>' ;
		indenticon_type = 'large';
	}
	else if(record[1].op[0] == 'comment' && record[1].op[1].parent_author != ''){
		const author = record[1].op[1].author;
		const permlink = record[1].op[1].permlink;
		const parent_author = record[1].op[1].parent_author;
		const parent_permlink = record[1].op[1].parent_permlink;
		identicon = `<img class=maru id=${record[0]} width=48 height=48 src=https://steemitimages.com/u/${author}/avatar />`;//2023.05.14
		body = author 
			+ " " + record[1].op[0] + " "
			+ emoji_replied 
			+ ' <a href=https://steemit.com/' 
			+ '@' + parent_author + '/' + parent_permlink + '#' + '@' + author + '/' + permlink 
			+ ' onmouseover=showTooltip_post(event) onmouseout=hideTooltip_post(event)'
			+ ' data-author='+ parent_author
			+ ' data-permlink='+ parent_permlink
			+ '>' 
			+ ellipsis('@' + parent_author + '/' + parent_permlink)
			+ '</a>' ;
		indenticon_type = 'large';
	}
	else if(record[1].op[0] == 'author_reward'){
		const author = record[1].op[1].author;
		const permlink = record[1].op[1].permlink;
		const sbd_payout = record[1].op[1].sbd_payout;
		const steem_payout = record[1].op[1].steem_payout;
		const vesting_payout = record[1].op[1].vesting_payout;
		identicon = '<canvas class=small id=' + record[0] + ' width=24 height=24 data-jdenticon-value=' + author + '></canvas>';
		body = author 
			+ " " + record[1].op[0] + " "
			+ emoji_author_reward 
			+ ' ' + steem_payout + ', ' + sbd_payout + ' and ' + vestToSteem(vesting_payout).toFixed(3) + ' SP'
			+ ' for <a href=https://steemit.com/@' + author + '/' + permlink
			+ ' onmouseover=showTooltip_post(event) onmouseout=hideTooltip_post(event)'
			+ ' data-author='+ author
			+ ' data-permlink='+ permlink
			+ '>' 
			+ ellipsis('@' + author + '/' + permlink) + '</a>' ;
	}
	else if(record[1].op[0] == 'transfer'){
		const from = record[1].op[1].from;
		const to = record[1].op[1].to;
		const amount = record[1].op[1].amount;
		const memo = record[1].op[1].memo;
		identicon = `<img class=maru id=${record[0]} width=48 height=48 src=https://steemitimages.com/u/${from}/avatar />`;//2023.05.14
		body = from 
			//+ '  transfer'
			+ " " + record[1].op[0] + " "
			+ emoji_transfer 
			+ ' ' + amount + ' to ' + to
			+ ' ' + memo;
		indenticon_type = 'large';
	} 
	else if(record[1].op[0] == 'claim_reward_balance'){
		const account = record[1].op[1].account;
		const reward_steem = record[1].op[1].reward_steem;
		const reward_sbd = record[1].op[1].reward_sbd;
		const reward_vests = record[1].op[1].reward_vests;
		identicon = '<canvas class=small id=' + record[0] + ' width=24 height=24 data-jdenticon-value=' + account + '></canvas>';
		body = account 
			//+ ' claim reward' 
			+ " " + record[1].op[0] + " "
			+ emoji_claim_reward_balance
			+ ' ' + reward_steem + ', ' + reward_sbd + ' and ' + vestToSteem(reward_vests).toFixed(3) + ' SP'
	} 
	else if(record[1].op[0] == 'delegate_vesting_shares'){
		//{"delegator":"deimage","delegatee":"japansteemit","vesting_shares":"368173.275664 VESTS"}
		//deimage delegate 200.002 SP to japansteemit
		//return_vesting_delegation {"account":"yasu","vesting_shares":"1769244.511776 VESTS"} ★★★
		//yasu return of 1000.926 SP delegation ★★★
		const delegator = record[1].op[1].delegator;
		const delegatee = record[1].op[1].delegatee;
		const vesting_shares = record[1].op[1].vesting_shares;
		identicon = '<canvas class=small id=' + record[0] + ' width=48 height=48 data-jdenticon-value=' + delegator + '></canvas>';
		const v = parseFloat(vesting_shares);
		body = delegator
			+ " " + record[1].op[0] + " "
			+ (v > 0 ? emoji_delegate_vesting_shares : emoji_undelegate_vesting_shares)
			+ (v > 0 ? ' ' + vestToSteem(vesting_shares).toFixed(3) + ' SP' : '')
			+ ' to ' + delegatee;
		indenticon_type = 'large';
	}
	else if(record[1].op[0] == 'producer_reward'){
		//{"producer":"yasu.witness","vesting_shares":"2330.621878 VESTS"} 
		//yasu.witness producer reward: 1.318 SP
		const producer = record[1].op[1].producer;
		const vesting_shares = record[1].op[1].vesting_shares;
		identicon = '<canvas class=small id=' + record[0] + ' width=48 height=48 data-jdenticon-value=' + producer + '></canvas>';
		const v = parseFloat(vesting_shares);
		body = producer
			+ " " + record[1].op[0] + " "
			+ emoji_author_reward
			+ vestToSteem(vesting_shares).toFixed(3) + ' SP';
		indenticon_type = 'large';
	} 
	else if(record[1].op[0] == 'comment_options'){
		const max_accepted_payout = record[1].op[1].max_accepted_payout;
		const percent_steem_dollars = record[1].op[1].percent_steem_dollars;
		const extensions = record[1].op[1].extensions;

		if(percent_steem_dollars == 0){
			identicon =  '<canvas class=small width=24 height=24></canvas>';
			body = "power up 100%";
		}
		else if(max_accepted_payout == "0.000 SBD"){
			body = "decline payout";
		}else{
			identicon =  '<canvas class=small width=24 height=24></canvas>';
			body = record[1].op[0] + ' ' + JSON.stringify(record[1].op[1]);
		}
	}
	else if(record[1].op[0] == 'fill_vesting_withdraw'){//パワーダウン
		//fill_vesting_withdraw {"from_account":"jsj1215","to_account":"jsj1215","withdrawn":"892647.895573 VESTS","deposited":"505.388 STEEM"}
		const from_account = record[1].op[1].from_account;
		const deposited = record[1].op[1].deposited;
		identicon =  '<canvas class=small width=48 height=48></canvas>';
		body = from_account
				+ " " + record[1].op[0] + " "
				+ deposited + ' SP';
		indenticon_type = 'large';
	}
	else if(record[1].op[0] == 'withdraw_vesting'){//パワーダウン開始
		//withdraw_vesting {"account":"jsj1215","vesting_shares":"3638716.399565 VESTS"} 11 hours
		const account = record[1].op[1].account;
		const vesting_shares = record[1].op[1].vesting_shares;
		identicon =  '<canvas class=small width=48 height=48></canvas>';
		body = account
				+ " " + record[1].op[0] + " "
				+ vestToSteem(vesting_shares).toFixed(3) + ' SP';
		indenticon_type = 'large';
	}
	else
	{
		identicon =  '<canvas class=small width=24 height=24></canvas>';
		body = record[1].op[0] + ' ' + JSON.stringify(record[1].op[1]);
	}

	let op = "";
	if(	record[1].op[0] == 'account_update2'
		|| record[1].op[0] == 'custom_json'
		|| record[1].op[0] == 'feed_publish'
		|| record[1].op[0] == 'claim_account'
		|| record[1].op[0] == 'claim_reward_balance'
		|| record[1].op[0] == 'witness_set_properties'
		|| record[1].op[0] == 'witness_update'//20250822
		){
		op = "other";
	}else{
		op = record[1].op[0];
	}

	return {identicon: identicon, body: body, time: time, type: indenticon_type, op: op};
}
		
function makeTable(records){

	html = '<table border=0 cellpadding=0 style="background-color: rgba(240, 240, 240, 0.0);">';
	for(var i=records.length-1;i>=0;i=i-1){
		const line = makeLine(records[i]);
		
		if(document.getElementById("history_hide").checked && line.op == "other"){continue;}
		if(document.getElementById("history_hide2").checked && line.op == "producer_reward"){continue;}
		if(document.getElementById("history_hide3").checked && line.op == "curation_reward"){continue;}
		if(document.getElementById("history_upvote").checked && line.op != "vote"){continue;}
		if(document.getElementById("history_reward").checked && line.op.indexOf("reward") == -1){continue;}
		if(document.getElementById("history_transfer").checked && line.op.indexOf("transfer") == -1){continue;}
		if(document.getElementById("history_comment").checked && line.op.indexOf("comment") == -1){continue;}
		if(document.getElementById("history_witness").checked && line.op.indexOf("witness") == -1){continue;}
		if(document.getElementById("history_account").checked && (
			line.op.indexOf("account") == -1 || line.op.indexOf("witness") > -1
		)){continue;}
		if(document.getElementById("history_delegate").checked && line.op.indexOf("delegat") == -1){continue;}
		if(document.getElementById("history_withdraw").checked && line.op.indexOf("withdraw") == -1){continue;}

		html = html + 
		(line.type == 'large'
			?'<tr style="background-color: rgba(245, 245, 220, 0.5);">'
			:'<tr style="background-color: rgba(255, 255, 255, 0.5);">')
		+ '<td style="display: flex;">' 
		+ line.identicon 
		+ `<div>&nbsp;</div>`
		+ `<span class=${line.type}>${line.body}&nbsp;${line.time}</span>`
		+ '</td>'
		+ '</tr>';
	}
	html = html + '</table>';

	document.getElementById("text").innerHTML = html;	
}

async function rate(){
	if(!globalProperties){
		//const promise0 = await client.database.getDynamicGlobalProperties();//★
    const promise0 = await steem.api.getDynamicGlobalPropertiesAsync();

		const promise1 = getPrice('krwsteem','KRW-STEEM');
		//const promise2 = getPrice('krwsbd','KRW-SBD');//SBD取り引き停止のためアクセス不可
		const promise3 = getPrice('krwtrx','KRW-TRX');
		const promise4 = getPrice('krwbtc','KRW-BTC');
		const promise5 = getPrice('krweth','KRW-ETH');
		const promise6 = getPrice('btcsteem','BTC-STEEM');
		const promise7 = getPriceWise('KRW','JPY');
		const promise8 = getPriceWise('KRW','USD');
		const promise9 = getPriceHuobi('usdtsbd','sbdusdt');
		const promise10 = getPriceHuobi('usdtbtc','btcusdt');

		[globalProperties,krwsteem,krwtrx,krwbtc,krweth,btcsteem,krwjpy,krwusd,usdtsbd,usdtbtc] 
			= await Promise.all([promise0,promise1,promise3,promise4,promise5,promise6,promise7,promise8,promise9,promise10]);

		krwsbd = usdtsbd * krwusd;
		
        console.log( "*** rate finish !!! ***");
	}
}

async function aaa(days){

	await rate();

		console.log("***1280***");

	await getTick();

		console.log("***1284***");

	const upbiturl = "https://upbit.com/exchange?code=CRIX.UPBIT.";
	const huobiurl = "https://www.htx.com/trade/";
	document.getElementById('price').innerHTML = 
		'<a class="right black" href=' + upbiturl + 'KRW-STEEM'+ ' target=upbit>STEEM ' + (krwsteem == 0 ? "---" : numberWithCommas(krwsteem)) + ' KRW</a>' 
		+ '<br/><a class="right black" href=' + huobiurl + 'sbd_usdt/' + ' target=huobi>(HTX) SBD ' + (usdtsbd == 0 ? "---" : usdtsbd) + ' USDT ' + numberWithCommas(parseInt(usdtsbd/krwusd)) + ' KRW</a>'
		+ '<br/><a class="right black" href=' + upbiturl + 'KRW-TRX'+ ' target=upbit>TRX ' + (krwtrx == 0 ? "---" : numberWithCommas(krwtrx)) + ' KRW</a>'
		+ '<br/><a class="right black" href=' + upbiturl + 'KRW-BTC'+ ' target=upbit>BTC ' + (krwbtc == 0 ? "---" : numberWithCommas(krwbtc)) + ' KRW</a>'
		+ '<br/><a class="right black" href=' + upbiturl + 'BTC-STEEM'+ ' target=upbit>STEEM ' + (btcsteem == 0 ? "---" : numberWithCommas(parseInt(btcsteem * 100000000))) + ' SATOSHI</a>';

	const username = document.getElementById("username").value;
	effectivepower(username);

	console.log("***1293***");

  	votingpower(username);

	console.log("***1297***");

	reputation(username, "reputation");

	console.log("***1301***");

	witness(username, );//2025.10.10

	console.log("***1305***");

	age(username);

	console.log("***1309***");

	wallet(username);

	console.log("***1313***");

	setUsername(username);

	console.log("***1317***");

	userlink();
	
console.log("***1321***");

	let out = [];
	let limit = _get_account_history_limit;
	let lastlength = limit;
	let firstValue = -1;
  	let firstTimestamp = new Date();
	let now = new Date();
	let lastTimestamp = null;//2026.03.01
	let leatestTimestamp = null;//2026.03.01

	// client.database.call('get_account_history',[username, firstValue, limit]);
	// -1,4で検索した場合
	//┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼┼
	//　　　　　　　　　　　　　　　　↑now
	//　　　　　　　　　　+0+1+2+3+4
	//　　　　　　　　　　1⃣□□□□
	//　　　　　　　　　　　　　　↑leatestTimestamp
	//　　　　　　　　　　↑firstTimestamp
	//　　　　　　+0+1+2+3+4
	//　　　　　　2⃣□□□1⃣
	//　　　　　　↑firstTimestamp
	// 
    //  　+0+1+2+3+4
	//　　□□□□2⃣
	// 
	//
	while (firstValue != 0 
		//&& now.getTime() - firstTimestamp.getTime() <= (86400000 * days) ){
		&& now.getTime() - firstTimestamp.getTime() <= (86400000 * days) ){

		//limitより小さいfirstValueでエラーになる問題の対応。
		if(firstValue != -1 && firstValue < limit) {
			limit = firstValue;
		}

		console.log("before get_account_history");
		let ret;
		try {
			//ret = await client.database.call('get_account_history',[username, firstValue, limit]);
      ret = await steem.api.getAccountHistoryAsync([username, firstValue, limit]);

console.log("***1342***");
console.log("ret",ret);

		} catch (error) {

			console.log("error",error);

			if( error.message == "Request Timeout"){
				document.getElementById("text").innerText = error.message;
				return out;
			}
			throw error;
		}
		console.log("after get_account_history");

		firstValue = ret[0][0];
    	firstTimestamp = new Date(ret[0][1].timestamp+"Z");
		ret.shift();
		lastlength = ret.length;

		//2026.03.01 ins-start
		if(lastTimestamp == null){
			//過去
			leatestTimestamp = new Date(ret[ret.length-1][1].timestamp+"Z").getTime()
			if(now.getTime() -  leatestTimestamp > (86400000 * days)){
				lastTimestamp =  firstTimestamp;
			}
			else{
				//通常
				lastTimestamp =  now.getTime() - (86400000 * days);
			}
		}
		//2026.03.01 ins-end

		for(var i=ret.length-1;i>=0;i=i-1){

			if(new Date(ret[i][1].timestamp+"Z").getTime() - lastTimestamp < 0){
				ret.splice(i,1);
				continue;
			}

			//2024/0/31 ins
			if(_get_account_history_keyword){
				if(ret[i][1].op[0].toLowerCase().indexOf(_get_account_history_keyword) == -1){
					ret.splice(i,1);
					continue;
				}
			}
			
			if(getReward(ret[i])){
				['author_reward', 'curation_reward', 'comment_benefactor_reward', 'producer_reward'].forEach(function(op){
					if(total_count[op] === void 0){
					}else{						
						let s = 
						    (op == "author_reward" ? "Author: " : 
						     (op == "curation_reward" ? "Curation: " : 
						      (op == "comment_benefactor_reward" ? "Benefactor: " : 
						       "Producer: ")))
							+ steemAmountFormat(total_steem_payout[op], total_sbd_payout[op], total_sp_payout[op])
							+ krwAmountFormat(total_steem_payout[op], total_sbd_payout[op], total_sp_payout[op], krwsteem, krwsbd)//2023.04.19 rep
							+ '<br/>'
						document.getElementById(op).innerHTML = s;
						document.getElementById("title_reward").style.display = "block";
					}
				});
			}
			
			//donation
			if(getReward_donation(ret[i])){
				['donation'].forEach(function(op){
					if(total_donation_count[op] === void 0){
					}else{						
						let s = steemAmountFormat(total_donation_steem[op], total_donation_sbd[op], total_donation_sp[op])
							+ krwAmountFormat(0, total_donation_sbd[op], total_donation_sp[op], krwsteem, krwsbd)
							+ '<br/>'
						document.getElementById(op).innerHTML = s;
						document.getElementById("title_donation").style.display = "block";
					}
				});
			}
			
			//power up/down
			if(getReward_powerupdown(ret[i])){
				['power_up', 'power_down'].forEach(function(op){
					if(total_powerupdown_count[op] === void 0){
					}else{						
						let s = 
						    (op == "power_up" ? "Power up: " : "Power down: ")
							+ steemAmountFormat(total_powerupdown_steem[op], 0, total_powerupdown_sp[op])
							+ krwAmountFormat(total_powerupdown_steem[op], 0, total_powerupdown_sp[op], krwsteem, krwsbd)
							+ '<br/>'
						document.getElementById(op).innerHTML = s;
						document.getElementById("title_power_up").style.display = "block";
					}
				});
			}
			
			//transfer
			if(getTransferAmount(ret[i])){
				['transfer_in', 'transfer_out'].forEach(function(op){
					if(total_transfer_count[op] === void 0){
					}else{						
						let s = 
						    (op == "transfer_in" ? "Incoming: " : "Outgoing: ")
							+ steemAmountFormat(total_transfer_steem[op], total_transfer_sbd[op], 0)
							+ krwAmountFormat(total_transfer_steem[op], total_transfer_sbd[op], 0, krwsteem, krwsbd)
							+ '<br/>'
						document.getElementById(op).innerHTML = s;
						document.getElementById("title_transfer").style.display = "block";
					}
				});
			}

			let timestamp = new Date(ret[i][1].timestamp + "Z");
			if(now.getTime() - leatestTimestamp > (86400000 * days)){
				//2026.03.01 ins-start
				document.getElementById("progress").innerText = timestamp.toLocaleString()
				+ ' -> ' + new Date(leatestTimestamp).toLocaleString() 
				+ ' (' 
				+ editDate(diffYMDH(leatestTimestamp,timestamp.getTime()))
				+')';
				//2026.03.01 ins-end
			}
			else{			
				document.getElementById("progress").innerText = timestamp.toLocaleString() 
				+ ' -> now' 
				+ ' (' 
				+ editDate(diffYMDH(now.getTime(),timestamp.getTime()))
				+')';
			}
		}
		
		out = ret.concat(out);
	}
	return out;
};

if (typeof window !== 'undefined') {
window.clickUserLink = async (username) => {
	document.getElementById("username").value = username;
	clickBtn(1);
}
}


//---------------------------------------------------------------------------------------------------------
var result_copy;
if (typeof window !== 'undefined') {
window.checkbox = function() {	
	makeTable(result_copy);
}
}

if (typeof window !== 'undefined') {
window.changecheckbox = function(checkbox) {
	if(document.getElementById(checkbox.id).checked){
		["history_upvote","history_reward","history_transfer","history_comment","history_witness","history_account","history_delegate","history_withdraw"].forEach(element => {
			if(checkbox.id != element){
				document.getElementById(element).checked = false;
			}
		});
	}
	makeTable(result_copy);
}
}

if (typeof window !== 'undefined') {
window.clickAppLink = function(appname) {
	username = document.getElementById("username").value;
	//location.href = appname + username;
	
	var a = document.createElement('a');
	a.href = appname + username;
	a.target = '_blank';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

if (typeof window !== 'undefined') {
window.onload = function() {

	let username = getUserName();
	if(username == ''){
		let userList = getUsernames();
		if(userList.length == 0) return;
		username = userList.pop();
	}
	document.getElementById("username").value = username;

	let url = new URL(window.location.href);
	let params = url.searchParams;
	//let api = params.get('api');
	// if(api){
	// 	client = null;
	// 	client = new dsteem.Client(api);
	// }

	//2024.1.27
	let limit = params.get('limit');
	if(limit){
		_get_account_history_limit = limit
	}
	console.log("_get_account_history_limit",_get_account_history_limit);

	//2024.8.31
	let keyword = params.get('keyword');
	if(keyword){
		_get_account_history_keyword = keyword.toLowerCase();
	}else{
		_get_account_history_keyword = "";
	}
	console.log("_get_account_history_keyword",_get_account_history_keyword);

	//2023.1.2 
	let span = params.get('span');
	if(span){
		clickBtn(span);
	}else{
		clickBtn(1);
	}
};
}

/* --------------------------------------------------------------------- */


window.showTooltip = async (e) => {
	let tooltip = document.getElementById("tooltip");
	let username = e.target.getAttribute('data-username');
		
	tooltip.style.top = e.pageY + 10 + 'px';
	tooltip.style.left = e.pageX + 10 + 'px';
	let s = "<image src=https://steemitimages.com/u/" + username + "/avatar style='float: left; margin: 4px;'/>"
		+ "<a style='font-size: xx-large; margin: 4px;'>" + username + "</a>"
		+ "<br/>"
		+ "<a id=tooltip_about style='margin: 4px;'></a>"
		+ "<table style='background-color: white;clear: left;'>"
		//+ "<table style='background-color: rgba(245, 245, 220, 1.0); clear: left; z-index: 9999;'>"
		+ "<tr><td>Reputation</td><td><a id=tooltip_rep></a></td></tr>"
		+ "<tr><td>Effective Power</td><td><a id=tooltip_ep1></a> <a id=tooltip_ep2></a></td></tr>"
		+ "<tr><td>Voting Power</td><td><a id=tooltip_vp></a></td></tr>"
		+ "</table>"
	tooltip.innerHTML = s;
	tooltip.style.display = "block";
	tooltip.style.zIndex = "9999";
	reputation(username, "tooltip_rep");
	effectivepower(username, "tooltip_ep1", "tooltip_ep2");
	votingpower(username, "tooltip_vp");
	postingJsonMetadataAbout(username, "tooltip_about");
}
function moveTooltip(e) {
}
window.hideTooltip = async (e) => {
	var tooltip = document.getElementById("tooltip");
	tooltip.style.display = "none";
}
}

/* --------------------------------------------------------------------- */

if (typeof window !== 'undefined') {
window.showTooltip_post = async (e) => {
	let tooltip = document.getElementById("tooltip");
	let author = e.target.getAttribute('data-author');
	let permlink = e.target.getAttribute('data-permlink');
	tooltip.style.top = e.pageY + 10 + 'px';
	tooltip.style.left = e.pageX + 10 + 'px';
	tooltip.style.display = "block";
	let o = await callAsync('condenser_api','get_content',[author, permlink] )
	tooltip.innerHTML = "<b>" + o.title + "</b><br/>" + "<image src=https://steemitimages.com/u/" + author + "/avatar style='margin: 4px;'/>"
	let imageList = JSON.parse(o.json_metadata).image
	if(imageList){
		let document_w = document.documentElement.clientWidth
		for (let index = 0; index < imageList.length; index++) {
			const imageUrl = imageList[index];
			if(!imageUrl || imageUrl=='') continue;
			tooltip.insertAdjacentHTML("beforeend", "<image src=https://steemitimages.com/0x128/" + imageUrl + " style='margin: 4px;'/>")
			_sleep(10)
			let tooltip_w = parseInt(window.getComputedStyle(tooltip).width);
			if(e.pageX + 10 + tooltip_w > document_w - 40){
				 tooltip.removeChild(tooltip.lastElementChild)
				 tooltip.insertAdjacentHTML("beforeend", "<br/><image src=https://steemitimages.com/0x128/" + imageUrl + " style='margin: 4px;'/>")
			}
		}
	}
}
window.hideTooltip_post = async (e) => {
	var tooltip = document.getElementById("tooltip")
	tooltip.style.display = "none"
}
}

/* --------------------------------------------------------------------- */


if (typeof window !== 'undefined') {
	/*スクロール対応*/
window.addEventListener('load', function() {
    const nav = document.querySelector('.top-nav');
    document.body.style.marginTop = nav.offsetHeight + 'px';
});
window.addEventListener('resize', function() {
    const nav = document.querySelector('.top-nav');
    document.body.style.marginTop = nav.offsetHeight + 'px';
});
}