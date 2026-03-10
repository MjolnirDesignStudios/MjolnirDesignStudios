"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      // Redirect will be handled by the auth callback
    }

    setLoading(false);
  };

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    setLoading(true);
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSignIn} className="w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-4 border rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-4 border rounded w-full"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="mb-4 p-4 border rounded w-full bg-blue-500 text-white"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <button
        onClick={() => handleOAuthSignIn("github")}
        className="mb-4 p-4 border rounded"
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() => handleOAuthSignIn("google")}
        className="mb-4 p-4 border rounded"
      >
        Sign in with Google
      </button>
    </div>
  );
}