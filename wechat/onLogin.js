
// 登录
const  {getFishingTips } = require('../utils/getFishingTips');
const {initRom} = require('../utils/index');
async function onLogin(user,wechaty) {
    console.log(`贴心小助理${user}登录了`);
    const date = new Date()
    console.log(`当前容器时间:${date}`);
    // 登陆后创建定时任务
    await initRom(wechaty,'30 5 7 * * *','232社畜中心',getFishingTips());
    await initRom(wechaty,'30 5 7 * * *','墨鱼协会',getFishingTips());
}

module.exports = onLogin