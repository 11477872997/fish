const config = require('../config/index');
// 访问讯飞星火 API 的方法
function initUrl(trimed) {
    try {
        return new Promise((resolve, reject) => {
            // 初始化问题值为空字符串
            let questionValue = '';
            
            // 引入加密和 WebSocket 模块
            const crypto = require('crypto');
            const ws = require('ws');
         
            // 获取当前时间的 GMT 字符串
            const dateString = new Date().toGMTString();
            // wss://spark-api.xf-yun.com/v3.5/chat
            // 定义星火 API 的主机和路径
            const host = 'spark-api.xf-yun.com';
            const path = '/v3.5/chat';
         
            // 构建用于签名的请求头
            let tmp = `host: ${host}\ndate: ${dateString}\nGET ${path} HTTP/1.1`;
         
            const APISecret = config.APISecret;  // 星火 APISecret 这里直接填入你自己的APISecret即可 格式如：ZjAafHbiODRdMjiyamM1azc3Yju1gMy1
            const APIKey = config.APIKey;  // 星火 APIKey 这里直接填入你自己的APISecret即可 格式如：4220a1b1881d40e8d70eb23fd1225cd1
            const app_id = config.app_id // 星火应用程序 ID  APPID 格式为 dbfab529
            let signature = crypto
              .createHmac('sha256', APISecret)
              .update(tmp)
              .digest('base64');
         
            const authorization_origin = `api_key="${APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
         
            // 将授权信息编码为 Base64 格式
            let buff = Buffer.from(authorization_origin);
            const authorization = buff.toString('base64');
         
            // 构建访问星火 API 的 WebSocket URL
            const signUrl = `wss://${host}${path}?authorization=${authorization}&date=${encodeURIComponent(dateString)}&host=${host}`;
         
            // 创建 WebSocket 连接
            let sock = new ws(signUrl);
         
            // 当连接打开时发送聊天请求
            sock.on('open', function () {
              console.log('讯飞星火连接sock连接成功!!!!');
              sock.send(
                JSON.stringify({
                  header: {
                    app_id: app_id,  // 星火应用程序 ID  APPID 格式为 dbfab529
                  },
                  parameter: {
                    chat: {
                      domain: 'generalv3.5',
                      temperature: 0.5,
                      max_tokens: 1024,
                    },
                  },
                  payload: {
                    message: {
                      text: [
                        {
                          role: 'user',
                          content: trimed,
                        },
                      ],
                    },
                  },
                })
              );
            });
         
            // 监听连接的错误事件
            sock.on('error', function (err) {
              console.log('error: ', err);
              reject(err);
            });
         
            // 监听消息事件，处理 API 响应
            sock.on('message', function (data) {
            let obj = JSON.parse(data);
            console.log("message", data.toString());
            if (obj.header.code !== 0) {
                console.log("出错了", obj.header.code, ":", obj.header.message);
                questionValue = obj.header.message;
                // 出错了"手动关闭连接"
                sock.close()
            }
            if (obj.header.code === 0) {
                // 对话已经完成
                if (obj.payload.choices.text) {
                        // 提取文本消息
                        const texts = obj.payload.choices.text;
                        
                        // 将文本消息拼接到问题值中
                        texts.forEach((item) => {
                            questionValue += item.content;
                        });
                    setTimeout(() => {
                        // "对话完成，手动关闭连接"
                        sock.close()
                    }, 1000)
                }
            }
            });
         
            // 监听连接关闭事件，将结果通过 resolve 返回
            sock.on('close', function () {
                console.log('cose',questionValue)
              resolve(questionValue);
            });
          });
    } catch (error) {
        
    }
   
  }
  
  // 导出 initUrl 函数
  module.exports = initUrl;