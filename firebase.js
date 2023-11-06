import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage"

const firebaseConfig = {
   apiKey: "AIzaSyBcZoFWt1eg3fRm4Za7zXiC-BbQI4f-mQM",
   authDomain: "linkedin-26bc3.firebaseapp.com",
   projectId: "linkedin-26bc3",
   storageBucket: "linkedin-26bc3.appspot.com",
   messagingSenderId: "1018531447394",
   appId: "1:1018531447394:web:d463683942bd65b473073b"
};

// Initialize Firebase
if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig)
}

export { firebase };