'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSpecs?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
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
          </div>
        </div>

      </div>
    </header>
  );
};
