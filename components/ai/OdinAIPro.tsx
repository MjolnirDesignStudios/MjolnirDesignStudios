// Pro: 25k tokens – same UI, bigger brain
"use client";
import OdinAI from "./OdinAI";

export default function OdinAIPro({ isLoggedIn }: { isLoggedIn: boolean }) {
  return <OdinAI isLoggedIn={isLoggedIn} />;
}