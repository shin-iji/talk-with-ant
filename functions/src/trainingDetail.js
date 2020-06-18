const db = require('./admin');

function trainingDetail(agent) {
    let topic = agent.parameters.Topic;
    let trainingRef = db.firestore.collection("Training Courses");
    let query = trainingRef.where("name", "==", topic).get().then(snapshot => {
        //Found Training
        agent.add('งานอบรม ' + topic + ' มีรายละเอียดดังนี้ครับผม');
        snapshot.forEach(doc => {
            agent.add('ชื่อ: ' + doc.data().name);
            agent.add('วันที่: ' + doc.data().date.substring(0, 10));
            agent.add('รายละเอียด: ' + doc.data().detail);
            agent.add('ผู้สอน: ' + doc.data().speaker);
            agent.add('สถานที่: ' + doc.data().place);
            agent.add('ค่าใช้จ่าย: ' + doc.data().payment + ' บาท');
            agent.add('ต้องการสมัครเลยหรือไม่ ถ้าต้อง กรุณาพิมพ์ว่า "สมัคร" ได้เลยนะครับผม');
        });

    }).catch(err => { //Error
        agent.add('ต้องขออภัยด้วยครับผม เกิดข้อผิดพลาดในการดึงข้อมูล ของอบรม', err); //Text here
    });
    return query;
}

module.exports = trainingDetail;