// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const FirebaseConfig = {
  apiKey: "AIzaSyDqBCDm2HYBFO9-4hHgC4YQT-YSdccsgfA",
  authDomain: "rightchoicehotels-eb2d2.firebaseapp.com",
  projectId: "rightchoicehotels-eb2d2",
  storageBucket: "rightchoicehotels-eb2d2.firebasestorage.app",
  messagingSenderId: "912254838831",
  appId: "1:912254838831:web:7d1b322f5e2b2600223eda",
  measurementId: "G-ZNJZM9MC94"
};

// Initialize Firebase
const app = initializeApp(FirebaseConfig);
const analytics = getAnalytics(app);
export const db= getFirestore(app);