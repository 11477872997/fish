const { api_city } = require('../api/index');
const getlistCity = require('../utils/city');
function getWeatherInfo(name) {
    let a  = name;
    return new Promise(async (resolve, reject) => {
        try {          
            const res = await api_city(getlistCity(a));
            const { indexes, realtime, weathers,city } = res.data.value[0];
            // 气温推荐
            const { content, name, level } =
                indexes[getRandomIntInclusive(0, indexes.length - 1)];
            // 实时天气
            const { sendibleTemp, temp, weather: wea, wD, wS } = realtime;
            const data = {
                city,
                weathers,
                content,
                name,
                level,
                temp,
                sendibleTemp,
                wea,
                wD,
                wS
            };
            resolve(data);
        } catch (error) {
            console.log('getWeatherInfo接口错误')
        }
    })

}

function getRandomIntInclusive(min, max) {
    const mi = Math.ceil(min);
    const ma = Math.floor(max);
    return Math.floor(Math.random() * (ma - mi + 1)) + mi; // 含最大值，含最小值
}


module.exports = getWeatherInfo