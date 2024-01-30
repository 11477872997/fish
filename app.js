const { WechatyBuilder } = require('wechaty');
const onScan = require('./wechat/onScan');
const onLogout = require('./wechat/onSlogout');
const onLogin = require('./wechat/onLogin');
const onMessage = require('./wechat/onSmessage');
const wechaty =  WechatyBuilder.build({
    name: "wechat-assistant", // generate xxxx.memory-card.json and save login data for the next login
    puppet: "wechaty-puppet-wechat",
    puppetOptions: {
      uos: true
    }
  });
// const wechaty = WechatyBuilder.build()

wechaty.on('scan', onScan);
wechaty.on('login', user  =>{
    onLogin(user,wechaty)
});
wechaty.on('message', message => {
    onMessage(message,wechaty)
});
wechaty.on('logout', onLogout);
wechaty.start();

