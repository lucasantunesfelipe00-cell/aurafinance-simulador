'use client';

import React, { useState } from 'react';
import { FinancingResult, ComparisonResult, FinancingInputs } from '@/types/financing';
import { formatPercent, calculateFinancing } from '@/lib/financing-calculator';
import { calculateAcquisitionCosts } from '@/lib/acquisition-costs';
import { assessIncomeCommitment } from '@/lib/income-assessment';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { MagneticButton } from '@/components/MagneticButton';
import { copyShareUrlToClipboard } from '@/lib/share-url';
import { saveScenario, generateDefaultName, getSavedScenarios } from '@/lib/saved-scenarios';
import { openWhatsAppChat } from '@/lib/whatsapp';
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
  MessageCircle,
  Building,
  Wallet,
  Scale,
  ShieldCheck,
  Landmark,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IncomeThermometerCard } from '@/components/IncomeThermometerCard';
import { AcquisitionCostsCard } from '@/components/AcquisitionCostsCard';
import { AcceleratedAmortizationCard } from '@/components/AcceleratedAmortizationCard';

interface ResultsSummaryProps {
  result: FinancingResult;
  comparison: ComparisonResult;
  onOpenComparison: () => void;
  onOpenRentVsBuy?: () => void;
  onOpenIncomeAssessment?: () => void;
  onOpenAcquisitionCosts?: () => void;
  inputs?: FinancingInputs;
  baselineResult?: FinancingResult;
  onInputsChange?: (inputs: FinancingInputs) => void;
  isExtraAmortizationOpen?: boolean;
  onToggleExtraAmortization?: () => void;
  onScenarioSaved?: () => void;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  result,
  comparison,
  onOpenComparison,
  onOpenRentVsBuy,
  onOpenIncomeAssessment,
  onOpenAcquisitionCosts,
  inputs,
  baselineResult,
  onInputsChange,
  isExtraAmortizationOpen,
  onToggleExtraAmortization,
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

  const handleWhatsAppConcierge = () => {
    vibrateShort();
    playClickSound();
    const currentInputs = getCurrentInputs();
    openWhatsAppChat(currentInputs, result);
  };

  const lastInstallmentNumber =
    result.installments && result.installments.length > 0
      ? result.installments[result.installments.length - 1].number
      : result.termMonths;

  const baseline =
    baselineResult ||
    calculateFinancing({
      ...getCurrentInputs(),
      extraMonthlyAmortization: 0,
      extraAnnualAmortization: 0,
    });
  const totalInterestSaved = Math.max(0, baseline.totalInterest - result.totalInterest);

  const estimatedAcquisitionCosts = calculateAcquisitionCosts({
    propertyValue: result.propertyValue,
    itbiRate: 3.0,
    registrationRate: 1.2,
    bankAppraisalFee: 3400,
    certificatesFee: 900,
    isFirstPropertySFH: false,
  }).totalCosts;

  const suggestedFamilyIncome = assessIncomeCommitment(
    result.firstInstallment,
    0
  ).minimumRequiredIncome;

  return (
    <div className="space-y-6">

      {/* Grade 9 KPI Cards (Editorial Sharp 0px Corners) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* Card 1: Valor do Imóvel */}
        <button
          type="button"
          onPointerDown={() => handleCardActivate(1)}
          onClick={() => handleCardActivate(1)}
          className={`text-left p-4 sm:p-4.5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 1
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-2.5 gap-2 w-full">
            <span className="text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-gold-400 whitespace-nowrap">Valor do Imóvel</span>
            <Building className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 w-full">
            <FormattedBRL
              value={result.propertyValue}
              className="text-base sm:text-lg lg:text-xl font-normal text-white tracking-tight whitespace-nowrap"
              animate
            />
          </div>
        </button>

        {/* Card 2: Valor de Entrada */}
        <button
          type="button"
          onPointerDown={() => handleCardActivate(2)}
          onClick={() => handleCardActivate(2)}
          className={`text-left p-4 sm:p-4.5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 2
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-2.5 gap-2 w-full">
            <span className="text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-gold-400 whitespace-nowrap">Valor de Entrada</span>
            <Wallet className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 w-full">
            <FormattedBRL
              value={result.downPayment}
              className="text-base sm:text-lg lg:text-xl font-normal text-white tracking-tight whitespace-nowrap"
              animate
            />
          </div>
        </button>

        {/* Card 3: Primeira Parcela */}
        <button
          type="button"
          onPointerDown={() => handleCardActivate(3)}
          onClick={() => handleCardActivate(3)}
          className={`text-left p-4 sm:p-4.5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 3
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-2.5 gap-2 w-full">
            <span className="text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-gold-400 whitespace-nowrap">1ª Parcela</span>
            <DollarSign className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 w-full">
            <FormattedBRL
              value={result.firstInstallment}
              className="text-base sm:text-lg lg:text-xl font-normal text-white tracking-tight whitespace-nowrap"
              animate
            />
          </div>
        </button>

        {/* Card 4: Xª Parcela (Mês final) */}
        <button
          type="button"
          onPointerDown={() => handleCardActivate(4)}
          onClick={() => handleCardActivate(4)}
          className={`text-left p-4 sm:p-4.5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 4
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-2.5 gap-2 w-full">
            <span className="text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-gold-400 whitespace-nowrap">
              {lastInstallmentNumber}ª Parcela
            </span>
            <TrendingDown className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 w-full">
            <FormattedBRL
              value={result.lastInstallment}
              className="text-base sm:text-lg lg:text-xl font-normal text-white tracking-tight whitespace-nowrap"
              animate
            />
          </div>
          {result.installments.length > 0 && result.installments.length < result.termMonths && (
            <span className="text-[10px] text-emerald-400 mt-1 block font-mono whitespace-nowrap">
              - {result.termMonths - result.installments.length} meses economizados
            </span>
          )}
        </button>

        {/* Card 5: Total de Juros */}
        <button
          type="button"
          onPointerDown={() => handleCardActivate(5)}
          onClick={() => handleCardActivate(5)}
          className={`text-left p-4 sm:p-4.5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 5
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-2.5 gap-2 w-full">
            <span className="text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-gold-400 whitespace-nowrap">Total de Juros</span>
            <Percent className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 w-full">
            <FormattedBRL
              value={result.totalInterest}
              className="text-base sm:text-lg lg:text-xl font-normal text-white tracking-tight whitespace-nowrap"
              animate
            />
          </div>
        </button>

        {/* Card 6: Total Geral Pago */}
        <button
          type="button"
          onPointerDown={() => handleCardActivate(6)}
          onClick={() => handleCardActivate(6)}
          className={`text-left p-4 sm:p-4.5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 6
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-gold-500/40 sm:hover:border-gold-400'
          }`}
        >
          <div className="flex justify-between items-start mb-2.5 gap-2 w-full">
            <span className="text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-gold-400 whitespace-nowrap">Total Geral Pago</span>
            <Layers className="w-4 h-4 text-gold-500 shrink-0" />
          </div>

          <div className="my-1 min-w-0 w-full">
            <FormattedBRL
              value={result.totalPaid}
              className="text-base sm:text-lg lg:text-xl font-normal text-white tracking-tight whitespace-nowrap"
              animate
            />
          </div>
        </button>

        {/* Card 7: Economia com Amortização */}
        <button
          type="button"
          onPointerDown={() => {
            handleCardActivate(7);
            if (onToggleExtraAmortization) onToggleExtraAmortization();
          }}
          onClick={() => {
            handleCardActivate(7);
            if (onToggleExtraAmortization) onToggleExtraAmortization();
          }}
          className={`text-left p-4 sm:p-4.5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 7
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-2.5 gap-2 w-full">
            <span className="text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-gold-400 truncate">Economia com Amortização</span>
            <Sparkles className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 w-full">
            <FormattedBRL
              value={totalInterestSaved}
              className="text-base sm:text-lg lg:text-xl font-normal text-white tracking-tight whitespace-nowrap"
              animate
            />
          </div>
        </button>

        {/* Card 8: Custos de Cartório */}
        <button
          type="button"
          onPointerDown={() => {
            handleCardActivate(8);
            if (onOpenAcquisitionCosts) onOpenAcquisitionCosts();
          }}
          onClick={() => {
            handleCardActivate(8);
            if (onOpenAcquisitionCosts) onOpenAcquisitionCosts();
          }}
          className={`text-left p-4 sm:p-4.5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 8
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-2.5 gap-2 w-full">
            <span className="text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-gold-400 whitespace-nowrap">Custos de Cartório</span>
            <Landmark className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 w-full">
            <FormattedBRL
              value={estimatedAcquisitionCosts}
              className="text-base sm:text-lg lg:text-xl font-normal text-white tracking-tight whitespace-nowrap"
              animate
            />
          </div>
        </button>

        {/* Card 9: Renda Familiar Sugerida */}
        <button
          type="button"
          onPointerDown={() => {
            handleCardActivate(9);
            if (onOpenIncomeAssessment) onOpenIncomeAssessment();
          }}
          onClick={() => {
            handleCardActivate(9);
            if (onOpenIncomeAssessment) onOpenIncomeAssessment();
          }}
          className={`text-left p-4 sm:p-4.5 rounded-none flex flex-col justify-between min-w-0 transition-all duration-200 cursor-pointer select-none w-full focus:outline-none bg-black ${
            activeCard === 9
              ? 'border-2 border-gold-400 shadow-[0_0_8px_rgba(194,162,91,0.25)]'
              : 'border border-white/20 sm:hover:border-gold-400/60'
          }`}
        >
          <div className="flex justify-between items-start mb-2.5 gap-2 w-full">
            <span className="text-xs sm:text-xs md:text-sm font-medium uppercase tracking-wider text-gold-400 whitespace-nowrap">Renda Familiar Sugerida</span>
            <ShieldCheck className="w-4 h-4 text-white shrink-0" />
          </div>

          <div className="my-1 min-w-0 w-full">
            <FormattedBRL
              value={suggestedFamilyIncome}
              className="text-base sm:text-lg lg:text-xl font-normal text-white tracking-tight whitespace-nowrap"
              animate
            />
          </div>
        </button>

      </div>

      {/* Simulador de Amortização Acelerada (Abaixo dos resultados da simulação e acima de Custos de transferência e cartório) */}
      <AcceleratedAmortizationCard
        inputs={getCurrentInputs()}
        result={result}
        baselineResult={baselineResult}
        onChange={onInputsChange}
        isOpen={isExtraAmortizationOpen}
        onToggle={onToggleExtraAmortization}
      />

      {/* Estimador de Custos de Cartório, ITBI e Escritura */}
      <AcquisitionCostsCard
        propertyValue={result.propertyValue}
        onOpenDetailedModal={onOpenAcquisitionCosts}
      />

      {/* Termômetro de Renda Mínima Exigida (Regra dos 30%) */}
      <IncomeThermometerCard
        firstInstallment={result.firstInstallment}
        propertyValue={result.propertyValue}
        onOpenDetailedAssessment={onOpenIncomeAssessment}
      />

      {/* 1. Análise Comparativa do Motor Financeiro (Diretamente ligado aos 4 KPIs) */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2.5 sm:pt-3.5">
        <MagneticButton
          type="button"
          onClick={onOpenComparison}
          className="btn-lift flex items-center justify-center space-x-2 uppercase tracking-wider text-xs sm:text-[13px] font-medium sm:font-semibold text-white bg-black border border-gold-400/50 hover:border-gold-300 hover:bg-gold-500/10 py-3 px-5 sm:px-6 rounded-full transition-all cursor-pointer shadow-[0_0_16px_rgba(194,162,91,0.18)] hover:shadow-[0_0_26px_rgba(194,162,91,0.35)] whitespace-nowrap w-full sm:w-auto"
        >
          <ArrowRightLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gold-400 shrink-0" />
          <span>COMPARAR TABELAS: SAC X PRICE</span>
        </MagneticButton>

        {onOpenRentVsBuy && (
          <MagneticButton
            type="button"
            onClick={onOpenRentVsBuy}
            className="btn-lift flex items-center justify-center space-x-2 uppercase tracking-wider text-xs sm:text-[13px] font-medium sm:font-semibold text-white bg-gradient-to-r from-[#1a160d] via-black to-[#1a160d] border border-gold-400 hover:border-gold-300 hover:bg-gold-500/15 py-3 px-5 sm:px-6 rounded-full transition-all cursor-pointer shadow-[0_0_20px_rgba(194,162,91,0.22)] hover:shadow-[0_0_30px_rgba(194,162,91,0.4)] whitespace-nowrap w-full sm:w-auto"
          >
            <Scale className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gold-400 shrink-0" />
            <span>COMPRAR VS. ALUGAR &amp; INVESTIR</span>
          </MagneticButton>
        )}
      </div>

      {/* 2. Hub Separado: Ações do Cenário (Gestão, Compartilhamento e Concierge) */}
      <div className="w-full pt-5 border-t border-white/10 mt-6">
        <div className="w-full flex flex-row items-start justify-center gap-6 sm:gap-4 text-center">
          {/* Botão 1: Salvar Cenário */}
          {!isConfirmingSave && (
            <div className="flex flex-col items-center">
              <MagneticButton
                type="button"
                onClick={handleStartSave}
                aria-label="Salvar Cenário"
                title="Salvar Cenário"
                className="btn-lift group flex items-center justify-center text-xs font-medium text-gold-300 bg-neutral-950 border border-gold-400/50 hover:border-gold-300 hover:bg-gold-500/10 hover:text-gold-200 w-12 h-12 sm:w-auto sm:h-11 sm:min-w-[44px] sm:px-3.5 sm:hover:px-5 rounded-full transition-all duration-300 cursor-pointer shadow-[0_0_12px_rgba(194,162,91,0.15)] hover:shadow-[0_0_20px_rgba(194,162,91,0.35)] active:scale-95"
              >
                <Bookmark className="w-5 h-5 sm:w-4.5 sm:h-4.5 text-gold-400 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="hidden sm:inline-block max-w-0 opacity-0 group-hover:max-w-[160px] group-hover:opacity-100 group-hover:ml-2 overflow-hidden whitespace-nowrap uppercase tracking-wider text-[11px] font-medium transition-all duration-300 ease-out">
                  Salvar Cenário
                </span>
              </MagneticButton>
              <span className="block sm:hidden text-[10px] font-mono tracking-wider uppercase text-gold-300/90 mt-2 max-w-[75px] leading-tight">
                Salvar Cenário
              </span>
            </div>
          )}

          {/* Botão 2: Compartilhar Simulação */}
          <div className="flex flex-col items-center">
            <MagneticButton
              type="button"
              onClick={handleShare}
              aria-label="Compartilhar Simulação"
              title="Compartilhar Simulação"
              className={`btn-lift group flex items-center justify-center text-xs font-medium w-12 h-12 sm:w-auto sm:h-11 sm:min-w-[44px] rounded-full transition-all duration-300 cursor-pointer active:scale-95 ${
                isCopied
                  ? 'bg-emerald-500 text-black border border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.4)] sm:px-5'
                  : 'bg-black text-neutral-200 border border-white/20 hover:border-white/50 hover:text-white hover:bg-neutral-900 shadow-[0_0_12px_rgba(0,0,0,0.8)] hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] sm:px-3.5 sm:hover:px-5'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-5 h-5 sm:w-4.5 sm:h-4.5 text-black shrink-0" />
                  <span className="hidden sm:inline-block sm:ml-2 overflow-hidden whitespace-nowrap uppercase tracking-wider text-[11px] font-medium animate-fadeIn">
                    Link Copiado!
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5 sm:w-4.5 sm:h-4.5 text-neutral-300 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  <span className="hidden sm:inline-block max-w-0 opacity-0 group-hover:max-w-[180px] group-hover:opacity-100 group-hover:ml-2 overflow-hidden whitespace-nowrap uppercase tracking-wider text-[11px] font-medium transition-all duration-300 ease-out">
                    Compartilhar
                  </span>
                </>
              )}
            </MagneticButton>
            <span className={`block sm:hidden text-[10px] font-mono tracking-wider uppercase mt-2 max-w-[80px] leading-tight ${isCopied ? 'text-emerald-400' : 'text-neutral-300'}`}>
              {isCopied ? 'Copiado!' : 'Compartilhar'}
            </span>
          </div>

          {/* Botão 3: Falar com Especialista (Concierge WhatsApp) */}
          <div className="flex flex-col items-center">
            <MagneticButton
              type="button"
              onClick={handleWhatsAppConcierge}
              aria-label="Falar com Especialista"
              title="Falar com Especialista"
              className="btn-lift group flex items-center justify-center text-xs font-medium text-white bg-gradient-to-r from-emerald-950/70 via-black to-emerald-950/70 border border-emerald-500/60 hover:border-emerald-400 hover:from-emerald-900/50 hover:to-emerald-900/50 w-12 h-12 sm:w-auto sm:h-11 sm:min-w-[44px] sm:px-3.5 sm:hover:px-5 rounded-full transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] active:scale-95"
            >
              <MessageCircle className="w-5 h-5 sm:w-4.5 sm:h-4.5 text-emerald-400 group-hover:scale-110 transition-transform duration-200 shrink-0" />
              <span className="hidden sm:inline-block max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-2 overflow-hidden whitespace-nowrap uppercase tracking-wider text-[11px] font-medium text-emerald-300 transition-all duration-300 ease-out">
                Falar com Especialista
              </span>
            </MagneticButton>
            <span className="block sm:hidden text-[10px] font-mono tracking-wider uppercase text-emerald-400 mt-2 max-w-[85px] leading-tight">
              Falar com Especialista
            </span>
          </div>
        </div>
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
