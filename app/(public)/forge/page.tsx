// app/(public)/forge/page.tsx
import Navbar from "@/components/ui/Navigation/Navbar";
import Footer from "@/components/Footer";
import WorkshopSignup from "@/components/WorkshopSignup";
import { getAssetUrls } from '@/lib/cdn-config';

export default function ForgePage() {
  const assets = getAssetUrls();
  return (
    <main className="relative bg-neutral-950 min-h-screen flex flex-col">
      {/* Navbar */}
      <div className="w-full">
        <Navbar />
      </div>

      {/* Workshop Signup Section */}
      <div className="w-full">
        <WorkshopSignup />
      </div>

      {/* Flyer Section */}
      <div className="w-full py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Workshop Flyer</h2>
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <img
              src={assets.mjolnirForgeFlyer}
              alt="Mjolnir Forge Workshop Flyer"
              className="w-full h-auto rounded-lg"
            />
          </div>
          <p className="text-gray-400 mt-6 text-sm">
            Download our workshop flyer for more details and to share with others!
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </main>
  );
}