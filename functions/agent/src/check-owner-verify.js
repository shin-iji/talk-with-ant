const { db } = require("../../database/database");

exports.checkOwnerVerify = async (ownerId) => {
  try {
    const ownerRef = db.collection("Owner");
    let verify;

    await ownerRef
      .where("id", "==", ownerId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          verify = doc.data().verify;
        });
      });

    return verify;
  } catch (error) {
    console.log(error);
  }
};
