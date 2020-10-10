const db = require("../../database/database");

exports.getPaymentUrl = async (courseName) => {
  const paymentUrl = [];
  const txRef = db.collection(`Transactions/${txId}`);
  const snapshot = await txRef.where("courseName", "==", courseName).get();
  snapshot.forEach((doc) => {
    paymentUrl.push(doc.data().paymentUrl);
  });
  return paymentUrl[0];
};
