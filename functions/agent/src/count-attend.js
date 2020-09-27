const { all } = require("../../api/api");
const db = require("../../database/database");

exports.countAttend = async (courseId) => {
  let allAttend = [];
  const courseRef = db.collection(`Training Courses/${courseId}/users`);
  const snapshot = await courseRef.where("checkAttend", "==", true).get();
  snapshot.forEach((doc) => {
    allAttend.push(doc.id);
  });
  return allAttend.length;
};
