const { db } = require("../../database/database");
const { push } = require("../../helper/push");
const lineHelper = require("../../helper/line-helper");

exports.checkAttend = async (userId, courseId) => {
  let orderId;
  let checkAttend;
  const userRef = db.collection(`Training Courses/${courseId}/users`);
  const snapshot = await userRef.where("userId", "==", userId).get();
  snapshot.forEach((doc) => {
    orderId = doc.id;
    checkAttend = doc.data().checkAttend;
  });

  if (checkAttend === true) {
    return true;
  } else {
    await userRef.doc(`${orderId}`).update({ checkAttend: true });
    return false;
  }
};
