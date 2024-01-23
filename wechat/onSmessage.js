const { getFishingTips } = require('../utils/getFishingTips');
const { delay } = require('../utils/index');
const { FileBox } = require('file-box');
const { api_img} = require('../api/index');
const  getWeatherInfo = require('../api/getWeatherInfo');
// 监听对话
async function onMessage(msg, bot) {
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
      }else if( contents.indexOf(`@心有林栖`) !== -1  && contents.indexOf('天气') !== -1){
        
        const { content, city,name, level, temp, sendibleTemp, wea, wD, wS } =
        await getWeatherInfo(contents);
        const msgs = `🌟当前${city}温度：${temp} ℃\n🌡️体感温度：${sendibleTemp} ℃\n☁️气候：${wea}\n🍃风：${wD} [${wS}]\n${content}\n[${name||""}：${level}]`;
        await delay(1000);
        await msg.say(msgs);
      }
    }
    if(topic === '232社畜中心'  && contents.indexOf(`@心有林栖`) !== -1 && contents.indexOf('打胶') !== -1){
        let res = await api_img();
        let regular = res.data.data[0].urls.regular;
        let fileBox = FileBox.fromUrl(regular);
        await msg.say(fileBox);
      }
  } else if (isText) {
    // 如果非群消息 目前只处理文字消息
    console.log(`发消息人: ${alias} 消息内容: ${contents}`);
    if (contents === '摸鱼') {
      let res = await getFishingTips();
      await delay(2000);
      await msg.say(res);
    }else if(contents.indexOf('天气') !== -1){
      const { content, city,name, level, temp, sendibleTemp, wea, wD, wS } =
      await getWeatherInfo(contents);
      const msgs = `🌟当前${city}温度：${temp} ℃\n🌡️体感温度：${sendibleTemp} ℃\n☁️气候：${wea}\n🍃风：${wD} [${wS}]\n${content}\n[${name||""}：${level}]`;
      await delay(1000);
      await msg.say(msgs);
    }
  }
}

module.exports = onMessage