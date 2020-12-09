let DIALOGFLOW_PROJECTID = "";
let DIALOGFLOW_SERVICE_ACCOUNT = "";
let channelAccessToken = "";

//Helper
const lineHelper = require("../helper/line-helper");
const linePayload = require("../helper/payload");
const querystring = require("querystring");
const { reply } = require("../helper/reply");
const { broadcast } = require("../helper/broadcast");

//Source Code
const { convertStruct } = require("./src/convert-struct");
const { detectIntent } = require("./src/detect-intent");
const { sendCheckAttend } = require("./src/send-check-attend");
const { checkAttend } = require("./src/check-attend");
const { countAttend } = require("./src/count-attend");
const { getPaymentUrl } = require("./src/get-payment-url");
const { getCourseById } = require("./src/get-course-by-id");
const { checkOwnerVerify } = require("./src/check-owner-verify");
const { addOwner } = require("./src/add-owner");

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

  const verify = await checkOwnerVerify(events.source.userId);
  console.log(verify);

  if (destination == "U4c942e6e783ace694220c4058f5894bd" && verify == false) {
    await reply(channelAccessToken, events.replyToken, [
      lineHelper.createTextMessage("รบกวนยืนยันตัวตนก่อนใช้งานด้วยนะ"),
    ]);
    //return;
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
    //console.log(replyMessage);
    await reply(channelAccessToken, event.replyToken, replyMessage);
  }

  if (events.type === "follow") {
    if (destination == "U4c942e6e783ace694220c4058f5894bd") {
      await addOwner(events.source.userId);
      return;
    } else {
      await reply(channelAccessToken, events.replyToken, [
        lineHelper.createTextMessage("สวัสดีจ้า"),
      ]);
    }
    return;
  }

  if (events.type === "postback") {
    const data = querystring.parse(events.postback.data);

    if (data.action === "CONFIRM_PAYMENT") {
      const courseName = data.courseName;
      const orderId = data.orderId;
      const amount = Number(data.amount);
      const paymentUrl = await getPaymentUrl(orderId);
      //console.log(courseName);
      const message = linePayload.startPayment(courseName, amount, paymentUrl);
      await reply(channelAccessToken, events.replyToken, [message]);
    }

    if (data.action === "SEND_CHECK_ATTEND") {
      const courseId = data.courseId;
      const courseName = data.courseName;
      console.log(courseName);
      sendCheckAttend(courseId, courseName);
      await reply(channelAccessToken, events.replyToken, [
        lineHelper.createTextMessage("ส่งเช็คชื่อเรียบร้อย สามารถเช็คยอดได้ที่ปุ่มเลยนะ"),
        linePayload.countAttend(courseId, courseName),
      ]);
    }

    if (data.action === "CHECK_ATTEND") {
      const userId = events.source.userId;
      const courseId = data.courseId;
      checkAttend(channelAccessToken, userId, courseId);
    }

    if (data.action === "COUNT_ATTEND") {
      const courseId = data.courseId;
      let result = await countAttend(courseId);
      await reply(channelAccessToken, events.replyToken, [
        lineHelper.createTextMessage(`มีผู้เข้าร่วมทั้งหมด ${result} คนจ้า`),
      ]);
    }

    if (data.action === "MULTICAST_COURSE") {
      const courseId = data.courseId;
      const course = await getCourseById(courseId);
      const msg = [
        {
          type: `text`,
          text: "มีคอร์สมาใหม่จ้าา",
        },
        lineHelper.createFlexMessage("New Course!", course),
      ];
      //console.log(course);
      await broadcast(msg);
      await reply(channelAccessToken, events.replyToken, [
        lineHelper.createTextMessage("ทำการกระจายข้อมูลแล้วนะ"),
      ]);
    }
  }

  res.status(200).end();
};
