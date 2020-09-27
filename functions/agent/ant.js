let DIALOGFLOW_PROJECTID = "";
let DIALOGFLOW_SERVICE_ACCOUNT = "";
let channelAccessToken = "";

//Helper
const lineHelper = require("../helper/line-helper");
const linePayload = require("../helper/payload");
const querystring = require("querystring");
const { reply } = require("../helper/reply");

//Source Code
const { convertStruct } = require("./src/convert-struct");
const { detectIntent } = require("./src/detect-intent");
const { sendCheckAttend } = require("./src/send-check-attend");
const { checkAttend } = require("./src/check-attend");
const { countAttend } = require("./src/count-attend");

//Line Pay
const linepay = require("../linepay-api/reserve-payment");

exports.webhook = async (req, res) => {
  console.log("Start Webhook", JSON.stringify(req.body));
  let destination = req.body.destination;
  const events = req.body.events[0];

  //Find Bot Destination
  switch (destination) {
    case "U5bbdb222ea05b9c391bad748cb859a6d": // Ant
      channelAccessToken =
        "Vu77dg2yeZmRwqJVjFpjXNGNMioOULYF6Qr9rXoNKLdHbCehW8Zlhdm4G9rpa5DYl4+kEjJXUVJCJOYsGehD+SNZBjR1gEAWltUjPEB6lL1i4T0ZNLilN85JSO92C22IBVVsnSQ7IxuYbWqQQMOUPwdB04t89/1O/w1cDnyilFU=";
      DIALOGFLOW_PROJECTID = "antv2-xdbgna";
      DIALOGFLOW_SERVICE_ACCOUNT = "ant-dialogflow-service-account.json";
      break;
    case "U4c942e6e783ace694220c4058f5894bd": //Ant Owner
      channelAccessToken =
        "n8oGQGp/o7wCxPkhGpCdQFzO1XJdbMIYl5nb4tq5hfDy9yPivTrjKK6ytE8yiSIONUhB1gwVy30jO6PCIVhnjNORCjUcCH05txDrn1vsfZqCsq9ENIkW1bO4QjqCFeq/14j9SWV1XCIQSICxpF6BSwdB04t89/1O/w1cDnyilFU=";
      DIALOGFLOW_PROJECTID = "antowner-tovppp";
      DIALOGFLOW_SERVICE_ACCOUNT = "ant-owner-dialogflow-service-account.json";
      break;
  }

  if (events.type === "message") {
    const event = req.body.events[0];
    //const userId = event.source.userId
    const sessionId = event.source.groupId || event.source.userId;
    const message = event.message.text;

    console.log("sessionId", sessionId);

    const intentResponse = await detectIntent(
      DIALOGFLOW_PROJECTID,
      DIALOGFLOW_SERVICE_ACCOUNT,
      sessionId,
      message,
      "th"
    );
    const replyMessage = await convertStruct(intentResponse);

    await reply(channelAccessToken, event.replyToken, replyMessage);
  }

  if (events.type === "follow") {
    await reply(channelAccessToken, events.replyToken, [lineHelper.createTextMessage("สวัสดีจ้า")]);
  }

  if (events.type === "postback") {
    const data = querystring.parse(events.postback.data);
    if (data.action === "RESERVE_PAYMENT") {
      const userId = events.source.userId;
      const courseId = data.courseId;
      const courseName = data.courseName;
      const amount = Number(data.amount);
      await linepay.reservePayment(channelAccessToken, courseId, courseName, amount, userId);
    }

    if (data.action === "SEND_CHECK_ATTEND") {
      const courseId = data.courseId;
      const courseName = data.courseName;
      console.log(events.replyToken);
      sendCheckAttend(courseId, courseName);
      await reply(channelAccessToken, events.replyToken, [
        lineHelper.createTextMessage("ส่งเช็คชื่อเรียบร้อย สามารถเช็คยอดได้ที่ปุ่มเลยนะ"),
        linePayload.countAttend(courseId, courseName),
      ]);
    }

    if (data.action === "CHECK_ATTEND") {
      const userId = events.source.userId;
      const courseId = data.courseId;
      checkAttend(userId, courseId);
      await reply(channelAccessToken, events.replyToken, [
        lineHelper.createTextMessage("เช็คชื่อเรียบร้อย"),
      ]);
    }

    if (data.action === "COUNT_ATTEND") {
      const courseId = data.courseId;
      let result = await countAttend(courseId);
      await reply(channelAccessToken, events.replyToken, [
        lineHelper.createTextMessage(`มีผู้เข้าร่วมทั้งหมด ${result} คนจ้า`),
      ]);
    }
  }

  res.status(200).end();
};
