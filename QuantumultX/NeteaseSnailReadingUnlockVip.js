/*
Netease snail reading unlock vip
By yxiaocai & JO2EY & NobyDa
Quantumult X:
[rewrite_local]
^https?://p\.du\.163\.com/gain/readtime/info.json url script-response-body https://raw.githubusercontent.com/Vaokgxi/Vox/main/QuantumultX/NeteaseSnailReadingUnlockVip.js
[mitm]
hostname = p.du.163.com
*/

var body = $response.body;
var obj = JSON.parse(body);

obj.tradeEndTime = 1679685290000;
body = JSON.stringify(obj);
$done({body});
