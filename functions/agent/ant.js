const functions = require("firebase-functions");

exports.webhook = (request, response) => {
  response.send("Test Agent");
};
