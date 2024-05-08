require("dotenv").config();
const firebaseAdmin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
  "base64"
).toString("utf-8");
const serviceAccountJson = JSON.parse(serviceAccount);

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
  credential: firebaseAdmin.credential.cert(serviceAccountJson),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const auth = getAuth();
const storage = firebaseAdmin.storage();

module.exports = { auth, storage };
