const express = require("express");
const router = express.Router();

const coursesController = require("../controllers/courses-controller");
const usersController = require("../controllers/users-controller");

router.get("/", coursesController.getAllCourses);
router.get("/:id", coursesController.getCourse);
router.post("/", coursesController.createCourse);
router.put("/:id", coursesController.updateCourse);
router.delete("/:id", coursesController.deleteCourse);

router.post("/users", usersController.createUser);
router.post("/:id/users", usersController.createUserByCourse);

module.exports = router;
