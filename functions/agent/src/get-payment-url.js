const db = require("../../database/database");

exports.getPaymentUrl = async (orderId) => {
  const paymentUrl = [];
  const txRef = db.collection(`Transactions`);
  const snapshot = await txRef.where("orderId", "==", orderId).get();
  snapshot.forEach((doc) => {
    paymentUrl.push(doc.data().paymentUrl);
  });
  return paymentUrl[0];
};
