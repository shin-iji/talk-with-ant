const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const storage = admin.storage();

module.exports = { db, storage };
