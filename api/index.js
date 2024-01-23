const  request  = require ('../utils/request');
function api_img(data) {  
    const url = 'https://api.lolicon.app/setu/v2?size=original&size=regular';
    return request({
        url: url,
        method: 'get',
        data
    })
}

module.exports = {api_img}