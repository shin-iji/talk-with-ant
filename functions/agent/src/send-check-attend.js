const { db } = require("../../database/database");
const { multicast } = require("../../helper/multicast");
const linePayload = require("../../helper/payload");

exports.sendCheckAttend = async (courseId, courseName) => {
  const userId = [];
  const courseRef = db.collection("Training Courses").doc(`${courseId}`);
  const userRef = db.collection(`Training Courses/${courseId}/users`);

  const snapshot = await userRef.where("paymentStatus", "==", "paid").get();
  snapshot.forEach((doc) => {
    userId.push(doc.data().userId);
    //console.log(doc.id);
  });

  const checkAttend = await courseRef.get();

  if (checkAttend.data().checkAttend === true) {
    return true;
  } else {
    await courseRef.update({ checkAttend: true });
    await multicast(userId, linePayload.checkAttend(courseId, courseName));
    return false;
  }
};
