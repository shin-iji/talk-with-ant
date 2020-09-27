const db = require("../../database/database");
const { multicast } = require("../../helper/multicast");
const linePayload = require("../../helper/payload");

exports.sendCheckAttend = async (courseId, courseName) => {
  let userId = [];
  const txRef = db.collection("Transactions");
  const snapshot = await txRef
    .where("status", "==", "paid")
    .where("productName", "==", courseName)
    .get();
  snapshot.forEach((doc) => {
    userId.push(doc.data().userId);
  });
  console.log(userId);
  await multicast(userId, linePayload.checkAttend(courseId, courseName));
};
