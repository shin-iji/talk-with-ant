const { Payload } = require("dialogflow-fulfillment");
const db = require("../database/database");
const linePayload = require("../helper/payload");

module.exports = async (agent) => {
  try {
    const courseName = agent.parameters.courseName;
    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    const courseId = [];
    const amount = [];

    snapshot.forEach((doc) => {
      courseId.push(doc.id);
      amount.push(doc.data().amount);
    });

    const payloadJson = linePayload.checkReadyPayment(courseId[0], courseName, amount[0]);

    let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
    agent.add(payload);
  } catch (error) {
    console.error(error);
  }
};
