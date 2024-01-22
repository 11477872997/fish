// 消息日志
function logInfo(msg) {
    if (msg.talker()?.id === 'weixin') return;
    console.log('╔══════════════════════════════════════════════╗');
    console.log(`╠═ from: ${msg.talker()?.name()}: ${msg.talker()?.id}`);
    console.log(`╠═ text: ${msg.text()}`);
    console.log(`╠═ isRoom: ${msg.room()}`);
    console.log(`╠═ RoomId: ${msg.room()?.id}`);
    console.log('╚══════════════════════════════════════════════╝');
}

module.exports = logInfo