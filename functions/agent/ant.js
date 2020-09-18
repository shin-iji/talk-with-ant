//const region = "asia-northeast1";
const functions = require("firebase-functions");

const { convertStruct } = require("./src/convertStruct");
const { detectIntent } = require("./src/detectIntent");
const { multicast } = require("../helper/multicast");
const { reply } = require("../helper/reply");

let channelAccessToken = "";

exports.webhook = async (req, res) => {
  console.log("Start Webhook", JSON.stringify(req.body));
  let destination = req.body.destination;

  switch (destination) {
    case "U933c679052ae3a715a5b8463bf9c25c8": // Test Bot
      channelAccessToken =
        "z0smCCfJ3+29+lPdjCLGFBoTZhGFuuYcn86OzBKTXDZaR0bJQfyvZFL3jZYFTd6euSugKfO4X58yx77jV0vlcC+OwZCCBqCiaUvJlhK5ltHNBv41RFTb6Mi4805oy+FQei9dB2VzFqRIP7vPEzK5ZAdB04t89/1O/w1cDnyilFU=";
      break;
    case "U5bbdb222ea05b9c391bad748cb859a6d": // Ant
      channelAccessToken =
        "Vu77dg2yeZmRwqJVjFpjXNGNMioOULYF6Qr9rXoNKLdHbCehW8Zlhdm4G9rpa5DYl4+kEjJXUVJCJOYsGehD+SNZBjR1gEAWltUjPEB6lL1i4T0ZNLilN85JSO92C22IBVVsnSQ7IxuYbWqQQMOUPwdB04t89/1O/w1cDnyilFU=";
      break;
  }

  if (req.body.events[0].type !== "message") {
    return;
  }
  if (req.body.events[0].message.type !== "text") {
    return;
  }
  if (req.body.events[0].message.text == "check") {
    multicast(res, "Test Multicast");
    return;
  }

  const event = req.body.events[0];
  //const userId = event.source.userId
  const sessionId = event.source.groupId || event.source.userId;
  const message = event.message.text;

  console.log("sessionId", sessionId);

  const intentResponse = await detectIntent(sessionId, message, "th");
  const replyMessage = await convertStruct(intentResponse);

  await reply(channelAccessToken, event.replyToken, replyMessage);

  res.status(200).end();
};
