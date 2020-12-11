const express = require("express");
const router = express.Router();

const coursesController = require("../controllers/courses-controller");
const usersController = require("../controllers/users-controller");

router.route("/").get(coursesController.getAllCourses).post(coursesController.createCourse);
router
  .route("/:id")
  .get(coursesController.getCourse)
  .put(coursesController.updateCourse)
  .delete(coursesController.deleteCourse);

router.route("/users").post(usersController.createUser);
router.route("/:id/users").post(usersController.createUserByCourse);

module.exports = router;
