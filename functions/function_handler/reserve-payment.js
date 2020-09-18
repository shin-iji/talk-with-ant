const request = require("request-promise");
const config = require("../config/config.json");
const db = require("../database/database");

module.exports = async (req, res) => {
  const url = `${config.linepay.api}/v3/payments/request`;

  const payload = {
    courseName,
    orderId,
    currency: "THB",
    confirmUrl: `${config.apiUrl}/confirmPayment`,
  };
  const headers = {
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
    .then(function (response) {
      console.log("reservePaymentServer response", JSON.stringify(response));
      if (response && response.returnCode === "0000" && response.info) {
        const data = req.body;
        const transactionId = response.info.transactionId;
        data.transactionId = transactionId;
        saveTx(orderId, data);
      }
      res.send(response);
    })
    .catch(function (err) {
      console.log("reservePaymentServer err", err);
      res.status(400).send(err);
    });
};

function saveTx(orderId, object) {
  object['lastActionDate'] = Date.now();
  const txRef = await db.collection("Transactions").doc(orderId);
  return txRef.add(object);
}
