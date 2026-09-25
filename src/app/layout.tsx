import type { Metadata } from "next";
import { Fraunces, Karla, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/state/auth-context";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DistraAI — Disaster Intelligence Dashboard",
  description:
    "Real-time flood and landslide risk assessment powered by satellite imagery, environmental data, and machine learning. Monitor risk scores, active alerts, and community reports.",
  keywords: [
    "disaster intelligence",
    "flood risk",
    "landslide detection",
    "satellite imagery",
    "risk assessment",
    "early warning system",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${karla.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
