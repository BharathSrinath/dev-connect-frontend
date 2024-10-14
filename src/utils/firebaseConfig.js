// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdZwwJUUeHrOKK8lIfJD9-XNNqUJVOa_I",
  authDomain: "dev-connect-a3f5b.firebaseapp.com",
  projectId: "dev-connect-a3f5b",
  storageBucket: "dev-connect-a3f5b.appspot.com",
  messagingSenderId: "243382289500",
  appId: "1:243382289500:web:0962c4190582c09058d299",
  measurementId: "G-KM054J24NN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);