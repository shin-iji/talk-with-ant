const db = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");

module.exports = async (agent) => {
  try {
    const session = agent.session;
    const userId = session.split("/")[4];
    const courseName = agent.parameters.courseName;
    const courseId = [];
    const orderId = [];

    const courseRef = db.collection("Training Courses");

    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    snapshot.forEach((doc) => {
      courseId.push(doc.id);
    });

    const userRef = await courseRef
      .doc(`${courseId[0]}`)
      .collection("users")
      .where("userId", "==", userId)
      .get();
    userRef.forEach((doc) => {
      orderId.push(doc.id);
    });

    if (orderId[0]) {
      agent.add("คุณสมัครคอร์สนี้ไปแล้วน้า ลองดูคอร์สอื่นนะ");
    } else {
      const userColleRef = await db.collection("Users").doc(`${userId}`).get();
      if (userColleRef.data() === undefined) {
        agent.add("สมัคร");
        agent.add(`https://liff.line.me/1654378227-QwAzgAb0/enrollcourse?courseId=${courseId[0]}`);
      } else {
        const name = userColleRef.data().name;
        const tel = userColleRef.data().tel;
        const email = userColleRef.data().email;
        const payloadJson = linePayload.userInfo(name, tel, email);
        let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
        agent.add(payload);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
