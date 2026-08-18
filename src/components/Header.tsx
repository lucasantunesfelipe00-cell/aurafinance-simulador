'use client';

import React from 'react';
import { ShieldCheck, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenSpecs?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSpecs }) => {
  return (
    <header className="w-full border-b border-gold-500/20 bg-obsidian-950/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Identity */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-gold-100 via-gold-500 to-gold-700 p-[1px] shadow-gold-glow transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-obsidian-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-400 animate-pulse-slow" />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-2xl font-black tracking-tight gold-text-gradient">AURA</span>
              <span className="text-2xl font-light tracking-wider text-white">FINANCE</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gold-500/80 font-medium">
              Simulador de Crédito & Amortização Elite
            </p>
          </div>
        </div>

        {/* Live Market Indicators & Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-obsidian-850 border border-gold-500/20 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-gray-400">Taxa Selic Base:</span>
            <span className="font-semibold text-white">10,50% a.a.</span>
          </div>

          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-obsidian-850 border border-gold-500/20 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-gray-300 font-medium">Algoritmo SAC & PRICE Válido</span>
          </div>

          {onOpenSpecs && (
            <button
              onClick={onOpenSpecs}
              className="flex items-center space-x-2 text-xs font-semibold text-gold-300 hover:text-white px-3 py-1.5 rounded-lg border border-gold-500/30 hover:border-gold-400 bg-obsidian-800/50 hover:bg-gold-500/10 transition-all duration-200"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Especificação</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
