const request = require("request-promise");
const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";

exports.reply = async (channelAccessToken, replyToken, message) => {
  return request({
    method: "POST",
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({
      replyToken: replyToken,
      messages: message,
    }),
  });
};
