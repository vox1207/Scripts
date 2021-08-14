//简单思路就是 获取ip再获取天气信息
const locationKey = "TFVBZ-WYGLW-TNORX-OYSUB-MNAWJ-FCBES"
const weatherKey = "o2C7VVN18yN2nB6K"

const apiList = {
    location:"https://apis.map.qq.com/ws"
}

function getLonLat(){
    $http.get({
        url: `${apiList.location}/location/v1/ip?key=${locationKey}`,
        handler: (resp) => {
            let location = resp.data&&resp.data.result&&resp.data.result.location
            getLocation(location)
        }
    });
}
function getLocation(location){
    $http.get({
        url: `${apiList.location}/geocoder/v1/?key=${locationKey}&location=${location.lat},${location.lng}`,
        handler: (resp) => {
            var data = resp.data;
            $console.info(data.result.formatted_addresses.recommend);
        }
    });
}

/**
 * 
 * @param {lat:"",lng:""} location 
 */
function getWeather(location){
    $http.get({
        url: `${apiList.weather}/${weatherKey}/${location.lng},${location.lat}/weather.json`,
        handler: (resp) => {
            let data = resp.data;
            console.info(data)
			//运行结果参照彩云天气https://open.caiyunapp.com/%E9%80%9A%E7%94%A8%E9%A2%84%E6%8A%A5%E6%8E%A5%E5%8F%A3/v2.5
        }
    });
}

getLonLat()
