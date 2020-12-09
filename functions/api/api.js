const functions = require("firebase-functions");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const fileMiddleware = require("express-multipart-file-parser");

const courses = require("./routes/routes");

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

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });
const { storage } = require("../database/database");
const bucket = storage.bucket();

app.post("/upload", (req, res) => {
  try {
    console.log(req.files[0]);
    console.log(req.body);
    const file = req.files[0];
    const fileName = `Test Upload`;
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
      res.status(200).send("Upload complete!");
      //return next();
    });

    blobStream.end(file.buffer);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use("/courses", courses);

module.exports = app;
