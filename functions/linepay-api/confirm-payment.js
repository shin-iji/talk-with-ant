const request = require("request-promise");
const lineSdk = require("@line/bot-sdk");

const config = require("../config/config.json");
const line = new lineSdk.Client(config.line);
const db = require("../database/database");
const lineHelper = require("../helper/line-helper");
const linePayload = require("../helper/payload");
const { push } = require("../helper/push");
const { sendUserInfo } = require("../helper/send-user-info");
const { getOwnerId } = require("../helper/get-owner-id");

const channelAccessToken =
  "n8oGQGp/o7wCxPkhGpCdQFzO1XJdbMIYl5nb4tq5hfDy9yPivTrjKK6ytE8yiSIONUhB1gwVy30jO6PCIVhnjNORCjUcCH05txDrn1vsfZqCsq9ENIkW1bO4QjqCFeq/14j9SWV1XCIQSICxpF6BSwdB04t89/1O/w1cDnyilFU=";

module.exports = async (req, res) => {
  //console.log(req.query.transactionId);
  //console.log(req.query.orderId);
  if (typeof req.query.transactionId === "undefined") {
    return res.send("You canceled the payment");
  } else {
    const transactionId = req.query.transactionId;
    const orderId = req.query.orderId;
    const url = `${config.linepay.api}/v2/payments/${transactionId}/confirm`;
    let data;
    getOrderInfo(orderId).then(async (orderInfo) => {
      data = orderInfo;
      let ownerId = await getOwnerId(data.productName);
      let userInfo = await sendUserInfo(data.productName, orderId);
      let body = {
        amount: data.amount,
        currency: "THB",
      };
      //console.log(data);
      //console.log(ownerId);
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
            line.pushMessage(data.userId, [
              lineHelper.createTextMessage("ชำระเงินเรียบร้อยแล้ว"),
              linePayload.successPayment(data.productName, data.amount),
            ]);
            data.status = "paid";
            saveTx(orderId, data);
            push(channelAccessToken, ownerId, userInfo);
            line.pushMessage(data.userId, linePayload.askTodoAnything());
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
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const timestamp = today.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
  object["lastActionDate"] = timestamp;
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
