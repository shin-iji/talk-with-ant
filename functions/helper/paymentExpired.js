const { db } = require("../database/database");

exports.paymentExpired = async () => {
  try {
    const payments = [];
    const txRef = db.collection("Transactions");
    const courseRef = db.collection("Training Courses");
    const today = Date.parse(new Date());

    await txRef
      .where("status", "==", "pending")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          let txId = doc.id;
          let userId = doc.data().userId;
          let courseName = doc.data().productName;
          let lastActionDate = doc.data().lastActionDate;
          payments.push({
            txId,
            lastActionDate,
            userId,
            courseName,
          });
        });
      });

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
      }
    }
  } catch (error) {
    console.log(error);
  }
};
