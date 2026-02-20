import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FirestoreMessage {
  id: string;
  role: "user" | "lunar";
  content: string;
  timestamp: number; // epoch ms
}

export interface HydratedChat {
  id: string;
  title: string;
  messages: {
    id: string;
    role: "user" | "lunar";
    content: string;
    timestamp: Date;
  }[];
  lastModified: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getUserChatsRef(userId: string) {
  return collection(db, "users", userId, "chats");
}

/* ------------------------------------------------------------------ */
/*  Real-time subscription (onSnapshot)                                */
/* ------------------------------------------------------------------ */

export function subscribeToChatHistory(
  userId: string,
  callback: (chats: HydratedChat[]) => void,
  onError?: (error: Error) => void
) {
  const q = query(getUserChatsRef(userId), orderBy("lastModified", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const chats: HydratedChat[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: (data.chat_title as string) || "New Conversation",
          messages: ((data.messages as FirestoreMessage[]) || []).map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
          lastModified: (data.lastModified as number) || 0,
        };
      });
      callback(chats);
    },
    (error) => {
      console.error("Firestore subscription error:", error);
      onError?.(error);
    }
  );
}

/* ------------------------------------------------------------------ */
/*  Write / Update                                                     */
/* ------------------------------------------------------------------ */

export async function saveChatToFirestore(
  userId: string,
  chatId: string,
  title: string,
  messages: {
    id: string;
    role: "user" | "lunar";
    content: string;
    timestamp: Date;
  }[]
) {
  const docRef = doc(db, "users", userId, "chats", chatId);

  const firestoreMessages: FirestoreMessage[] = messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp.getTime(),
  }));

  await setDoc(
    docRef,
    {
      chat_title: title,
      messages: firestoreMessages,
      timestamp: serverTimestamp(),
      lastModified: Date.now(),
    },
    { merge: true }
  );
}

/* ------------------------------------------------------------------ */
/*  Delete                                                             */
/* ------------------------------------------------------------------ */

export async function deleteChatFromFirestore(
  userId: string,
  chatId: string
) {
  await deleteDoc(doc(db, "users", userId, "chats", chatId));
}

export async function clearTodayChatsFromFirestore(
  userId: string,
  chatIds: string[]
) {
  if (chatIds.length === 0) return;
  const batch = writeBatch(db);
  for (const id of chatIds) {
    batch.delete(doc(db, "users", userId, "chats", id));
  }
  await batch.commit();
}

/* ------------------------------------------------------------------ */
/*  One-time read (for migration between accounts)                     */
/* ------------------------------------------------------------------ */

export async function getAllChatsOnce(userId: string): Promise<HydratedChat[]> {
  const q = query(getUserChatsRef(userId), orderBy("lastModified", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: (data.chat_title as string) || "New Conversation",
      messages: ((data.messages as FirestoreMessage[]) || []).map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
      lastModified: (data.lastModified as number) || 0,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Migrate all chats from one user to another (guest → Google)        */
/* ------------------------------------------------------------------ */

export async function migrateChatsToUser(
  oldUserId: string,
  newUserId: string
) {
  const oldChats = await getAllChatsOnce(oldUserId);
  if (oldChats.length === 0) return;

  const newExisting = await getAllChatsOnce(newUserId);
  const existingIds = new Set(newExisting.map((c) => c.id));

  const writes: Promise<void>[] = [];
  for (const chat of oldChats) {
    if (!existingIds.has(chat.id)) {
      writes.push(
        saveChatToFirestore(newUserId, chat.id, chat.title, chat.messages)
      );
    }
  }

  if (writes.length > 0) {
    await Promise.all(writes);
  }
}
