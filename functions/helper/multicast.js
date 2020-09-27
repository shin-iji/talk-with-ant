const request = require("request-promise");
const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";
const channelAccessToken =
  "Vu77dg2yeZmRwqJVjFpjXNGNMioOULYF6Qr9rXoNKLdHbCehW8Zlhdm4G9rpa5DYl4+kEjJXUVJCJOYsGehD+SNZBjR1gEAWltUjPEB6lL1i4T0ZNLilN85JSO92C22IBVVsnSQ7IxuYbWqQQMOUPwdB04t89/1O/w1cDnyilFU=";

exports.multicast = (userId, msg) => {
  return request({
    method: `POST`,
    uri: `${LINE_MESSAGING_API}/multicast`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [msg],
    }),
  });
};
