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

process.env.DEBUG = 'dialogflow:debug'; 
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome ${userId} to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  //Feature Register
  function register(agent) {
    let firstName = request.body.queryResult.parameters.fName; //get first name
    let lastName = request.body.queryResult.parameters.lName; //get last name
    let tel = request.body.queryResult.parameters.tel;
    let email = request.body.queryResult.parameters.email;
    let userId = agent.originalRequest.payload.data.source.userId;

    return db.ref('users').set({
      userId: {
        firstName: firstName,
        lastName: lastName,
        tel: tel,
        email: email
      }
    })
    agent.add(`Complete`);
  }

  function listTraining(agent) {
    let date = request.body.queryResult.parameters.date;

    return db.collection('Training Courses').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().date == date) {
            agent.add(doc.id, '=>', doc.data());
          } 
        });
      })
      .catch((err) => {
        agent.add('Error getting documents', err);
      });
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('..', register);
  intentMap.set('Start', listTraining);

  agent.handleRequest(intentMap);
});
