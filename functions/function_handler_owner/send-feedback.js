const linePayload = require("../helper/payload");
const { multicast } = require("../helper/multicast");
const { db } = require("../database/database");
const { user } = require("firebase-functions/lib/providers/auth");

module.exports = async (agent) => {
  try {
    const url = agent.parameters.url;
    const courseName = agent.parameters.courseName;
    const any = agent.parameters.any;
    let name;
    let courseId;
    let userId = [];

    if (courseName) {
      name = courseName;
    } else {
      name = any;
    }
    console.log(name);
    console.log(url);

    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", name).get();
    snapshot.forEach((doc) => {
      courseId = doc.id;
    });

    const userRef = await courseRef
      .doc(`${courseId}`)
      .collection("users")
      .where("checkAttend", "==", true)
      .get();
    userRef.forEach((doc) => {
      userId.push(doc.data().userId);
    });
    const msg = linePayload.feedbackFormButton(name, url);
    await multicast(userId, msg);
    agent.add("กระจายแบบสอบถามแล้ว");
  } catch (error) {
    console.log(error);
  }
};
