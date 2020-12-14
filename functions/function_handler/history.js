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

    const payloadJson = lineHelper.createFlexCarouselMessage("List Course", contents);
    let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
    agent.add("คอร์สทั้งหมดที่คุณเคยสมัครไปแล้วนะ");
    agent.add(payload);

    //agent.add("test");
  } catch (error) {
    console.log(error);
  }
};
