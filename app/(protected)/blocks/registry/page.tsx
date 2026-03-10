// app/(protected)/blocks/registry/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import UserNavbar from "@/components/layout/UserNavbar";
import UserSidebar from "@/components/layout/UserSidebar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Zap, Crown } from "lucide-react";

// MjolnirUI registry components — stubs until submodule is built
// TODO: replace with real imports once mjolnirui-registry packages are complete
const BackgroundStudio = () => (
  <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
    <span className="text-xs text-gray-400">Background Studio</span>
  </div>
);
const ThunderButton = () => (
  <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-amber-500/20 rounded-lg flex items-center justify-center">
    <span className="text-xs text-gray-400">Thunder Button</span>
  </div>
);
const LightningCard = () => (
  <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center">
    <span className="text-xs text-gray-400">Lightning Card</span>
  </div>
);
const OdinAI = () => (
  <div className="w-full h-full bg-gradient-to-br from-gold/20 to-amber-500/20 rounded-lg flex items-center justify-center">
    <span className="text-xs text-gray-400">OdinAI</span>
  </div>
);

// Mock user subscription status (replace with real auth check)
const userTier = 'free'; // 'free', 'base', 'pro', 'elite'

const isPremium = () => {
  return ['base', 'pro', 'elite'].includes(userTier);
};

const components = [
  {
    id: 'background-studio',
    name: 'Background Studio',
    description: 'Premium animated background shader generator with 25+ effects',
    category: 'backgrounds',
    component: BackgroundStudio,
    props: { isPremium: isPremium() },
    tier: 'base'
  },
  {
    id: 'thunder-button',
    name: 'Thunder Button',
    description: 'Animated button with lightning effects and GSAP animations',
    category: 'buttons',
    component: ThunderButton,
    props: { isPremium: isPremium(), children: 'Thunder Strike' },
    tier: 'base'
  },
  {
    id: 'lightning-card',
    name: 'Lightning Card',
    description: 'Premium card component with electric border effects and animations',
    category: 'cards',
    component: LightningCard,
    props: {
      isPremium: isPremium(),
      title: 'Lightning Card',
      children: 'This is a premium lightning card with electric effects.'
    },
    tier: 'base'
  },
  {
    id: 'odin-ai',
    name: 'OdinAI Chatbot',
    description: 'Premium AI business consultant with strategic insights and consulting capabilities',
    category: 'ai',
    component: OdinAI,
    props: { isPremium: isPremium() },
    tier: 'base'
  }
];

const categories = ['all', 'backgrounds', 'buttons', 'cards', 'forms', 'navigation', 'ai'];

export default function ComponentRegistry() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredComponents, setFilteredComponents] = useState(components);

  useEffect(() => {
    let filtered = components;

    if (searchTerm) {
      filtered = filtered.filter(comp =>
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(comp => comp.category === selectedCategory);
    }

    setFilteredComponents(filtered);
  }, [searchTerm, selectedCategory]);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'base':
        return <Star className="w-4 h-4 text-emerald-400" />;
      case 'pro':
        return <Zap className="w-4 h-4 text-blue-400" />;
      case 'elite':
        return <Crown className="w-4 h-4 text-purple-400" />;
      default:
        return null;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'base':
        return 'border-emerald-400/30 bg-emerald-400/10';
      case 'pro':
        return 'border-blue-400/30 bg-blue-400/10';
      case 'elite':
        return 'border-purple-400/30 bg-purple-400/10';
      default:
        return 'border-gray-600 bg-gray-800/50';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      <UserNavbar />

      <div className="flex flex-1 pt-24">
        <UserSidebar />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-4xl font-bold text-white mb-4">Component Registry</h1>
                <p className="text-gray-400 text-lg">
                  Browse and use premium MjolnirUI components. Upgrade to unlock advanced features.
                </p>
              </motion.div>

              {/* Search and Filter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 flex flex-col sm:flex-row gap-4"
              >
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Components Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredComponents.map((comp, index) => (
                    <motion.div
                      key={comp.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative bg-gray-900 border rounded-xl p-6 hover:shadow-2xl transition-all duration-300 ${getTierColor(comp.tier)}`}
                    >
                      {/* Tier Badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1">
                        {getTierIcon(comp.tier)}
                        <span className="text-xs font-medium uppercase">
                          {comp.tier}
                        </span>
                      </div>

                      {/* Component Preview */}
                      <div className="mb-4 h-32 flex items-center justify-center bg-gray-800 rounded-lg overflow-hidden">
                        <comp.component {...comp.props} className="w-full h-full" />
                      </div>

                      {/* Component Info */}
                      <h3 className="text-lg font-semibold text-white mb-2">{comp.name}</h3>
                      <p className="text-gray-400 text-sm mb-4">{comp.description}</p>

                      {/* Category Tag */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                          {comp.category}
                        </span>

                        {/* Action Button */}
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                          {isPremium() ? 'Use Component' : 'Upgrade Required'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Empty State */}
              {filteredComponents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-gray-400 text-lg mb-4">No components found</div>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </motion.div>
              )}
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}