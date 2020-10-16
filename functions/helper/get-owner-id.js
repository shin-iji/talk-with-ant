const db = require("../database/database");

exports.getOwnerId = async (courseName) => {
  let courseId = [];
  let ownerId = [];

  const courseRef = db.collection("Training Courses");
  const snapshot = await courseRef.where("courseName", "==", courseName).get();
  snapshot.forEach((doc) => {
    courseId.push(doc.id);
    ownerId.push(doc.data().ownerId);
  });

  return ownerId[0];
};
