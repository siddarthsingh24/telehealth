import { initializeApp } from "firebase/app";
import {browserLocalPersistence, getAuth, setPersistence} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
const firebaseConfig = {
  apiKey: "AIzaSyDlVwbigwbIC1vjRwbII9Jz8_RR0YvZ4NE",
  authDomain: "telehealth-f8a5b.firebaseapp.com",
  projectId: "telehealth-f8a5b",
  storageBucket: "telehealth-f8a5b.appspot.com",
  messagingSenderId: "1096800886189",
  appId: "1:1096800886189:web:14dbf27f7aba254c741524"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
setPersistence(auth,browserLocalPersistence)
export const functions = getFunctions(app);