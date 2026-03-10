// app/blocks/backgrounds/studio/page.tsx — Background Studio Builder
"use client";

import React, { useState, useEffect } from "react";
import UserNavbar from "@/components/layout/UserNavbar";
import UserSidebar from "@/components/layout/UserSidebar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Crown, Sparkles, Zap, Star, Flame, Waves, Cloud, Moon } from "lucide-react";
import Link from "next/link";

export default function BackgroundStudioPage() {
  const [selectedBackground, setSelectedBackground] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isPremium, setIsPremium] = useState(false); // This would be determined by user subscription

  const backgrounds = [
    {
      name: "Gradient Flow",
      icon: <Sparkles className="w-6 h-6" />,
      component: (
        <div className="w-full h-64 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <div className="text-white text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Gradient Flow</p>
          </div>
        </div>
      ),
      code: `bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500`,
      description: "Smooth gradient flow with multiple color stops"
    },
    {
      name: "Energy Tunnel",
      icon: <Zap className="w-6 h-6" />,
      component: (
        <div className="w-full h-64 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-xl flex items-center justify-center">
          <div className="text-white text-center">
            <Zap className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Energy Tunnel</p>
          </div>
        </div>
      ),
      code: `bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500`,
      description: "High-energy gradient with warm colors"
    },
    {
      name: "Cosmic Nebula",
      icon: <Star className="w-6 h-6" />,
      component: (
        <div className="w-full h-64 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-xl flex items-center justify-center">
          <div className="text-white text-center">
            <Star className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Cosmic Nebula</p>
          </div>
        </div>
      ),
      code: `bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900`,
      description: "Deep space nebula with cosmic colors"
    },
    {
      name: "Fire Storm",
      icon: <Flame className="w-6 h-6" />,
      component: (
        <div className="w-full h-64 bg-gradient-to-t from-orange-600 via-red-600 to-yellow-500 rounded-xl flex items-center justify-center">
          <div className="text-white text-center">
            <Flame className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Fire Storm</p>
          </div>
        </div>
      ),
      code: `bg-gradient-to-t from-orange-600 via-red-600 to-yellow-500`,
      description: "Fiery gradient with intense heat colors"
    },
    {
      name: "Ocean Waves",
      icon: <Waves className="w-6 h-6" />,
      component: (
        <div className="w-full h-64 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <div className="text-white text-center">
            <Waves className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Ocean Waves</p>
          </div>
        </div>
      ),
      code: `bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600`,
      description: "Calming ocean-inspired gradient"
    },
    {
      name: "Cloud Dream",
      icon: <Cloud className="w-6 h-6" />,
      component: (
        <div className="w-full h-64 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-xl flex items-center justify-center">
          <div className="text-white text-center">
            <Cloud className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Cloud Dream</p>
          </div>
        </div>
      ),
      code: `bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400`,
      description: "Soft cloud-like gradient"
    },
    {
      name: "Midnight Sky",
      icon: <Moon className="w-6 h-6" />,
      component: (
        <div className="w-full h-64 bg-gradient-to-b from-indigo-900 via-purple-900 to-black rounded-xl flex items-center justify-center">
          <div className="text-white text-center">
            <Moon className="w-12 h-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Midnight Sky</p>
          </div>
        </div>
      ),
      code: `bg-gradient-to-b from-indigo-900 via-purple-900 to-black`,
      description: "Dark night sky gradient"
    }
  ];

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const nextBackground = () => {
    setSelectedBackground((prev) => (prev + 1) % backgrounds.length);
  };

  const prevBackground = () => {
    setSelectedBackground((prev) => (prev - 1 + backgrounds.length) % backgrounds.length);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextBackground();
      if (e.key === 'ArrowLeft') prevBackground();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isPremium) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
        <UserNavbar />
        <div className="flex flex-1 pt-24">
          <UserSidebar />
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-950 via-purple-950/5 to-neutral-950">
              <div className="p-10 lg:p-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-4xl mx-auto text-center"
                >
                  <div className="mb-8">
                    <Crown className="w-20 h-20 text-gold mx-auto mb-6" />
                    <h1 className="text-6xl font-black text-white mb-6 bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
                      Background Studio
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                      Unlock premium background effects and interactive studio tools
                    </p>
                  </div>

                  <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Premium Feature</h2>
                    <p className="text-gray-300 mb-6">
                      The Background Studio is available with Pro and Elite plans, featuring:
                    </p>
                    <ul className="text-left text-gray-300 space-y-2 mb-8">
                      <li>• Interactive wheel selector for 50+ backgrounds</li>
                      <li>• Real-time preview and customization</li>
                      <li>• Code generation with copy-to-clipboard</li>
                      <li>• Advanced particle and shader effects</li>
                      <li>• 3D background integrations</li>
                    </ul>

                    <div className="flex gap-4 justify-center">
                      <Link href="/pricing">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-xl shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
                        >
                          Upgrade to Pro
                        </motion.button>
                      </Link>
                      <Link href="/pricing">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-8 py-4 bg-gradient-to-r from-gold to-yellow-500 text-black font-bold rounded-xl shadow-lg hover:shadow-gold/50 transition-all duration-300"
                        >
                          Go Elite
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
              <Footer />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      <UserNavbar />

      <div className="flex flex-1 pt-24">
        <UserSidebar />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-neutral-950 via-purple-950/5 to-neutral-950">
            <div className="p-10 lg:p-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto"
              >
                {/* Header */}
                <div className="mb-12">
                  <motion.h1
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, type: "spring", stiffness: 200 }}
                    className="text-6xl md:text-8xl font-black text-white mb-6 bg-gradient-to-r from-white via-gold to-emerald-400 bg-clip-text text-transparent"
                  >
                    Background Studio
                  </motion.h1>
                  <p className="text-xl text-gray-300 max-w-3xl">
                    Interactive background builder with wheel selection. Choose from gradients,
                    particles, and advanced effects. Use arrow keys to navigate.
                  </p>
                </div>

                {/* Wheel Selector */}
                <div className="mb-12">
                  <div className="relative flex items-center justify-center">
                    {/* Background Wheel */}
                    <div className="relative w-96 h-96">
                      {backgrounds.map((bg, index) => {
                        const angle = (index / backgrounds.length) * 360;
                        const isSelected = index === selectedBackground;
                        const distance = isSelected ? 120 : 100;

                        return (
                          <motion.div
                            key={bg.name}
                            className={`absolute w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                              isSelected ? 'bg-white/20 border-2 border-gold' : 'bg-white/10 hover:bg-white/15'
                            }`}
                            style={{
                              left: '50%',
                              top: '50%',
                              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${distance}px) rotate(-${angle}deg)`,
                            }}
                            onClick={() => setSelectedBackground(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <div className="text-white">
                              {bg.icon}
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Center Selection */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-black/50 backdrop-blur-sm rounded-full border-2 border-white/20 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="text-2xl mb-1">
                              {backgrounds[selectedBackground].icon}
                            </div>
                            <div className="text-xs opacity-75">
                              {selectedBackground + 1}/{backgrounds.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                      onClick={prevBackground}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextBackground}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>

                {/* Selected Background Display */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedBackground}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-2">
                            {backgrounds[selectedBackground].name}
                          </h2>
                          <p className="text-gray-300">
                            {backgrounds[selectedBackground].description}
                          </p>
                        </div>
                        <div className="text-6xl">
                          {backgrounds[selectedBackground].icon}
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">Preview</h3>
                        {backgrounds[selectedBackground].component}
                      </div>

                      {/* Code */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-300">Tailwind Classes</h3>
                          <button
                            onClick={() => copyToClipboard(backgrounds[selectedBackground].code)}
                            className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            {copiedCode ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-300">
                              {copiedCode ? 'Copied!' : 'Copy'}
                            </span>
                          </button>
                        </div>
                        <pre className="bg-gray-900 rounded-xl p-6 overflow-x-auto border border-white/5">
                          <code className="text-sm text-gray-300 font-mono">
                            {backgrounds[selectedBackground].code}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Instructions */}
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Navigation</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Click on wheel segments to select</li>
                        <li>• Use arrow keys for navigation</li>
                        <li>• Click navigation buttons</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">Implementation</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Copy the Tailwind classes</li>
                        <li>• Apply to any container element</li>
                        <li>• Customize colors as needed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}