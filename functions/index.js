'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
//Connect Firebase
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://antv1-rkiiru.firebaseio.com'
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
  }

  function listTrainingByDate(agent) {
    let date = request.body.queryResult.parameters.date;
    agent.add(date);
    let trainingRef = firestore.collection("Training Courses");
    let query = trainingRef.where("date", ">=", date).get().then(snapshot => {
      if (snapshot.empty) { //No Training
        agent.add(/*insert text here*/'No Training');
        return;
      }  
  
      snapshot.forEach(doc => { //Found Training
        agent.add(doc.data().name);
      });

    }).catch(err => { //Error
      agent.add('Error getting documents', err);
    });
    return query;
  }

  function listTrainingByTopic(agent) {
    let topic = request.body.queryResult.parameters.topic; //Case sensitive only
    agent.add(topic);
    let trainingRef = firestore.collection("Training Courses");
    let query = trainingRef.where("name", ">=", topic).get().then(snapshot => {
      if (snapshot.empty) { //No Training
        agent.add(/*insert text here*/'No Training');
        return;
      }  
  
      snapshot.forEach(doc => { //Found Training
        agent.add(doc.data().name);
      });

    }).catch(err => { //Error
      agent.add('Error getting documents', err);
    });
    return query;
  }

  function TrainingDetail(agent) {
    let topic = request.body.queryResult.parameters.Topic;
    agent.add(topic);
    let trainingRef = firestore.collection("Training Courses");
    let query = trainingRef.where("name","==", topic).get().then(snapshot => {
      if (snapshot.empty) { //No Training
        agent.add(/*insert text here*/'No Training');
        return;
      }  
  
      snapshot.forEach(doc => { //Found Training
        agent.add('รายละเอียดดังนี้');
        agent.add('ชื่อ: ' + doc.data().name);
        agent.add('วันที่: ' + doc.data().date.substring(0,10));
      });

    }).catch(err => { //Error
      agent.add('Error getting documents', err);
    });
    return query;
  }

  let intentMap = new Map();
  intentMap.set('test', welcome);
  intentMap.set('Start Choice - topic', listTrainingByTopic)
  intentMap.set('Start Choice - Date', listTrainingByDate);
  intentMap.set('S Choice - topic - Info', TrainingDetail);
  intentMap.set('Choice - topic - Info', TrainingDetail);
  intentMap.set('S Choice - Date - Info', TrainingDetail);
  intentMap.set('Choice - Date - Info', TrainingDetail);

  agent.handleRequest(intentMap);
});