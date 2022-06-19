import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDqMTM9cCeKohz0VqvI4QqWqj0Hcd5KLfc",
  authDomain: "chaty-ac398.firebaseapp.com",
  projectId: "chaty-ac398",
  storageBucket: "chaty-ac398.appspot.com",
  messagingSenderId: "211951345672",
  appId: "1:211951345672:web:fe842bf06bf426945831bd",
  measurementId: "G-4CXQE53JYK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

export { auth, db };
