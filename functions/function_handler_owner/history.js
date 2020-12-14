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
          courses.push({ courseName: doc.data().courseName, date: doc.data().date });
        });
      });

    courses.map((course) => {
      contents.push(linePayload.listHistory(course.courseName, course.date));
    });

    const payloadJson = lineHelper.createFlexCarouselMessage("List Course", contents);
    let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
    agent.add("คอร์สทั้งหมดที่คุณเคยสร้างไปแล้วนะ");
    agent.add(payload);

    //agent.add("test");
  } catch (error) {
    console.log(error);
  }
};
