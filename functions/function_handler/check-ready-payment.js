const db = require("../database/database");
const linepay = require("../linepay-api/reserve-payment");

module.exports = async (agent) => {
  try {
    const session = agent.session;
    const userId = session.split("/")[4];
    const courseName = agent.parameters.courseName;
    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    const courseId = [];
    const amount = [];
    const avaiPar = [];

    snapshot.forEach((doc) => {
      courseId.push(doc.id);
      amount.push(doc.data().amount);
      avaiPar.push(doc.data().avaiPar);
    });

    const orderId = [];
    const userRef = await courseRef
      .doc(`${courseId[0]}`)
      .collection("users")
      .where("userId", "==", userId)
      .get();
    userRef.forEach((doc) => {
      orderId.push(doc.id);
    });

    await courseRef.doc(`${courseId[0]}`).update({ avaiPar: avaiPar[0] - 1 });

    if (amount[0] === undefined) {
      agent.add("สมัครเสร็จแล้ว");
      agent.add("ต้องการทำอะไรต่อบอกได้นะ");
    } else {
      await linepay.reservePayment(courseName, amount[0], orderId[0], userId);
    }
  } catch (error) {
    console.error(error);
  }
};
