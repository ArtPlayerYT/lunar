"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp, Menu, ChevronLeft, PlusCircle, Trash2, X, LogIn } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { LunarLogo } from "@/components/ui/lunar-logo";
import { useAuth } from "@/lib/auth-context";
import {
  subscribeToChatHistory,
  saveChatToFirestore,
  deleteChatFromFirestore,
  clearTodayChatsFromFirestore,
} from "@/lib/firestore";

interface Message {
  id: string;
  role: "user" | "lunar";
  content: string;
  timestamp: Date;
}

const LOCALSTORAGE_KEY = "lunar_chat_history";

// Spring config for snappy animations
const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };

// Ghost-text suggestions for predictive UX
const GHOST_SUGGESTIONS = [
  "Current position of Mars?",
  "Explain dark energy in simple terms...",
  "Calculate escape velocity from Europa",
  "What causes a neutron star to spin?",
  "Hubble vs JWST — key differences",
  "How do gravitational waves propagate?",
];

// Quick-link starter cards
const QUICK_LINKS = [
  { icon: "🔭", label: "Stellar Anomaly", query: "Analyze the latest stellar anomaly detected by JWST" },
  { icon: "🪐", label: "Mars Trajectory", query: "What is the current orbital trajectory of Mars relative to Earth?" },
  { icon: "⚛️", label: "Quantum Tunneling", query: "Explain quantum tunneling and its role in stellar fusion" },
  { icon: "🌌", label: "Dark Matter", query: "What is the current scientific understanding of dark matter composition?" },
];

export function ChatInterface() {
  const shouldReduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "lunar",
      content: "The void is silent. What seek you from the stars?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id: string; title: string; messages: Message[]; lastModified: number }[]>([]);
  const [currentId, setCurrentId] = useState<string>("");
  const [firestoreError, setFirestoreError] = useState<string | null>(null);
  const [ghostIndex, setGhostIndex] = useState(0);
  const [showMobileAuth, setShowMobileAuth] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const router = useRouter();
  const { user, loading: authLoading, signInWithGoogle, signInAsGuest, linkWithGoogle, signOut } = useAuth();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMigrated = useRef(false);

  // Cycle ghost-text suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setGhostIndex((prev) => (prev + 1) % GHOST_SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Open sidebar by default on desktop, closed on mobile
  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 768);
  }, []);

  // Swipe-to-open sidebar gesture (mobile)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
    // Swipe right from left edge to open sidebar
    if (deltaX > 80 && deltaY < 80 && touchStartRef.current.x < 40 && !isSidebarOpen) {
      setSidebarOpen(true);
    }
    // Swipe left to close sidebar
    if (deltaX < -80 && deltaY < 80 && isSidebarOpen) {
      setSidebarOpen(false);
    }
    touchStartRef.current = null;
  }, [isSidebarOpen]);

  // Initialize unique ID for the current session if not already set
  useEffect(() => {
    if (!currentId) {
      setCurrentId(generateId());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function deriveTitle(msgs: Message[]): string {
    const first = msgs.find((m) => m.role === "user");
    return first ? first.content.slice(0, 30) + "..." : "New Conversation";
  }

  // ---- Helper: load history from localStorage ----
  function loadFromLocalStorage() {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return parsed.map((chat: Record<string, unknown>) => ({
        ...chat,
        messages: ((chat.messages as Record<string, unknown>[]) || []).map((msg: Record<string, unknown>) => ({
          ...msg,
          timestamp: new Date(msg.timestamp as string),
        })),
      }));
    } catch {
      return [];
    }
  }

  // ---- Helper: save history array to localStorage backup ----
  function backupToLocalStorage(chats: { id: string; title: string; messages: Message[]; lastModified: number }[]) {
    try { localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(chats)); } catch { /* quota */ }
  }

  // ---- History: Firestore (signed in) or localStorage (signed out) ----
  useEffect(() => {
    if (authLoading) return;

    // Always start by loading localStorage (instant, always available)
    const localChats = loadFromLocalStorage();
    if (localChats.length > 0) {
      setHistory(localChats);
    }

    // SIGNED IN — subscribe to Firestore, merge with local
    if (user) {
      setFirestoreError(null);
      const unsubscribe = subscribeToChatHistory(
        user.uid,
        (firestoreChats) => {
          setFirestoreError(null);

          // Merge: Firestore is source of truth, but include any local-only chats
          const firestoreIds = new Set(firestoreChats.map((c) => c.id));
          const localOnly = localChats.filter((c: { id: string }) => !firestoreIds.has(c.id));

          // If there are local-only chats, push them to Firestore (migration)
          if (localOnly.length > 0 && !hasMigrated.current) {
            hasMigrated.current = true;
            const writes: Promise<void>[] = [];
            for (const chat of localOnly) {
              writes.push(
                saveChatToFirestore(
                  user.uid,
                  chat.id,
                  chat.title || "Imported Chat",
                  chat.messages
                )
              );
            }
            Promise.all(writes).catch((err) => {
              console.error("Migration to Firestore failed:", err);
              hasMigrated.current = false; // retry next time
            });
          } else if (!hasMigrated.current) {
            hasMigrated.current = true;
          }

          // Use Firestore data as source of truth
          setHistory(firestoreChats);

          // Mirror to localStorage as backup
          backupToLocalStorage(firestoreChats);
        },
        // If Firestore fails, keep using whatever we loaded from localStorage
        (err) => {
          console.error("Firestore subscription failed:", err);
          setFirestoreError("Cloud sync unavailable — using local backup. Check Firestore rules.");
          // localChats already loaded above, nothing more to do
        }
      );
      return () => unsubscribe();
    }

    // SIGNED OUT — already loaded from localStorage above
  }, [user, authLoading]);

  // ---- Save: Firestore + localStorage backup (signed in) or localStorage only (signed out) ----
  useEffect(() => {
    if (authLoading) return;
    if (messages.length <= 1 && messages[0].role === "lunar") return;

    const title = deriveTitle(messages);

    // Always save to localStorage as backup
    setHistory((prev) => {
      const existingIndex = prev.findIndex((chat) => chat.id === currentId);
      const updatedChat = { id: currentId, title, messages, lastModified: Date.now() };
      let newHistory;
      if (existingIndex >= 0) {
        newHistory = [...prev];
        newHistory[existingIndex] = updatedChat;
      } else {
        newHistory = [updatedChat, ...prev];
      }
      backupToLocalStorage(newHistory);
      return newHistory;
    });

    // Also save to Firestore if signed in (debounced)
    if (user) {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveChatToFirestore(user.uid, currentId, title, messages).catch(
          console.error
        );
        saveTimerRef.current = null;
      }, 800);
      return () => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      };
    }
  }, [messages, currentId, user, authLoading]);

  // Auto-scroll: instant during streaming for reliability, smooth otherwise
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: isProcessing ? "instant" : "smooth",
      });
    }
  }, [messages, isProcessing, error]);

  function generateId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  const flushPendingSave = () => {
    if (saveTimerRef.current && user && messages.length > 1) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
      const title = deriveTitle(messages);
      saveChatToFirestore(user.uid, currentId, title, messages).catch(console.error);
    }
  };

  const loadConversation = (id: string) => {
    flushPendingSave();
    const conversation = history.find((chat) => chat.id === id);
    if (conversation) {
      setCurrentId(conversation.id);
      setMessages(conversation.messages);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null); // Clear previous errors
    setIsProcessing(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role === "lunar" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to connect to the void.");
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const assistantMessageId = generateId();
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "lunar",
          content: "",
          timestamp: new Date(),
        },
      ]);

      const decoder = new TextDecoder();
      let done = false;
      let sseBuffer = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        sseBuffer += decoder.decode(value, { stream: true });

        // Split on newlines but keep the last (potentially incomplete) segment as buffer
        const segments = sseBuffer.split('\n');
        sseBuffer = segments.pop() || '';

        for (const line of segments) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') { done = true; break; }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + content }
                      : msg
                  )
                );
              }
            } catch {
              // Incomplete JSON — will be reassembled in next chunk
            }
          }
        }
      }

      // Process any remaining data left in the buffer
      if (sseBuffer.trim().startsWith('data: ')) {
        const data = sseBuffer.trim().slice(6);
        if (data && data !== '[DONE]') {
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + content }
                    : msg
                )
              );
            }
          } catch {
            // Final buffer wasn't valid
          }
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error("Transmission error:", err);
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetConversation = () => {
    flushPendingSave();
    const newId = generateId();
    setCurrentId(newId);
    setMessages([
        {
          id: generateId(),
          role: "lunar",
          content: "The void is silent. What seek you from the stars?",
          timestamp: new Date(),
        },
    ]);
    setInput("");
    setError(null);
    setIsProcessing(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleExit = async () => {
    flushPendingSave();
    setIsExiting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push('/');
  };

  const handleDeleteChat = (id: string) => {
    if (user) {
      deleteChatFromFirestore(user.uid, id).catch(console.error);
    }
    // Always update localStorage backup
    setHistory((prev) => {
      const newHistory = prev.filter((chat) => chat.id !== id);
      backupToLocalStorage(newHistory);
      return newHistory;
    });
    if (id === currentId) {
      handleResetConversation();
    }
  };

  const handleClearAll = () => {
    const todayIds = todayHistory.map((c) => c.id);
    const todayIdSet = new Set(todayIds);
    if (user) {
      clearTodayChatsFromFirestore(user.uid, todayIds).catch(console.error);
    }
    // Always update localStorage backup
    setHistory((prev) => {
      const newHistory = prev.filter((chat) => !todayIdSet.has(chat.id));
      backupToLocalStorage(newHistory);
      return newHistory;
    });
    if (todayIdSet.has(currentId)) {
      handleResetConversation();
    }
    setShowClearModal(false);
  };

  // Filter history for "Today" and "Older"
  const todayHistory = history.filter(chat => {
    const chatDate = new Date(chat.lastModified);
    const today = new Date();
    return chatDate.getDate() === today.getDate() &&
           chatDate.getMonth() === today.getMonth() &&
           chatDate.getFullYear() === today.getFullYear();
  });

  const olderHistory = history.filter(chat => {
    const chatDate = new Date(chat.lastModified);
    const today = new Date();
    return !(chatDate.getDate() === today.getDate() &&
             chatDate.getMonth() === today.getMonth() &&
             chatDate.getFullYear() === today.getFullYear());
  });

  return (
    <div
      className="flex w-full h-full relative overflow-hidden bg-black/20 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white/5"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
       {/* Clear All Confirmation Modal */}
       <AnimatePresence>
         {showClearModal && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center"
              style={{ willChange: "opacity" }}
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setShowClearModal(false)}
              />
              {/* Modal Card */}
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={shouldReduceMotion ? { duration: 0 } : springTransition}
                className="relative z-10 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl"
                style={{ willChange: "transform, opacity" }}
              >
                <h3 className="text-sm font-medium text-white mb-2 tracking-wide">Clear Today&apos;s Logs</h3>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed font-light">
                  This will permanently erase all conversations from today. This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowClearModal(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </m.div>
            </m.div>
         )}
       </AnimatePresence>

       {/* Exit Transition Overlay */}
       <AnimatePresence>
            {isExiting && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 z-[100] bg-true-black pointer-events-none"
                    style={{ willChange: "opacity" }}
                />
            )}
       </AnimatePresence>

      {/* Sidebar: Memory Logs — Desktop: side panel / Mobile: slide-in overlay */}
      <AnimatePresence mode="wait">
          {isSidebarOpen && (
              <>
                {/* Mobile backdrop overlay */}
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[49] bg-black/60 backdrop-blur-sm md:hidden"
                  onClick={() => setSidebarOpen(false)}
                />
                <m.div
                   initial={{ x: -280, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   exit={{ x: -280, opacity: 0 }}
                   transition={shouldReduceMotion ? { duration: 0 } : springTransition}
                   className={cn(
                     "flex flex-col border-r border-white/5 bg-black/95 md:bg-black/40 h-full backdrop-blur-xl md:backdrop-blur-md overflow-hidden relative z-50 w-[280px] flex-shrink-0",
                     /* Mobile: fixed overlay; Desktop: normal sidebar flow */
                     "fixed md:relative top-0 left-0 bottom-0"
                   )}
                   style={{ willChange: "transform, opacity" }}
               >
                  {/* Mobile close button */}
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-3 right-3 z-10 flex md:hidden items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    aria-label="Close sidebar"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="p-4 border-b border-white/5 space-y-2">
                       <button onClick={handleExit} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group w-full text-left min-h-[44px] md:min-h-0">
                            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Home</span>
                       </button>
                       <button 
                            onClick={handleResetConversation}
                            className="w-full flex items-center gap-2 px-3 py-2.5 md:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5 hover:border-white/10 group min-h-[44px] md:min-h-0"
                        >
                            <PlusCircle className="w-4 h-4 text-nebula-violet group-hover:rotate-90 transition-transform" />
                            <span className="text-xs font-medium tracking-wide">New Chat</span>
                       </button>
                  </div>

                  {/* Auth Section */}
                  <div className="p-4 border-b border-white/5 space-y-3">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 min-h-[44px]">
                            {user.photoURL ? (
                              // eslint-disable-next-line @next/next/no-img-element -- external auth avatar URL
                              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full ring-1 ring-white/10" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nebula-violet to-blue-600 ring-1 ring-white/10" />
                            )}
                            <div className="flex flex-col">
                                <span className="text-xs text-white font-medium" style={{ lineHeight: '1.5' }}>
                                  {user.isAnonymous ? "Guest Explorer" : (user.displayName || "Commander")}
                                </span>
                                <span className="text-[10px] text-gray-500" style={{ lineHeight: '1.5' }}>
                                  {user.isAnonymous ? "Temporary Access" : "Full Access"}
                                </span>
                            </div>
                        </div>
                        {user.isAnonymous && (
                          <button
                            onClick={() => linkWithGoogle().catch(console.error)}
                            className="w-full text-xs md:text-[10px] text-center py-2.5 md:py-1.5 rounded-lg border border-white/15 text-gray-400 hover:text-white hover:border-white/25 hover:shadow-[0_0_12px_rgba(255,255,255,0.06)] transition-all min-h-[44px] md:min-h-0"
                          >
                            Link Google Account
                          </button>
                        )}
                        <button
                          onClick={() => {
                            signOut();
                            setHistory([]);
                            hasMigrated.current = false;
                            handleResetConversation();
                          }}
                          className="w-full text-xs md:text-[10px] text-center py-2.5 md:py-1.5 rounded-lg text-gray-600 hover:text-red-400 transition-colors min-h-[44px] md:min-h-0"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        <button
                          onClick={signInWithGoogle}
                          className="w-full flex items-center justify-center gap-2 px-3 py-3 md:py-2 rounded-lg bg-white text-black text-xs md:text-[11px] font-medium hover:bg-white/90 active:bg-white/80 transition-all min-h-[44px] shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                        >
                          <svg className="w-4 h-4 md:w-3.5 md:h-3.5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                          Sign in with Google
                        </button>
                        <button
                          onClick={signInAsGuest}
                          className="w-full flex items-center justify-center gap-2 px-3 py-3 md:py-2 rounded-lg border border-white/15 text-xs md:text-[11px] text-gray-400 hover:text-white hover:border-white/25 hover:bg-white/5 active:bg-white/10 transition-all min-h-[44px] shadow-[0_0_12px_rgba(255,255,255,0.06)] hover:shadow-[0_0_18px_rgba(255,255,255,0.1)]"
                        >
                          <span className="text-sm">👤</span>
                          Login as Guest
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                      <span className="text-xs font-display tracking-widest text-gray-500 uppercase">Memory Logs</span>
                  </div>

                  {firestoreError && (
                    <div className="mx-4 mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-[10px] text-amber-400 leading-relaxed">
                        {firestoreError}
                      </p>
                    </div>
                  )}

                  <div className="p-4 flex-1 overflow-y-auto w-full no-scrollbar">
                      {/* Today */}
                      {todayHistory.length > 0 && (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 font-mono">TODAY</span>
                            <button
                              onClick={() => setShowClearModal(true)}
                              className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors tracking-wide min-h-[44px] md:min-h-0 flex items-center"
                            >
                              Clear All
                            </button>
                          </div>
                          <AnimatePresence mode="popLayout">
                            {todayHistory.map((chat) => (
                              <m.div
                                key={chat.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scaleY: 0 }}
                                transition={{ duration: 0.2 }}
                                onMouseEnter={() => setHoveredChatId(chat.id)}
                                onMouseLeave={() => setHoveredChatId(null)}
                                style={{ transformOrigin: "top", willChange: "transform, opacity" }}
                              >
                                <div
                                  onClick={() => loadConversation(chat.id)}
                                  className={cn(
                                    "flex items-center justify-between p-2.5 md:p-2 rounded-lg text-xs mb-1 cursor-pointer transition-colors group min-h-[44px] md:min-h-0",
                                    currentId === chat.id
                                      ? "bg-white/10 text-white"
                                      : "bg-transparent text-gray-400 hover:bg-white/5"
                                  )}
                                >
                                  <span className="truncate flex-1 mr-2">{chat.title}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteChat(chat.id);
                                    }}
                                    className={cn(
                                      "p-1.5 md:p-1 rounded-md text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all flex-shrink-0",
                                      /* Always show on mobile (no hover), hover-reveal on desktop */
                                      "opacity-100 md:opacity-0",
                                      hoveredChatId === chat.id && "md:opacity-100"
                                    )}
                                    title="Delete chat"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 md:w-3 md:h-3" />
                                  </button>
                                </div>
                              </m.div>
                            ))}
                          </AnimatePresence>
                        </>
                      )}

                      {/* Older */}
                      {olderHistory.length > 0 && (
                        <>
                          <div className="flex items-center justify-between mb-2 mt-4">
                            <span className="text-xs text-gray-500 font-mono">PREVIOUS</span>
                          </div>
                          <AnimatePresence mode="popLayout">
                            {olderHistory.map((chat) => (
                              <m.div
                                key={chat.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scaleY: 0 }}
                                transition={{ duration: 0.2 }}
                                onMouseEnter={() => setHoveredChatId(chat.id)}
                                onMouseLeave={() => setHoveredChatId(null)}
                                style={{ transformOrigin: "top", willChange: "transform, opacity" }}
                              >
                                <div
                                  onClick={() => loadConversation(chat.id)}
                                  className={cn(
                                    "flex items-center justify-between p-2.5 md:p-2 rounded-lg text-xs mb-1 cursor-pointer transition-colors group min-h-[44px] md:min-h-0",
                                    currentId === chat.id
                                      ? "bg-white/10 text-white"
                                      : "bg-transparent text-gray-400 hover:bg-white/5"
                                  )}
                                >
                                  <span className="truncate flex-1 mr-2">{chat.title}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteChat(chat.id);
                                    }}
                                    className={cn(
                                      "p-1.5 md:p-1 rounded-md text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all flex-shrink-0",
                                      "opacity-100 md:opacity-0",
                                      hoveredChatId === chat.id && "md:opacity-100"
                                    )}
                                    title="Delete chat"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 md:w-3 md:h-3" />
                                  </button>
                                </div>
                              </m.div>
                            ))}
                          </AnimatePresence>
                        </>
                      )}

                      {todayHistory.length === 0 && olderHistory.length === 0 && (
                        <div className="text-xs text-gray-600 italic px-2 font-light tracking-wide">
                          No recent communes
                        </div>
                      )}
                  </div>
              </m.div>
              </>
          )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full">
        {/* Toggle Sidebar Button (visible on both mobile and desktop when sidebar is closed) */}
        {!isSidebarOpen && (
             <button onClick={() => setSidebarOpen(true)} className="absolute top-4 left-4 z-30 text-gray-500 hover:text-white transition-colors p-2.5 md:p-2 rounded-full bg-black/40 border border-white/5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center">
                <Menu className="w-5 h-5 md:w-4 md:h-4" />
             </button>
        )}

        {/* SYSTEM ONLINE Indicator */}
        <div className="flex items-center justify-center gap-2 py-3 border-b border-white/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-mono text-emerald-400/70 tracking-[0.3em] uppercase">SYSTEM ONLINE</span>
        </div>

        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 md:px-20 py-6 md:py-8 no-scrollbar scroll-smooth"
        >
            <div className="max-w-3xl mx-auto space-y-8 md:space-y-12 pb-36 md:pb-32">

            {/* Quick-Link Starter Cards */}
            {messages.length === 1 && messages[0].role === "lunar" && !isProcessing && (
              <m.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto"
              >
                {QUICK_LINKS.map((link, i) => (
                  <m.button
                    key={link.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setInput(link.query);
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        if (form) form.requestSubmit();
                      }, 50);
                    }}
                    className="group flex items-start gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.05] transition-all text-left cursor-pointer"
                  >
                    <span className="text-lg mt-0.5">{link.icon}</span>
                    <div>
                      <p className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">{link.label}</p>
                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed line-clamp-2">{link.query}</p>
                    </div>
                  </m.button>
                ))}
              </m.div>
            )}

            {messages.map((msg, idx) => (
                <m.div
                 key={msg.id}
                 initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={springTransition}
                 className={cn(
                     "flex gap-3 md:gap-6",
                     msg.role === "user" ? "justify-end" : "justify-start"
                 )}
                 style={{ willChange: "transform, opacity" }}
                 >
                {msg.role === "lunar" && (
                    <div className="flex-shrink-0 mt-1 overflow-visible pl-1 ml-1">
                         {/* Pulse Logo if processing AND last message, else static Logo */}
                         <LunarLogo 
                            className="w-7 h-7 md:w-10 md:h-10" 
                            isThinking={isProcessing && idx === messages.length - 1}
                        />
                    </div>
                )}

                <div
                    className={cn(
                    "relative p-3 md:p-6 rounded-2xl max-w-[90%] md:max-w-[75%] leading-relaxed tracking-wide font-light shadow-2xl backdrop-blur-md",
                    msg.role === "user"
                        ? "bg-white/10 text-white border border-white/10 rounded-tr-sm"
                        : "bg-black/40 text-gray-100 border border-white/5 rounded-tl-sm"
                    )}
                    style={{ fontSize: "clamp(0.8125rem, 2vw, 1rem)", lineHeight: '1.6', overflowWrap: 'break-word', wordBreak: 'break-word' }}
                >
                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5">
                      <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                      >
                          {msg.content}
                      </ReactMarkdown>
                    </div>
                </div>
                </m.div>
            ))}
            {isProcessing && (
                 <m.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 md:gap-6 justify-start opacity-70"
                 >
                     <div className="flex-shrink-0 mt-1 overflow-visible pl-1 ml-1">
                         <LunarLogo className="w-7 h-7 md:w-10 md:h-10" isThinking={true} />
                     </div>
                     <div className="flex items-center">
                         <span className="text-xs tracking-widest text-nebula-violet animate-pulse">ANALYZING STREAM...</span>
                     </div>
                 </m.div>
            )}
            
            {/* Error Message Display */}
            {error && (
                 <m.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                 >
                     <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs px-4 py-2 rounded-full backdrop-blur-md">
                         ERROR: {error}
                     </div>
                 </m.div>
            )}
            </div>
        </div>

        {/* Mobile Auth Bottom Dock — shown when not signed in & sidebar is closed */}
        <AnimatePresence>
          {!user && !authLoading && !isSidebarOpen && (
            <m.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="absolute top-3 right-3 z-40 md:hidden"
            >
              {showMobileAuth ? (
                <m.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col gap-2 p-3 rounded-2xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-2xl min-w-[200px]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500 tracking-widest uppercase font-medium">Access</span>
                    <button onClick={() => setShowMobileAuth(false)} className="p-1 text-gray-500 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => { signInWithGoogle(); setShowMobileAuth(false); }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-white text-black text-xs font-medium hover:bg-white/90 active:bg-white/80 transition-all min-h-[48px] shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Sign in with Google
                  </button>
                  <button
                    onClick={() => { signInAsGuest(); setShowMobileAuth(false); }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-white/15 text-xs text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-all min-h-[48px] shadow-[0_0_12px_rgba(255,255,255,0.06)] hover:shadow-[0_0_18px_rgba(255,255,255,0.1)]"
                  >
                    <span className="text-sm">👤</span>
                    Login as Guest
                  </button>
                </m.div>
              ) : (
                <m.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowMobileAuth(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white/80 hover:text-white hover:bg-white/15 transition-all shadow-lg min-h-[44px]"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-xs font-medium tracking-wide">Sign In</span>
                </m.button>
              )}
            </m.div>
          )}
        </AnimatePresence>

        {/* Input Dock — hidden on mobile when sidebar is open */}
        <div className={cn("absolute bottom-0 left-0 right-0 px-3 md:px-0 z-50 transition-opacity duration-200", isSidebarOpen && "opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto")} style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}>
            <div className="max-w-2xl mx-auto relative group">
                {/* Input Glow */}
                <div className={cn(
                  "absolute -inset-1 rounded-full blur-xl transition-opacity duration-700",
                  isProcessing
                    ? "bg-gradient-to-r from-nebula-violet/30 via-blue-500/30 to-purple-500/30 opacity-100"
                    : "bg-gradient-to-r from-nebula-violet/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100"
                )} />
                
                <form
                    onSubmit={handleSubmit}
                    className={cn(
                      "relative flex items-center bg-black/50 backdrop-blur-xl border rounded-full p-2 pl-6 shadow-2xl overflow-hidden transition-all duration-500 border-t-white/15",
                      isProcessing
                        ? "border-white/20"
                        : "border-white/10"
                    )}
                    style={isProcessing ? {
                      backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
                      backgroundSize: '200% 100%',
                      animation: 'inputShimmer 2s linear infinite',
                    } : undefined}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={input ? undefined : GHOST_SUGGESTIONS[ghostIndex]}
                        autoFocus
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500/60 font-light tracking-wide py-3"
                        style={{ fontSize: "clamp(0.875rem, 2.5vw, 1rem)" }}
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || isProcessing}
                        className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-2"
                    >
                        <ArrowUp className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}
