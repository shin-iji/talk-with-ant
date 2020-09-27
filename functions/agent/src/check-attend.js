const db = require("../../database/database");

exports.checkAttend = async (userId, courseId) => {
  let orderId = [];
  const userRef = db.collection(`Training Courses/${courseId}/users`);
  const snapshot = await userRef.where("userId", "==", userId).get();
  snapshot.forEach((doc) => {
    orderId.push(doc.id);
  });
  const editAttend = await userRef.doc(`${orderId[0]}`).update({ checkAttend: true });
};
