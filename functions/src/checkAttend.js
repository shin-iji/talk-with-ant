const db = require('./admin');

function checkAttend(agent) {
    let userId = agent.originalRequest.payload.data.source.userId;
    let topic = agent.parameters.topic;
    let query = db.realtimeDB.ref(topic).child("users").child(userId).update({
        checkAttend: true
    })
    .then(() => {
        agent.add('ขอบคุณสำหรับความร่วมมือครับผม ต้องการให้ช่วยอะไรเพิ่มเติมไหมครับผม');
    })
    .catch(error => {
        agent.add('error' + error);
    });
    return query;
}

module.exports = checkAttend;