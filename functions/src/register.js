const db = require('./admin');

function register(agent) {
    let userId = agent.originalRequest.payload.data.source.userId;
    let topic = agent.parameters.Topic;
    let name = agent.parameters.name.person.name;
    let tel = agent.parameters.phoneNum;
    let email = agent.parameters.email;
    let query = db.realtimeDB.ref(topic).child("users").child(userId).set({
        name: name,
        tel: tel,
        email: email,
        checkAttend: false
    }).then(() => {
        agent.add('สำเร็จ');
    }).catch(error => {
        agent.add(error);
    });
    return query;
}

function getPayment(agent) {
    let topic = agent.parameters.Topic;
    let trainingRef = db.firestore.collection("Training Courses");
    let query = trainingRef.where("name", "==", topic).get().then(snapshot => {
        if (snapshot.empty) { //No Training
            agent.add('ไม่มีงานอบรมที่คุณตามหาครับผม กรุณาลองใหม่อีกครั้งนะครับ');
            return;
        }

        snapshot.forEach(doc => { //get cost from Database
            agent.add('การลงทะเบียนมีค่าเข้าร่วมเป็นจำนวนเงิน ' + doc.data().payment + ' บาท ท่านตกลงที่จะเข้าร่วมเลยไหมครับ ถ้า "ตกลง" ทางเราจะส่งบิลเรียกเก็บเงินให้ทันทีครับผม');
            agent.add('กรุณาพิมพ์ "ตกลง" เพื่อยืนยัน');
            agent.add('กรุณาพิมพ์ "ไม่ตกลง" เพื่อยกเลิก');
        });

    }).catch(err => { //Error
        agent.add('ต้องขออภัยด้วยครับผม เกิดข้อผิดพลาดในการดึงข้อมูล ของอบรม', err); //Text here
    });
    return query;
}

module.exports = {
    register,
    getPayment
};