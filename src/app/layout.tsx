import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FryerCare | Commercial Kitchen Oil Servicing & Filtration",
  description:
    "Mobile-first on-site commercial fryer oil management, scheduled filtration, and fresh oil replacement for restaurants, cafes, and commercial kitchens.",
  keywords: [
    "commercial fryer oil service",
    "restaurant oil change",
    "cooking oil filtration",
    "used cooking oil collection",
    "commercial kitchen maintenance",
  ],
  authors: [{ name: "FryerCare Operations" }],
  openGraph: {
    title: "FryerCare | Commercial Kitchen Oil Servicing & Filtration",
    description:
      "Solo-operator precision fryer oil management and recycling delivered straight to your restaurant doorstep.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A1D20",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${plusJakartaSans.variable} dark`}
    >
      <body className="min-h-screen bg-background text-content-primary antialiased flex flex-col font-sans selection:bg-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}
