const db = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");

module.exports = async (agent) => {
  try {
    const payments = [];
    const txRef = db.collection("Transactions");
    const snapshot = await txRef.where("status", "==", "not paid").get();
    snapshot.forEach((doc) => {
      let courseName = doc.data().productName;
      let amount = doc.data().amount;
      let paymentUrl = doc.data().paymentUrl;
      payments.push(linePayload.listPayment(courseName, amount, paymentUrl));
    });

    if (!Array.isArray(payments) || !payments.length) {
      agent.add("ไม่มีคอร์สที่ต้องจ่ายจ้า");
    } else {
      const payloadJson = lineHelper.createFlexCarouselMessage("List Payment", payments);
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add(payload);
    }
  } catch (error) {
    console.log(error);
  }
};
