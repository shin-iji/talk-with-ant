const express = require("express");
const router = express.Router();

const ownerController = require("../controllers/owner-controller");
const { route } = require("./routes");

router.route("/verify").post(ownerController.checkVerifyId);

router.route("/").get(ownerController.getAllOwner);

router.route("/:id/users").get(ownerController.getAllAttend);

module.exports = router;
