const db = require("../database/database");

module.exports = async (agent) => {
  try {
    const courseName = agent.parameters.courseName;
    const courseId = [];

    const courseRef = db.collection("Training Courses");

    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    snapshot.forEach((doc) => {
      courseId.push(doc.id);
    });

    agent.add("สมัคร");
    agent.add(`https://liff.line.me/1654378227-QwAzgAb0/enrollcourse?courseId=${courseId[0]}`);
  } catch (error) {
    console.log(error);
  }
};
