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
import { getAllChatsOnce, saveChatToFirestore } from "@/lib/firestore";

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
        // ---- 1. Snapshot old chats BEFORE switching auth ----
        // Read from Firestore while still authenticated as the anonymous user
        let oldChats: { id: string; title: string; messages: { id: string; role: "user" | "lunar"; content: string; timestamp: Date }[]; lastModified: number }[] = [];
        try {
          oldChats = await getAllChatsOnce(oldUid);
        } catch {
          // Firestore read failed — fall back to localStorage
        }

        // Also grab localStorage backup (may have unsaved chats)
        try {
          const raw = localStorage.getItem("lunar-chat-history");
          if (raw) {
            const localChats = JSON.parse(raw).map((c: Record<string, unknown>) => ({
              ...c,
              messages: ((c.messages as Record<string, unknown>[]) || []).map((m: Record<string, unknown>) => ({
                ...m,
                timestamp: new Date(m.timestamp as string),
              })),
            }));
            // Merge: include any chats in localStorage not already in Firestore snapshot
            const snapshotIds = new Set(oldChats.map((c) => c.id));
            for (const lc of localChats) {
              if (!snapshotIds.has(lc.id)) oldChats.push(lc);
            }
          }
        } catch { /* localStorage parse error */ }

        // ---- 2. Switch to the existing Google account ----
        const credential = GoogleAuthProvider.credentialFromError(error as import("firebase/auth").AuthError);
        let newUser: User | null = null;
        if (credential) {
          const result = await signInWithCredential(auth, credential);
          newUser = result.user;
        } else {
          const result = await signInWithPopup(auth, googleProvider);
          newUser = result.user;
        }

        // ---- 3. Migrate old chats to the Google user's Firestore ----
        if (newUser && newUser.uid !== oldUid && oldChats.length > 0) {
          try {
            const existingChats = await getAllChatsOnce(newUser.uid);
            const existingIds = new Set(existingChats.map((c) => c.id));
            const toMigrate = oldChats.filter((c) => !existingIds.has(c.id));
            if (toMigrate.length > 0) {
              await Promise.all(
                toMigrate.map((chat) =>
                  saveChatToFirestore(newUser!.uid, chat.id, chat.title || "Imported Chat", chat.messages)
                )
              );
            }
          } catch (err) {
            console.error("Chat migration to Google account failed:", err);
          }
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
