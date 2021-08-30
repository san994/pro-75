import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDJKOVCipU7cZVuzPGsPsZU_KNOZ3NyoZA",
  authDomain: "e-ride-88a9d.firebaseapp.com",
  projectId: "e-ride-88a9d",
  storageBucket: "e-ride-88a9d.appspot.com",
  messagingSenderId: "1076836191092",
  appId: "1:1076836191092:web:d445bd69812ddbd263fa21"
};
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
