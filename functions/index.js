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

//Payment Functions
const paymentConfirm = require("./function_handler/payment-confirm");

//Function Handler
const welcome = require("./function_handler/welcome");
const fallback = require("./function_handler/fallback");
const listCourses = require("./function_handler/list-courses");
const payment = require("./function_handler/check-ready-payment");

const test = require("./function_handler/test");

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(request.body));

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("Listing", listCourses);
  intentMap.set("Test", test);

  //Payment
  intentMap.set("Payment", payment);
  intentMap.set("Payment - yes", paymentConfirm);

  agent.handleRequest(intentMap);
});

exports.twaApi = functions.https.onRequest(api);

exports.twaWebhook = functions.https.onRequest(ant.webhook);

exports.confirmPayment = functions.https.onRequest(confirmPayment);
