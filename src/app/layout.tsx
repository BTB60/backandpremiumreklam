import type { Metadata } from "next";
import "./globals.css";
import { WhatsAppChat } from "@/components/ui/WhatsAppChat";

export const metadata: Metadata = {
  title: "Premium Reklam - Reklam və Dekor Xidmətləri",
  description: "Professional reklam və dekor xidmətləri. Vinil, orakal, banner çapı və dizayn.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" data-scroll-behavior="smooth">
      <body className="antialiased font-sans">
        {children}
        <WhatsAppChat />
      </body>
    </html>
  );
}
