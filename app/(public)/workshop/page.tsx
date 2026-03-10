// app/(public)/workshop/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkshopCheckout() {
  const router = useRouter();

  useEffect(() => {
    const initiateCheckout = async () => {
      try {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ product: "workshop_live" }),
        });

        const data = await res.json();

        if (data.url) {
          window.location.href = data.url;
        } else {
          alert("Payment setup failed");
          router.push("/");
        }
      } catch (err) {
        alert("Payment failed");
        router.push("/");
      }
    };

    initiateCheckout();
  }, [router]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Redirecting to payment...</p>
      </div>
    </div>
  );
}