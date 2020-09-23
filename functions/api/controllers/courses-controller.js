const db = require("../../database/database");

const getAllCourses = async (req, res) => {
  try {
    const coursesQuerySnapshot = await db.collection("Training Courses").get();
    const courses = [];
    coursesQuerySnapshot.forEach((doc) => {
      courses.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    res.json(courses);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await db.collection("Training Courses").doc(courseId).get();
    res.json({
      id: course.id,
      data: course.data(),
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const createCourse = async (req, res) => {
  try {
    const { ownerId, name, date, place } = req.body;
    const data = {
      ownerId,
      name,
      date,
      place,
    };
    const courseRef = await db.collection("Training Courses").add(data);
    const course = await courseRef.get();

    res.json({
      id: courseRef.id,
      data: course.data(),
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { ownerId, name, date, place } = req.body;
    const data = {
      ownerId,
      name,
      date,
      place,
    };
    const courseRef = await db
      .collection("Training Courses")
      .doc(courseId)
      .set(data, { merge: true });

    res.json({
      id: courseId,
      data,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    await db.collection("Training Courses").doc(courseId).delete();

    res.json({
      id: courseId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
