const { getFishingTips } = require('../utils/getFishingTips');
const { delay } = require('../utils/index');
const { FileBox } = require('file-box');
const { api_img } = require('../api/index');
const getWeatherInfo = require('../api/getWeatherInfo');
const initUrl = require('../utils/xfxxgpt');
// 监听对话
const startTime = new Date()
async function onMessage(msg, bot) {
  try {
    // 避免重复发送
    console.log('msg.date() < startTime',msg.date() < startTime)
    // if (msg.date() < startTime) return
    const contact = msg.talker(); // 发消息人
    const contents = msg.text().trim(); // 消息内容
    const room = msg.room(); // 是否是群消息
    const alias = await contact.alias() || await contact.name(); // 发消息人备注
    const isText = msg.type() === bot.Message.Type.Text;
    if (room && isText) {
      // 如果是群消息 目前只处理文字消息
      const topic = await room.topic();
      console.log(`群名: ${topic} 发消息人: ${await contact.name()} 内容: ${contents}`);
      if (topic === '232社畜中心' || topic === '墨鱼协会') {
        if (contents === '摸鱼') {
          let res = await getFishingTips();
          await delay(2000);
          await msg.say(res);
        }
        // 判断有没有艾特机器人
        if (!(await msg.mentionSelf())) return;
        // 获取艾特的内容
        const trimed = await msg.mentionText();
        // 无内容不处理
        if (!trimed.length) return;
        if (contents.indexOf('天气') !== -1) {
          const { content, city, name, level, temp, sendibleTemp, wea, wD, wS } =
            await getWeatherInfo(contents);
          const msgs = `🌟当前${city}温度：${temp} ℃\n🌡️体感温度：${sendibleTemp} ℃\n☁️气候：${wea}\n🍃风：${wD} [${wS}]\n${content}\n[${name || ""}：${level}]`;
          await delay(1000);
          await msg.say(msgs);
        } else if (topic === '232社畜中心' && trimed == '打胶') {
          let res = await api_img();
          let regular = res.data.data[0].urls.small;
          let fileBox = FileBox.fromUrl(regular);
          msg.say(fileBox);
        }else{
          initUrl(trimed).then((result) => {
              console.log('Result:', result);
               msg.say(result);
            }).catch((err) => {
              msg.say(err);
              console.error('Error:', err);
            });
        }

        console.log('trimed', trimed)
      }
    } else if (isText) {
      // 如果非群消息 目前只处理文字消息
      console.log(`发消息人: ${alias} 消息内容: ${contents}`);
      if (contents === '摸鱼') {
        let res = await getFishingTips();
        await delay(2000);
        await msg.say(res);
      } else if (contents.indexOf('天气') !== -1) {
        const { content, city, name, level, temp, sendibleTemp, wea, wD, wS } =
          await getWeatherInfo(contents);
        const msgs = `🌟当前${city}温度：${temp} ℃\n🌡️体感温度：${sendibleTemp} ℃\n☁️气候：${wea}\n🍃风：${wD} [${wS}]\n${content}\n[${name || ""}：${level}]`;
        await delay(1000);
        await msg.say(msgs);
      }else if(alias  != '心有林栖'){
        initUrl(contents).then((result) => {
          console.log('Result:', result);
           msg.say(result);
        }).catch((err) => {
          msg.say(err);
          console.error('Error:', err);
        });
      }
    }
  } catch (error) {
    console.log('错误处理onMessage', error)
  }

}

module.exports = onMessage

