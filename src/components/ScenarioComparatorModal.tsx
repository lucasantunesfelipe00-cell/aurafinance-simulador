'use client';

import React from 'react';
import { FinancingInputs } from '@/types/financing';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { MagneticButton } from '@/components/MagneticButton';
import {
  X,
  CheckCircle2,
  ArrowRightLeft,
  Bookmark,
  Sparkles,
  MessageCircle,
  Play,
  Scale,
  TrendingDown,
  Building,
  Wallet,
  DollarSign,
  Percent,
  Layers,
} from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound } from '@/lib/sound';
import { SavedScenario } from '@/lib/saved-scenarios';
import {
  ScenarioItem,
  compareTwoScenarios,
  buildWhatsAppComparisonMessage,
} from '@/lib/scenario-comparator';
import { generateWhatsAppUrl, normalizeWhatsAppPhone } from '@/lib/whatsapp';

interface ScenarioComparatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenarioA: ScenarioItem;
  scenarioB: ScenarioItem;
  availableScenarios: SavedScenario[];
  currentInputs: FinancingInputs;
  onSelectScenarioA?: (item: ScenarioItem) => void;
  onSelectScenarioB?: (item: ScenarioItem) => void;
  onApplyScenario: (inputs: FinancingInputs) => void;
}

export const ScenarioComparatorModal: React.FC<ScenarioComparatorModalProps> = ({
  isOpen,
  onClose,
  scenarioA,
  scenarioB,
  availableScenarios,
  currentInputs,
  onSelectScenarioA,
  onSelectScenarioB,
  onApplyScenario,
}) => {
  if (!isOpen) return null;

  const comparison = compareTwoScenarios(scenarioA, scenarioB);
  const { scenarioA: evaluatedA, scenarioB: evaluatedB, deltas, winners, executiveInsight } = comparison;

  const handleApply = (inputs: FinancingInputs) => {
    vibrateShort();
    playClickSound();
    onApplyScenario(inputs);
    onClose();
  };

  const handleWhatsAppChat = () => {
    vibrateShort();
    playClickSound();
    const message = buildWhatsAppComparisonMessage(comparison);
    const encoded = encodeURIComponent(message);
    const phone = normalizeWhatsAppPhone();
    const url = `https://wa.me/${phone}?text=${encoded}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const allOptions: ScenarioItem[] = [
    { name: 'Cenário Atual Calculado', inputs: currentInputs, isCurrent: true },
    ...availableScenarios.map((s) => ({
      id: s.id,
      name: s.name,
      inputs: s.inputs,
    })),
  ];

  return (
    <section className="w-full max-w-4xl mx-auto editorial-card editorial-card-gold-border p-5 sm:p-8 bg-black rounded-none flex flex-col relative overflow-hidden font-sans animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-none bg-gradient-to-br from-[#c2a25b]/20 to-[#a47e35]/10 border border-[#c2a25b]/40 text-[#c2a25b] shadow-inner">
            <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <span>Comparador de Cenários</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Análise comparativa lado a lado entre simulações e cenários salvos
            </p>
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

      {/* Seletor Rápido de Cenários para Comparação */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-gold-400 block">
            Cenário A (Esquerda):
          </label>
          <select
            value={scenarioA.id || (scenarioA.isCurrent ? '__current__' : scenarioA.name)}
            onChange={(e) => {
              const val = e.target.value;
              const found = allOptions.find((opt) => (opt.id || (opt.isCurrent ? '__current__' : opt.name)) === val);
              if (found && onSelectScenarioA) onSelectScenarioA(found);
            }}
            className="w-full bg-neutral-950 border border-gold-400/40 text-white text-xs sm:text-sm px-3 py-2.5 rounded-none focus:outline-none focus:border-gold-400 font-sans cursor-pointer"
          >
            {allOptions.map((opt) => (
              <option
                key={opt.id || (opt.isCurrent ? '__current__' : opt.name)}
                value={opt.id || (opt.isCurrent ? '__current__' : opt.name)}
                className="bg-black text-white"
              >
                {opt.isCurrent ? '⭐ ' : '📌 '}
                {opt.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-gold-400 block">
            Cenário B (Direita):
          </label>
          <select
            value={scenarioB.id || (scenarioB.isCurrent ? '__current__' : scenarioB.name)}
            onChange={(e) => {
              const val = e.target.value;
              const found = allOptions.find((opt) => (opt.id || (opt.isCurrent ? '__current__' : opt.name)) === val);
              if (found && onSelectScenarioB) onSelectScenarioB(found);
            }}
            className="w-full bg-neutral-950 border border-gold-400/40 text-white text-xs sm:text-sm px-3 py-2.5 rounded-none focus:outline-none focus:border-gold-400 font-sans cursor-pointer"
          >
            {allOptions.map((opt) => (
              <option
                key={opt.id || (opt.isCurrent ? '__current__' : opt.name)}
                value={opt.id || (opt.isCurrent ? '__current__' : opt.name)}
                className="bg-black text-white"
              >
                {opt.isCurrent ? '⭐ ' : '📌 '}
                {opt.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Banner de Insight Executivo / Veredito Inteligente */}
      <div className="mb-6 p-4 border border-gold-500/40 bg-gradient-to-r from-[#1a160d] via-black to-[#1a160d] rounded-none flex items-start space-x-3.5 relative z-10 shadow-[0_0_20px_rgba(194,162,91,0.15)]">
        <div className="p-2 bg-gold-400/20 text-gold-400 rounded-none shrink-0 mt-0.5 border border-gold-400/40">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-gold-400 font-bold block mb-0.5">
            Análise Inteligente da Comparação
          </span>
          <p className="text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
            {executiveInsight}
          </p>
        </div>
      </div>

      {/* Grade de Comparação Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        {/* Coluna Cenário A */}
        <div
          className={`p-5 rounded-none flex flex-col justify-between border bg-black transition-all ${
            winners.totalPaid === 'A'
              ? 'border-gold-400 shadow-[0_0_20px_rgba(194,162,91,0.25)]'
              : 'border-white/20'
          }`}
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 block">
                  {evaluatedA.isCurrent ? 'Cenário Ativo' : 'Cenário Salvo'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-[220px]">
                  {evaluatedA.name}
                </h3>
              </div>
              {winners.totalPaid === 'A' && (
                <span className="px-2.5 py-1 bg-gold-gradient-btn text-black text-[9px] uppercase font-bold tracking-wider rounded-none shrink-0 shadow-sm">
                  🏆 Menor Custo
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs sm:text-sm border-t border-white/10 pt-4 font-sans">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Valor do Imóvel:</span>
                <FormattedBRL value={evaluatedA.inputs.propertyValue} className="text-white font-medium" />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Entrada:</span>
                <div className="text-right">
                  <FormattedBRL value={evaluatedA.inputs.downPayment} className="text-white font-medium" />
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    ({((evaluatedA.inputs.downPayment / evaluatedA.inputs.propertyValue) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Valor Financiado:</span>
                <FormattedBRL value={evaluatedA.result.loanAmount} className="text-white font-medium" />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Sistema &amp; Taxa:</span>
                <span className="text-white font-mono font-medium">
                  {evaluatedA.inputs.amortizationMethod} • {formatPercent(evaluatedA.inputs.interestRateYearly, 2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Prazo:</span>
                <span className="text-white font-mono font-medium">
                  {evaluatedA.inputs.termMonths} meses ({Math.round(evaluatedA.inputs.termMonths / 12)} anos)
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-neutral-400">1ª Parcela:</span>
                <div className="text-right">
                  <FormattedBRL value={evaluatedA.result.firstInstallment} className="text-white font-bold" />
                  {winners.firstInstallment === 'A' && (
                    <span className="text-[10px] text-emerald-400 block font-mono font-medium">
                      ✓ Mais acessível
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Total de Juros:</span>
                <div className="text-right">
                  <FormattedBRL
                    value={evaluatedA.result.totalInterest}
                    className={`font-medium ${winners.totalInterest === 'A' ? 'text-gold-300 font-bold' : 'text-white'}`}
                  />
                  {winners.totalInterest === 'A' && deltas.interestSavings > 0 && (
                    <span className="text-[10px] text-emerald-400 block font-mono">
                      Economiza {formatBRL(deltas.interestSavings)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gold-400/30">
                <span className="text-gold-400 font-medium">Total Geral Pago:</span>
                <div className="text-right">
                  <FormattedBRL
                    value={evaluatedA.result.totalPaid}
                    className={`text-sm sm:text-base font-bold ${winners.totalPaid === 'A' ? 'text-gold-400' : 'text-white'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => handleApply(evaluatedA.inputs)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs uppercase font-medium tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 text-gold-400" />
              <span>Carregar Cenário A no Simulador</span>
            </button>
          </div>
        </div>

        {/* Coluna Cenário B */}
        <div
          className={`p-5 rounded-none flex flex-col justify-between border bg-black transition-all ${
            winners.totalPaid === 'B'
              ? 'border-gold-400 shadow-[0_0_20px_rgba(194,162,91,0.25)]'
              : 'border border-white/20'
          }`}
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 block">
                  {evaluatedB.isCurrent ? 'Cenário Ativo' : 'Cenário Salvo'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-[220px]">
                  {evaluatedB.name}
                </h3>
              </div>
              {winners.totalPaid === 'B' && (
                <span className="px-2.5 py-1 bg-gold-gradient-btn text-black text-[9px] uppercase font-bold tracking-wider rounded-none shrink-0 shadow-sm">
                  🏆 Menor Custo
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs sm:text-sm border-t border-white/10 pt-4 font-sans">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Valor do Imóvel:</span>
                <FormattedBRL value={evaluatedB.inputs.propertyValue} className="text-white font-medium" />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Entrada:</span>
                <div className="text-right">
                  <FormattedBRL value={evaluatedB.inputs.downPayment} className="text-white font-medium" />
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    ({((evaluatedB.inputs.downPayment / evaluatedB.inputs.propertyValue) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Valor Financiado:</span>
                <FormattedBRL value={evaluatedB.result.loanAmount} className="text-white font-medium" />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Sistema &amp; Taxa:</span>
                <span className="text-white font-mono font-medium">
                  {evaluatedB.inputs.amortizationMethod} • {formatPercent(evaluatedB.inputs.interestRateYearly, 2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Prazo:</span>
                <span className="text-white font-mono font-medium">
                  {evaluatedB.inputs.termMonths} meses ({Math.round(evaluatedB.inputs.termMonths / 12)} anos)
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-neutral-400">1ª Parcela:</span>
                <div className="text-right">
                  <FormattedBRL value={evaluatedB.result.firstInstallment} className="text-white font-bold" />
                  {winners.firstInstallment === 'B' && (
                    <span className="text-[10px] text-emerald-400 block font-mono font-medium">
                      ✓ Mais acessível
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Total de Juros:</span>
                <div className="text-right">
                  <FormattedBRL
                    value={evaluatedB.result.totalInterest}
                    className={`font-medium ${winners.totalInterest === 'B' ? 'text-gold-300 font-bold' : 'text-white'}`}
                  />
                  {winners.totalInterest === 'B' && deltas.interestSavings > 0 && (
                    <span className="text-[10px] text-emerald-400 block font-mono">
                      Economiza {formatBRL(deltas.interestSavings)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gold-400/30">
                <span className="text-gold-400 font-medium">Total Geral Pago:</span>
                <div className="text-right">
                  <FormattedBRL
                    value={evaluatedB.result.totalPaid}
                    className={`text-sm sm:text-base font-bold ${winners.totalPaid === 'B' ? 'text-gold-400' : 'text-white'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => handleApply(evaluatedB.inputs)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs uppercase font-medium tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 text-gold-400" />
              <span>Carregar Cenário B no Simulador</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ações do Rodapé */}
      <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <p className="text-xs text-neutral-400 font-light text-center sm:text-left">
          💡 Os cálculos utilizam as mesmas regras financeiras e bancárias homologadas.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <MagneticButton
            type="button"
            onClick={handleWhatsAppChat}
            className="btn-lift flex items-center justify-center space-x-2 uppercase tracking-wider text-xs font-medium text-white bg-gradient-to-r from-emerald-950/70 via-black to-emerald-950/70 border border-emerald-500/60 hover:border-emerald-400 hover:from-emerald-900/50 hover:to-emerald-900/50 py-3 px-5 rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] w-full sm:w-auto group"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="text-white group-hover:text-emerald-300 transition-colors">
              Falar com Especialista sobre esta Comparação
            </span>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};
