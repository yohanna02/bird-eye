import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebaseConfig";

export const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app);

export const store = getFirestore(app);
export const storage = getStorage(app);