"use client";

import React from "react";
import { Shield, ExternalLink, Cpu } from "lucide-react";

export const TerminalFooter: React.FC = () => {
  return (
    <footer className="w-full border-t-2 border-matrix-green bg-matrix-darkgreen/90 py-8 px-4 font-mono text-xs text-matrix-green/80 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start space-x-3 max-w-xl">
          <Shield className="w-5 h-5 text-matrix-mint flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-matrix-mint">LGPD & PRIVACIDADE:</strong> Esta ferramenta é uma interface pública de consulta cadastral corporativa. Não retemos, processamos nem comercializamos dados privados ou histórico de navegação nos servidores. Dados originados diretamente da Receita Federal via BrasilAPI & MinhaReceita.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center space-x-2 border border-matrix-muted px-3 py-1.5 bg-matrix-bg">
            <Cpu className="w-4 h-4 text-matrix-green" />
            <span>HOSPEDADO EM: <strong className="text-matrix-mint">VERCEL EDGE NETWORK</strong></span>
          </div>

          <a
            href="https://github.com/cli/cli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-matrix-mint transition-colors underline"
          >
            <span>GITHUB_CLI_READY</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
