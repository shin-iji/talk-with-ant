const db = require("../../database/database");

const createUser = async (req, res) => {
  try {
    const { courseName, userId, name, tel, email, timestamp } = req.body;
    const data = {
      courseName,
      userId,
      name,
      tel,
      email,
      timestamp,
      checkAttent: false,
    };
    const courseId = [];
    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    snapshot.forEach((doc) => {
      courseId.push(doc.id);
    });
    const addCourseUser = await courseRef
      .doc(courseId[0])
      .collection("users")
      .doc(userId)
      .set(data);
    const userRef = await db.collection("Users").doc(userId).set(data);

    res.status(200).json({
      courseId: courseId[0],
      user: {
        id: userId,
        data: data,
      },
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createUser };
