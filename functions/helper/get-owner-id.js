const db = require("../database/database");

exports.getOwnerId = async (courseName) => {
  let ownerId;

  const courseRef = db.collection("Training Courses");
  const snapshot = await courseRef.where("courseName", "==", courseName).get();
  snapshot.forEach((doc) => {
    ownerId = doc.data().ownerId;
  });

  return ownerId;
};
