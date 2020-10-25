const { Payload } = require("dialogflow-fulfillment");
const db = require("../database/database");
const linepay = require("../linepay-api/reserve-payment");
const { push } = require("../helper/push");
const linePayload = require("../helper/payload");

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
    let courseId;
    let amount;
    let avaiPar;

    snapshot.forEach((doc) => {
      courseId = doc.id;
      amount = doc.data().amount;
      avaiPar = doc.data().avaiPar;
    });

    let orderId;
    const userRef = courseRef.doc(`${courseId}`).collection("users");
    const userSnapshot = await userRef.where("userId", "==", userId).get();
    userSnapshot.forEach((doc) => {
      orderId = doc.id;
    });

    await courseRef.doc(`${courseId}`).update({ avaiPar: avaiPar - 1 });

    const ownerId = await getOwnerId(courseName);
    const userInfo = await sendUserInfo(courseName, orderId);

    if (amount === undefined) {
      await userRef.doc(`${orderId}`).update({ paymentStatus: true });
      push(channelAccessToken, ownerId, userInfo);
      let payloadJson = linePayload.askTodoAnything();
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add(payload);
    } else {
      agent.add("รอสักครู่..");
      await linepay.reservePayment(courseName, amount, orderId, userId);
    }
  } catch (error) {
    console.error(error);
  }
};
