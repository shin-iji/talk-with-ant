const { db } = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");

module.exports = async (agent) => {
  try {
    const courseName = agent.parameters.courseName;
    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    let payloadJson;
    let button;
    snapshot.forEach((doc) => {
      let desc = doc.data().description;
      let max = doc.data().maxPar;
      let available = doc.data().avaiPar;
      let date = doc.data().date;
      let amount = doc.data().amount;

      if (amount === undefined || amount === "0" || amount === 0) {
        amount = "Free";
      }

      if (available === 0) {
        available = "Full";
        button = {
          type: "box",
          layout: "vertical",
          backgroundColor: "#B2BEC3",
          height: "50px",
          cornerRadius: "md",
          contents: [
            {
              type: "text",
              text: "Full",
              align: "center",
              gravity: "center",
              size: "lg",
              flex: 2,
            },
          ],
        };
      } else {
        button = {
          type: "button",
          action: {
            type: "message",
            label: "Register",
            text: `สมัคร ${courseName}`,
          },
          style: "primary",
          color: "#FF783E",
        };
      }
      payloadJson = linePayload.courseInfo(courseName, desc, max, available, date, amount, button);
    });
    let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
    agent.add(payload);
  } catch (error) {
    console.log(error);
  }
};
