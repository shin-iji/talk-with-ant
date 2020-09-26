const db = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");

module.exports = async (agent) => {
  try {
    const courseRef = await db.collection("Training Courses").get();
    const courses = [];
    courseRef.forEach((doc) => {
      let url = doc.data().pictureUrl;
      let courseName = doc.data().courseName;
      let date = doc.data().date;
      courses.push(linePayload.listCourses(url, courseName, date));
    });
    const payloadJson = lineHelper.createFlexCarouselMessage("List Course", courses);
    let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
    agent.add(payload);
  } catch (error) {
    console.log(error);
  }
};
