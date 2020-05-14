'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
//Connect Firebase
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://ant-llicbp.firebaseio.com'
});
let db = admin.database();
let firestore = admin.firestore();

process.env.DEBUG = 'dialogflow:debug'; 
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    let userId = agent.originalRequest.payload.data.source.userId;
    agent.add(userId);
    let trainingRef = firestore.collection('Training Courses');
    let query = trainingRef.get().then(snapshot => {
      if (snapshot.empty) {
        agent.add('ไม่มีการจัดอบรม');
      }

      snapshot.forEach(doc => {
        agent.add(doc.data().name)
      })
    })
    return query
  }

  function listTrainingByDate(agent) {
    let date = request.body.queryResult.parameters.date;
    agent.add(date);
    let trainingRef = firestore.collection('Training Courses');
    let query = trainingRef.where('date','==', date).get().then(snapshot => {
      if (snapshot.empty) {
        agent.add('ไม่มีการจัดอบรม');
      }

      snapshot.forEach(doc => {
        agent.add(/*insert text here*/);
        agent.add(doc.data().name)
      })
    })
    return query
  }
  let intentMap = new Map();
  intentMap.set('test', welcome);
  intentMap.set('Start Choice - Date', listTrainingByDate);

  agent.handleRequest(intentMap);
});