// components/Tech.tsx — MJÖLNIR TECH SHOWCASE 2026
"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";
import { supabaseClient } from "@/lib/supabase/client";
import {
  Calendar,
  Cloud,
  Zap,
  Globe,
  Mail,
  Video,
  Database,
  Server,
  Code,
  Smartphone,
  Monitor,
  Palette,
  Layers,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  BarChart3,
  Users,
  TrendingUp,
  Award,
  CreditCard
} from "lucide-react";

// Tech stack icons mapping
const techIcons = {
  Calendly: Calendar,
  CloudFlare: Cloud,
  GSAP: Zap,
  Hostinger: Globe,
  HubSpot: Mail,
  Remotion: Video,
  Resend: Mail,
  Supabase: Database,
  NextJS: Code,
  React: Code,
  TypeScript: Code,
  Tailwind: Palette,
  FramerMotion: Layers,
  ThreeJS: Cpu,
  NodeJS: Server,
  PostgreSQL: Database,
  Stripe: CreditCard,
  Vercel: Globe,
  GitHub: Code,
  Figma: Palette
};

// Counter component with animation
function Counter({ target, label, suffix = "", prefix = "", colorClass }: {
  target: number;
  label: string;
  suffix?: string;
  prefix?: string;
  colorClass?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      const timer = setInterval(() => {
        setCount(prev => {
          const next = prev + increment;
          if (next >= target) {
            clearInterval(timer);
            return target;
          }
          return next;
        });
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <div className={`text-4xl md:text-6xl font-black mb-2 ${colorClass || 'text-gold'}`}>
        {prefix}{Math.floor(count).toLocaleString()}{suffix}
      </div>
      <div className="text-lg text-gray-400">{label}</div>
    </motion.div>
  );
}

// Hook to fetch subscriber count from Supabase
function useSubscribers() {
  const [count, setCount] = useState(10); // Default fallback

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        // Assuming there's a newsletter_subscribers table
        const { count: subscriberCount, error } = await supabaseClient
          .from('newsletter_subscribers')
          .select('*', { count: 'exact', head: true });

        if (!error && subscriberCount !== null) {
          setCount(subscriberCount);
        }
      } catch (error) {
        console.log('Using default subscriber count');
      }
    };

    fetchSubscribers();
  }, []);

  return count;
}

// Random motion path component
function RandomMotionIcon({ Icon, delay = 0 }: { Icon: React.ComponentType<any>; delay?: number }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      // Random path generation
      const paths = [
        { x: [0, 50, -30, 0], y: [0, -40, 60, 0] },
        { x: [0, -60, 40, 0], y: [0, 50, -20, 0] },
        { x: [0, 30, -50, 0], y: [0, -60, 40, 0] },
        { x: [0, 70, -20, 0], y: [0, 30, -50, 0] }
      ];
      const randomPath = paths[Math.floor(Math.random() * paths.length)];

      controls.start({
        x: randomPath.x,
        y: randomPath.y,
        transition: {
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay
        }
      });
    }
  }, [isInView, controls, delay]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold/20 to-yellow-600/20 rounded-xl border border-gold/30 backdrop-blur-sm"
    >
      <Icon className="w-8 h-8 text-gold" />
    </motion.div>
  );
}

// Marquee scroller with random reveals
function TechMarquee() {
  const [visibleIcons, setVisibleIcons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const techNames = Object.keys(techIcons);
      const randomIcon = techNames[Math.floor(Math.random() * techNames.length)];
      setVisibleIcons(prev => new Set([...prev, randomIcon]));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden py-12">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent" />

      {/* Scrolling container */}
      <motion.div
        className="flex space-x-8"
        animate={{
          x: [-100, -2000],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear"
            }
          }
        }}
      >
        {Object.entries(techIcons).map(([name, Icon], index) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={visibleIcons.has(name) ? {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, type: "spring" }
            } : {}}
            className="flex flex-col items-center space-y-2 min-w-[120px]"
          >
            <RandomMotionIcon Icon={Icon} delay={index * 0.2} />
            <span className="text-sm text-gray-400 font-medium">{name}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Duplicate for seamless loop */}
      <motion.div
        className="flex space-x-8 absolute top-0 left-full"
        animate={{
          x: [-100, -2000],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear"
            }
          }
        }}
      >
        {Object.entries(techIcons).map(([name, Icon], index) => (
          <motion.div
            key={`${name}-duplicate`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={visibleIcons.has(name) ? {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.5, type: "spring" }
            } : {}}
            className="flex flex-col items-center space-y-2 min-w-[120px]"
          >
            <RandomMotionIcon Icon={Icon} delay={index * 0.2} />
            <span className="text-sm text-gray-400 font-medium">{name}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Tech() {
  const subscriberCount = useSubscribers();

  return (
    <section id="tech" className="py-20 relative min-h-screen bg-gradient-to-b from-neutral-950 via-purple-950/10 to-neutral-950 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl lg:text-5xl font-bold text-center mb-4">
            <span className="text-white">Asgardian </span><span className="text-gold">Tech</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Experience the thunderous power of our cutting-edge technology stack.
            From lightning-fast animations to enterprise-grade integrations.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <Counter target={80} suffix="+" label="Components Forged" colorClass="text-electric-400" />
          <Counter target={1500} suffix="+" label="Site Visitors" colorClass="text-emerald-400" />
          <Counter target={subscriberCount} suffix="+" label="Newsletter Subscribers" colorClass="text-gold" />
          <Counter target={17} suffix="+" label="Users Served" colorClass="text-orange-400" />
        </div>

        {/* Tech Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Our Tech Arsenal
          </h3>
          <TechMarquee />
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Lightning Performance",
              description: "Sub-millisecond load times with optimized animations and caching."
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Bank-grade encryption and compliance across all integrations."
            },
            {
              icon: TrendingUp,
              title: "Real-time Analytics",
              description: "Live data from Hostinger and Supabase for instant insights."
            },
            {
              icon: Users,
              title: "Community Driven",
              description: "Built by developers, for developers, with open-source spirit."
            },
            {
              icon: Award,
              title: "Award Winning",
              description: "Recognized for innovation in modern web development."
            },
            {
              icon: Globe,
              title: "Global Scale",
              description: "Deployed worldwide with CDN optimization and edge computing."
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-gold/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-yellow-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-gold" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
