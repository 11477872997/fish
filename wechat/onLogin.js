
// 登录
const  {getFishingTips } = require('../utils/getFishingTips');
const {initRom,initDay} = require('../utils/index');
const  getWeatherInfo = require('../api/getWeatherInfo');
async function onLogin(user,wechaty) {
    try {
        console.log(`贴心小助理${user}登录了`);
        const date = new Date()
        console.log(`当前容器时间:${date}`);
        // 登陆后创建定时任务
        await initRom(wechaty,'30 5 7 * * *','232社畜中心',getFishingTips());
        await initRom(wechaty,'30 5 7 * * *','墨鱼协会',getFishingTips());
        const { content, city,name, level, temp, sendibleTemp, wea, wD, wS } =
        await getWeatherInfo('潮阳');
        const msgs = `🌟当前${city}温度：${temp} ℃\n🌡️体感温度：${sendibleTemp} ℃\n☁️气候：${wea}\n🍃风：${wD} [${wS}]\n${content}\n[${name||""}：${level}]`;
        await initDay(wechaty,'30 5 7 * * *','STAY',msgs);
        
    } catch (error) {
        console.log('错误处理onLogin',error)
    }
}

module.exports = onLogin