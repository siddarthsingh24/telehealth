import { initializeApp } from "firebase/app";
import {
	browserSessionPersistence,
	getAuth,
	setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyB8ku_G864y_TMIoryl_Ho3JsYaKBYiOds",
  authDomain: "telehealth-solution.firebaseapp.com",
  projectId: "telehealth-solution",
  storageBucket: "telehealth-solution.appspot.com",
  messagingSenderId: "997427233480",
  appId: "1:997427233480:web:df0c63eaf7b57a09915bfd",
  measurementId: "G-WL979WFDQ5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
setPersistence(auth, browserSessionPersistence);
export const functions = getFunctions(app);
