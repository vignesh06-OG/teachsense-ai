import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { PointerSpotlight } from "@/components/motion/PointerSpotlight";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TeachSense AI | Precision Diagnostic & Differentiated Instruction",
  description:
    "AI-powered diagnostic and differentiated instruction platform for teachers. Misconception classification, adaptive student grouping, targeted remediation, and before/after delta analysis.",
  keywords: [
    "EdTech AI",
    "Misconception Analysis",
    "Differentiated Instruction",
    "Teacher Copilot",
    "Formative Assessment",
    "VORTEXA 3.0",
  ],
  authors: [{ name: "TeachSense AI Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white relative">
        <PointerSpotlight />
        {children}
      </body>
    </html>
  );
}

