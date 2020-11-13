const { db } = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");

module.exports = async (agent) => {
  try {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const date = today.toLocaleDateString(); // "6/14/2020"
    let listCourses = [];

    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("date", "==", date).get();
    snapshot.forEach((doc) => {
      let courseName = doc.data().courseName;
      let courseId = doc.id;
      listCourses.push({ courseId, courseName });
    });

    if (!Array.isArray(listCourses) || !listCourses.length) {
      let courses = [];
      let contents = [];
      const course = await courseRef.get();
      course.forEach((doc) => {
        courses.push({ courseId: doc.id, courseName: doc.data().courseName });
      });

      for (let i = 0; i < courses.length; i++) {
        const doc = courses[i];
        if (Date.parse(`${doc.date}`) < `${today}`) {
          continue;
        }
        contents.push(linePayload.listCheckAttend(doc.courseId, doc.courseName));
      }

      if (!Array.isArray(contents) || !contents.length) {
        const payloadJson = linePayload.askTodoAnythingOwner();
        let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
        agent.add("ดูเหมือนจะไม่มีคอร์สในช่วงนี้เลยนะ");
        agent.add(payload);
      } else {
        const payloadJson = lineHelper.createFlexCarouselMessage("List Course", contents);
        let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
        agent.add("ไม่พบคอร์สที่ตรงกับวันนี้นะ แต่สามารถเลือกได้จากรายการนี้เลยนะ");
        agent.add(payload);
      }
    } else {
      if (listCourses.length != 1) {
        console.log(listCourses);
        let contents = [];
        listCourses.map((course) => {
          contents.push(linePayload.listCheckAttend(course.courseId, course.courseName));
        });
        const payloadJson = lineHelper.createFlexCarouselMessage("Check Attend", contents);
        let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
        agent.add("ดูเหมือนวันนี้จะมีตรงกันหลายคอร์สนะ แต่สามารถเลือกได้จากรายการนี้เลย");
        agent.add(payload);
        return;
      }
      agent.add("พบคอร์สที่ตรงกับวันนี้นะ");
      const payloadJson = linePayload.askedSendCheckAttend(listCourses[0].courseName, date);
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add(payload);
    }
  } catch (error) {
    console.log(error);
  }
};
