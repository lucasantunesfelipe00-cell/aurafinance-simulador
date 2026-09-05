'use client';

import React from 'react';
import { FinancingResult, ComparisonResult } from '@/types/financing';
import { formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { MagneticButton } from '@/components/MagneticButton';
import { DollarSign, Percent, TrendingDown, Layers, ArrowRightLeft } from 'lucide-react';

interface ResultsSummaryProps {
  result: FinancingResult;
  comparison: ComparisonResult;
  onOpenComparison: () => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  result,
  comparison,
  onOpenComparison,
}) => {
  const [activeCard, setActiveCard] = React.useState<number | null>(null);
  const lastInteractionRef = React.useRef<{ id: number; time: number }>({ id: 0, time: 0 });

  const handleCardActivate = (cardId: number) => {
    const now = Date.now();
    // Se o mesmo card recebeu dois eventos (pointerdown + click) em menos de 400ms, ignora o segundo para não desativar
    if (lastInteractionRef.current.id === cardId && now - lastInteractionRef.current.time < 400) {
      return;
    }
    lastInteractionRef.current = { id: cardId, time: now };
    setActiveCard((prev) => (prev === cardId ? null : cardId));
  };

  return (
    <div className="space-y-6">

      {/* Grade 4 KPI Cards (Editorial Sharp 0px Corners) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Card 1: Primeira Parcela */}
        <button
          type="button"
          onPointerDown={() => handleCardActivate(1)}
          onClick={() => handleCardActivate(1)}
          className={`text-left p-5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 1
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-3 gap-2 w-full">
            <span className="text-xs sm:text-sm font-normal uppercase tracking-wider text-gold-400 truncate">1ª Parcela</span>
            <DollarSign className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 overflow-hidden w-full">
            <FormattedBRL
              value={result.firstInstallment}
              className="text-base sm:text-xl font-normal text-white tracking-tight break-all sm:break-normal"
              animate
            />
          </div>
        </button>

        {/* Card 2: Última Parcela */}
        <button
          type="button"
          onPointerDown={() => handleCardActivate(2)}
          onClick={() => handleCardActivate(2)}
          className={`text-left p-5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 2
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-3 gap-2 w-full">
            <span className="text-xs sm:text-sm font-normal uppercase tracking-wider text-gold-400 truncate">Última Parcela</span>
            <TrendingDown className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 overflow-hidden w-full">
            <FormattedBRL
              value={result.lastInstallment}
              className="text-base sm:text-xl font-normal text-white tracking-tight break-all sm:break-normal"
              animate
            />
          </div>
          {result.installments.length > 0 && result.installments.length < result.termMonths && (
            <span className="text-[9px] text-emerald-400 mt-1 block font-mono">
              - {result.termMonths - result.installments.length} meses economizados
            </span>
          )}
        </button>

        {/* Card 3: Total de Juros */}
        <button
          type="button"
          onPointerDown={() => handleCardActivate(3)}
          onClick={() => handleCardActivate(3)}
          className={`text-left p-5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 3
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-3 gap-2 w-full">
            <span className="text-xs sm:text-sm font-normal uppercase tracking-wider text-gold-400 truncate">Total de Juros</span>
            <Percent className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 overflow-hidden w-full">
            <FormattedBRL
              value={result.totalInterest}
              className="text-base sm:text-xl font-normal text-white tracking-tight break-all sm:break-normal"
              animate
            />
          </div>
        </button>

        {/* Card 4: Total Geral Pago */}
        <button
          type="button"
          onPointerDown={() => handleCardActivate(4)}
          onClick={() => handleCardActivate(4)}
          className={`text-left p-5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 4
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-gold-500/40 sm:hover:border-gold-400'
          }`}
        >
          <div className="flex justify-between items-start mb-3 gap-2 w-full">
            <span className="text-xs sm:text-sm font-normal uppercase tracking-wider text-gold-400 truncate">Total Geral Pago</span>
            <Layers className="w-4 h-4 text-gold-500 shrink-0" />
          </div>

          <div className="my-1 min-w-0 overflow-hidden w-full">
            <FormattedBRL
              value={result.totalPaid}
              className="text-base sm:text-xl font-normal text-white tracking-tight break-all sm:break-normal"
              animate
            />
          </div>
        </button>

      </div>

      {/* Botão Comparar Lado a Lado (Fundo Preto, Pill Border, Magnético & Tátil) */}
      <div className="flex justify-center pt-3">
        <MagneticButton
          type="button"
          onClick={onOpenComparison}
          className="btn-lift flex items-center space-x-3 uppercase tracking-widest text-xs sm:text-sm font-medium text-white bg-black border border-white/30 hover:border-white hover:bg-neutral-950 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full transition-all cursor-pointer shadow-xl"
        >
          <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
          <span>Comparar Lado a Lado</span>
        </MagneticButton>
      </div>

    </div>
  );
};
