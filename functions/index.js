"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
//const { Card, Suggestion } = require("dialogflow-fulfillment");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

//Bot Agent Webhhok
const api = require("./api/api");
const ant = require("./agent/ant");

//Payment Api
const confirmPayment = require("./linepay-api/confirm-payment");

//Function Handler
const welcome = require("./function_handler/welcome");
const fallback = require("./function_handler/fallback");
const listCourses = require("./function_handler/list-courses");
const payment = require("./function_handler/check-ready-payment");
const findCourseForCheckAttend = require("./function_handler_owner/find-course-for-check-attend");
const sendCheckButton = require("./function_handler_owner/send-check-payload");
const courseInfo = require("./function_handler/course-info");
const listPayment = require("./function_handler/list-payment");
const checkUserData = require("./function_handler/check-user-data");
const register = require("./function_handler/register");
const registerForm = require("./function_handler/register-form");
const askMulticastCourse = require("./function_handler_owner/ask-multicast-course");
const createCourseForm = require("./function_handler_owner/create-course");
const sendFeedback = require("./function_handler_owner/send-feedback");
const askMulticastFeedback = require("./function_handler_owner/ask-multicast-feedback");
const history = require("./function_handler/history");
const ownerHistory = require("./function_handler_owner/history");
const listParticipant = require("./function_handler_owner/list-attend");

const test = require("./function_handler/test");

exports.antDialogflowFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(request.body));

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("Listing", listCourses);
  intentMap.set("ShowInfo", courseInfo);
  intentMap.set("List Payment", listPayment);
  intentMap.set("Register", checkUserData);
  intentMap.set("Register - yes", register);
  intentMap.set("Register - no", registerForm);
  intentMap.set("History", history);
  intentMap.set("Test", test);

  //Payment
  intentMap.set("Payment", payment);

  agent.handleRequest(intentMap);
});

exports.antOwnerDialogflowFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(request.body));

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set("Check Attend", findCourseForCheckAttend);
  intentMap.set("Check Attend - Yes", sendCheckButton);
  intentMap.set("Create course End", askMulticastCourse);
  intentMap.set("Create course", createCourseForm);
  intentMap.set("Feedback", askMulticastFeedback);
  intentMap.set("Send Feedback", sendFeedback);
  intentMap.set("History", ownerHistory);
  intentMap.set("List Participant", listParticipant);
  agent.handleRequest(intentMap);
});

exports.twaApi = functions.https.onRequest(api);

exports.twaWebhook = functions.https.onRequest(ant.webhook);

exports.confirmPayment = functions.https.onRequest(confirmPayment);
