import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getAdminApp() {
  if (getApps().length) return getApp();
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin is not configured.");
  }
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export function firebaseAdminAuth() {
  return getAuth(getAdminApp());
}

