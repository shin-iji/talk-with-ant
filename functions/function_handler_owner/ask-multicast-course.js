const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");
const { db } = require("../database/database");

module.exports = async (agent) => {
  try {
    const courseName = agent.parameters.courseName;

    let courseId;

    const courseRef = db.collection("Training Courses");

    while (courseId === undefined) {
      const snapshot = await courseRef.where("courseName", "==", courseName).get();
      snapshot.forEach((doc) => {
        courseId = doc.id;
      });
    }

    const payloadJson = linePayload.askMulticastCourse(courseId);
    let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
    agent.add(payload);
  } catch (error) {
    console.log(error);
  }
};
