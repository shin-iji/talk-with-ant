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

// router.get("/", coursesController.getAllCourses);
// router.get("/:id", coursesController.getCourse);
// router.post("/", coursesController.createCourse);
// router.put("/:id", coursesController.updateCourse);
// router.delete("/:id", coursesController.deleteCourse);

// router.post("/users", usersController.createUser);
// router.post("/:id/users");

module.exports = router;
