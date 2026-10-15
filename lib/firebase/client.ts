import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function getFirebaseAuth() {
  if (Object.values(config).some((value) => !value)) {
    throw new Error("Firebase sign-in is not configured.");
  }
  const app = getApps().length ? getApp() : initializeApp(config);
  return getAuth(app);
}
