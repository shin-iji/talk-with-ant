const db = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");

module.exports = async (agent) => {
  try {
    const courseRef = await db.collection("Training Courses").get();
    const courses = [];
    courseRef.forEach((doc) => {
      courses.push({
        title: `${doc.data().name}`,
        text: "Text",
        actions: [
          {
            type: "message",
            label: "สมัคร",
            text: `สมัคร ${doc.data().name}`,
          },
          {
            type: "message",
            label: "รายละเอียด",
            text: `รายละเอียด ${doc.data().name}`,
          },
        ],
      });
    });
    const payloadJson = {
      type: "template",
      altText: "this is a carousel template",
      template: {
        type: "carousel",
        actions: [],
        columns: courses,
      },
    };
    let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
    agent.add(payload);
  } catch (error) {
    console.log(error);
  }
};
