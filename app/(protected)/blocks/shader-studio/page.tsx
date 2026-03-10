// app/(protected)/blocks/shader-studio/page.tsx
// Asgardian Shader Studio — 25 WebGL background effects, tier-gated
"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import UserNavbar from "@/components/layout/UserNavbar";
import UserSidebar from "@/components/layout/UserSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Play, Pause, Settings2, Lock, ChevronDown, ChevronUp, Crown, Star } from "lucide-react";
import { supabaseClient } from "@/lib/supabase/client";

// Dynamic import — Canvas must be client-only (no SSR)
const ShaderCanvas = dynamic(() => import("@/components/ui/shaders/ShaderCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500/40 border-t-cyan-500 rounded-full animate-spin" />
        <p className="text-cyan-400/60 text-sm">Initializing WebGL…</p>
      </div>
    </div>
  ),
});

// ── Shader metadata ───────────────────────────────────────────────────────────
const SHADER_LIST: { id: string; label: string; tier: "free" | "base" | "pro" | "elite"; category: string }[] = [
  // Free tier — 2 shaders for teasers
  { id: "nebula",        label: "Nebula",         tier: "free",  category: "Presets" },
  { id: "starfield",     label: "Star Field",     tier: "free",  category: "Cosmic"  },
  // Base tier — all remaining shaders
  { id: "cyberpunk",     label: "Cyberpunk",      tier: "base",  category: "Presets" },
  { id: "accretion",     label: "Accretion Disk", tier: "base",  category: "Cosmic"  },
  { id: "atomic",        label: "Atomic",         tier: "base",  category: "Energy"  },
  { id: "atmosphere",    label: "Atmosphere",     tier: "base",  category: "Cosmic"  },
  { id: "aura-waves",    label: "Aura Waves",     tier: "base",  category: "Energy"  },
  { id: "bifrost",       label: "Bifrost",        tier: "base",  category: "Norse"   },
  { id: "black-hole",    label: "Black Hole",     tier: "base",  category: "Cosmic"  },
  { id: "colorhalo",     label: "Color Halo",     tier: "base",  category: "Energy"  },
  { id: "darkveil",      label: "Dark Veil",      tier: "base",  category: "Cosmic"  },
  { id: "globe",         label: "Globe",          tier: "base",  category: "World"   },
  { id: "gravitylens",   label: "Gravity Lens",   tier: "base",  category: "Cosmic"  },
  { id: "hyperspeed",    label: "Hyperspeed",     tier: "base",  category: "Motion"  },
  { id: "laser-flow",    label: "Laser Flow",     tier: "base",  category: "Energy"  },
  { id: "light-pillar",  label: "Light Pillar",   tier: "base",  category: "Norse"   },
  { id: "lightning",     label: "Lightning",      tier: "base",  category: "Norse"   },
  { id: "liquidribbons", label: "Liquid Ribbons", tier: "base",  category: "Motion"  },
  { id: "matrix-rain",   label: "Matrix Rain",    tier: "base",  category: "Digital" },
  { id: "neuralnet",     label: "Neural Net",     tier: "base",  category: "Digital" },
  { id: "ripple-grid",   label: "Ripple Grid",    tier: "base",  category: "Digital" },
  { id: "silkylines",    label: "Silky Lines",    tier: "base",  category: "Motion"  },
  { id: "singularity",   label: "Singularity",    tier: "base",  category: "Cosmic"  },
  { id: "swirling-gas",  label: "Swirling Gas",   tier: "base",  category: "Cosmic"  },
  { id: "lightningeffect", label: "Lightning FX", tier: "base",  category: "Norse"   },
];

const TIER_ORDER = ["free", "base", "pro", "elite"] as const;
type Tier = typeof TIER_ORDER[number];

function tierUnlocked(userTier: string, shaderTier: string): boolean {
  return TIER_ORDER.indexOf(userTier as Tier) >= TIER_ORDER.indexOf(shaderTier as Tier);
}

const CATEGORY_COLORS: Record<string, string> = {
  Presets: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  Cosmic: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Norse: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Energy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Motion: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Digital: "text-green-400 bg-green-400/10 border-green-400/20",
  World: "text-teal-400 bg-teal-400/10 border-teal-400/20",
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function ShaderStudioPage() {
  const [activeShader, setActiveShader] = useState("nebula");
  const [isPlaying, setIsPlaying] = useState(true);
  const [userTier, setUserTier] = useState<string>("free");
  const [showControls, setShowControls] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Load user's subscription tier
  useEffect(() => {
    supabaseClient.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabaseClient
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data?.subscription_tier) setUserTier(data.subscription_tier.toLowerCase());
        });
    });
  }, []);

  const categories = ["All", ...Array.from(new Set(SHADER_LIST.map(s => s.category)))];

  const visibleShaders = activeCategory === "All"
    ? SHADER_LIST
    : SHADER_LIST.filter(s => s.category === activeCategory);

  const currentShaderMeta = SHADER_LIST.find(s => s.id === activeShader);
  const canRender = currentShaderMeta ? tierUnlocked(userTier, currentShaderMeta.tier) : false;

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      <UserNavbar />
      <div className="flex flex-1 pt-16">
        <UserSidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="px-6 pt-6 pb-4 border-b border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Zap className="w-6 h-6 text-cyan-400" />
                  Asgardian Shader Studio
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {SHADER_LIST.length} WebGL background effects · Base tier and above
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                  userTier === "elite" ? "text-purple-400 bg-purple-400/10 border-purple-400/30" :
                  userTier === "pro"   ? "text-blue-400 bg-blue-400/10 border-blue-400/30" :
                  userTier === "base"  ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" :
                  "text-gray-400 bg-gray-400/10 border-gray-400/30"
                }`}>
                  {userTier === "free" ? "Free" : userTier} Tier
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">

            {/* ── Shader Preview Canvas ───────────────────────────────────── */}
            <div className="flex-1 relative bg-black">
              {canRender ? (
                <Suspense fallback={null}>
                  <ShaderCanvas
                    shaderId={activeShader}
                    isPlaying={isPlaying}
                    className="w-full h-full"
                  />
                </Suspense>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-neutral-900 to-black">
                  <Lock className="w-16 h-16 text-gray-600" />
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Upgrade to Access</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">
                      {currentShaderMeta?.label} requires the{" "}
                      <span className="text-emerald-400 font-semibold capitalize">
                        {currentShaderMeta?.tier}
                      </span>{" "}
                      tier or above.
                    </p>
                    <a
                      href="/pricing"
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-xl hover:scale-105 transition inline-flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4" />
                      Upgrade Now
                    </a>
                  </div>
                </div>
              )}

              {/* Canvas controls overlay */}
              {canRender && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 bg-black/70 hover:bg-black/90 border border-white/10 rounded-lg backdrop-blur-sm transition"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div className="px-3 py-2 bg-black/70 border border-white/10 rounded-lg backdrop-blur-sm text-xs text-gray-300">
                    <span className="text-white font-semibold">{currentShaderMeta?.label}</span>
                    <span className="ml-2 text-gray-500">·</span>
                    <span className="ml-2 text-gray-400">{currentShaderMeta?.category}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Sidebar: Shader List ────────────────────────────────────── */}
            <div className="w-72 border-l border-white/5 flex flex-col bg-neutral-900/50">

              {/* Category filter */}
              <div className="p-3 border-b border-white/5">
                <div className="flex flex-wrap gap-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2 py-1 rounded text-xs font-medium transition ${
                        activeCategory === cat
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shader list */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                <AnimatePresence>
                  {visibleShaders.map((shader) => {
                    const unlocked = tierUnlocked(userTier, shader.tier);
                    const active = activeShader === shader.id;
                    const catColor = CATEGORY_COLORS[shader.category] || "text-gray-400 bg-gray-400/10 border-gray-400/20";

                    return (
                      <motion.button
                        key={shader.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveShader(shader.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition group ${
                          active
                            ? "bg-cyan-500/15 border border-cyan-500/30"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        {/* Lock / active indicator */}
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          active ? "bg-cyan-400" : unlocked ? "bg-white/20" : "bg-red-500/40"
                        }`} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium truncate ${
                              active ? "text-white" : unlocked ? "text-gray-300" : "text-gray-600"
                            }`}>
                              {shader.label}
                            </span>
                            {!unlocked && <Lock className="w-3 h-3 text-gray-600 flex-shrink-0" />}
                          </div>
                          <span className={`text-xs px-1.5 py-0.5 rounded border inline-block mt-0.5 ${catColor}`}>
                            {shader.category}
                          </span>
                        </div>

                        {/* Tier badge */}
                        {shader.tier !== "free" && (
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${
                            shader.tier === "base"  ? "text-emerald-400 bg-emerald-400/10" :
                            shader.tier === "pro"   ? "text-blue-400 bg-blue-400/10" :
                            "text-purple-400 bg-purple-400/10"
                          }`}>
                            {shader.tier}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Upgrade CTA for free users */}
              {userTier === "free" && (
                <div className="p-4 border-t border-white/5">
                  <div className="bg-gradient-to-br from-emerald-900/40 to-cyan-900/40 border border-emerald-500/20 rounded-xl p-4 text-center">
                    <Star className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-white text-sm font-semibold mb-1">Unlock All 25 Shaders</p>
                    <p className="text-gray-400 text-xs mb-3">Base tier · $10/month</p>
                    <a
                      href="/pricing"
                      className="block w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-bold rounded-lg hover:scale-105 transition"
                    >
                      Upgrade to Base
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
