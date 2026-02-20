"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  linkWithPopup,
  signOut as firebaseSignOut,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { migrateChatsToUser } from "@/lib/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  linkWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const googleProvider = new GoogleAuthProvider();
let popupInProgress = false; // prevent double-clicking from spawning two popups

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    if (popupInProgress) return;
    popupInProgress = true;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: unknown) {
      // Ignore cancelled/closed popups — user just closed the window
      const code = (error as { code?: string })?.code;
      if (
        code !== "auth/cancelled-popup-request" &&
        code !== "auth/popup-closed-by-user"
      ) {
        throw error;
      }
    } finally {
      popupInProgress = false;
    }
  };

  const signInAsGuest = async () => {
    await signInAnonymously(auth);
  };

  const linkWithGoogle = async () => {
    if (!auth.currentUser || popupInProgress) return;
    popupInProgress = true;
    const oldUid = auth.currentUser.uid;
    try {
      const result = await linkWithPopup(auth.currentUser, googleProvider);
      setUser(result.user);
    } catch (error: unknown) {
      const code = (error as { code?: string })?.code;
      if (code === "auth/credential-already-in-use") {
        // Old anonymous user's data lives under oldUid — read it BEFORE switching
        const credential = GoogleAuthProvider.credentialFromError(error as import("firebase/auth").AuthError);
        let newUser: User | null = null;
        if (credential) {
          const result = await signInWithCredential(auth, credential);
          newUser = result.user;
        } else {
          const result = await signInWithPopup(auth, googleProvider);
          newUser = result.user;
        }
        // Migrate Firestore chats from anonymous UID → Google UID
        if (newUser && newUser.uid !== oldUid) {
          migrateChatsToUser(oldUid, newUser.uid).catch(console.error);
        }
      } else if (
        code !== "auth/cancelled-popup-request" &&
        code !== "auth/popup-closed-by-user" &&
        code !== "auth/popup-blocked"
      ) {
        throw error;
      }
    } finally {
      popupInProgress = false;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInAsGuest,
        linkWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
