const db = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");

module.exports = async (agent) => {
  try {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const date = today.toLocaleDateString(); // "6/14/2020"
    let courseName = [];
    let courseId = [];
    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("date", "==", date).get();
    snapshot.forEach((doc) => {
      courseName.push(doc.data().courseName);
      courseId.push(doc.id);
    });
    //console.log(courseName[0]);
    const payloadJson = linePayload.sendCheckAttend(courseId[0], courseName[0]);
    let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
    agent.add(payload);
  } catch (error) {
    console.log(error);
  }
};
