const db = require('./admin');

function listTrainingByDate(agent) {
    let date = agent.parameters.date;
    let trainingRef = db.firestore.collection("Training Courses");
    let query = trainingRef.where("date", "==", date).get().then(snapshot => {
        if (snapshot.empty) { //No Training
            agent.add('ไม่พบ หัวข้องานอบรมภายในวันที่นี้ ' + date.substring(0, 10)) //Text;
            return;
        }

        //Found Training  
        agent.add('วันที่ ' + date.substring(0, 10) + ' มีการจัดงานอบรมดังนี้ครับผม กรุณาพิมพ์ชื่องานอบรมที่ต้องการได้เลยครับ');
        snapshot.forEach(doc => {
            agent.add(doc.data().name);
        });

    }).catch(err => { //Error
        agent.end('ต้องขออภัยด้วยครับผม เกิดข้อผิดพลาดในการดึงข้อมูล ของอบรม โดยวันที', err); //Text here
    });
    return query;
}

function listTrainingByTopic(agent) {
    let topic = agent.parameters.topic; //Case sensitive only
    let trainingRef = db.firestore.collection("Training Courses");
    let query = trainingRef.where("name", ">=", topic).get().then(snapshot => {
        if (snapshot.empty) { //No Training
            agent.add('ไม่พบ หัวข้อ นี้ในงานอบรมครับผม ') //Text;
            return;
        }

        //Found Training  
        agent.add('งานอบรมที่เกี่ยวข้องกับหัวข้อว่า ' + topic + ' มีดังนี้ครับผม กรุณาพิมพ์ชื่องานอบรมที่ต้องการได้เลยครับ');
        snapshot.forEach(doc => {
            agent.add(doc.data().name);
        });

    }).catch(err => { //Error
        agent.add('ต้องขออภัยด้วยครับผม เกิดข้อผิดพลาดในการดึงข้อมูล ของอบรม', err); //Text here
    });
    return query;
}

module.exports = {
    listTrainingByDate,
    listTrainingByTopic
};