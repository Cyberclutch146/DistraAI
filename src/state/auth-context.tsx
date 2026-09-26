"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

/* ── Public shape ── */

interface AuthContextValue {
  /** Currently authenticated user, or null if signed out. */
  user: User | null;
  /** True while the initial auth state is being resolved. */
  loading: boolean;
  /**
   * False when no Firebase config was present at build time. Sign-in is
   * unavailable in that case and the chat view explains why.
   */
  configured: boolean;
  /** Trigger Google sign-in popup. */
  signIn: () => Promise<void>;
  /** Sign the current user out. */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/* ── Provider ── */

const googleProvider = new GoogleAuthProvider();

const NOT_CONFIGURED =
  "Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* values to .env.local and rebuild.";

export function AuthProvider({ children }: { children: ReactNode }) {
  // Starts settled when unconfigured: there is no session to resolve, so
  // consumers must not sit on a permanent loading skeleton.
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    if (!auth) throw new Error(NOT_CONFIGURED);
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo(
    () => ({ user, loading, configured: isFirebaseConfigured, signIn, signOut }),
    [user, loading, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ── Hook ── */

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
}
