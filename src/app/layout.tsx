import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";
import { CustomCursor } from "@/components/CustomCursor";
import { SoundEffects } from "@/components/SoundEffects";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080A" },
    { media: "(prefers-color-scheme: light)", color: "#D4AF37" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  applicationName: "BrasilFinance",
  title: {
    default: "BrasilFinance — Simulador de Financiamento & Amortização SAC e PRICE",
    template: "%s | BrasilFinance",
  },
  description: "Simule financiamentos imobiliários, automotivos e pessoais com máxima precisão. Compare tabelas SAC e PRICE, analise gráficos de evolução de juros e exporte cronogramas completos.",
  keywords: [
    "BrasilFinance",
    "Simulador de Financiamento",
    "Financiamento Imobiliário",
    "Financiamento de Veículos",
    "Tabela SAC",
    "Tabela PRICE",
    "Amortização Constante",
    "Calculadora de Juros",
    "Custo Efetivo Total",
    "CET",
    "Selic",
    "Simulador de Crédito",
  ],
  authors: [{ name: "BrasilFinance Engineering Team" }],
  creator: "BrasilFinance",
  publisher: "BrasilFinance",
  manifest: "/manifest.json",
  metadataBase: new URL("https://brasilfinance-simulador.vercel.app"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BrasilFinance",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "BrasilFinance — Simulador de Financiamento & Amortização SAC e PRICE",
    description: "Simulador avançado de crédito imobiliário, veicular e pessoal. Compare os sistemas SAC e PRICE e veja a economia em juros em tempo real.",
    url: "https://brasilfinance-simulador.vercel.app",
    siteName: "BrasilFinance",
    images: [
      {
        url: "https://brasilfinance-simulador.vercel.app/og-image.svg",
        width: 1200,
        height: 630,
        alt: "BrasilFinance — Simulador de Financiamento & Amortização",
        type: "image/svg+xml",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrasilFinance — Simulador de Financiamento & Amortização",
    description: "Simulador de crédito imobiliário, veicular e pessoal com comparativo avançado de amortização SAC vs PRICE.",
    images: ["https://brasilfinance-simulador.vercel.app/og-image.svg"],
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

        {/* Fallback de Meta Tags Explícitas em HTML para Web Scrapers do WhatsApp / Facebook */}
        <meta property="og:title" content="BrasilFinance — Simulador de Financiamento & Amortização SAC e PRICE" />
        <meta property="og:description" content="Simule financiamentos imobiliários, automotivos e pessoais com máxima precisão. Compare tabelas SAC e PRICE e economize juros." />
        <meta property="og:image" content="https://brasilfinance-simulador.vercel.app/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://brasilfinance-simulador.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BrasilFinance" />
      </head>
      <body className="bg-[#07080A] text-gray-100 antialiased font-sans selection:bg-gold-500 selection:text-obsidian-950">
        <PwaRegister />
        <CustomCursor />
        <SoundEffects />
        {children}
      </body>
    </html>
  );
}
