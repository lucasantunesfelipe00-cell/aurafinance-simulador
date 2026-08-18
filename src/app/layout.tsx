import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#07080A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AuraFinance — Simulador de Financiamento & Amortização SAC e PRICE",
  description: "Simule financiamentos imobiliários, automotivos e pessoais com alta precisão matemática. Compare parcelas SAC e PRICE, visualize a evolução dos juros e descubra como economizar.",
  keywords: [
    "Simulador de Financiamento",
    "Financiamento Imobiliário",
    "Tabela SAC",
    "Tabela PRICE",
    "Amortização",
    "Financiamento de Veículos",
    "Calculadora de Juros",
    "AuraFinance",
    "CET",
    "Taxa Selic",
  ],
  authors: [{ name: "AuraFinance Elite" }],
  creator: "AuraFinance",
  publisher: "AuraFinance",
  metadataBase: new URL("https://aurafinance-simulador.vercel.app"),
  openGraph: {
    title: "AuraFinance — Simulador de Financiamento Imobiliário & Amortização",
    description: "Simule financiamentos imobiliários e automotivos com precisão. Compare tabelas SAC e PRICE e veja quanto você economiza em juros.",
    url: "https://aurafinance-simulador.vercel.app",
    siteName: "AuraFinance",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraFinance — Simulador de Financiamento & Amortização",
    description: "Simulador avançado de crédito imobiliário, veicular e pessoal com comparativo SAC vs PRICE.",
  },
  robots: {
    index: true,
    follow: true,
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
      </head>
      <body className="bg-[#07080A] text-gray-100 antialiased font-sans selection:bg-gold-500 selection:text-obsidian-950">
        {children}
      </body>
    </html>
  );
}
