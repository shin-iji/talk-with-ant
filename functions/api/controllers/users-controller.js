const db = require("../../database/database");

const createUser = async (req, res) => {
  try {
    const { courseName, userId, name, tel, email } = req.body;
    const timestamp = Date().toString();
    const data = {
      courseName,
      userId,
      name,
      tel,
      email,
      timestamp: timestamp,
      checkAttent: false,
      paymentStatus: false,
    };
    const user = {
      userId,
      name,
      tel,
      email,
    };
    const courseId = [];
    const courseRef = db.collection("Training Courses");
    const snapshot = await courseRef.where("courseName", "==", courseName).get();
    snapshot.forEach((doc) => {
      courseId.push(doc.id);
    });
    const addCourseUser = await courseRef.doc(courseId[0]).collection("users").doc().set(data);
    const userRef = await db.collection("Users").doc(userId).set(user);

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

const createUserByCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { userId, name, tel, email } = req.body;
    const timestamp = Date().toString();
    const data = {
      userId,
      name,
      tel,
      email,
      timestamp: timestamp,
      checkAttent: false,
    };
    const courseRef = await db.collection(`Training Courses/${courseId}/users`).set(data);

    const user = {
      userId,
      name,
      tel,
      email,
    };
    const userRef = await db.collection("Users").doc(`${userId}`).set(user);

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

module.exports = { createUser, createUserByCourse };
