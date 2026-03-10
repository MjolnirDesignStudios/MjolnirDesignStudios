// Base: 2500 tokens/session – locked after
"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Hammer, Lock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OdinAI({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, );

  if (!isLoggedIn) return null;

  const send = async () => {
    if (!input || isLoading || isLocked) return;
    const q = { role: "user", content: input };
    setMessages(prev => [...prev, q]);
    setIsLoading(true);

    const r = await fetch("/api/odin/chat", {
      method: "POST",
      body: JSON.stringify({ messages: [...messages, q], tier: "base" })
    });

    const { error, reply } = await r.json();
    if (error) setMessages(prev => [...prev, { role: "assistant", content: `⚠️ ${error}` }]);
    else setMessages(prev => [...prev, { role: "assistant", content: reply }]);

    setInput("");
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-6 right-6 w-80 bg-neutral-950 border-2 border-white/10 rounded-3xl shadow-xl shadow-black/50 z-40"
    >
      <div className="p-4 border-b border-gold/30 flex items-center gap-2">
        <Hammer className="w-5 h-5 text-gold" />
        <span className="font-bold text-sm">Odin AI</span>
        {isLocked && <Lock className="w-4 h-4 text-red-500 ml-auto" />}
      </div>

      <div className="h-80 overflow-y-auto p-4 space-y-2 text-sm text-white">
        {messages.length === 0 ? (
          <p className="text-gray-500 italic">Ask me to forge UI…</p>
        ) : (
          messages.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-2 rounded-lg max-w-xs",
                m.role === "user" ? "bg-emerald-600/20 ml-auto" :
                "bg-gold/10 text-gray-100"
              )}
            >
              {m.content}
            </motion.div>
          ))
        )}
        {ref.current = null as any}
      </div>

      <div className="p-3 bg-black/50 rounded-b-3xl">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Forge a hero…"
            className="flex-1 bg-neutral-900 border border-white/20 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-gold"
            disabled={isLoading || isLocked}
          />
          <button
            onClick={send}
            disabled={isLoading || isLocked}
            className={cn(
              "p-2 rounded-full transition",
              isLocked ? "opacity-30 cursor-not-allowed" :
              isLoading ? "bg-yellow-600" : "bg-gradient-to-r from-gold to-amber-600 hover:scale-105"
            )}
          >
            {isLoading ? <Zap className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        {isLocked && (
          <p className="text-xs text-rose-400 mt-2 text-center">
            🔓 Upgrade to Pro for unlimited thunder.
          </p>
        )}
      </div>
    </motion.div>
  );
}