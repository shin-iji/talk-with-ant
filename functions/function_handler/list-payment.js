const { db } = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");
const { paymentExpired } = require("../helper/paymentExpired");

module.exports = async (agent) => {
  try {
    await paymentExpired();
    const payments = [];
    const pendingPayments = [];
    const session = agent.session;
    const userId = session.split("/")[4];
    const txRef = db.collection("Transactions");
    const snapshot = await txRef
      .where("status", "==", "pending")
      .where("userId", "==", userId)
      .get();
    snapshot.forEach((doc) => {
      let courseName = doc.data().productName;
      let amount = doc.data().amount;
      let paymentUrl = doc.data().paymentUrl;
      payments.push({ courseName, amount, paymentUrl });
    });

    payments.map((payment) => {
      pendingPayments.push(
        linePayload.listPayment(payment.courseName, payment.amount, payment.paymentUrl)
      );
    });

    if (!Array.isArray(pendingPayments) || !pendingPayments.length) {
      const payloadJson = linePayload.askTodoAnything();
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add("ไม่มีคอร์สที่ต้องจ่ายนะ");
      agent.add(payload);
    } else {
      const payloadJson = lineHelper.createFlexCarouselMessage("List Payment", pendingPayments);
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add(payload);
    }
  } catch (error) {
    console.log(error);
  }
};
