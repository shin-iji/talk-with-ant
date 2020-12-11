const functions = require("firebase-functions");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fileMiddleware = require("express-multipart-file-parser");

const courses = require("./routes/routes");
const owner = require("./routes/owner-routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(fileMiddleware);

//exports.twaApi = functions.region("asia-northeast1").https.onRequest(app);

app.get("/", (req, res) => {
  res.json({
    message: "Hello from api",
  });
});

app.use("/courses", courses);

app.use("/owner", owner);

const basicAuth = require("express-basic-auth");
app.get(
  "/verify",
  basicAuth({
    challenge: true,
    users: { admin: "admin" },
  }),
  require("./controllers/owner-controller").getVerifyId
);

module.exports = app;
