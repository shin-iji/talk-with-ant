const db = require("../../database/database");

const createUser = async (req, res) => {
  try {
    const { courseName, userId, name, tel, email, courseId, timestamp } = req.body;
    const data = {
      courseName,
      userId,
      name,
      tel,
      email,
      timestamp,
    };
    const courseRef = await db
      .collection("Training Courses")
      .doc(courseId)
      .collection("Users")
      .doc(userId)
      .set(data);
    const userRef = await db.collection("Users").doc(userId).set(data);

    res.status(200).json({
      courseId: courseId,
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
