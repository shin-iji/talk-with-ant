const { Payload } = require("dialogflow-fulfillment");
const db = require("../database/database");
const linePayload = require("../helper/payload");
const linepay = require("../linepay-api/reserve-payment");

module.exports = async (agent) => {
  try {
    const session = agent.session;
    const userId = session.split("/")[4];
    const courseName = agent.parameters.courseName;
    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    const courseId = [];
    const amount = [];

    snapshot.forEach((doc) => {
      courseId.push(doc.id);
      amount.push(doc.data().amount);
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

    await linepay.reservePayment(courseName, amount[0], orderId[0], userId);

    const payloadJson = linePayload.checkReadyPayment(courseName, amount[0]);

    let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
    agent.add(payload);
  } catch (error) {
    console.error(error);
  }
};
