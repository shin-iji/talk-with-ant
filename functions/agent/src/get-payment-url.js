const db = require("../../database/database");

exports.getPaymentUrl = async (orderId) => {
  let paymentUrl;
  const txRef = db.collection(`Transactions`);
  const snapshot = await txRef.where("orderId", "==", orderId).get();
  snapshot.forEach((doc) => {
    paymentUrl = doc.data().paymentUrl;
  });
  return paymentUrl;
};
