'use client';

import React, { useState } from 'react';
import { FinancingResult, ComparisonResult, FinancingInputs } from '@/types/financing';
import { formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { MagneticButton } from '@/components/MagneticButton';
import { copyShareUrlToClipboard } from '@/lib/share-url';
import { saveScenario, generateDefaultName, getSavedScenarios } from '@/lib/saved-scenarios';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound } from '@/lib/sound';
import {
  DollarSign,
  Percent,
  TrendingDown,
  Layers,
  ArrowRightLeft,
  Share2,
  Check,
  Bookmark,
  X,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultsSummaryProps {
  result: FinancingResult;
  comparison: ComparisonResult;
  onOpenComparison: () => void;
  inputs?: FinancingInputs;
  onScenarioSaved?: () => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  result,
  comparison,
  onOpenComparison,
  inputs,
  onScenarioSaved,
}) => {
  const [activeCard, setActiveCard] = React.useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const [scenarioNameInput, setScenarioNameInput] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
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

  const getCurrentInputs = (): FinancingInputs => {
    return (
      inputs || {
        category: 'property',
        propertyValue: result.propertyValue,
        downPayment: result.downPayment,
        downPaymentPercent: (result.downPayment / result.propertyValue) * 100,
        interestRateYearly: 10.5,
        termMonths: result.termMonths,
        amortizationMethod: result.method,
        includeInsurances: true,
        monthlyAdminFee: 25,
        mipRateYearly: 0.021,
        dfiRateYearly: 0.008,
      }
    );
  };

  const handleShare = async () => {
    vibrateShort();
    playClickSound();

    const currentInputs = getCurrentInputs();
    const success = await copyShareUrlToClipboard(currentInputs);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const handleStartSave = () => {
    vibrateShort();
    playClickSound();
    const currentInputs = getCurrentInputs();
    const count = getSavedScenarios().length;
    setScenarioNameInput(generateDefaultName(currentInputs, count));
    setSaveError(null);
    setIsConfirmingSave(true);
  };

  const handleCancelSave = () => {
    vibrateShort();
    playClickSound();
    setIsConfirmingSave(false);
    setSaveError(null);
  };

  const handleConfirmSave = () => {
    vibrateShort();
    playClickSound();
    const currentInputs = getCurrentInputs();
    const res = saveScenario(scenarioNameInput, currentInputs);
    if (!res.success) {
      setSaveError(res.error || 'Não foi possível salvar o cenário.');
      return;
    }

    setIsConfirmingSave(false);
    setSaveError(null);
    if (onScenarioSaved) {
      onScenarioSaved();
    }
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

      {/* Ações Finais: 1. Comparar SAC x PRICE | 2. Salvar Cenário | 3. Compartilhar Simulação */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 text-center">
        {/* 1. Botão de Comparar */}
        <MagneticButton
          type="button"
          onClick={onOpenComparison}
          className="btn-lift flex items-center justify-center space-x-2 uppercase tracking-widest text-xs font-medium text-white bg-black border border-gold-400/60 hover:border-gold-400 hover:bg-neutral-950 px-5 sm:px-6 py-3.5 rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(194,162,91,0.2)] hover:shadow-[0_0_25px_rgba(194,162,91,0.35)] w-full sm:w-auto"
        >
          <ArrowRightLeft className="w-4 h-4 text-gold-400 shrink-0" />
          <span>COMPARAR SAC X PRICE</span>
        </MagneticButton>

        {/* 2. Botão de Salvar Cenário */}
        {!isConfirmingSave && (
          <MagneticButton
            type="button"
            onClick={handleStartSave}
            className="btn-lift flex items-center justify-center space-x-2 uppercase tracking-widest text-xs font-medium text-black bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] hover:from-[#b88f3c] hover:to-[#b88f3c] px-5 sm:px-6 py-3.5 rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(194,162,91,0.25)] hover:shadow-[0_0_25px_rgba(194,162,91,0.4)] w-full sm:w-auto"
          >
            <Bookmark className="w-4 h-4 text-black shrink-0" />
            <span>SALVAR CENÁRIO</span>
          </MagneticButton>
        )}

        {/* 3. Botão de Compartilhar (Fundo Preto + Texto Branco) */}
        <MagneticButton
          type="button"
          onClick={handleShare}
          className={`btn-lift flex items-center justify-center space-x-2 uppercase tracking-widest text-xs font-medium px-5 sm:px-6 py-3.5 rounded-full transition-all cursor-pointer w-full sm:w-auto ${
            isCopied
              ? 'bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
              : 'bg-black text-white border border-white/20 hover:border-gold-400 hover:bg-neutral-950 shadow-[0_0_15px_rgba(0,0,0,0.8)] hover:shadow-[0_0_20px_rgba(194,162,91,0.2)]'
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-black shrink-0" />
              <span>LINK COPIADO!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-white shrink-0" />
              <span>COMPARTILHAR SIMULAÇÃO</span>
            </>
          )}
        </MagneticButton>
      </div>

      {/* Caixa de Confirmação do Salvamento do Cenário */}
      <AnimatePresence>
        {isConfirmingSave && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-gradient-to-br from-[#1c180e] via-black to-black border border-gold-400/70 rounded-none shadow-[0_0_25px_rgba(194,162,91,0.25)] max-w-xl mx-auto space-y-3 font-sans select-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <Bookmark className="w-4 h-4" /> Nomear e Confirmar Cenário
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={scenarioNameInput}
                onChange={(e) => {
                  setScenarioNameInput(e.target.value);
                  if (saveError) setSaveError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmSave();
                  if (e.key === 'Escape') handleCancelSave();
                }}
                placeholder="Nome do cenário (ex: Apto Jardins R$ 1.2M)..."
                className="flex-1 px-3.5 py-2.5 bg-black border border-white/20 text-white text-xs sm:text-sm focus:outline-none focus:border-gold-400 font-sans"
                autoFocus
              />

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  className="px-4 py-2.5 bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] hover:from-[#b88f3c] hover:to-[#b88f3c] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-black" /> Confirmar
                </button>

                <button
                  type="button"
                  onClick={handleCancelSave}
                  className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white font-medium text-xs uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" /> Cancelar
                </button>
              </div>
            </div>

            {saveError && (
              <p className="text-xs text-red-400 bg-red-950/50 p-2.5 border border-red-500/40 font-mono animate-fadeIn">
                {saveError}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isCopied && (
        <p className="text-center text-xs font-mono text-emerald-400 animate-fadeIn -mt-2">
          ✓ Link copiado para a área de transferência! Cole no WhatsApp, e-mail ou redes sociais.
        </p>
      )}

    </div>
  );
};
