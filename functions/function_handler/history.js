const { Payload } = require("dialogflow-fulfillment");
const { db } = require("../database/database");
const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");

module.exports = async (agent) => {
  try {
    const session = agent.session;
    const userId = session.split("/")[4];
    const userRef = db.collection("Users");
    const courses = [];
    const contents = [];

    await userRef
      .doc(`${userId}`)
      .collection("history")
      .orderBy("date", "asc")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //console.log(doc.id);
          courses.push({ courseName: doc.data().courseName, date: doc.data().date });
        });
      });
    //console.log(courses);

    courses.map((course) => {
      contents.push(linePayload.listHistory(course.courseName, course.date));
    });

    if (!Array.isArray(contents) || !contents.length) {
      const payloadJson = linePayload.askTodoAnything();
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add("คุณยังไม่เคยสมัครคอร์สอะไรนะ");
      agent.add(payload);
    } else {
      const payloadJson = lineHelper.createFlexCarouselMessage("List Course", contents);
      payloadJson.quickReply = {
        items: [
          {
            action: {
              label: "รายการอบรม",
              type: "message",
              text: "รายการอบรม",
            },
            type: "action",
          },
          {
            type: "action",
            action: {
              type: "message",
              text: "รายการที่ต้องจ่าย",
              label: "รายการที่ต้องจ่าย",
            },
          },
          {
            type: "action",
            action: {
              type: "message",
              text: "ประวัติการสมัคร",
              label: "ประวัติการสมัคร",
            },
          },
          {
            type: "action",
            action: {
              type: "message",
              text: "ช่วยเหลือ",
              label: "ช่วยเหลือ",
            },
          },
        ],
      };
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add("คอร์สทั้งหมดที่คุณเคยสมัครไปแล้วนะ");
      agent.add(payload);
    }
    //agent.add("test");
  } catch (error) {
    console.log(error);
  }
};
