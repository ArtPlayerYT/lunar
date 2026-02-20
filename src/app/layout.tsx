import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/ui/motion-provider";
import { AuthProvider } from "@/lib/auth-context";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUNAR | Elite AI Intelligence",
  description: "The Intelligence of the Night. Powered by Gemini 2.0.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-true-black text-lunar-silver font-sans overflow-x-hidden`}
      >
        <MotionProvider>
          <AuthProvider>{children}</AuthProvider>
        </MotionProvider>
      </body>
    </html>
  );
}

