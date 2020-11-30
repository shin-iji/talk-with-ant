const linePayload = require("../../helper/payload");
const lineHelper = require("../../helper/line-helper");
const { db } = require("../../database/database");

exports.getCourseById = async (courseId) => {
  try {
    const courseRef = await db.collection("Training Courses").doc(`${courseId}`).get();
    const courseName = courseRef.data().courseName;
    const date = courseRef.data().date;

    const button = {
      type: "button",
      action: {
        type: "message",
        label: "สมัคร",
        text: `สมัคร ${courseName}`,
      },
      style: "primary",
      color: "#FF783E",
    };

    return linePayload.listCourses(courseName, date, button);
  } catch (error) {
    console.log(error);
  }
};
