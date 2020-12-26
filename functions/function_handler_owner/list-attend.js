const { Payload } = require("dialogflow-fulfillment");
const { db } = require("../database/database");
const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");

module.exports = async (agent) => {
  try {
    const today = Date.parse(new Date());
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
          courses.push({ courseId: doc.id, courseName: doc.data().courseName });
        });
      });

    for (let i = 0; i < courses.length; i++) {
      const doc = courses[i];
      if (Date.parse(`${doc.date}`) < Number(today)) {
        continue;
      } else {
        contents.push(linePayload.listAttend(doc.courseId, doc.courseName));
      }
    }

    if (!Array.isArray(contents) || !contents.length) {
      const payloadJson = linePayload.askTodoAnythingOwner();
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add("ไม่มีคอร์สจ้า");
      agent.add(payload);
    } else {
      const payloadJson = lineHelper.createFlexCarouselMessage("List Course Participant", contents);
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
      agent.add("ต้องการดูรายชื่อผู้เข้าสมัครคอร์สไหน เลือกได้เลยนะ");
      agent.add(payload);
    }
  } catch (error) {
    console.log(error);
  }
};
