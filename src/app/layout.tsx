import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";
import { CustomCursor } from "@/components/CustomCursor";
import { SoundEffects } from "@/components/SoundEffects";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  applicationName: "Brasil Finance",
  title: {
    default: "Brasil Finance — Inteligência Financeira Imobiliária",
    template: "%s | Brasil Finance",
  },
  description: "Inteligência financeira para seus imóveis. Simulações avançadas de amortização SAC e PRICE, comparativos de taxas e gestão de crédito imobiliário.",
  keywords: [
    "Brasil Finance",
    "Simulador de Financiamento",
    "Financiamento Imobiliário",
    "Inteligência Financeira",
    "Tabela SAC",
    "Tabela PRICE",
    "Amortização Constante",
    "Calculadora de Juros Imobiliários",
    "Crédito Imobiliário",
    "Portabilidade de Financiamento",
  ],
  authors: [{ name: "Brasil Finance" }],
  creator: "Brasil Finance",
  publisher: "Brasil Finance",
  manifest: "/manifest.json",
  metadataBase: new URL("https://brasil-finance-lucas-antunes.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.png"],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
      { url: "/apple-touch-icon-precomposed.png", type: "image/png", sizes: "180x180" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Brasil Finance",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Brasil Finance — Inteligência Financeira Imobiliária",
    description: "Inteligência financeira para seus imóveis. Compare sistemas SAC e PRICE e simule economias de amortização.",
    url: "https://brasil-finance-lucas-antunes.vercel.app",
    siteName: "Brasil Finance",
    images: [
      {
        url: "https://brasil-finance-lucas-antunes.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Brasil Finance — Inteligência Financeira Imobiliária",
        type: "image/png",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brasil Finance — Inteligência Financeira Imobiliária",
    description: "Inteligência financeira para seus imóveis com comparativo avançado de amortização.",
    images: ["https://brasil-finance-lucas-antunes.vercel.app/og-image.png"],
    creator: "@brasilfinance",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Tags explícitas de Ícones e Web App para iOS (iPhone Atalho) */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-precomposed.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Brasil Finance" />

        {/* Fallback de Meta Tags Explícitas em HTML para Web Scrapers do WhatsApp / Facebook / LinkedIn */}
        <meta property="og:title" content="Brasil Finance — Inteligência Financeira Imobiliária" />
        <meta property="og:description" content="Inteligência financeira para seus imóveis. Simulações avançadas de amortização SAC e PRICE." />
        <meta property="og:image" content="https://brasil-finance-lucas-antunes.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://brasil-finance-lucas-antunes.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Brasil Finance" />
      </head>
      <body className="bg-black text-gray-100 antialiased font-sans selection:bg-gold-500 selection:text-obsidian-950">
        <PwaRegister />
        <CustomCursor />
        <SoundEffects />
        {children}
      </body>
    </html>
  );
}
