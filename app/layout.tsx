// app/layout.tsx — FINAL: PERFECT SCROLL OFFSET + SMOOTH SCROLLING
import type { Metadata } from "next";
import { Inter, Ubuntu } from "next/font/google";
import Script from "next/script";
import ClientLayout from "./clientlayout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-satoshi",
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  variable: "--font-ubuntu",
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mjolnirdesignstudios.com"),
  title: {
    default: "Mjolnir Design Studios | Thunderous UI/UX",
    template: "%s • Mjolnir Design Studios",
  },
  description:
    "Premium UI/UX and web designs. Full-stack development from the Lightning Capital of the World — Tampa, Florida. We build high-performance digital experiences that strike with the power of Mjolnir!.",
  keywords: [
    "web design tampa",
    "web development tampa",
    "ui ux design tampa",
    "next.js agency",
    "react developer tampa",
    "Mjolnir Design Studios",
    "MjolnirUI",
    "Mjolnir Forge",
    "thunderous ui/ux",
    "electric web design",
    "3D web experiences",
    "premium web components",
    "web3 design studio",
    "tampa web designer",
    "florida digital agency",
    "lightning capital",
  ],
  authors: [{ name: "Mjolnir Design Studios", url: "https://www.mjolnirdesignstudios.com" }],
  creator: "Mjolnir Design Studios",
  publisher: "Mjolnir Design Studios",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.mjolnirdesignstudios.com",
    siteName: "Mjolnir Design Studios",
    title: "Mjolnir Design Studios • Thunderous Digital Experiences",
    description: "Electric UI/UX and web designs from Tampa — the Lightning Capital of the World",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mjolnir Design Studios – Electric Blue Hammer Striking Lightning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@MjolnirDesignsX",
    creator: "@MjolnirDesignsX",
    title: "Mjolnir Design Studios Tampa's Thunderous Web Agency",
    description: "We don’t just build websites. We bring the thunder.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: ["/favicon/favicon.ico"],
    shortcut: ["/favicon/favicon.ico"],
    apple: ["/favicon/apple-touch-icon.png"],
    other: [
      { rel: "icon", url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  verification: {
    google: "your-google-site-verification", // TODO: Replace with actual Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Static export compatible structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mjolnir Design Studios",
    "url": "https://www.mjolnirdesignstudios.com",
    "logo": "https://www.mjolnirdesignstudios.com/Assets/mjolnir_logo_transparent.png",
    "description": "Premium UI/UX and web designs. Full-stack development from the Lightning Capital of the World — Tampa, Florida.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Tampa",
      "addressRegion": "FL",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://twitter.com/MjolnirDesignsX"
    ],
    "serviceType": ["Web Design", "UI/UX Design", "Web Development", "Digital Agency"],
    "areaServed": {
      "@type": "Place",
      "name": "Tampa, Florida"
    },
    "knowsAbout": ["Next.js", "React", "TypeScript", "UI/UX Design", "Web Development", "3D Web Experiences"]
  };

  return (
    <html lang="en" className={`${inter.variable} ${ubuntu.variable}`} suppressHydrationWarning>
      <head>
        {/* Static export compatible SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.mjolnirdesignstudios.com" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:url" content="https://www.mjolnirdesignstudios.com" />
        <meta property="og:site_name" content="Mjolnir Design Studios" />
        <meta property="og:title" content="Mjolnir Design Studios • Thunderous Digital Experiences" />
        <meta property="og:description" content="Thunderous UI/UX from Tampa, Florida — the Lightning Capital of the World" />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@MjolnirDesignsX" />
        <meta name="twitter:creator" content="@MjolnirDesignsX" />
        <meta name="twitter:title" content="Mjolnir Design Studios Tampa Bay's Thunderous Digital Agency" />
        <meta name="twitter:description" content="We don't just build websites. We bring the thunder." />
        <meta name="twitter:image" content="/og-image.jpg" />

        {/* Google Analytics - Static Export Compatible */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body className="font-body antialiased bg-black text-white min-h-screen">
        {/* THIS LINE FIXES EVERYTHING */}
        <div className="pt-20 lg:pt-26" /> {/* Invisible spacer = navbar height */}

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}