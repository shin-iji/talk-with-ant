const { db } = require("../../database/database");

exports.checkOwnerVerify = async (ownerId) => {
  try {
    const ownerRef = db.collection("Owners");
    let verify;

    await ownerRef
      .where("ownerId", "==", ownerId)
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
