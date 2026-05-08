import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { ScrollReset } from "@/components/scroll-reset";
import "./globals.css";

const headingFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

function resolveMetadataBase() {
  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!rawSiteUrl) {
    return new URL("http://localhost:3000");
  }

  const normalized = /^https?:\/\//i.test(rawSiteUrl)
    ? rawSiteUrl
    : `https://${rawSiteUrl}`;

  try {
    return new URL(normalized);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: {
    default: "Wedly | Beautiful Wedding RSVP Pages",
    template: "%s | Wedly",
  },
  description: "Create a beautiful wedding RSVP page in minutes.",
  openGraph: {
    title: "Wedly",
    description: "Create a beautiful wedding RSVP page in minutes.",
    type: "website",
    url: "/",
    siteName: "Wedly",
    images: [
      {
        url: "/og-img.png",
        width: 1200,
        height: 630,
        alt: "Wedly wedding RSVP preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedly",
    description: "Create a beautiful wedding RSVP page in minutes.",
    images: ["/og-img.png"],
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
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ScrollReset />
        {children}
      </body>
    </html>
  );
}
