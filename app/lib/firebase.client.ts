// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  setPersistence,
  type User,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const clientAuth = getAuth(app);
const clientFirestore = getFirestore(app);
const authToRegisterUsers = getAuth(app);

function getCurrentUserAsync(): Promise<User | null> {
  return new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(clientAuth, (user: User | null) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export {
  clientAuth,
  clientFirestore,
  setPersistence,
  getCurrentUserAsync,
  browserLocalPersistence,
  browserSessionPersistence,
  authToRegisterUsers,
};
