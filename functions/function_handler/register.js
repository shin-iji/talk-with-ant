const { Payload } = require("dialogflow-fulfillment");
const db = require("../database/database");
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
      checkAttent: false,
      paymentStatus: false,
    };

    const courseId = [];
    const amount = [];
    const avaiPar = [];

    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    snapshot.forEach((doc) => {
      courseId.push(doc.id);
      amount.push(doc.data().amount);
      avaiPar.push(doc.data().avaiPar);
    });

    await courseRef.doc(`${courseId[0]}`).update({ avaiPar: avaiPar[0] - 1 });

    await courseRef.doc(`${courseId[0]}`).collection("users").doc().set(data);

    const orderId = [];

    courseRef
      .doc(`${courseId[0]}`)
      .collection("users")
      .where("userId", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          orderId.push(doc.id);
        });
      });

    const ownerId = await getOwnerId(courseName);
    const userInfo = await sendUserInfo(courseName, orderId[0]);

    if (amount[0] === undefined) {
      await userRef.doc(`${orderId[0]}`).update({ paymentStatus: true });
      push(channelAccessToken, ownerId, userInfo);
      agent.add(`ลงทะเบียน ${courseName} สำเร็จ`);
      agent.add("ต้องการทำอะไรต่อบอกได้นะ");
    } else {
      agent.add("รอสักครู่..");
      agent.add(`ลงทะเบียน ${courseName} สำเร็จ`);
      await linepay.reservePayment(courseName, amount[0], orderId[0], userId);
    }
  } catch (error) {
    console.log(error);
  }
};
