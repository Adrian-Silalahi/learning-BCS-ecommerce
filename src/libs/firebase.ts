// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2cYRcRMpKOniDo2q5DTR1oMyhkLFaTWM",
  authDomain: "eccomerce-bcs.firebaseapp.com",
  projectId: "eccomerce-bcs",
  storageBucket: "eccomerce-bcs.appspot.com",
  messagingSenderId: "779034314016",
  appId: "1:779034314016:web:2a07ae2bfdcac0e9f28345"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp