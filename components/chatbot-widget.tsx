"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Trash2,
  User,
  Bot,
  RotateCcw,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
  suggestions?: string[];
  status?: "sent" | "delivered";
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Bienvenue, cher chrononaute. Je suis Chronos, votre concierge temporel d\u2019exception. Trois destinations extraordinaires vous attendent : le Paris scintillant de 1889, les terres primordiales du Cr\u00e9tac\u00e9, ou la Florence des g\u00e9nies de 1504. Quelle \u00e9poque fait battre votre c\u0153ur ?",
  timestamp: new Date().toISOString(),
  suggestions: [
    "Parlez-moi de Paris 1889",
    "Le Cr\u00e9tac\u00e9, c\u2019est s\u00fbr ?",
    "Florence et ses artistes",
  ],
};

const INITIAL_QUICK_REPLIES = [
  "D\u00e9couvrir Paris 1889",
  "L\u2019aventure Cr\u00e9tac\u00e9",
  "Florence Renaissance",
  "Quelle destination pour moi ?",
];

const MAX_CHARS = 500;
const STORAGE_KEY = "timetravel-chat-history";
const TOOLTIP_DELAY = 10000;
const TOOLTIP_DURATION = 5000;

function parseSuggestions(content: string): {
  text: string;
  suggestions: string[];
} {
  const match = content.match(
    /\[SUGGESTIONS\](.*?)\[\/SUGGESTIONS\]/s
  );
  if (match) {
    const text = content.replace(/\[SUGGESTIONS\].*?\[\/SUGGESTIONS\]/s, "").trim();
    const suggestions = match[1]
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
    return { text, suggestions };
  }
  return { text: content, suggestions: [] };
}

function TypingIndicator() {
  return (
    <div
      className="flex gap-1.5 px-1 py-0.5"
      role="status"
      aria-label="Chronos r\u00e9dige sa r\u00e9ponse..."
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-primary/60"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.7,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInitialReplies, setShowInitialReplies] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipHideRef = useRef<NodeJS.Timeout | null>(null);

  // Hydrate from sessionStorage
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        if (parsed.length > 1) {
          setMessages(parsed);
          setShowInitialReplies(false);
        }
      }
    } catch {
      /* ignore */
    }
    setHasHydrated(true);
  }, []);

  // Persist to sessionStorage
  useEffect(() => {
    if (hasHydrated && messages.length > 0) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch {
        /* ignore */
      }
    }
  }, [messages, hasHydrated]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Focus input on open + auto scroll
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 350);
    }
  }, [isOpen, scrollToBottom]);

  // Tooltip teaser when chat is closed
  useEffect(() => {
    if (!isOpen && hasHydrated) {
      tooltipTimerRef.current = setTimeout(() => {
        setShowTooltip(true);
        tooltipHideRef.current = setTimeout(() => {
          setShowTooltip(false);
        }, TOOLTIP_DURATION);
      }, TOOLTIP_DELAY);
    } else {
      setShowTooltip(false);
    }
    return () => {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      if (tooltipHideRef.current) clearTimeout(tooltipHideRef.current);
    };
  }, [isOpen, hasHydrated]);

  const resetChat = useCallback(() => {
    setMessages([
      {
        ...WELCOME_MESSAGE,
        id: `welcome-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setShowInitialReplies(true);
    setError(null);
    setInput("");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setError(null);
      setShowInitialReplies(false);

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      // Mark as delivered after short delay
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessage.id ? { ...m, status: "delivered" } : m
          )
        );
      }, 600);

      try {
        const apiMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.error ||
              "Une perturbation temporelle affecte nos syst\u00e8mes."
          );
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        const { text: cleanText, suggestions } = parseSuggestions(
          data.content
        );

        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: cleanText,
          timestamp: new Date().toISOString(),
          suggestions,
        };

        setMessages((prev) => [...prev, botMessage]);

        if (!isOpen) {
          setHasUnread(true);
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Une perturbation temporelle mineure est survenue. Veuillez r\u00e9essayer.";
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, isOpen]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleRetry = () => {
    setError(null);
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      setMessages((prev) => prev.filter((m) => m.id !== lastUserMsg.id));
      sendMessage(lastUserMsg.content);
    }
  };

  // Find last suggestions
  const lastAssistantMsg = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const contextSuggestions = lastAssistantMsg?.suggestions ?? [];

  return (
    <div className="fixed right-3 bottom-3 z-50 flex flex-col items-end sm:right-6 sm:bottom-6">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="mb-3 flex h-[min(560px,80vh)] w-[min(400px,calc(100vw-1.5rem))] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-primary/15 shadow-2xl shadow-primary/15"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,14,26,0.92) 0%, rgba(15,20,35,0.95) 100%)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
            role="dialog"
            aria-label="Chat avec Chronos, concierge temporel"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.02) 100%)",
                borderBottom: "1px solid rgba(212,175,55,0.12)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/25">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground font-serif">
                    Chronos
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[11px] text-muted-foreground">
                      Concierge temporel
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Reset button */}
                <button
                  onClick={resetChat}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  aria-label="Nouvelle conversation"
                  title="Nouvelle conversation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                {/* Close button - larger touch target on mobile */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground min-w-[40px] min-h-[40px] flex items-center justify-center"
                  aria-label="Fermer le chat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              className="flex-1 overflow-y-auto p-4 chat-scrollbar"
              role="log"
              aria-live="polite"
              aria-label="Messages du chat"
            >
              <div className="flex flex-col gap-4">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                          msg.role === "assistant"
                            ? "bg-primary shadow-md shadow-primary/20"
                            : "bg-muted-foreground/15 border border-border/30"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                        ) : (
                          <User className="h-3.5 w-3.5 text-foreground" />
                        )}
                      </div>

                      {/* Bubble */}
                      <div className="flex max-w-[78%] flex-col gap-1">
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 ${
                            msg.role === "assistant"
                              ? "rounded-tl-sm border border-primary/10 bg-secondary/40"
                              : "rounded-tr-sm bg-primary/15 border border-primary/20"
                          }`}
                          style={
                            msg.role === "assistant"
                              ? {
                                  backdropFilter: "blur(8px)",
                                }
                              : undefined
                          }
                        >
                          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground">
                            {msg.content}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                        >
                          <span className="text-[10px] text-muted-foreground/50">
                            {formatTime(msg.timestamp)}
                          </span>
                          {/* Delivered checkmark for user messages */}
                          {msg.role === "user" && msg.status === "delivered" && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-primary"
                            >
                              <Check className="h-3 w-3" />
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-2.5"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/20">
                        <Bot className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                      <div className="rounded-2xl rounded-tl-sm border border-primary/10 bg-secondary/40 px-4 py-3">
                        <TypingIndicator />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error with themed message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 rounded-xl border border-red-500/15 bg-red-500/8 p-3"
                    >
                      <p className="flex-1 text-xs leading-relaxed text-red-400/90">
                        {error}
                      </p>
                      <button
                        onClick={handleRetry}
                        className="flex shrink-0 items-center gap-1 rounded-lg bg-red-500/15 px-2.5 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/25"
                        aria-label="R\u00e9essayer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        R\u00e9essayer
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Initial Quick Replies */}
                <AnimatePresence>
                  {showInitialReplies && messages.length <= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex flex-wrap gap-2"
                    >
                      {INITIAL_QUICK_REPLIES.map((text, i) => (
                        <motion.button
                          key={text}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.08 }}
                          onClick={() => sendMessage(text)}
                          className="rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary/12 hover:shadow-sm hover:shadow-primary/10 active:scale-95"
                        >
                          {text}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Contextual Suggestions (after each AI reply) */}
                <AnimatePresence>
                  {!isLoading &&
                    !showInitialReplies &&
                    contextSuggestions.length > 0 && (
                      <motion.div
                        key={`suggestions-${lastAssistantMsg?.id}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap gap-2"
                      >
                        {contextSuggestions.map((text, i) => (
                          <motion.button
                            key={text}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + i * 0.08 }}
                            onClick={() => sendMessage(text)}
                            className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs text-primary/80 transition-all duration-200 hover:border-primary/40 hover:bg-primary/12 hover:text-primary active:scale-95"
                          >
                            {text}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div
              className="p-3"
              style={{
                borderTop: "1px solid rgba(212,175,55,0.1)",
                background: "rgba(10,14,26,0.5)",
              }}
            >
              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) =>
                      setInput(e.target.value.slice(0, MAX_CHARS))
                    }
                    onKeyDown={handleKeyDown}
                    placeholder="Posez votre question au concierge..."
                    rows={1}
                    disabled={isLoading}
                    className="w-full resize-none rounded-xl border border-border/30 bg-secondary/30 px-3.5 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/30 disabled:opacity-50"
                    style={{ backdropFilter: "blur(4px)" }}
                    aria-label="Votre message"
                  />
                  {input.length > MAX_CHARS * 0.8 && (
                    <span className="absolute right-2 bottom-1 text-[10px] text-muted-foreground/40">
                      {input.length}/{MAX_CHARS}
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="shrink-0 rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-90 disabled:opacity-30 disabled:shadow-none"
                  aria-label="Envoyer le message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip teaser */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="mb-3 rounded-xl border border-primary/20 px-4 py-2.5 text-xs text-foreground shadow-lg shadow-primary/10"
            style={{
              background:
                "linear-gradient(135deg, rgba(10,14,26,0.95) 0%, rgba(15,20,35,0.97) 100%)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p>
              Paris, le Cr\u00e9tac\u00e9 ou Florence ?
            </p>
            <div
              className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 border-b border-r border-primary/20"
              style={{ background: "rgba(12,16,30,0.95)" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/40"
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-foreground"
            >
              <span className="h-2 w-2 rounded-full bg-background animate-pulse" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
