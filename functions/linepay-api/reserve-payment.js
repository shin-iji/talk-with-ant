const request = require("request-promise");
const config = require("../config/config.json");
const db = require("../database/database");

const linePayload = require("../helper/payload");
const { push } = require("../helper/push");

exports.reservePayment = async (courseName, amount, orderId, userId) => {
  let url = `${config.linepay.api}/v2/payments/request`;
  let payload = {
    productName: courseName,
    amount: amount,
    orderId: orderId,
    currency: "THB",
    //confirmUrl: `${config.apiUrl}`,
    confirmUrl: `https://49a2b230491d.ngrok.io/antv2-xdbgna/us-central1/confirmPayment`,
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
          status: "not paid",
          paymentUrl: paymentUrl,
        };
        const transactionId = response.info.transactionId;
        data.transactionId = transactionId;
        saveTx(orderId, data);
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
