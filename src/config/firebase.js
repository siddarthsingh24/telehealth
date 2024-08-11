import { initializeApp } from "firebase/app";
import {
	browserSessionPersistence,
	getAuth,
	setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: ""
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
setPersistence(auth, browserSessionPersistence);
export const functions = getFunctions(app);
