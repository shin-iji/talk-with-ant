const { db, rtDb } = require("../../database/database");

const getAllOwner = async (req, res) => {
  try {
    const ownerRef = db.collection("Owners");
    const owners = [];

    await ownerRef.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        owners.push({ ownerId: doc.data().ownerId, verify: doc.data().verify });
      });
    });

    res.json(owners);
  } catch (error) {
    console.log(error);
  }
};

const checkVerifyId = async (req, res) => {
  try {
    const { ownerId, ownerName, verifyId } = req.body;
    const ownerRef = db.collection("Owners");

    let id;
    await rtDb
      .ref("verifyId")
      .once("value")
      .then((snapshot) => {
        id = snapshot.val();
      });

    const data = {
      ownerId,
      ownerName,
      verify: true,
    };
    console.log(verifyId);
    console.log(id);
    const newVerifyId = getRandomString();

    if (String(verifyId) === String(id)) {
      await ownerRef.doc(`${ownerId}`).set(data);
      await rtDb.ref().set({ verifyId: newVerifyId });
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};
const getVerifyId = async (req, res) => {
  try {
    let id;
    await rtDb
      .ref("verifyId")
      .once("value")
      .then((snapshot) => {
        id = snapshot.val();
      });

    res.json({ verifyId: id });
  } catch (error) {
    console.log(error);
  }
};

function getRandomString() {
  var randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < 6; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

module.exports = { getVerifyId, checkVerifyId, getAllOwner };
