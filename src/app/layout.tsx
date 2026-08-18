import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CNPJ Terminal // CyberLookup Enterprise",
  description: "Plataforma web de consulta cadastral de empresas (CNPJ) ultrarrápida com estética Matrix CRT brutalista.",
  keywords: ["CNPJ", "Consulta CNPJ", "Receita Federal", "BrasilAPI", "Matrix", "Cyberpunk", "Terminal"],
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
          href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-matrix-bg text-matrix-green antialiased font-mono selection:bg-matrix-green selection:text-matrix-bg">
        {children}
      </body>
    </html>
  );
}
