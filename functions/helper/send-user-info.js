const { db } = require("../database/database");
const linePayload = require("./payload");

exports.sendUserInfo = async (courseName, orderId) => {
  let courseId;
  const courseRef = db.collection("Training Courses");
  const snapshot = await courseRef.where("courseName", "==", courseName).get();
  snapshot.forEach((doc) => {
    courseId = doc.id;
  });
  const userRef = db.collection(`Training Courses/${courseId}/users`).doc(`${orderId}`);
  const doc = await userRef.get();
  let name = doc.data().name;
  let email = doc.data().email;
  let tel = doc.data().tel;
  return linePayload.sendUserInfo(name, email, tel, courseName);
};
