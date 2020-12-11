const { db } = require("../../database/database");

exports.addOwner = async (ownerId) => {
  try {
    const ownerRef = db.collection("Owners");
    const data = {
      ownerId: ownerId,
      verify: false,
    };
    return ownerRef.doc(ownerId).set(data);
  } catch (error) {
    console.log(error);
  }
};
