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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Wedly",
    description: "Create a beautiful wedding RSVP page in minutes.",
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
