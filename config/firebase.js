require("dotenv").config();
const firebaseAdmin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");

// En teoría ya no necesitamos esto al usar la service account pero lo dejo en caso de.
// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID
// };

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    require("../c16-ronda-firebase-adminsdk-x8d6t-0a0ca75147.json")
  ),
});

const auth = getAuth();

module.exports = auth;