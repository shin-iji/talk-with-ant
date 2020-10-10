const db = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");

module.exports = async (agent) => {
  const courseName = agent.parameters.courseName;
  const courseRef = db.collection("Training Courses");
  const snapshot = await courseRef.where("courseName", "==", courseName).get();
  let payloadJson;
  snapshot.forEach((doc) => {
    let url = doc.data().pictureUrl;
    let desc = doc.data().description;
    let max = doc.data().maxPar;
    let available = doc.data().avaiPar;
    let date = doc.data().date;
    let amount = doc.data().amount;
    if (available === 0) {
      available = "Full";
    }
    payloadJson = linePayload.courseInfo(courseName, url, desc, max, available, date, amount);
  });
  let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
  agent.add(payload);
};
