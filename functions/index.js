'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; 

const welcome = require('./src/welcome');
const listTraining = require('./src/listTraining');
const trainingDetail = require('./src/trainingDetail');
const register = require('./src/register');
const checkAttend = require('./src/checkAttend');
const editInfo = require('./src/editInfo');

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  let intentMap = new Map();
  intentMap.set('Welcome with Find LU', welcome.welcome);
  intentMap.set('Start Choice - topic', listTraining.listTrainingByTopic);
  intentMap.set('Start Choice - Date', listTraining.listTrainingByDate);
  intentMap.set('Choice - topic', listTraining.listTrainingByTopic)
  intentMap.set('Choice - Date', listTraining.listTrainingByDate);
  intentMap.set('S Choice - topic - Info', trainingDetail);
  intentMap.set('Choice - topic - Info', trainingDetail);
  intentMap.set('S Choice - Date - Info', trainingDetail);
  intentMap.set('Choice - Date - Info', trainingDetail);
  intentMap.set('Register Confirm - yes', register.register);
  intentMap.set('Register Confirm', register.getPayment);
  intentMap.set('Check-Attend - Checked', checkAttend);
  intentMap.set('Edit-registerInfo - Name - yes - EditingName - yes', editInfo.editName);
  intentMap.set('Edit-registerInfo - Phone - yes - Editing - yes', editInfo.editPhoneNum);
  intentMap.set('Edit-registerInfo - Email - yes - Editing - yes', editInfo.editEmail);

  agent.handleRequest(intentMap);
});