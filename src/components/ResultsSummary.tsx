'use client';

import React from 'react';
import { FinancingResult, ComparisonResult } from '@/types/financing';
import { formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { MagneticButton } from '@/components/MagneticButton';
import { DollarSign, Percent, TrendingDown, Layers, ArrowRightLeft, ShieldCheck, Info } from 'lucide-react';

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

      {/* Seção Exclusiva de Transparência Financeira: Custo Efetivo Total (CET) */}
      <div className="editorial-card p-4 sm:p-5 bg-black border border-white/15 rounded-none space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Custo Efetivo Total (CET) Estimado
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-neutral-400">Taxa Efetiva:</span>
            <span className="text-sm sm:text-base font-bold text-gold-400 font-mono bg-gold-400/10 border border-gold-400/30 px-2.5 py-0.5 rounded-none">
              {formatPercent(result.effectiveYearlyRate, 2)} a.a.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/[0.02] p-2.5 border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider mb-0.5">Taxa de Juros Nominal</span>
            <span className="text-white font-mono font-medium text-xs sm:text-sm">
              {result.installments.length > 0 && result.totalInterest > 0
                ? `${formatPercent(result.effectiveYearlyRate <= 0 ? 0 : (result.totalInterest > 0 ? (result.effectiveYearlyRate - (result.totalInsurancesAndFees > 0 ? (result.effectiveYearlyRate - (result.effectiveYearlyRate * 0.95)) : 0)) : 0), 2)} a.a.`
                : '0,00% a.a.'}
            </span>
          </div>

          <div className="bg-white/[0.02] p-2.5 border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider mb-0.5">Seguros &amp; Taxas Administrativas</span>
            <span className="text-white font-mono font-medium text-xs sm:text-sm">
              <FormattedBRL value={result.totalInsurancesAndFees} />
            </span>
          </div>

          <div className="bg-white/[0.02] p-2.5 border border-white/10">
            <span className="text-neutral-400 block text-[10px] uppercase tracking-wider mb-0.5">Metodologia de Cálculo</span>
            <span className="text-[#c2a25b] font-medium text-xs sm:text-sm flex items-center space-x-1">
              <span>TIR / IRR (Res. CMN 3.517)</span>
            </span>
          </div>
        </div>

        <p className="text-[10px] text-neutral-400 font-light leading-relaxed pt-1 flex items-start space-x-1.5">
          <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
          <span>
            <strong>Estimativa regulatória simplificada:</strong> calculada por Taxa Interna de Retorno (TIR) sobre o fluxo real de prestações somando juros, seguro MIP/DFI e taxa de administração. O CET definitivo de contratação depende da idade do proponente, seguradora e aprovação de crédito na instituição emissora.
          </span>
        </p>
      </div>

      {/* Botão Comparar SAC X PRICE (Fundo Preto, Pill Border, Magnético & Tátil) */}
      <div className="flex justify-center pt-3">
        <MagneticButton
          type="button"
          onClick={onOpenComparison}
          className="btn-lift flex items-center space-x-3 uppercase tracking-widest text-xs sm:text-sm font-medium text-white bg-black border border-white/30 hover:border-white hover:bg-neutral-950 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full transition-all cursor-pointer shadow-xl"
        >
          <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
          <span>COMPARAR SAC X PRICE</span>
        </MagneticButton>
      </div>

    </div>
  );
};
