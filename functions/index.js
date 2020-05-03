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

  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  //List Training Course
  function listAllTraining(agent) {
    let trainingRef = firestore.collection('Training Courses');
    let query = trainingRef.get().then(snapshot => {
      if (snapshot.empty) {
        agent.add('ไม่มีการจัดอบรม');
      }

      snapshot.forEach(doc => {
        agent.add(doc.data().name);
      })
    })
    return query
  }

  function listTrainingByDate(agent) {
    let date = request.body.queryResult.parameters.date;
    agent.add(date);

    let trainingRef = firestore.collection('Training Courses');
    let query = trainingRef.where('date', '==', date).get().then(snapshot => {

      if (snapshot.empty) {
        agent.add('ไม่มีการจัดอบรม');
      }

      snapshot.forEach(doc => {
        agent.add(doc.id, '=>', doc.data());
      })
    })
    return query
  }

  function getTrainingDetail(agent) {
    let keyword = agent.originalRequest.payload.data.source.keyword;
    let query = firestore.collection('Training Courses').doc(keyword).get().then(doc => {
      agent.add(doc.data());
    })
    return query
  }

  //Register
  function getUser(agent) {
    let userId = agent.originalRequest.payload.data.source.userId;
    let query = db.ref('users').child(userId).once('value').then(snapshot => {
      let firstName = snapshot.val().firstName;
      let lastName = snapshot.val().lastName;
      agent.add('ชื่อ: ' + firstName + '\n' + 
                'นามสกุล: ' + lastName);
    })
    return query
  }

  

  // //Feature Register
  // function register(agent) {
  //   let firstName = request.body.queryResult.parameters.fName; //get first name
  //   let lastName = request.body.queryResult.parameters.lName; //get last name
  //   let tel = request.body.queryResult.parameters.tel;
  //   let email = request.body.queryResult.parameters.email;
  //   let userId = agent.originalRequest.payload.data.source.userId;
  //   agent.add(userId);
  //   let usersRef = db.ref("users");
  //   let query = usersRef.child(userId).set({
  //     firstName: firstName,
  //     lastName: lastName,
  //     tel: tel,
  //     email: email
  //   })
  //   agent.add('Complete');
  //   return query
  // }

  

  

  function setUser(agent) {
    let userId = agent.originalRequest.payload.data.source.userId;
    let query = db.ref('users').child(userId).set({
      firstName: "Siradanai",
      lastName: "Boonyuen"
    });
    agent.add('Complete');
    return query
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Start', listTrainingByDate);
  intentMap.set('Training-List', listAllTraining)
  intentMap.set('Regis',setUser);
  intentMap.set('getUser', getUser);

  agent.handleRequest(intentMap);
});
