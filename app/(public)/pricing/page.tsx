// app/pricing/page.tsx
import Pricing from "@/components/Pricing";
import Navbar from "@/components/ui/Navigation/Navbar"; // Adjust path if needed
import { FloatingNav } from "@/components/ui/Navigation/FloatingNav"; // Adjust path if needed
import Footer from "@/components/Footer"; // Adjust path if needed
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata(
  "Pricing Plans | Mjolnir Forge Workshops",
  "Choose your plan: Base ($10/mo), Pro ($50/mo), or Elite ($500/mo). All plans include lifetime updates and accept Bitcoin payments. Premium UI/UX design services from Tampa's top web agency.",
  "/pricing",
  "/og-image-pricing.jpg"
);

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-neutral-950 flex flex-col">
      {/* Desktop Navbar - Fixed at top */}
      <Navbar />

      {/* Mobile Floating Nav */}
      <FloatingNav />

      {/* Main Content - Pricing Section */}
      <main className="flex-1 pt-12 lg:pt-8"> {/* Padding to avoid overlap with fixed navbar */}
        <Pricing />
      </main>

      {/* Footer - Always at bottom */}
      <Footer />
    </div>
  );
}