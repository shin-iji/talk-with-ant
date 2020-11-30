const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");
const { db } = require("../database/database");

module.exports = async (agent) => {
  try {
    const courseName = agent.parameters.courseName;
    const any = agent.parameters.any;
    let name;
    let courseId;

    if (courseName) {
      name = courseName;
    } else {
      name = any;
    }

    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "<=", name).get();
    snapshot.forEach((doc) => {
      courseId = doc.id;
    });

    const payloadJson = linePayload.askMulticastCourse(courseId);
    let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
    agent.add(payload);
  } catch (error) {
    console.log(error);
  }
};
