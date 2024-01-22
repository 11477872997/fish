const qrcodeTerminal  = require('qrcode-terminal');
// 登录二维码生成
async  function onScan(qrcode,status){
    if (status === 2 || status == 5) {
        qrcodeTerminal.generate(qrcode, { small: true }); 
      } else {
        console.error('onScan', status);
      }
}

module.exports = onScan
