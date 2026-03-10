import type { Metadata } from "next";

const baseUrl = "https://www.mjolnirdesignstudios.com";

export function generateMetadata(
  title?: string,
  description?: string,
  path?: string,
  image?: string
): Metadata {
  const fullTitle = title
    ? `${title} • Mjolnir Design Studios`
    : "Mjolnir Design Studios | Thunderous UI/UX";

  const fullDescription = description ||
    "Thunderous UI/UX and Premium Design Studio. Full-stack development from the Lightning Capital of the World — Tampa, Florida. We build high-performance digital experiences that strike with the power of Mjolnir!.";

  const url = path ? `${baseUrl}${path}` : baseUrl;
  const ogImage = image || "/og-image.jpg";

  return {
    title: fullTitle,
    description: fullDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: "Mjolnir Design Studios",
      title: fullTitle,
      description: fullDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Mjolnir Design Studios – ${title || "Electric Blue Hammer Striking Lightning"}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@MjolnirDesignsX",
      creator: "@MjolnirDesignsX",
      title: fullTitle,
      description: fullDescription,
      images: [ogImage],
    },
  };
}