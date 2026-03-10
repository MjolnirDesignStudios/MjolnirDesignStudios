// components/WorkshopSignup.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import { Calendar, QrCode, Users, Zap } from "lucide-react";
import ElectricBorder from "@/components/ui/ElectricBorder";

// Calendly script loading
const loadCalendlyScript = () => {
  if (typeof window !== 'undefined' && !window.Calendly) {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);
  }
};

export default function WorkshopSignup() {
  const [loading, setLoading] = useState(false);
  const [showInlineCalendar, setShowInlineCalendar] = useState(false);

  useEffect(() => {
    loadCalendlyScript();
  }, []);

  const openCalendlyPopup = () => {
    if (typeof window !== 'undefined' && window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/mjolnirdesignstudios/mjolnir-forge-live'
      });
    } else {
      // Fallback to direct link
      window.open('https://calendly.com/mjolnirdesignstudios/mjolnir-forge-live', '_blank');
    }
  };

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "workshop_live" }),
      });

      const data = await res.json();

      if (!data.url) {
        console.error("Stripe error:", data);
        alert("Payment setup failed. See console.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Payment failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <section id="forge" className="py-16 relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="heading text-silver-100 text-5xl lg:text-5xl font-bold text-center mb-4">
            Mjolnir <span className="text-gold">Forge</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400">
            Forge a modern website with our live workshops.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Live Workshop Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <ElectricBorder color="#34D399" thickness={4} className="h-full">
              <div className="relative h-full p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-heading font-black text-white mb-2">
                    Live Workshop - <span className="text-gold">$500</span>
                  </h3>
                  <p className="text-gray-400 text-sm">In-Person Experience</p>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-emerald-400" />
                    <span>Pay Now and Select a Time</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="w-5 h-5 text-emerald-400" />
                    <span>Limited seats available</span>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm mb-4">Scan QR code or click to pay and schedule</p>
                  <div className="bg-white p-4 rounded-2xl inline-block mb-4">
                      <QRCodeCanvas value="https://calendly.com/mjolnirdesignstudios/mjolnir-forge-live" size={150} level="H" />
                  </div>
                  <motion.button
                    onClick={openCalendlyPopup}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg mb-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar className="w-4 h-4" />
                    Schedule Now
                  </motion.button>
                </div>

                {/* Inline Calendar Toggle */}
                <div className="text-center mb-6">
                  <motion.button
                    onClick={() => setShowInlineCalendar(!showInlineCalendar)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-lime-400 text-black font-semibold rounded-lg hover:scale-105 transition-all duration-200 shadow-md text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Calendar className="w-4 h-4" />
                    {showInlineCalendar ? 'Hide' : 'Show'} Full Calendar
                  </motion.button>
                </div>

                {/* Inline Calendly Embed */}
                {showInlineCalendar && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6"
                  >
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Book Your Session</h3>
                        <p className="text-gray-400 text-sm">Select a time that works for you</p>
                      </div>
                      {/* Calendly inline widget */}
                      <div
                        className="calendly-inline-widget"
                        data-url="https://calendly.com/mjolnirdesignstudios/mjolnir-forge-live?background_color=282828&text_color=ffffff&primary_color=00be4b"
                        style={{ minWidth: '320px', height: '700px' }}
                      ></div>
                    </div>
                  </motion.div>
                )}

                {/* Pay & Schedule CTA */}
                <div className="text-center mt-auto">
                  <motion.button
                    onClick={handleStripeCheckout}
                    disabled={loading}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-lime-400 text-black font-bold rounded-2xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? (
                      <>
                        <Zap className="animate-pulse w-6 h-6" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <QrCode className="w-6 h-6" />
                        Pay & Schedule
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </ElectricBorder>
          </motion.div>

          {/* Webinar Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="h-full"
          >
            <ElectricBorder color="#F0FF42" thickness={4} className="h-full">
              <div className="relative h-full p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-heading font-black text-white mb-2">
                    Live Webinar - <span className="text-gold">$250</span>
                  </h3>
                  <p className="text-gray-400 text-sm">Virtual Experience</p>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-yellow-400" />
                    <span>Coming Soon</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="w-5 h-5 text-yellow-400" />
                    <span>Unlimited participants</span>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm mb-4">QR Code Coming Soon</p>
                  <div className="bg-gray-700 p-4 rounded-2xl inline-block mb-4">
                    <div className="w-[150px] h-[150px] bg-gray-600 rounded flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="text-center mt-auto">
                  <button
                    disabled
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-bold rounded-2xl opacity-50 cursor-not-allowed"
                  >
                    <QrCode className="w-6 h-6" />
                    Coming Soon
                  </button>
                </div>
              </div>
            </ElectricBorder>
          </motion.div>
        </div>
      </div>
    </section>
  );
}