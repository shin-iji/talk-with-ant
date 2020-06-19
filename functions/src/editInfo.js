const db = require('./admin');

function editName(agent) {
    let userId = agent.originalRequest.payload.data.source.userId;
    let topic = agent.parameters.topic;
    let name = agent.parameters.name;
    let query = db.realtimeDB.ref(topic).child("users").child(userId).update({
        name: name
    })
    .then(() => {
        agent.add(`เรียบร้อย เราได้เปลี่ยนชื่อของคุณเป็น ${name} แล้วครับ`);
        agent.add('ต้องการจะทำอะไรอีกไหมครับผม');
    })
    .catch(error => {
        agent.add('error' + error);
    });
    return query;
}

function editPhoneNum(agent) {
    let userId = agent.originalRequest.payload.data.source.userId;
    let topic = agent.parameters.topic;
    let tel = agent.parameters.phoneNum;
    let query = db.realtimeDB.ref(topic).child("users").child(userId).update({
        tel: tel
    })
    .then(() => {
        agent.add(`ทำการเปลี่ยนแปลงเบอร์โทรศัพท์เป็น 0${tel} เเล้วครับ`);
        agent.add('ต้องการจะทำอะไรอีกไหมครับผม');
    })
    .catch(error => {
        agent.add('error' + error);
    });
    return query;
}

module.exports = {
    editName,
    editPhoneNum
};