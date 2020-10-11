const request = require("request-promise");

const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";

exports.push = (channelAccessToken, userId, msg) => {
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/push`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({
      to: `${userId}`,
      messages: [msg],
    }),
  });
};
