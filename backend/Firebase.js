import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBsbtkTh4MYoWw6GD89LcO8hKGLGbgWNKw",
  authDomain: "project-1-cmpsc263.firebaseapp.com",
  projectId: "project-1-cmpsc263",
  storageBucket: "project-1-cmpsc263.firebasestorage.app",
  messagingSenderId: "785404922156",
  appId: "1:785404922156:web:19bfd2500fe8885a080489",
  measurementId: "G-518BNYMHCT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getFirestore(app);

export default app