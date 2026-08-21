import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const title = "aleckos";
const description =
  "Aleck's operating system styled personal website built with next, react, typescript and tailwindcss";

export const metadata: Metadata = {
  metadataBase: new URL("https://aleckshen.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://aleckshen.com",
    siteName: "aleckos",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
