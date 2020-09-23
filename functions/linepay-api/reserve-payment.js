const { user } = require("firebase-functions/lib/providers/auth");
const request = require("request-promise");
const config = require("../config/config.json");
const db = require("../database/database");

const linePayload = require("../helper/payload");
const { reply } = require("../helper/reply");

exports.reservePayment = async (channelAccessToken, replyToken, courseName, amount, userId) => {
  let url = `${config.linepay.api}/v2/payments/request`;
  let orderId = await findOrderId(courseName, userId);

  let payload = {
    productName: courseName,
    amount: amount,
    orderId: orderId,
    currency: "THB",
    confirmUrl: `${config.apiUrl}`,
    langCd: "th",
    confirmUrlType: "SERVER",
  };
  //console.log(payload);
  let headers = {
    "X-LINE-ChannelId": config.linepay.channelId,
    "X-LINE-ChannelSecret": config.linepay.channelSecret,
    "Content-Type": "application/json",
  };
  request({
    method: "POST",
    uri: url,
    body: payload,
    headers,
    json: true,
  })
    .then((response) => {
      console.log("reservePayment response", JSON.stringify(response));
      if (response && response.returnCode === "0000" && response.info) {
        const data = {
          userId: userId,
          orderId: orderId,
          productName: courseName,
          amount: amount,
          currency: "THB",
        };
        const transactionId = response.info.transactionId;
        const paymentUrl = response.info.paymentUrl.web;
        data.transactionId = transactionId;
        const message = linePayload.startPayment(courseName, amount, `${paymentUrl}`);
        saveTx(orderId, data);
        return reply(channelAccessToken, replyToken, [message]);
      }
    })
    .catch((err) => {
      console.log("reservePayment err", err);
    });
};

async function saveTx(orderId, object) {
  object["lastActionDate"] = Date().toString();
  const txRef = db.collection("Transactions").doc(`${orderId}`);
  const snapshot = await txRef.set(object);
}

async function findOrderId(courseName, userId) {
  const courseId = [];
  const orderId = [];
  const courseRef = db.collection("Training Courses");
  const doc = await courseRef.where("courseName", "==", courseName).get();
  doc.forEach((doc) => {
    courseId.push(doc.id);
  });
  const userRef = db.collection(`Training Courses/wuiUz0tp8ZVlxz5eX6RN/users`);
  const snapshot = await userRef.where("userId", "==", userId).get();
  snapshot.forEach((doc) => {
    orderId.push(doc.id);
  });
  return orderId[0];
}
