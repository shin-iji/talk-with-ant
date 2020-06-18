function welcome(agent) {
    agent.add('สวัสดีครับ ต้องการสมัครงานอบรมหรือไม่ เราช่วยคุณหาได้นะครับผม');
    agent.add('เพียงเเค่ระบุวันที่ หรือ หัวข้อที่สนใจ เราจะตรวจสอบให้ว่ามีที่ตรงหรือใกล้เคียงมาให้เลือกทันทีเลยครับผม')
}

function fallback(agent) {
    agent.add('Sorry');
}

module.exports = {
    welcome,
    fallback
}
