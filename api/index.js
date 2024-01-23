const  request  = require ('../utils/request');
function api_img(data) {  
    const url = 'https://api.lolicon.app/setu/v2?size=original&size=regular';
    return request({
        url: url,
        method: 'get',
        data
    })
}
function api_city(cityIds) {  
    const url = `http://aider.meizu.com/app/weather/listWeather?cityIds=${cityIds}`;
    return request({
        url: url,
        method: 'get'
    })
}

module.exports = {api_img,api_city}