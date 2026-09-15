'use client';

import React from 'react';
import { ComparisonResult } from '@/types/financing';
import { formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { MagneticButton } from '@/components/MagneticButton';
import { X, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';

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
    <section className="w-full max-w-3xl mx-auto editorial-card editorial-card-gold-border p-6 sm:p-10 bg-black rounded-none flex flex-col relative overflow-hidden font-sans animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-none bg-gradient-to-br from-[#c2a25b]/20 to-[#a47e35]/10 border border-[#c2a25b]/40 text-[#c2a25b] shadow-inner">
            <ArrowRightLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <span>Comparativo SAC vs PRICE</span>
            </h2>
            <p className="text-xs text-neutral-400">Análise técnica e financeira detalhada entre os sistemas de amortização</p>
          </div>
        </div>

        <button
          onClick={() => {
            vibrateShort();
            onClose();
          }}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="p-2 rounded-none text-[#c2a25b] hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#c2a25b]/60 transition-all cursor-pointer"
          title="Fechar"
          aria-label="Fechar"
        >
          <X className="w-5 h-5 text-[#c2a25b]" />
        </button>
      </div>

      {/* Banner de Economia */}
      <div className="mb-6 p-4 border border-gold-500/30 bg-neutral-900 rounded-none flex items-center space-x-4 relative z-10">
        <div className="p-2.5 bg-gold-gradient-btn text-black font-medium text-sm sm:text-base shrink-0 rounded-[75px] px-4 font-mono">
          {formatPercent(percentageSavings, 1)}
        </div>
        <div>
          <p className="text-sm sm:text-base text-neutral-300 font-light">
            Economia estimada de <FormattedBRL value={interestSavingsSAC} className="text-emerald-400 font-semibold text-base sm:text-xl" animate /> ao longo do contrato no SAC.
          </p>
        </div>
      </div>

      {/* Grade Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        
        {/* Card SAC */}
        <MouseGlow size={140} className="p-5 sm:p-6 border border-gold-500/50 bg-black rounded-none flex flex-col justify-between shadow-winner-glow-gold">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 rounded-[75px] bg-gold-gradient-btn text-black text-[10px] sm:text-xs uppercase font-medium tracking-wider">
                MAIOR ECONOMIA DE JUROS
              </span>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gold-500" />
            </div>

            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">SAC</h3>
              <span className="text-xs text-neutral-400 font-light block mt-0.5">(Amortização fixa mensal)</span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm border-t border-white/15 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 uppercase tracking-wider">Primeira Parcela:</span>
                <FormattedBRL value={sac.firstInstallment} className="font-medium text-white text-sm sm:text-base" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 uppercase tracking-wider">Última Parcela:</span>
                <FormattedBRL value={sac.lastInstallment} className="font-medium text-white text-sm sm:text-base" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 uppercase tracking-wider">Total de Juros:</span>
                <FormattedBRL value={sac.totalInterest} className="font-medium text-white text-sm sm:text-base" />
              </div>
              <div className="flex justify-between items-center border-t border-white/15 pt-3 font-normal">
                <span className="text-white font-medium uppercase tracking-wider">Total Geral Pago:</span>
                <FormattedBRL value={sac.totalPaid} className="text-white text-base sm:text-lg font-medium" animate />
              </div>
            </div>
          </div>
        </MouseGlow>

        {/* Card PRICE */}
        <MouseGlow size={140} className="p-5 sm:p-6 border border-white/15 bg-black rounded-none flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 rounded-[75px] bg-neutral-800 text-neutral-300 text-[10px] sm:text-xs uppercase font-normal tracking-wider border border-white/10">
                PARCELA INICIAL MENOR
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">PRICE</h3>
              <span className="text-xs text-neutral-400 font-light block mt-0.5">(Prestação fixa mensal)</span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm border-t border-white/15 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 uppercase tracking-wider">Primeira Parcela:</span>
                <FormattedBRL value={price.firstInstallment} className="font-medium text-white text-sm sm:text-base" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 uppercase tracking-wider">Última Parcela:</span>
                <FormattedBRL value={price.lastInstallment} className="font-medium text-white text-sm sm:text-base" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-300 uppercase tracking-wider">Total de Juros:</span>
                <FormattedBRL value={price.totalInterest} className="font-medium text-neutral-300 text-sm sm:text-base" />
              </div>
              <div className="flex justify-between items-center border-t border-white/15 pt-3 font-normal">
                <span className="text-white font-medium uppercase tracking-wider">Total Geral Pago:</span>
                <FormattedBRL value={price.totalPaid} className="text-white text-base sm:text-lg font-medium" animate />
              </div>
            </div>
          </div>
        </MouseGlow>

      </div>

      {/* Footer com botão Voltar à Simulação */}
      <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-end relative z-10">
        <MagneticButton
          type="button"
          onClick={() => {
            vibrateShort();
            onClose();
          }}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="btn-gold-fill btn-lift btn-shine btn-shine-gold flex items-center space-x-1.5 text-xs font-normal uppercase tracking-widest px-6 py-2.5 rounded-[75px] cursor-pointer"
        >
          <span>Voltar à Simulação</span>
        </MagneticButton>
      </div>

    </section>
  );
};
