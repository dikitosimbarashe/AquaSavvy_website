import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBHTOa-TGZ1w17iVZyfbKKY_Ri8MAvncDI",
  authDomain: "aquasavvy-zw.firebaseapp.com",
  projectId: "aquasavvy-zw",
  storageBucket: "aquasavvy-zw.firebasestorage.app",
  messagingSenderId: "411002291633",
  appId: "1:411002291633:web:3b095983e9628d2ea42990"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const requestForToken = () => {
  const messaging = getMessaging(app);
  return getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        // Track the token -> our database
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

export const onMessageListener = () => {
  const messaging = getMessaging(app);
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });
};

export default app;
