const channelAccessToken =
  "Vu77dg2yeZmRwqJVjFpjXNGNMioOULYF6Qr9rXoNKLdHbCehW8Zlhdm4G9rpa5DYl4+kEjJXUVJCJOYsGehD+SNZBjR1gEAWltUjPEB6lL1i4T0ZNLilN85JSO92C22IBVVsnSQ7IxuYbWqQQMOUPwdB04t89/1O/w1cDnyilFU=";

const request = require("request-promise");
const config = require("../config/config.json");
const { db } = require("../database/database");

const linePayload = require("../helper/payload");
const { push } = require("../helper/push");

exports.reservePayment = async (courseName, amount, orderId, userId) => {
  let url = `${config.linepay.api}/v2/payments/request`;
  let payload = {
    productName: courseName,
    amount: amount,
    orderId: orderId,
    currency: "THB",
    confirmUrl: `${config.apiUrl}`,
    //confirmUrl: `https://9922a19c6a3f.ngrok.io/confirmPayment`,
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
        const paymentUrl = response.info.paymentUrl.web;
        const data = {
          userId: userId,
          orderId: orderId,
          productName: courseName,
          amount: amount,
          currency: "THB",
          status: "pending",
          paymentUrl: paymentUrl,
        };
        const transactionId = response.info.transactionId;
        data.transactionId = transactionId;
        saveTx(orderId, data);
        const payloadJson = linePayload.checkReadyPayment(courseName, orderId, amount);
        push(channelAccessToken, userId, payloadJson);
      }
    })
    .catch((err) => {
      console.log("reservePayment err", err);
    });
};

async function saveTx(orderId, object) {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const timestamp = today.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
  object["lastActionDate"] = timestamp;
  const txRef = db.collection("Transactions").doc(`${orderId}`);
  const snapshot = await txRef.set(object);
}
