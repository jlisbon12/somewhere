// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXI6uujJ84AyGqI7mevTt7HFcnzQJAvdY",
  authDomain: "trailblazer-5caec.firebaseapp.com",
  projectId: "trailblazer-5caec",
  storageBucket: "trailblazer-5caec.appspot.com",
  messagingSenderId: "797056958050",
  appId: "1:797056958050:web:bd525bb6553e2957d11b3b",
  measurementId: "G-N6FL0SSNHJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };
