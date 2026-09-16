'use client';

import React, { useState, useEffect } from 'react';
import { FinancingInputs, FinancingResult } from '@/types/financing';
import { formatBRL, calculateFinancing } from '@/lib/financing-calculator';
import { playTypeSound } from '@/lib/sound';
import { vibrateShort } from '@/lib/haptics';
import { setCursorVariant } from '@/lib/cursor-store';
import { Zap, ChevronUp, ChevronDown } from 'lucide-react';

function formatCurrencyMask(val: number): string {
  if (isNaN(val)) return '0,00';
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
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen((prev) => !prev);
    }
  };

  const [maskedMonthly, setMaskedMonthly] = useState(formatCurrencyMask(inputs.extraMonthlyAmortization || 0));
  const [maskedAnnual, setMaskedAnnual] = useState(formatCurrencyMask(inputs.extraAnnualAmortization || 0));

  // Sync masks when external inputs change
  useEffect(() => {
    setMaskedMonthly(formatCurrencyMask(inputs.extraMonthlyAmortization || 0));
  }, [inputs.extraMonthlyAmortization]);

  useEffect(() => {
    setMaskedAnnual(formatCurrencyMask(inputs.extraAnnualAmortization || 0));
  }, [inputs.extraAnnualAmortization]);

  // Baseline comparison for savings calculation
  const baseline =
    customBaselineResult ||
    calculateFinancing({
      ...inputs,
      extraMonthlyAmortization: 0,
      extraAnnualAmortization: 0,
    });

  const isAmortizationActive =
    (inputs.extraMonthlyAmortization && inputs.extraMonthlyAmortization > 0) ||
    (inputs.extraAnnualAmortization && inputs.extraAnnualAmortization > 0);

  const handleMonthlyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    const digitsOnly = valStr.replace(/\D/g, '');
    const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
    setMaskedMonthly(formatCurrencyMask(numericVal));

    const val = Math.max(0, numericVal);
    const updated = { ...inputs, extraMonthlyAmortization: val };
    if (onChange) onChange(updated);
  };

  const handleMonthlySliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const updated = { ...inputs, extraMonthlyAmortization: val };
    if (onChange) onChange(updated);
    vibrateShort();
  };

  const handleAnnualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    const digitsOnly = valStr.replace(/\D/g, '');
    const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
    setMaskedAnnual(formatCurrencyMask(numericVal));

    const val = Math.max(0, numericVal);
    const updated = { ...inputs, extraAnnualAmortization: val };
    if (onChange) onChange(updated);
  };

  const handleAnnualSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const updated = { ...inputs, extraAnnualAmortization: val };
    if (onChange) onChange(updated);
    vibrateShort();
  };

  return (
    <div
      id="amortizacao-acelerada-section"
      className={`group editorial-card border bg-black rounded-none overflow-hidden transition-all duration-300 scroll-mt-24 ${
        isAmortizationActive
          ? '!border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
          : 'border-white/20 hover:!border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] focus-within:!border-amber-400'
      }`}
    >
      <button
        type="button"
        onClick={() => {
          handleToggle();
          playTypeSound();
        }}
        className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none hover:bg-white/[0.02] transition-colors gap-3"
      >
        <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0 flex-1">
          <Zap
            className={`w-4.5 h-4.5 sm:w-6 sm:h-6 shrink-0 transition-colors ${
              isAmortizationActive
                ? '!text-amber-400'
                : 'text-gold-400 group-hover:!text-amber-400'
            }`}
          />
          <div className="min-w-0 flex-1">
            <h3
              className={`text-xs min-[380px]:text-sm sm:text-base lg:text-lg font-bold uppercase tracking-wider whitespace-nowrap truncate transition-colors ${
                isAmortizationActive
                  ? '!text-amber-400'
                  : 'text-gold-400 group-hover:!text-amber-400'
              }`}
            >
              Simulador de Amortização Acelerada
            </h3>
            {isOpen && (
              <p className="text-[10px] sm:text-xs lg:text-sm text-neutral-400 font-light mt-0.5 truncate animate-fadeIn">
                Acelere a quitação amortizando valores adicionais
              </p>
            )}
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 !text-amber-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400 group-hover:!text-amber-400 shrink-0 transition-colors" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 space-y-5 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 text-left">
            {/* Aporte Mensal Extra */}
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                <label className="text-[11px] sm:text-xs font-normal uppercase tracking-wider text-amber-400">
                  Aporte Mensal Extra
                </label>
                <div className="flex items-center bg-black border border-amber-400 focus-within:border-amber-400 rounded-none px-2.5 py-1 shrink-0">
                  <span className="text-white text-xs sm:text-sm font-medium mr-1.5">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maskedMonthly}
                    onChange={handleMonthlyInputChange}
                    onKeyDown={() => playTypeSound()}
                    onMouseEnter={() => setCursorVariant('input')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-24 sm:w-28 bg-transparent text-right font-mono text-white text-sm sm:text-base focus:outline-none"
                  />
                </div>
              </div>

              <div
                className="relative py-5 -my-2 cursor-pointer group"
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
                  className="w-full cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs sm:text-sm lg:text-base text-neutral-300 font-mono font-medium mt-1">
                <span>R$ 0</span>
                <span>R$ 10.000 / mês</span>
              </div>
            </div>

            {/* Aporte Anual Extra */}
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                <label className="text-[11px] sm:text-xs font-normal uppercase tracking-wider text-amber-400">
                  Aporte Anual Extra
                </label>
                <div className="flex items-center bg-black border border-amber-400 focus-within:border-amber-400 rounded-none px-2.5 py-1 shrink-0">
                  <span className="text-white text-xs sm:text-sm font-medium mr-1.5">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maskedAnnual}
                    onChange={handleAnnualInputChange}
                    onKeyDown={() => playTypeSound()}
                    onMouseEnter={() => setCursorVariant('input')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-24 sm:w-28 bg-transparent text-right font-mono text-white text-sm sm:text-base focus:outline-none"
                  />
                </div>
              </div>

              <div
                className="relative py-5 -my-2 cursor-pointer group"
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
                  className="w-full cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs sm:text-sm lg:text-base text-neutral-300 font-mono font-medium mt-1">
                <span>R$ 0</span>
                <span>R$ 50.000 / ano</span>
              </div>
            </div>
          </div>

          {/* Banner de Economia e Impacto */}
          {((inputs.extraMonthlyAmortization || 0) > 0 || (inputs.extraAnnualAmortization || 0) > 0) && (
            <div className="mt-4 p-4 sm:p-5 border border-gold-500/35 bg-neutral-900/50 text-sm sm:text-base text-neutral-200 animate-fadeIn space-y-2 leading-relaxed">
              <div className="flex items-start sm:items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0 mt-1 sm:mt-0"></span>
                <span>
                  Tempo de quitação reduzido de{' '}
                  <strong className="text-white font-semibold">
                    {Math.ceil(baseline.installments.length / 12)} anos
                  </strong>{' '}
                  para{' '}
                  <strong className="text-white font-semibold">
                    {Math.ceil(result.installments.length / 12)} anos
                  </strong>{' '}
                  ({baseline.installments.length - result.installments.length} meses economizados).
                </span>
              </div>
              <div className="flex items-start sm:items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0 mt-1 sm:mt-0"></span>
                <span>
                  Economia estimada em juros pagos de{' '}
                  <strong className="text-gold-400 font-bold">
                    {formatBRL(baseline.totalInterest - result.totalInterest)}
                  </strong>{' '}
                  ao longo do contrato!
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
