import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Qraft | QR Code Generator",
  description: "Generate beautiful QR codes with custom patterns and colors. Simple, fast, and free.",
  keywords: ["QR code", "QR generator", "Qraft", "custom QR code", "QR code maker"],
  openGraph: {
    title: "Qraft - QR Code Generator",
    description: "Generate beautiful QR codes with custom patterns and colors",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
