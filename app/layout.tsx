import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = "https://qraft.ashutoshswamy.in";
const title = "Qraft | Free QR Code Generator";
const description =
  "Generate custom QR codes for free. Choose a pattern, a color, and a size, then download instantly as PNG. No sign-up required.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Qraft",
  },
  description,
  keywords: [
    "QR code generator",
    "free QR code generator",
    "custom QR code",
    "QR code maker",
    "QR code with color",
    "Qraft",
  ],
  authors: [{ name: "Ashutosh Swamy", url: "https://ashutoshswamy.in" }],
  creator: "Ashutosh Swamy",
  publisher: "Ashutosh Swamy",
  applicationName: "Qraft",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Qraft",
    title,
    description,
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@ashutoshswamy_",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f1ec",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Qraft",
  url: siteUrl,
  description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Ashutosh Swamy",
    url: "https://ashutoshswamy.in",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${dmMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
