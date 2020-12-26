const { Payload } = require("dialogflow-fulfillment");
const { db } = require("../database/database");
const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");

module.exports = async (agent) => {
  try {
    const session = agent.session;
    const userId = session.split("/")[4];
    const courseRef = db.collection("Training Courses");
    const courses = [];
    const contents = [];

    await courseRef
      .where("ownerId", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          courses.push({
            courseId: doc.id,
            courseName: doc.data().courseName,
            date: doc.data().date,
          });
        });
      });

    courses.map((course) => {
      contents.push(linePayload.listHistoryOwner(course.courseId, course.courseName, course.date));
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
            type: "action",
            action: {
              text: "สร้างคอร์ส",
              type: "message",
              label: "สร้างคอร์ส",
            },
          },
          {
            action: {
              label: "เช็คชื่อ",
              type: "message",
              text: "เช็คชื่อ",
            },
            type: "action",
          },
          {
            type: "action",
            action: {
              label: "ส่งแบบสอบถาม",
              text: "ส่งแบบสอบถาม",
              type: "message",
            },
          },
          {
            type: "action",
            action: {
              label: "รายชื่อผู้สมัคร",
              text: "รายชื่อผู้สมัคร",
              type: "message",
            },
          },
          {
            type: "action",
            action: {
              label: "ประวัติการสร้าง",
              text: "ประวัติการสร้าง",
              type: "message",
            },
          },
        ],
      };
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add("คอร์สทั้งหมดที่คุณเคยสร้างไปแล้วนะ");
      agent.add(payload);
    }
    //agent.add("test");
  } catch (error) {
    console.log(error);
  }
};
