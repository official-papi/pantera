import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pantera — Premium Automated Investment Platform",
  description: "High-performance automated yield generation and investor portal. Earn daily returns with full transparency.",
};

import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import GoogleTranslateBridge from "@/components/common/GoogleTranslateBridge";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans antialiased text-zinc-900 bg-[#fafafa]"
        suppressHydrationWarning
      >
        <LanguageProvider>
          <GoogleTranslateBridge />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
