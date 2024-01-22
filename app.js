const { WechatyBuilder } = require('wechaty');
const onScan = require('./wechat/onScan');
const onLogout = require('./wechat/onSlogout');
const onLogin = require('./wechat/onLogin');
const onMessage = require('./wechat/onSmessage');
const wechaty = WechatyBuilder.build({
    name: 'WechatEveryDay',
    puppet: 'wechaty-puppet-wechat4u', // 如果有token，记得更换对应的puppet
})

wechaty.on('scan', onScan);
wechaty.on('login', user  =>{
    onLogin(user,wechaty)
});
wechaty.on('message', message => {
    onMessage(message,wechaty)
});
wechaty.on('logout', onLogout);
wechaty.start();
