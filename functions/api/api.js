const functions = require("firebase-functions");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const courses = require("./routes/routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

//exports.twaApi = functions.region("asia-northeast1").https.onRequest(app);

app.get("/", (req, res) => {
  res.json({
    message: "Hello from api",
  });
});

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

app.use("/courses", courses);

module.exports = app;
