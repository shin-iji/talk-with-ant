"use strict";

const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");
//const { Card, Suggestion } = require("dialogflow-fulfillment");

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

//Bot Agent Webhhok
const ant = require("./agent/ant");
const api = require("./api/api");

//Function Handler
const welcome = require("./function_handler/welcome");
const fallback = require("./function_handler/fallback");
const listCourses = require("./function_handler/listCourses");

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(request.body));

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("Listing", listCourses);

  agent.handleRequest(intentMap);
});

exports.twaApi = functions.https.onRequest(api);
