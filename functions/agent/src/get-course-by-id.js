const linePayload = require("../../helper/payload");
const lineHelper = require("../../helper/line-helper");
const { db } = require("../../database/database");

exports.getCourseById = async (courseId) => {
  try {
    const courseRef = await db.collection("Training Courses").doc(`${courseId}`).get();
    const courseName = courseRef.data().courseName;
    const date = courseRef.data().date;
    return linePayload.listCourses(courseName, date);
  } catch (error) {
    console.log(error);
  }
};
