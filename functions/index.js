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
    agent.add('สวัสดีครับ ต้องการสมัครอบรมอะไรไหมเอ้ย เราช่วยคุณหาได้นะ');
    agent.add('เพียงเเค่ระบุวันที่ หรือ หัวข้อที่สนใจ เราจะตรวจสอบให้ว่ามีที่ตรงหรือใกล้เคียงไหมมาใหเลือกเลยละ')
  }

  function listTrainingByDate(agent) {
    let date = request.body.queryResult.parameters.date;
    let trainingRef = firestore.collection("Training Courses");
    let query = trainingRef.where("date", "==", date).get().then(snapshot => {
      if (snapshot.empty) { //No Training
        agent.add('ไม่พบ หัวข้องานอบรมภายในวันที่นี้ ' + date.substring(0,10))//Text;
        return;
      }  

      //Found Training  
      agent.add('วันที่ ' + date.substring(0,10) + ' มีการจัดงานอบรมดังนี้ครับ');
      snapshot.forEach(doc => { 
        agent.add(doc.data().name);
      });

    }).catch(err => { //Error
      agent.end('ต้องขออภัยด้วยครับผม เกิดข้อผิดพลาดในการดึงข้อมูล ของอบรม โดยวันที', err);//Text here
    });
    return query;
  }

  function listTrainingByTopic(agent) {
    let topic = request.body.queryResult.parameters.topic; //Case sensitive only
    let trainingRef = firestore.collection("Training Courses");
    let query = trainingRef.where("name", ">=", topic).get().then(snapshot => {
      if (snapshot.empty) { //No Training
        agent.add('ไม่พบ หัวข้อ นี้ในงานอบรมครับผม ')//Text;
        return;
      }  

      //Found Training  
      agent.add('งานอบรมที่เกี่ยวข้องกับหัวข้อว่า ' + topic + ' มีดังนี้ครับ');
      snapshot.forEach(doc => { 
        agent.add(doc.data().name);
      });

    }).catch(err => { //Error
      agent.add('ต้องขออภัยด้วยครับผม เกิดข้อผิดพลาดในการดึงข้อมูล ของอบรม', err);//Text here
    });
    return query;
  }

  function TrainingDetail(agent) {
    let topic = request.body.queryResult.parameters.Topic;
    agent.add(topic);
    let trainingRef = firestore.collection("Training Courses");
    let query = trainingRef.where("name","==", topic).get().then(snapshot => {
      if (snapshot.empty) { //No Training
        agent.add('วันที่นี้ไม่มีการจัดงานอบรมครับผม ');//Text here
        return;
      }  

      //Found Training
      agent.add('งานอบรม' + doc.data().name +'รายละเอียดดังนี้');
      snapshot.forEach(doc => { 
        agent.add('ชื่อ: ' + doc.data().name);
        agent.add('วันที่: ' + doc.data().date.substring(0,10));
      });

    }).catch(err => { //Error
      agent.add('ต้องขออภัยด้วยครับผม เกิดข้อผิดพลาดในการดึงข้อมูล ของอบรม', err);//Text here
    });
    return query;
  }

  function Register(agent) {
    let userId = agent.originalRequest.payload.data.source.userId;
    let topic = request.body.queryResult.parameters.Topic;
    let name = request.body.queryResult.parameters.name;
    let tel = request.body.queryResult.parameters.phoneNum;
    let email = request.body.queryResult.parameters.email;
    let query = db.ref(topic).child("users").child(userId).set({
      name: name,
      tel: tel,
      email: email
    });
    agent.add('สำเร็จ');
    return query;
  }

  function getPayment(agent) {
    let topic = request.body.queryResult.parameters.Topic;
    let trainingRef = firestore.collection("Training Courses");
    let query = trainingRef.where("name","==", topic).get().then(snapshot => {
      if (snapshot.empty) { //No Training
        agent.add('ไม่งานอบรมไม่มีงานอบรมที่คุณตามหาครับ');
        return;
      }  
  
      snapshot.forEach(doc => { //get cost from Database
        agent.add('การลงทะเบียนมีค่าเข้าร่วมเป็นจำนวนเงิน ' + doc.data().payment + ' บาท ท่านตกลงที่จะเข้าร่วมเลยไหมครับถ้าตกลงทางเราจะส่งบิลเรียกเก็บเงินให้ทันที');
        agent.add('กรุณาพิมพ์ "ตกลง" เพื่อยืนยัน');
        agent.add('กรุณาพิมพ์ "ไม่ตกลง" เพื่อยกเลิก');
      });

    }).catch(err => { //Error
      agent.add('ต้องขออภัยด้วยครับผม เกิดข้อผิดพลาดในการดึงข้อมูล ของอบรม', err);//Text here
    });
    return query;
  }

  let intentMap = new Map();
  intentMap.set('Welcome with Find LU', welcome);
  intentMap.set('Start Choice - topic', listTrainingByTopic)
  intentMap.set('Start Choice - Date', listTrainingByDate);
  intentMap.set('Choice - topic', listTrainingByTopic)
  intentMap.set('Choice - Date', listTrainingByDate);
  intentMap.set('S Choice - topic - Info', TrainingDetail);
  intentMap.set('Choice - topic - Info', TrainingDetail);
  intentMap.set('S Choice - Date - Info', TrainingDetail);
  intentMap.set('Choice - Date - Info', TrainingDetail);
  intentMap.set('Register Confirm - yes', Register);
  intentMap.set('Register Confirm', getPayment);

  agent.handleRequest(intentMap);
});