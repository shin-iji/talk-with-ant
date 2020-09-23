const request = require("request-promise");
const config = require("../config/config.json");
const db = require("../database/database");
const lineSdk = require("@line/bot-sdk");
const line = new lineSdk.Client(config.line);
const lineHelper = require("../helper/line-helper");
const linePayload = require("../helper/payload");

module.exports = async (req, res) => {
  console.log(req.query.transactionId);
  console.log(req.query.orderId);
  if (typeof req.query.transactionId === "undefined") {
    return res.send("You canceled the payment");
  } else {
    const transactionId = req.query.transactionId;
    const orderId = req.query.orderId;
    const url = `${config.linepay.api}/v2/payments/${transactionId}/confirm`;
    let data;
    getOrderInfo(orderId).then(async (orderInfo) => {
      data = orderInfo;
      let body = {
        amount: data.amount,
        currency: "THB",
      };
      console.log(data);
      const headers = {
        "X-LINE-ChannelId": config.linepay.channelId,
        "X-LINE-ChannelSecret": config.linepay.channelSecret,
        "Content-Type": "application/json",
      };
      request({
        method: "POST",
        uri: url,
        body: body,
        headers,
        json: true,
      })
        .then((response) => {
          console.log("confirmPayment response", JSON.stringify(response));
          if (response && response.returnCode === "0000" && response.info) {
            data.status = "paid";
            saveTx(orderId, data);
            line.pushMessage(data.userId, lineHelper.createTextMessage("รับชำระเงินเรียบร้อยแล้ว"));
            line.pushMessage(
              data.userId,
              linePayload.successPayment(data.productName, data.amount)
            );
          }
          res.send(response);
        })
        .catch((err) => {
          console.log("confirmPayment err", err);
          res.status(400).send(err);
        });
    });
  }
};

async function saveTx(orderId, object) {
  object["lastActionDate"] = Date().toString();
  const txRef = db.collection("Transactions").doc(`${orderId}`);
  const snapshot = await txRef.set(object);
}

async function getOrderInfo(orderId) {
  let list = [];
  const txRef = db.collection("Transactions").doc(`${orderId}`);
  const doc = await txRef.get();
  list.push({
    userId: doc.data().userId,
    amount: doc.data().amount,
    orderId: doc.data().orderId,
    productName: doc.data().productName,
    currency: doc.data().currency,
    transactionId: doc.data().transactionId,
  });

  return list[0];
}
