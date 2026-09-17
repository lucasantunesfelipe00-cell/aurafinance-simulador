'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FinancingInputs, FinancingResult } from '@/types/financing';
import { formatBRL, formatPercent, calculateFinancing } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import {
  Zap,
  ChevronDown,
  Sparkles,
  TrendingDown,
  Coins,
  Calendar,
  Clock,
  Percent,
  MessageCircle,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound, playTypeSound } from '@/lib/sound';
import { normalizeWhatsAppPhone, buildWhatsAppAmortizationMessage } from '@/lib/whatsapp';

function formatCurrencyMask(val: number): string {
  if (isNaN(val) || val === 0) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

interface AcceleratedAmortizationCardProps {
  inputs: FinancingInputs;
  result: FinancingResult;
  baselineResult?: FinancingResult;
  onChange?: (newInputs: FinancingInputs) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
}

export const AcceleratedAmortizationCard: React.FC<AcceleratedAmortizationCardProps> = ({
  inputs,
  result,
  baselineResult: customBaselineResult,
  onChange,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  defaultOpen = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    vibrateShort();
    playClickSound();
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const [maskedMonthly, setMaskedMonthly] = useState(
    inputs.extraMonthlyAmortization ? formatCurrencyMask(inputs.extraMonthlyAmortization) : ''
  );
  const [maskedAnnual, setMaskedAnnual] = useState(
    inputs.extraAnnualAmortization ? formatCurrencyMask(inputs.extraAnnualAmortization) : ''
  );

  // Sync masks when external inputs change
  useEffect(() => {
    setMaskedMonthly(
      inputs.extraMonthlyAmortization ? formatCurrencyMask(inputs.extraMonthlyAmortization) : ''
    );
  }, [inputs.extraMonthlyAmortization]);

  useEffect(() => {
    setMaskedAnnual(
      inputs.extraAnnualAmortization ? formatCurrencyMask(inputs.extraAnnualAmortization) : ''
    );
  }, [inputs.extraAnnualAmortization]);

  // Baseline comparison for savings calculation
  const baseline = useMemo(() => {
    return (
      customBaselineResult ||
      calculateFinancing({
        ...inputs,
        extraMonthlyAmortization: 0,
        extraAnnualAmortization: 0,
      })
    );
  }, [customBaselineResult, inputs]);

  const isAmortizationActive =
    (inputs.extraMonthlyAmortization && inputs.extraMonthlyAmortization > 0) ||
    (inputs.extraAnnualAmortization && inputs.extraAnnualAmortization > 0);

  const baselineMonths = baseline.installments.length || inputs.termMonths;
  const currentMonths = result.installments.length;
  const monthsSaved = Math.max(0, baselineMonths - currentMonths);
  const yearsSaved = (monthsSaved / 12).toFixed(1);

  const totalInterestSaved = Math.max(0, baseline.totalInterest - result.totalInterest);
  const interestSavedPct =
    baseline.totalInterest > 0
      ? Math.min(100, (totalInterestSaved / baseline.totalInterest) * 100)
      : 0;

  const handleMonthlyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    const digitsOnly = valStr.replace(/\D/g, '');
    const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
    setMaskedMonthly(digitsOnly ? formatCurrencyMask(numericVal) : '');

    const val = Math.max(0, numericVal);
    const updated = { ...inputs, extraMonthlyAmortization: val };
    if (onChange) onChange(updated);
    playTypeSound();
  };

  const handleMonthlySliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMaskedMonthly(val > 0 ? formatCurrencyMask(val) : '');
    const updated = { ...inputs, extraMonthlyAmortization: val };
    if (onChange) onChange(updated);
    vibrateShort();
  };

  const handleQuickMonthlyPreset = (amount: number) => {
    vibrateShort();
    playClickSound();
    setMaskedMonthly(amount > 0 ? formatCurrencyMask(amount) : '');
    const updated = { ...inputs, extraMonthlyAmortization: amount };
    if (onChange) onChange(updated);
  };

  const handleAnnualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    const digitsOnly = valStr.replace(/\D/g, '');
    const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
    setMaskedAnnual(digitsOnly ? formatCurrencyMask(numericVal) : '');

    const val = Math.max(0, numericVal);
    const updated = { ...inputs, extraAnnualAmortization: val };
    if (onChange) onChange(updated);
    playTypeSound();
  };

  const handleAnnualSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMaskedAnnual(val > 0 ? formatCurrencyMask(val) : '');
    const updated = { ...inputs, extraAnnualAmortization: val };
    if (onChange) onChange(updated);
    vibrateShort();
  };

  const handleQuickAnnualPreset = (amount: number) => {
    vibrateShort();
    playClickSound();
    setMaskedAnnual(amount > 0 ? formatCurrencyMask(amount) : '');
    const updated = { ...inputs, extraAnnualAmortization: amount };
    if (onChange) onChange(updated);
  };

  const handleClearAmortization = () => {
    vibrateShort();
    playClickSound();
    setMaskedMonthly('');
    setMaskedAnnual('');
    const updated = {
      ...inputs,
      extraMonthlyAmortization: 0,
      extraAnnualAmortization: 0,
    };
    if (onChange) onChange(updated);
  };

  const handleShareWhatsApp = () => {
    vibrateShort();
    playClickSound();
    const msg = buildWhatsAppAmortizationMessage(inputs, baseline, result);
    const phone = normalizeWhatsAppPhone('');
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="amortizacao-acelerada-section"
      className={`group editorial-card border bg-black rounded-none relative overflow-hidden transition-all duration-300 font-sans scroll-mt-24 ${
        isOpen
          ? '!border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.25)]'
          : 'border-white/20 hover:!border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] focus-within:!border-amber-400'
      }`}
    >
      {/* Glow de ambientação dourado sutil */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-[#c2a25b]/10 via-[#a47e35]/5 to-transparent pointer-events-none" />

      {/* Header do Card (Clicável para expandir/recolher) */}
      <div
        onClick={handleToggle}
        onMouseEnter={() => setCursorVariant('button')}
        onMouseLeave={() => setCursorVariant('default')}
        className="w-full p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start sm:items-center space-x-3 min-w-0">
          <div
            className={`p-2 sm:p-2.5 border shrink-0 transition-all duration-300 ${
              isOpen
                ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-gradient-to-br from-[#c2a25b]/20 to-[#a47e35]/10 border-[#c2a25b]/40 text-gold-400 group-hover:border-amber-400 group-hover:bg-amber-400/20 group-hover:text-amber-300'
            }`}
          >
            <Zap
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                isOpen ? 'text-amber-300' : 'text-gold-400 group-hover:text-amber-300'
              }`}
            />
          </div>

          <div className="min-w-0">
            <span
              className={`text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors duration-200 block truncate ${
                isOpen ? 'text-amber-300' : 'text-gold-400 group-hover:text-amber-300'
              }`}
            >
              Simulador de Amortização Acelerada
            </span>
          </div>
        </div>

        {/* Resumo do Impacto + Botão de Expansão */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <div className="text-left sm:text-right">
            <span
              className={`text-[10px] sm:text-xs uppercase tracking-wider block transition-colors duration-200 ${
                isOpen ? 'text-amber-400' : 'text-neutral-400 group-hover:text-amber-400'
              }`}
            >
              {isAmortizationActive && totalInterestSaved > 0 ? 'Economia em Juros' : 'Economia Estimada'}
            </span>
            <FormattedBRL
              value={totalInterestSaved}
              className={`text-sm sm:text-base lg:text-lg font-semibold tracking-tight transition-colors duration-200 ${
                isOpen ? 'text-amber-300' : 'text-white group-hover:text-amber-300'
              }`}
              animate
            />
          </div>

          <button
            type="button"
            aria-label={isOpen ? 'Recolher simulador de amortização' : 'Expandir simulador de amortização'}
            className={`p-1.5 rounded-none border transition-all duration-200 ${
              isOpen
                ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : 'bg-white/5 border-white/15 text-neutral-300 group-hover:border-amber-400/50 group-hover:text-amber-300'
            }`}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isOpen ? 'rotate-180 text-amber-300' : 'group-hover:text-amber-300'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Conteúdo Expansível com Controles e Gráficos */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 bg-neutral-950/60 p-4 sm:p-6 space-y-5"
          >
            {/* Controles de Aportes: Mensal e Anual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Controle 1: Aporte Mensal Extra */}
              <div className="p-3.5 bg-black/70 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
                    <Coins className="w-3.5 h-3.5 text-gold-400" />
                    <span>Aporte Mensal Extra</span>
                  </label>
                  <div className="flex items-center bg-neutral-900 border border-white/20 focus-within:border-gold-400 rounded-none px-2 py-0.5">
                    <span className="text-gold-400 text-xs font-mono font-medium mr-1">R$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={maskedMonthly}
                      onChange={handleMonthlyInputChange}
                      placeholder="0,00"
                      onMouseEnter={() => setCursorVariant('input')}
                      onMouseLeave={() => setCursorVariant('default')}
                      className="w-20 sm:w-24 bg-transparent text-right font-mono text-white text-xs sm:text-sm focus:outline-none placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                <div
                  className="py-1 cursor-pointer"
                  onMouseEnter={() => setCursorVariant('native')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={inputs.extraMonthlyAmortization || 0}
                    onChange={handleMonthlySliderChange}
                    className="w-full cursor-pointer accent-[#c2a25b]"
                  />
                </div>

                {/* Quick Presets Chips */}
                <div className="flex items-center justify-between gap-1 pt-0.5 flex-wrap">
                  {[200, 500, 1000, 2000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleQuickMonthlyPreset(preset)}
                      className={`text-[9px] font-mono px-2 py-0.5 border transition-all cursor-pointer ${
                        inputs.extraMonthlyAmortization === preset
                          ? 'bg-gold-500/20 text-gold-300 border-gold-400/50 shadow-[0_0_8px_rgba(194,162,91,0.2)]'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      +{formatBRL(preset)}
                    </button>
                  ))}
                  {inputs.extraMonthlyAmortization && inputs.extraMonthlyAmortization > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleQuickMonthlyPreset(0)}
                      className="text-[9px] font-mono px-1.5 py-0.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                      title="Zerar aporte mensal"
                    >
                      Zerar
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Controle 2: Aporte Anual Extra (FGTS / 13º / Bônus) */}
              <div className="p-3.5 bg-black/70 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-400" />
                    <span>Aporte Anual (FGTS / 13º)</span>
                  </label>
                  <div className="flex items-center bg-neutral-900 border border-white/20 focus-within:border-gold-400 rounded-none px-2 py-0.5">
                    <span className="text-gold-400 text-xs font-mono font-medium mr-1">R$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={maskedAnnual}
                      onChange={handleAnnualInputChange}
                      placeholder="0,00"
                      onMouseEnter={() => setCursorVariant('input')}
                      onMouseLeave={() => setCursorVariant('default')}
                      className="w-20 sm:w-24 bg-transparent text-right font-mono text-white text-xs sm:text-sm focus:outline-none placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                <div
                  className="py-1 cursor-pointer"
                  onMouseEnter={() => setCursorVariant('native')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={inputs.extraAnnualAmortization || 0}
                    onChange={handleAnnualSliderChange}
                    className="w-full cursor-pointer accent-[#c2a25b]"
                  />
                </div>

                {/* Quick Presets Chips */}
                <div className="flex items-center justify-between gap-1 pt-0.5 flex-wrap">
                  {[2000, 5000, 10000, 20000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleQuickAnnualPreset(preset)}
                      className={`text-[9px] font-mono px-2 py-0.5 border transition-all cursor-pointer ${
                        inputs.extraAnnualAmortization === preset
                          ? 'bg-gold-500/20 text-gold-300 border-gold-400/50 shadow-[0_0_8px_rgba(194,162,91,0.2)]'
                          : 'bg-white/5 text-neutral-400 border-white/10 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      +{formatBRL(preset)}
                    </button>
                  ))}
                  {inputs.extraAnnualAmortization && inputs.extraAnnualAmortization > 0 ? (
                    <button
                      type="button"
                      onClick={() => handleQuickAnnualPreset(0)}
                      className="text-[9px] font-mono px-1.5 py-0.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                      title="Zerar aporte anual"
                    >
                      Zerar
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Grid com os 3 Pilares de Impacto e Economia */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {/* 1. Prazo do Financiamento */}
              <div
                className={`p-3 bg-black border flex flex-col justify-between ${
                  isAmortizationActive && monthsSaved > 0
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">
                    1. Prazo de Quitação
                  </span>
                  {isAmortizationActive && monthsSaved > 0 && (
                    <span className="text-[8px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      -{monthsSaved} meses
                    </span>
                  )}
                </div>
                <div className="my-1 flex items-baseline space-x-1.5">
                  <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                    {Math.ceil(result.installments.length / 12)} anos
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    ({result.installments.length} meses)
                  </span>
                </div>
                <span className="text-[9px] text-neutral-500 truncate">
                  {isAmortizationActive && monthsSaved > 0
                    ? `Economia de ~${yearsSaved} anos a menos`
                    : `Prazo padrão do contrato (${Math.ceil(baselineMonths / 12)} anos)`}
                </span>
              </div>

              {/* 2. Juros Totais Pagos */}
              <div
                className={`p-3 bg-black border flex flex-col justify-between ${
                  isAmortizationActive && totalInterestSaved > 0
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">
                    2. Juros Totais
                  </span>
                  {isAmortizationActive && totalInterestSaved > 0 && (
                    <span className="text-[8px] font-bold px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      -{interestSavedPct.toFixed(0)}%
                    </span>
                  )}
                </div>
                <div className="my-1">
                  <FormattedBRL
                    value={result.totalInterest}
                    className="text-xs sm:text-sm font-semibold text-white tracking-tight"
                  />
                </div>
                <span className="text-[9px] text-neutral-500 truncate">
                  {isAmortizationActive && totalInterestSaved > 0
                    ? `Antes: ${formatBRL(baseline.totalInterest)}`
                    : 'Sem amortização extraordinária'}
                </span>
              </div>

              {/* 3. Economia Real no Bolso */}
              <div
                className={`p-3 bg-black border flex flex-col justify-between ${
                  isAmortizationActive && totalInterestSaved > 0
                    ? 'border-gold-400/50 bg-gold-950/15 shadow-[0_0_15px_rgba(194,162,91,0.12)]'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block truncate">
                    3. Economia Estimada
                  </span>
                  {isAmortizationActive && totalInterestSaved > 0 && (
                    <Sparkles className="w-3 h-3 text-gold-400" />
                  )}
                </div>
                <div className="my-1">
                  <FormattedBRL
                    value={totalInterestSaved}
                    className="text-xs sm:text-sm font-bold text-gold-400 tracking-tight"
                  />
                </div>
                <span className="text-[9px] text-neutral-400 truncate">
                  {isAmortizationActive && totalInterestSaved > 0
                    ? 'Dinheiro economizado em juros'
                    : 'Defina um aporte para simular'}
                </span>
              </div>
            </div>

            {/* Banner de Dica do Especialista */}
            <div className="p-3.5 bg-gradient-to-r from-[#a47e35]/15 via-black to-[#a47e35]/10 border border-gold-400/40 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                <strong className="text-gold-300">Dica do Especialista: </strong>
                Ao amortizar diretamente o saldo devedor (reduzindo o prazo), os juros futuros são recalculados sobre um montante menor. Aportar o equivalente a apenas <strong>1 parcela extra por ano</strong> pode encurtar um financiamento de 30 anos em até <strong>8 a 10 anos</strong>.
              </div>
            </div>

            {/* Botões de Ação: Limpar e Compartilhar no WhatsApp */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-white/10">
              {isAmortizationActive ? (
                <button
                  type="button"
                  onClick={handleClearAmortization}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className="w-full sm:w-auto text-xs font-semibold text-neutral-400 hover:text-white flex items-center justify-center space-x-1.5 py-1.5 px-3 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Valores Padrão</span>
                </button>
              ) : (
                <div className="hidden sm:block text-[10px] text-neutral-500 font-mono">
                  * Cálculos baseados em amortização direta no saldo devedor com redução de prazo.
                </div>
              )}

              <button
                type="button"
                onClick={handleShareWhatsApp}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-full sm:w-auto btn-lift flex items-center justify-center space-x-1.5 text-xs font-semibold text-white bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/60 py-2 px-4 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/20"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enviar Estratégia no WhatsApp</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
