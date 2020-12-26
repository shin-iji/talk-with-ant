const { db, storage } = require("../../database/database");
const { updateEntity } = require("../../helper/update-entity");
const { updateEntityOwner } = require("../../helper/update-entity-owner");
const bucket = storage.bucket("antv2-xdbgna.appspot.com");

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

const createCourse = async (req, res, next) => {
  try {
    const {
      ownerId,
      courseName,
      date,
      location,
      amount,
      description,
      trainerName,
      maxPar,
    } = req.body;

    const newDate = new Date(date);

    //console.log(req.body);
    await updateEntity(courseName);
    await updateEntityOwner(courseName);

    const file = req.files[0];
    //console.log(file);
    const fileName = `${courseName.split(" ").join("_")}`;
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      res.status(405).json(err);
    });

    blobStream.on("finish", () => {
      // res.status(200).send("Upload complete!");
      return next();
    });

    blobStream.end(file.buffer);

    const data = {
      ownerId,
      courseName,
      date: newDate.toLocaleDateString(),
      amount,
      currency: "THB",
      description,
      location,
      trainerName,
      maxPar: Number(maxPar),
      avaiPar: Number(maxPar),
      checkAttend: false,
    };

    const courseRef = await db.collection("Training Courses").doc().set(data);

    res.status(200).json({
      message: "success",
      data,
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
