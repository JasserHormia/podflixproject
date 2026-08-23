import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Alexandria } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Grain from "@/components/ui/Grain";
import ScrollProgress from "@/components/ui/ScrollProgress";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { jsonLd, localBusinessSchema } from "@/lib/schema";

// Display / headings — closest free match to Myriad Variable Concept.
const displayFont = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

// Body copy.
const bodyFont = Alexandria({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://podflix.ae"),
  title: {
    default: "Podflix | Podcast Studio Dubai",
    template: "%s | Podflix",
  },
  description:
    "Dubai's premier podcast recording studio. Professional audio, cinema-grade video, and full post-production — all in one place.",
  keywords: [
    "podcast studio dubai",
    "podcast recording dubai",
    "video podcast studio",
    "content creation dubai",
    "podflix",
  ],
  authors: [{ name: "Podflix" }],
  creator: "MCFLIX Agency",
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://podflix.ae",
    siteName: "Podflix",
    title: "Podflix | Podcast Studio Dubai",
    description: "Dubai's premier podcast recording studio.",
    images: [
      {
        url: "/assets/logos/camel-wordmark.png",
        width: 1200,
        height: 630,
        alt: "Podflix Studio Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Podflix | Podcast Studio Dubai",
    description: "Dubai's premier podcast recording studio.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        {/* LocalBusiness structured data — applies to every route. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessSchema) }}
        />
        <SmoothScrollProvider>
          <ScrollProgress />
          <Grain />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
