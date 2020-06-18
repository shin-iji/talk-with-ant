const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://antv1-rkiiru.firebaseio.com"
});

const firestore = admin.firestore();
const realtimeDB = admin.database();

module.exports = {
  firestore,
  realtimeDB
};