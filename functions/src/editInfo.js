const db = require('./admin');

function editName(agent) {
    let userId = agent.originalRequest.payload.data.source.userId;
    let topic = agent.parameters.topic;
    let name = agent.parameters.name;
    let query = db.realtimeDB.ref(topic).child("users").child(userId).update({
            name: name
        })
        .then(function () {
            agent.add(`เรียบร้อย เราได้เปลี่ยนชื่อของคุณเป็น ${name} แล้วครับ ต้องการจะทำอะไรอีกไหมครับผม`);
        })
        .catch(function (error) {
            agent.add('error');
        });

    return query;
}

module.exports = {
    editName
};