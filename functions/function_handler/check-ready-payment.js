const db = require("../database/database");
const linepay = require("../linepay-api/reserve-payment");
const { push } = require("../helper/push");

const { sendUserInfo } = require("../helper/send-user-info");
const { getOwnerId } = require("../helper/get-owner-id");

const channelAccessToken =
  "n8oGQGp/o7wCxPkhGpCdQFzO1XJdbMIYl5nb4tq5hfDy9yPivTrjKK6ytE8yiSIONUhB1gwVy30jO6PCIVhnjNORCjUcCH05txDrn1vsfZqCsq9ENIkW1bO4QjqCFeq/14j9SWV1XCIQSICxpF6BSwdB04t89/1O/w1cDnyilFU=";

module.exports = async (agent) => {
  try {
    const session = agent.session;
    const userId = session.split("/")[4];
    const courseName = agent.parameters.courseName;
    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    const courseId = [];
    const amount = [];
    const avaiPar = [];

    snapshot.forEach((doc) => {
      courseId.push(doc.id);
      amount.push(doc.data().amount);
      avaiPar.push(doc.data().avaiPar);
    });

    const orderId = [];
    const userRef = await courseRef
      .doc(`${courseId[0]}`)
      .collection("users")
      .where("userId", "==", userId)
      .get();
    userRef.forEach((doc) => {
      orderId.push(doc.id);
    });

    await courseRef.doc(`${courseId[0]}`).update({ avaiPar: avaiPar[0] - 1 });

    const ownerId = await getOwnerId(courseName);
    const userInfo = await sendUserInfo(courseName, orderId[0]);

    if (amount[0] === undefined) {
      push(channelAccessToken, ownerId, userInfo);
      agent.add("สมัครเสร็จแล้ว");
      agent.add("ต้องการทำอะไรต่อบอกได้นะ");
    } else {
      await linepay.reservePayment(courseName, amount[0], orderId[0], userId);
    }
  } catch (error) {
    console.error(error);
  }
};
