const { db } = require("../database/database");
const { Payload } = require("dialogflow-fulfillment");
const linePayload = require("../helper/payload");
const lineHelper = require("../helper/line-helper");
const { user } = require("firebase-functions/lib/providers/auth");

module.exports = async (agent) => {
  try {
    const payments = [];
    const pendingPayments = [];
    const txRef = db.collection("Transactions");
    const today = Date.parse(new Date());
    const snapshot = await txRef.where("status", "==", "pending").get();
    snapshot.forEach((doc) => {
      let txId = doc.id;
      let userId = doc.data().userId;
      let courseName = doc.data().productName;
      let amount = doc.data().amount;
      let paymentUrl = doc.data().paymentUrl;
      let lastActionDate = doc.data().lastActionDate;
      payments.push({ txId, courseName, userId, amount, paymentUrl, lastActionDate });
    });

    const courseRef = db.collection("Training Courses");

    for (let i = 0; i < payments.length; i++) {
      const payment = payments[i];
      if (Date.parse(payment.lastActionDate) + 86400000 < today) {
        await txRef.doc(`${payment.txId}`).update({ status: "expired" });
        let courseId;
        let avaiPar;
        let userDocId;
        await courseRef
          .where("courseName", "==", payment.courseName)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              courseId = doc.id;
              avaiPar = doc.data().avaiPar;
            });
          });
        //console.log(courseId);
        //console.log(avaiPar);

        await courseRef
          .doc(`${courseId}`)
          .collection("users")
          .where("userId", "==", payment.userId)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              userDocId = doc.id;
            });
          });
        //console.log(userDocId);
        await courseRef.doc(`${courseId}`).update({ avaiPar: avaiPar + 1 });
        await courseRef.doc(`${courseId}`).collection("users").doc(`${userDocId}`).delete();
        continue;
      } else {
        pendingPayments.push(
          linePayload.listPayment(payment.courseName, payment.amount, payment.paymentUrl)
        );
      }
    }

    if (!Array.isArray(pendingPayments) || !pendingPayments.length) {
      agent.add("ไม่มีคอร์สที่ต้องจ่ายจ้า");
    } else {
      const payloadJson = lineHelper.createFlexCarouselMessage("List Payment", pendingPayments);
      let payload = new Payload(`LINE`, payloadJson, { sendAsMessage: true });
      agent.add(payload);
    }
  } catch (error) {
    console.log(error);
  }
};
