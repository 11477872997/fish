const setSchedule = require('./cron');
// 延时函数，防止检测出类似机器人行为操作
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


/**
 * 
 * @param {*} wechaty  微信回调
 * @param {*} time   定时任务时间
 * @param {*} name   群名
 * @param {*} sedDate  发送的数据
 */
// 创建微信群摸鱼定时任务
async function initRom(wechaty,time,name,sedDate) {
    console.log(`已经设群聊定时任务`);
    setSchedule.setSchedule(time, async () => {
        let contact = (await wechaty.Room.find({ topic: name }))
        try {
            await delay(1500);
            await contact.say(sedDate); // 发送消息
        } catch (e) {
            console.log('e',e.message);
        }
       
    });
}
/**
 * 
 * @param {*} wechaty  微信回调
 * @param {*} time   定时任务时间
 * @param {*} name   群名
 * @param {*} sedDate  发送的数据
 */
// 创建微信个人摸鱼定时任务
async function initDay(wechaty,time,name,sedDate) {
    console.log(`已经设个人定时任务`);
    setSchedule.setSchedule(time, async () => {
        let contact =
                    (await wechaty.Contact.find({ name: name })) ||
                    (await wechaty.Contact.find({ alias: name }));
        try {
            await delay(1500);
            await contact.say(sedDate); // 发送消息
        } catch (e) {
            console.log('e',e.message);
        }
       
    });
}


module.exports = {delay,initRom,initDay}