const { db } = require("../../database/database");
const { push } = require("../../helper/push");
const lineHelper = require("../../helper/line-helper");

exports.checkAttend = async (channelAccessToken, userId, courseId) => {
  let orderId;
  let checkAttend;
  const userRef = db.collection(`Training Courses/${courseId}/users`);
  const snapshot = await userRef.where("userId", "==", userId).get();
  snapshot.forEach((doc) => {
    orderId = doc.id;
    checkAttend = doc.data().checkAttend;
  });

  if (checkAttend === true) {
    await push(channelAccessToken, userId, lineHelper.createTextMessage("คุณเช็คชื่อไปแล้วนะ"));
  } else {
    const editAttend = await userRef.doc(`${orderId}`).update({ checkAttend: true });
    await push(channelAccessToken, userId, lineHelper.createTextMessage("เช็คชื่อเรียบร้อย"));
  }
};
