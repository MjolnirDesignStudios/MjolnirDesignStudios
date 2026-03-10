// app/(protected)/layout.tsx
"use client";

import ClientLayout from "@/app/clientlayout";
import { supabaseClient } from "@/lib/supabase/client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setIsVerified(true);
      }
    };

    // Also listen for sign-out events during the session
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [router]);

  // Hold render until auth confirmed — prevents flash of protected content
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Verifying access…</p>
        </div>
      </div>
    );
  }

  return <ClientLayout>{children}</ClientLayout>;
}
