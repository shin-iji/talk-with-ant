//const region = "asia-northeast1";
//const functions = require("firebase-functions");

const { convertStruct } = require("./src/convert-struct");
const { detectIntent } = require("./src/detect-intent");
//const { multicast } = require("../helper/multicast");
const { reply } = require("../helper/reply");

const querystring = require("querystring");

const linepay = require("../linepay-api/reserve-payment");

let channelAccessToken = "";

exports.webhook = async (req, res) => {
  console.log("Start Webhook", JSON.stringify(req.body));
  let destination = req.body.destination;
  const events = req.body.events[0];

  //Find Bot Destination
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

  if (events.type === "message") {
    const event = req.body.events[0];
    //const userId = event.source.userId
    const sessionId = event.source.groupId || event.source.userId;
    const message = event.message.text;

    console.log("sessionId", sessionId);

    const intentResponse = await detectIntent(sessionId, message, "th");
    const replyMessage = await convertStruct(intentResponse);

    await reply(channelAccessToken, event.replyToken, replyMessage);
  }

  if (events.type === "postback") {
    const data = querystring.parse(events.postback.data);
    if (data.action === "RESERVE_PAYMENT") {
      const userId = events.source.userId;
      const courseName = data.courseId;
      const amount = Number(data.amount);
      // console.log(data);
      // console.log(courseName);
      // console.log(amount);
      //const paymentPayload = require("../helper/payload");
      linepay.reservePayment(channelAccessToken, events.replyToken, courseName, amount, userId);
    }
  }

  res.status(200).end();
};
