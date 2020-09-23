const db = require("../database/database");
const linepay = require("../linepay-api/reserve-payment");

module.exports = async (agent) => {
  try {
    const courseName = agent.parameters.courseName;
    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    const courseId = [];
    const amount = [];

    snapshot.forEach((doc) => {
      courseId.push(doc.id);
      amount.push(doc.data().amount);
    });

    linepay.reservePayment(courseName, amount[0]);
    agent.add("Test2");
  } catch (error) {
    console.error(error);
  }
};
