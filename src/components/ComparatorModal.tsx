'use client';

import React from 'react';
import { ComparisonResult } from '@/types/financing';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { X, CheckCircle2, Award, ArrowRight, ShieldCheck } from 'lucide-react';

interface ComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparison: ComparisonResult;
}

export const ComparatorModal: React.FC<ComparatorModalProps> = ({
  isOpen,
  onClose,
  comparison,
}) => {
  if (!isOpen) return null;

  const { sac, price, interestSavingsSAC, percentageSavings } = comparison;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Container */}
      <div className="glass-card w-full max-w-4xl rounded-2xl border border-gold-500/30 p-6 sm:p-8 relative shadow-gold-glow-lg overflow-hidden">
        
        {/* Luzes decorativas */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white bg-obsidian-850 border border-gold-500/20 hover:border-gold-400 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título do Modal */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gold-400 mb-1">
            <Award className="w-4 h-4" />
            <span>Matriz de Decisão Financeira</span>
          </div>
          <h2 className="text-2xl font-black text-white">Comparativo SAC vs PRICE</h2>
          <p className="text-xs text-gray-400">Analise qual modalidade é mais vantajosa para o seu planejamento</p>
        </div>

        {/* Banner de Economia Destacado */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-gold-500/20 via-gold-600/10 to-obsidian-950 border border-gold-400/40 flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gold-500 text-obsidian-950 font-black text-xl shrink-0">
            {formatPercent(percentageSavings, 1)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">O Sistema SAC economiza juros significativos!</h4>
            <p className="text-xs text-amber-200">
              Economia líquida de <strong className="font-mono text-white text-sm">{formatBRL(interestSavingsSAC)}</strong> ao longo dos {sac.termMonths} meses.
            </p>
          </div>
        </div>

        {/* Tabela de Comparação Lado a Lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Card SAC */}
          <div className="p-6 rounded-2xl bg-obsidian-850/80 border-2 border-gold-400/60 shadow-gold-glow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-500/40">
                RECOMENDADO PARA ECONOMIA
              </span>
              <CheckCircle2 className="w-5 h-5 text-gold-400" />
            </div>

            <h3 className="text-xl font-bold text-white mb-4">SAC (Amortização Constante)</h3>

            <div className="space-y-3 text-xs border-t border-gold-500/20 pt-4 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Primeira Parcela:</span>
                <span className="font-bold text-white">{formatBRL(sac.firstInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Última Parcela:</span>
                <span className="font-bold text-emerald-400">{formatBRL(sac.lastInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total de Juros:</span>
                <span className="font-bold text-gold-400">{formatBRL(sac.totalInterest)}</span>
              </div>
              <div className="flex justify-between border-t border-obsidian-700 pt-2 font-bold text-sm">
                <span className="text-white">Total Pago:</span>
                <span className="text-white">{formatBRL(sac.totalPaid)}</span>
              </div>
            </div>
          </div>

          {/* Card PRICE */}
          <div className="p-6 rounded-2xl bg-obsidian-950/60 border border-gold-500/20 relative">
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 rounded-full bg-obsidian-800 text-gray-400 text-xs font-bold border border-obsidian-700">
                PARCELA INICIAL MENOR
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">PRICE (Prestação Fixo)</h3>

            <div className="space-y-3 text-xs border-t border-gold-500/20 pt-4 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Primeira Parcela:</span>
                <span className="font-bold text-white">{formatBRL(price.firstInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Última Parcela:</span>
                <span className="font-bold text-white">{formatBRL(price.lastInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total de Juros:</span>
                <span className="font-bold text-amber-500">{formatBRL(price.totalInterest)}</span>
              </div>
              <div className="flex justify-between border-t border-obsidian-700 pt-2 font-bold text-sm">
                <span className="text-white">Total Pago:</span>
                <span className="text-white">{formatBRL(price.totalPaid)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer do Modal */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="btn-gold-metallic py-2.5 px-6 rounded-xl text-xs font-bold"
          >
            Entendido, Fechar Comparativo
          </button>
        </div>

      </div>
    </div>
  );
};
