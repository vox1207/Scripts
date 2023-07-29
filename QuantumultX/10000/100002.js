/**
 * cr from @songyangzz from @id77
 * @fileoverview Template to compose HTTP reqeuest.
 *
 */
const $ = new Env('电信余额提醒');
$.SESSION_KEY = 'id77_10000_balanceReminder';
$.LOWEST_BALANCE_KEY = 'id77_10000_lowestBalance';
const lowestBalance = $.getdata($.LOWEST_BALANCE_KEY) || 5;

!(async () => {
  if (!$.getdata($.SESSION_KEY)) {
    $.subt = '未找到Cookie';
    $.desc = '请获取根据说明获取Cookie，点击前往';
    $.msg($.name, $.subt, $.desc, {
      'open-url':
        'https://raw.githubusercontent.com/id77/QuantumultX/master/task/10000.cookie.js',
    });

    $.done();
    return;
  }

  await inquire();
  await showmsg();
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done());

function inquire() {
  return new Promise((resolve) => {
    const opts = JSON.parse($.getdata($.SESSION_KEY));
    $.get(opts, (err, resp, data) => {
      try {
        $.resData = JSON.parse(data);
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  });
}

function showmsg() {
  return new Promise((resolve) => {
    const { paraFieldResult, totalBalanceAvailable } = $.resData;

    console.log('====================================');
    console.log('电信余额提醒');
    console.log(JSON.stringify($.resData));
    console.log('====================================');
    const balance = totalBalanceAvailable / 100;

    if ((paraFieldResult === '成功' || paraFieldResult === 'SUCCESS') && balance <= lowestBalance) {
      $.subt = '余额过低，请及时充值';
      $.desc = `当前余额：${balance}元`;
      $.msg($.name, $.subt, $.desc);
    }
    if (paraFieldResult !== '成功' && paraFieldResult !== 'SUCCESS') {
      $.subt = '查询失败';
      $.desc = '进入【天翼账号中心】公众号，点【查询充值-查余额】；获取Cookie';
      $.msg($.name, $.subt, $.desc);
    }
    resolve();
  });
}

fetchUrl = {
    detail: 'https://e.189.cn/store/user/package_detail.do',
    balance: 'https://e.189.cn/store/user/balance_new.do',
  };

async getData () {
    const opts = {
      headers: {'cookie': this.settings.cookie}
    };
    let url = this.fetchUrl.detail;
    const detail = await this.httpGet(url, true, true, opts, 'POST');
    url = this.fetchUrl.balance;
    const balance = await this.httpGet(url, true, true, opts, 'POST');
    
    try{
      if (detail.result === 0) {
        // 套餐分钟数
        if (detail.voiceBalance && detail.voiceAmount) {
          this.formatVoice(Number(detail.voiceBalance), Number(detail.voiceAmount));
        } else {
          detail.items.forEach((data) => {
            if (data.offerType == 21) {
              data.items.forEach((item) => {
                if (item.unitTypeId === '1') {
                  if (item.ratableAmount !== '0' && item.balanceAmount !== '0') {
                    this.formatVoice(Number(item.voiceBalance), Number(item.voiceAmount));
                  }
                }
              })
            }
          })
        }
        // 流量套餐
        let flows = [];
        let flowName = [];
        let index = 0;
        detail.items.forEach((data) => {
          data.items.forEach((item) => {
            if (item.unitTypeId === '3') {
              let flow = {};
              let itemName = item.ratableAmount.length > 8 ? "无限流量" : item.ratableResourcename;
              let idx = flowName.indexOf(itemName);
              if(idx == -1){
                flowName.push(itemName);
                flow.itemName = itemName;
                flow.total = Number(item.ratableAmount);
                flow.used = Number(item.usageAmount);
                flow.balance = Number(item.balanceAmount);
                flows.push(flow);
              } else {
                flows[idx].total = flows[idx].total + Number(item.ratableAmount);
                flows[idx].used = flows[idx].used + Number(item.usageAmount);
                flows[idx].balance = flows[idx].balance + Number(item.balanceAmount);
              }
            }
          })
        })
        this.settings.flows = flows;
        
        if (balance.result === 0) {
      	  // 余额
      	  this.fee.number = parseFloat(parseInt(balance.totalBalanceAvailable) / 100).toFixed(2);
    	};
      } else {
        this.flow.FGColor = 'C4C4C4';
        this.voice.FGColor = 'C4C4C4';
        this.notify(this.name, '用户登录失败，cookie失效');
      }
    }catch(e){
      this.ERROR.push({error:e.toString()});
    }
  };

// https://github.com/chavyleung/scripts/blob/master/Env.js
// prettier-ignore
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient}isLoon(){return"undefined"!=typeof $loon}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i),console.log(`${i}: ${JSON.stringify(s)}`)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i),console.log(`${i}: ${JSON.stringify(h)}`)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status,s(t,e,i))}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.message)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}
