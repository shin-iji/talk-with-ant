const express = require("express");
const router = express.Router();

const coursesController = require("../controllers/coursesController");
const usersController = require("../controllers/usersController");

router.get("/", coursesController.getAllCourses);
router.get("/:id", coursesController.getCourse);
router.post("/", coursesController.createCourse);
router.put("/:id", coursesController.updateCourse);
router.delete("/:id", coursesController.deleteCourse);

router.post("/users", usersController.createUser);

module.exports = router;
