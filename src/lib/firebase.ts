/**
 * Firebase client SDK — singleton initialization.
 *
 * All Firebase credentials are read from NEXT_PUBLIC_ env vars so they
 * are inlined into the client bundle at build time.  Never import this
 * file on the server; it's client-only.
 *
 * The SDK is initialised defensively: `getAuth()` throws synchronously
 * when the config has no `apiKey`, and because this module is imported
 * by AuthProvider in the root layout, an unguarded throw would turn a
 * missing `.env.local` into a 500 on every route in the app. So when the
 * config is incomplete we export `null` handles instead, and consumers
 * degrade to a signed-out state rather than crashing.
 */

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import {
  getFirestore,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * True when enough config is present to talk to Firebase. `apiKey` is the
 * value `getAuth()` validates, so it gates the whole realtime path.
 *
 * `NEXT_PUBLIC_` values are inlined at build time, so a missing value here
 * means the app was built without a `.env.local` (or before it was added).
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) return getApps()[0];
  return initializeApp(firebaseConfig);
}

export const app: FirebaseApp | null = isFirebaseConfigured
  ? getFirebaseApp()
  : null;

export const auth: Auth | null = app ? getAuth(app) : null;

export const db: Firestore | null = app ? getFirestore(app) : null;
