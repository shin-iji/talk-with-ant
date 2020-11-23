const { Payload } = require("dialogflow-fulfillment");
const { db } = require("../database/database");
const linePayload = require("../helper/payload");
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
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const timestamp = today.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });

    const userColleRef = await db.collection("Users").doc(`${userId}`).get();
    const data = {
      courseName,
      userId,
      name: userColleRef.data().name,
      tel: userColleRef.data().tel,
      email: userColleRef.data().email,
      timestamp: timestamp,
      checkAttend: false,
    };

    let courseId;
    let amount;
    let avaiPar;

    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    snapshot.forEach((doc) => {
      courseId = doc.id;
      amount = doc.data().amount;
      avaiPar = doc.data().avaiPar;
    });

    await courseRef.doc(`${courseId}`).update({ avaiPar: avaiPar - 1 });

    await courseRef.doc(`${courseId}`).collection("users").doc().set(data);

    let orderId;

    courseRef
      .doc(`${courseId}`)
      .collection("users")
      .where("userId", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          orderId = doc.id;
        });
      });

    const ownerId = await getOwnerId(courseName);
    const userInfo = await sendUserInfo(courseName, orderId);
    const userRef = courseRef.doc(`${courseId}`).collection("users");
    console.log(amount);
    if (amount === undefined) {
      await userRef.doc(`${orderId}`).update({ paymentStatus: true });
      push(channelAccessToken, ownerId, userInfo);
      agent.add(`ลงทะเบียน ${courseName} สำเร็จ`);
      let payloadJson = linePayload.askTodoAnything();
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add(payload);
    } else {
      await userRef.doc(`${orderId}`).update({ paymentStatus: false });
      agent.add(`ลงทะเบียน ${courseName} สำเร็จ`);
      agent.add("รอสักครู่..");
      await linepay.reservePayment(courseName, amount, orderId, userId);
    }
  } catch (error) {
    console.log(error);
  }
};
