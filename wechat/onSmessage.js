const { getFishingTips } = require('../utils/getFishingTips');
const { delay } = require('../utils/index');
const { FileBox } = require('file-box');
const { api_img } = require('../api/index');
// 监听对话
async function onMessage(msg, bot) {
  const contact = msg.talker(); // 发消息人
  const content = msg.text().trim(); // 消息内容
  const room = msg.room(); // 是否是群消息
  const alias = await contact.alias() || await contact.name(); // 发消息人备注
  const isText = msg.type() === bot.Message.Type.Text;
  if (room && isText) {
    // 如果是群消息 目前只处理文字消息
    const topic = await room.topic();
    console.log(`群名: ${topic} 发消息人: ${await contact.name()} 内容: ${content}`);
    if (topic === '232社畜中心' || topic === '墨鱼协会') {
      if (content === '摸鱼') {
        let res = await getFishingTips();
        await delay(2000);
        await msg.say(res);
      }
      if(topic === '232社畜中心'  && content.indexOf(`@心有林栖`) !== -1 && content.indexOf('打胶') !== -1){
          let res = await api_img();
          let regular = res.data.data[0].urls.regular;
          let fileBox = FileBox.fromUrl(regular);
          await msg.say(fileBox);
        }
    }

  } else if (isText) {
    // 如果非群消息 目前只处理文字消息
    console.log(`发消息人: ${alias} 消息内容: ${content}`);
    if (content === '摸鱼') {
      let res = await getFishingTips();
      await delay(2000);
      await msg.say(res);
    }
  }
}

module.exports = onMessage