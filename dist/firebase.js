"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessageListener = exports.requestForToken = exports.db = exports.auth = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const messaging_1 = require("firebase/messaging");
const firebaseConfig = {
    apiKey: "AIzaSyBHTOa-TGZ1w17iVZyfbKKY_Ri8MAvncDI",
    authDomain: "aquasavvy-zw.firebaseapp.com",
    projectId: "aquasavvy-zw",
    storageBucket: "aquasavvy-zw.firebasestorage.app",
    messagingSenderId: "411002291633",
    appId: "1:411002291633:web:3b095983e9628d2ea42990"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)(app);
exports.db = (0, firestore_1.getFirestore)(app);
const requestForToken = () => {
    const messaging = (0, messaging_1.getMessaging)(app);
    return (0, messaging_1.getToken)(messaging, { vapidKey: 'YOUR_VAPID_KEY' })
        .then((currentToken) => {
        if (currentToken) {
            console.log('current token for client: ', currentToken);
            // Track the token -> our database
        }
        else {
            console.log('No registration token available. Request permission to generate one.');
        }
    })
        .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
};
exports.requestForToken = requestForToken;
const onMessageListener = () => {
    const messaging = (0, messaging_1.getMessaging)(app);
    return new Promise((resolve) => {
        (0, messaging_1.onMessage)(messaging, (payload) => {
            console.log("payload", payload);
            resolve(payload);
        });
    });
};
exports.onMessageListener = onMessageListener;
exports.default = app;
//# sourceMappingURL=firebase.js.map