const { db } = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");

module.exports = async (agent) => {
  try {
    const today = Date.parse(new Date());
    const courseRef = await db.collection("Training Courses").get();
    const courses = [];
    const contents = [];
    let button;
    courseRef.forEach((doc) => {
      let courseName = doc.data().courseName;
      let date = doc.data().date;
      let avaiPar = doc.data().avaiPar;
      courses.push({
        courseName,
        date,
        avaiPar,
      });
    });
    for (let i = 0; i < courses.length; i++) {
      const doc = courses[i];
      if (Date.parse(`${doc.date}`) < `${today}`) {
        continue;
      }
      if (doc.avaiPar === 0) {
        button = {
          type: "box",
          layout: "vertical",
          backgroundColor: "#B2BEC3",
          height: "50px",
          cornerRadius: "md",
          contents: [
            {
              type: "text",
              text: "เต็ม",
              align: "center",
              gravity: "center",
              size: "md",
              flex: 2,
            },
          ],
        };
      } else {
        button = {
          type: "button",
          action: {
            type: "message",
            label: "สมัคร",
            text: `สมัคร ${doc.courseName}`,
          },
          style: "primary",
          color: "#FF783E",
        };
      }
      contents.push(linePayload.listCourses(doc.courseName, doc.date, button));
    }
    if (!Array.isArray(contents) || !contents.length) {
      const payloadJson = linePayload.askTodoAnything();
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add("ไม่มีคอร์สจ้า");
      agent.add(payload);
    } else {
      const payloadJson = lineHelper.createFlexCarouselMessage("List Course", contents);
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add(payload);
    }
  } catch (error) {
    console.log(error);
  }
};
