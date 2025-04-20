import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const firebaseAdminConfig = {
  credential: cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
};

export function customInitApp() {
  if (getApps().length <= 0) {
    console.log("Firebase admin inicializado");
    initializeApp(firebaseAdminConfig);
  }
}

customInitApp();

const adminAuth = getAuth();
const adminFirestoreDb = getFirestore();

export { adminAuth, adminFirestoreDb  };
