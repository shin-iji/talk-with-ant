const db = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");

module.exports = async (agent) => {
  try {
    const today = Date.parse(new Date());
    const courseRef = await db.collection("Training Courses").get();
    const courses = [];
    const contents = [];
    courseRef.forEach((doc) => {
      let pictureUrl = doc.data().pictureUrl;
      let courseName = doc.data().courseName;
      let date = doc.data().date;
      courses.push({
        pictureUrl,
        courseName,
        date,
      });
    });
    for (let i = 0; i < courses.length; i++) {
      const doc = courses[i];
      if (Date.parse(`${doc.date}`) < `${today}`) {
        continue;
      }
      contents.push(linePayload.listCourses(doc.pictureUrl, doc.courseName, doc.date));
    }
    if (!Array.isArray(contents) || !contents.length) {
      agent.add("ไม่มีคอร์สจ้า");
    } else {
      const payloadJson = lineHelper.createFlexCarouselMessage("List Course", contents); //Change button to text
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add(payload);
    }
  } catch (error) {
    console.log(error);
  }
};
