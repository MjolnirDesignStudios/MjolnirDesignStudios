// Elite: Unlimited – same skin, no lock
"use client";
import OdinAI from "./OdinAI";

export default function OdinAIElite({ isLoggedIn }: { isLoggedIn: boolean }) {
  return <OdinAI isLoggedIn={isLoggedIn} />;
}