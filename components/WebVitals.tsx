"use client";

import { useEffect } from "react";

export function reportWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
}) {
  // Send to analytics (Google Analytics gtag)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    });
  }
}

export default function WebVitals() {
  useEffect(() => {
    // web-vitals v5 API: onCLS, onFCP, onLCP, onTTFB, onINP (FID replaced by INP)
    import("web-vitals").then((vitals) => {
      if (typeof vitals.onCLS === "function") vitals.onCLS(reportWebVitals);
      if (typeof vitals.onFCP === "function") vitals.onFCP(reportWebVitals);
      if (typeof vitals.onLCP === "function") vitals.onLCP(reportWebVitals);
      if (typeof vitals.onTTFB === "function") vitals.onTTFB(reportWebVitals);
      if (typeof vitals.onINP === "function") vitals.onINP(reportWebVitals);
    });
  }, []);

  return null;
}
