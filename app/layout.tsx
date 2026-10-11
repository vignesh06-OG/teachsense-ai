import type { Metadata } from "next";
import "./globals.css";

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
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
