"use client";
import { ThemeProvider } from "./provider";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No isMounted guard — next-themes handles its own SSR hydration.
  // The old `if (!isMounted) return null` pattern caused a full-page FOUC.
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
