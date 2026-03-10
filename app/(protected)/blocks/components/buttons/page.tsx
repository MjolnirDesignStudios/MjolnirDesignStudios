// app/blocks/components/buttons/page.tsx — Buttons Component Showcase
"use client";

import React, { useState } from "react";
import UserNavbar from "@/components/layout/UserNavbar";
import UserSidebar from "@/components/layout/UserSidebar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import Link from "next/link";

export default function ButtonsPage() {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const buttonVariants = [
    {
      name: "Primary Button",
      component: (
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          Primary Action
        </button>
      ),
      code: `<button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
  Primary Action
</button>`,
      props: [
        { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
        { name: "onClick", type: "function", default: "undefined", description: "Click handler function" },
        { name: "disabled", type: "boolean", default: "false", description: "Disables the button" },
        { name: "children", type: "ReactNode", default: "undefined", description: "Button content" }
      ]
    },
    {
      name: "Secondary Button",
      component: (
        <button className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
          Secondary Action
        </button>
      ),
      code: `<button className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
  Secondary Action
</button>`,
      props: [
        { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
        { name: "onClick", type: "function", default: "undefined", description: "Click handler function" },
        { name: "disabled", type: "boolean", default: "false", description: "Disables the button" },
        { name: "children", type: "ReactNode", default: "undefined", description: "Button content" }
      ]
    },
    {
      name: "Ghost Button",
      component: (
        <button className="px-6 py-3 bg-transparent text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200">
          Ghost Action
        </button>
      ),
      code: `<button className="px-6 py-3 bg-transparent text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200">
  Ghost Action
</button>`,
      props: [
        { name: "className", type: "string", default: "undefined", description: "Additional CSS classes" },
        { name: "onClick", type: "function", default: "undefined", description: "Click handler function" },
        { name: "disabled", type: "boolean", default: "false", description: "Disables the button" },
        { name: "children", type: "ReactNode", default: "undefined", description: "Button content" }
      ]
    }
  ];

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
                    Buttons
                  </motion.h1>
                  <p className="text-xl text-gray-300 max-w-3xl">
                    A collection of beautifully designed button components with hover effects,
                    gradients, and smooth animations. Perfect for calls-to-action and user interactions.
                  </p>
                </div>

                {/* Component Variants */}
                <div className="space-y-16">
                  {buttonVariants.map((variant, index) => (
                    <motion.div
                      key={variant.name}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                    >
                      {/* Component Title */}
                      <h2 className="text-3xl font-bold text-white mb-6">{variant.name}</h2>

                      {/* Visual Example */}
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">Preview</h3>
                        <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/5 flex items-center justify-center">
                          {variant.component}
                        </div>
                      </div>

                      {/* Code Block */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-300">Usage</h3>
                          <button
                            onClick={() => copyToClipboard(variant.code, variant.name)}
                            className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            {copiedStates[variant.name] ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-300">
                              {copiedStates[variant.name] ? 'Copied!' : 'Copy'}
                            </span>
                          </button>
                        </div>
                        <pre className="bg-gray-900 rounded-xl p-6 overflow-x-auto border border-white/5">
                          <code className="text-sm text-gray-300 font-mono">
                            {variant.code}
                          </code>
                        </pre>
                      </div>

                      {/* Props Table */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">Props</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full border border-white/10 rounded-xl overflow-hidden">
                            <thead className="bg-white/5">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Prop</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Default</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {variant.props.map((prop, propIndex) => (
                                <tr key={propIndex} className="hover:bg-white/5">
                                  <td className="px-4 py-3 text-sm text-white font-mono">{prop.name}</td>
                                  <td className="px-4 py-3 text-sm text-blue-400 font-mono">{prop.type}</td>
                                  <td className="px-4 py-3 text-sm text-yellow-400 font-mono">{prop.default}</td>
                                  <td className="px-4 py-3 text-sm text-gray-300">{prop.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="mt-16 pt-8 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <Link href="/blocks/components">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        ← Back to Components
                      </motion.button>
                    </Link>
                    <Link href="/blocks/components/cards">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
                      >
                        Next: Cards →
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