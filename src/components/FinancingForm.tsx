'use client';

import React, { useState, useEffect } from 'react';
import { FinancingInputs } from '@/types/financing';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { setCursorVariant } from '@/lib/cursor-store';
import { Sliders, RefreshCw, Calculator } from 'lucide-react';

interface FinancingFormProps {
  inputs: FinancingInputs;
  onChange: (newInputs: FinancingInputs) => void;
  onReset: () => void;
  onSimulate?: () => void;
}

// Formata valores com centavos pt-BR (ex: 600000 -> 600.000,00)
function formatCurrencyMask(val: number): string {
  if (isNaN(val)) return '0,00';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export const FinancingForm: React.FC<FinancingFormProps> = ({ inputs, onChange, onReset, onSimulate }) => {
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');

  const [maskedPropertyValue, setMaskedPropertyValue] = useState<string>(
    formatCurrencyMask(inputs.propertyValue)
  );
  const [maskedDownPayment, setMaskedDownPayment] = useState<string>(
    formatCurrencyMask(inputs.downPayment)
  );
  const [rawInterestRate, setRawInterestRate] = useState<string>(inputs.interestRateYearly.toString());

  useEffect(() => {
    setMaskedPropertyValue(formatCurrencyMask(inputs.propertyValue));
  }, [inputs.propertyValue]);

  useEffect(() => {
    setMaskedDownPayment(formatCurrencyMask(inputs.downPayment));
  }, [inputs.downPayment]);

  useEffect(() => {
    setRawInterestRate(inputs.interestRateYearly.toString());
  }, [inputs.interestRateYearly]);

  const handlePropertyValueInput = (valStr: string) => {
    const digitsOnly = valStr.replace(/\D/g, '');
    const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
    setMaskedPropertyValue(formatCurrencyMask(numericVal));

    const propertyValue = Math.max(0, numericVal);
    const downPayment = Math.min(propertyValue, (propertyValue * inputs.downPaymentPercent) / 100);
    setMaskedDownPayment(formatCurrencyMask(downPayment));
    onChange({
      ...inputs,
      propertyValue,
      downPayment,
    });
  };

  const handleDownPaymentInput = (valStr: string) => {
    const digitsOnly = valStr.replace(/\D/g, '');
    const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
    const downPayment = Math.min(inputs.propertyValue, Math.max(0, numericVal));
    setMaskedDownPayment(formatCurrencyMask(downPayment));

    const downPaymentPercent = inputs.propertyValue > 0 ? (downPayment / inputs.propertyValue) * 100 : 0;
    onChange({
      ...inputs,
      downPayment,
      downPaymentPercent,
    });
  };

  const handleDownPaymentPercentChange = (pct: number) => {
    const downPaymentPercent = Math.min(95, Math.max(0, pct));
    const downPayment = Math.round((inputs.propertyValue * downPaymentPercent) / 100);
    setMaskedDownPayment(formatCurrencyMask(downPayment));
    onChange({
      ...inputs,
      downPayment,
      downPaymentPercent,
    });
  };

  const termInYears = Math.round((inputs.termMonths / 12) * 10) / 10;

  return (
    <MouseGlow size={420} className="editorial-card p-6 border border-white/20 bg-black rounded-none">
      
      {/* Header do Form */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <Sliders className="w-4 h-4 text-white" />
          <div>
            <h2 className="text-xs font-normal uppercase tracking-widest text-white">Configurar Simulação</h2>
            <p className="text-[11px] text-neutral-400 font-light">Parâmetros do financiamento</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="btn-lift flex items-center space-x-1.5 text-[11px] text-neutral-400 hover:text-white px-3 py-1 rounded-[75px] border border-white/20 hover:border-white transition-all uppercase tracking-wider shrink-0"
          title="Restaurar padrão"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Redefinir</span>
        </button>
      </div>

      {/* 1. Sistema de Amortização (Controle Segmentado com Indicador Deslizante) */}
      <div className="mb-6">
        <label className="block text-[10px] font-normal uppercase tracking-widest text-neutral-400 mb-2">
          Sistema de Amortização
        </label>
        <div className="relative grid grid-cols-2 gap-0 p-1 bg-black border border-white/15 rounded-none">
          <div
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-gold-gradient-btn shadow-gold-glow-sm transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{ transform: inputs.amortizationMethod === 'PRICE' ? 'translateX(100%)' : 'translateX(0%)' }}
          />

          <button
            type="button"
            onClick={() => onChange({ ...inputs, amortizationMethod: 'SAC' })}
            className={`relative z-10 py-2 px-3 rounded-none text-xs tracking-wider font-normal transition-colors duration-300 ${
              inputs.amortizationMethod === 'SAC'
                ? 'text-black font-medium'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            SAC (Decrescente)
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...inputs, amortizationMethod: 'PRICE' })}
            className={`relative z-10 py-2 px-3 rounded-none text-xs tracking-wider font-normal transition-colors duration-300 ${
              inputs.amortizationMethod === 'PRICE'
                ? 'text-black font-medium'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            PRICE (Prestação Fixa)
          </button>
        </div>
      </div>

      {/* 2. Valor do Bem (Com Máscara R$) */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
          <label className="text-xs font-normal uppercase tracking-wider text-neutral-300">
            Valor do Bem
          </label>

          <div className="flex items-center bg-black border border-white/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-white">
            <span className="text-white text-xs font-medium mr-1.5">R$</span>
            <input
              type="text"
              inputMode="numeric"
              value={maskedPropertyValue}
              onChange={(e) => handlePropertyValueInput(e.target.value)}
              onMouseEnter={() => setCursorVariant('input')}
              onMouseLeave={() => setCursorVariant('default')}
              className="w-24 sm:w-28 bg-transparent text-right font-mono text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <input
          type="range"
          min={10000}
          max={inputs.category === 'property' ? 10000000 : inputs.category === 'vehicle' ? 500000 : 150000}
          step={5000}
          value={inputs.propertyValue}
          onChange={(e) => {
            const val = Number(e.target.value);
            setMaskedPropertyValue(formatCurrencyMask(val));
            const downPayment = Math.min(val, (val * inputs.downPaymentPercent) / 100);
            setMaskedDownPayment(formatCurrencyMask(downPayment));
            onChange({ ...inputs, propertyValue: val, downPayment });
          }}
          onMouseEnter={() => setCursorVariant('native')}
          onMouseLeave={() => setCursorVariant('default')}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-neutral-500 mt-1.5 font-mono">
          <span>R$ 10 mil</span>
          <span className="text-white font-medium">{formatBRL(inputs.propertyValue)}</span>
          <span>R$ {inputs.category === 'property' ? '10 mi' : '500 mil'}</span>
        </div>
      </div>

      {/* 3. Valor da Entrada (Com Máscara R$) */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
          <div className="flex items-center space-x-2 shrink-0">
            <label className="text-xs font-normal uppercase tracking-wider text-neutral-300">
              Valor da Entrada
            </label>
            <span className="text-[10px] px-2 py-0.5 rounded-[75px] bg-white/10 border border-white/20 text-white font-mono">
              {formatPercent(inputs.downPaymentPercent, 1)}
            </span>
          </div>

          <div className="flex items-center bg-black border border-white/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-white">
            <span className="text-white text-xs font-medium mr-1.5">R$</span>
            <input
              type="text"
              inputMode="numeric"
              value={maskedDownPayment}
              onChange={(e) => handleDownPaymentInput(e.target.value)}
              onMouseEnter={() => setCursorVariant('input')}
              onMouseLeave={() => setCursorVariant('default')}
              className="w-24 sm:w-28 bg-transparent text-right font-mono text-white text-xs focus:outline-none"
            />
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={80}
          step={1}
          value={inputs.downPaymentPercent}
          onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
          onMouseEnter={() => setCursorVariant('native')}
          onMouseLeave={() => setCursorVariant('default')}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-neutral-500 mt-1.5 font-mono">
          <span>0%</span>
          <span>Financiado: <FormattedBRL value={inputs.propertyValue - inputs.downPayment} className="text-white" /></span>
          <span>80%</span>
        </div>
      </div>

      {/* 4. Taxa de Juros & Prazo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        
        {/* Taxa de Juros */}
        <div>
          <div className="flex justify-between items-center mb-2 gap-2">
            <label className="text-xs font-normal uppercase tracking-wider text-neutral-300 truncate">
              Taxa de Juros
            </label>

            <div className="flex items-center bg-black border border-white/20 rounded-none px-2 py-0.5 shrink-0 focus-within:border-white">
              <input
                type="number"
                step="0.1"
                value={rawInterestRate}
                onChange={(e) => {
                  setRawInterestRate(e.target.value);
                  const num = parseFloat(e.target.value) || 0;
                  onChange({ ...inputs, interestRateYearly: Math.max(0.1, num) });
                }}
                onMouseEnter={() => setCursorVariant('input')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-12 bg-transparent text-right font-mono text-white text-xs focus:outline-none"
              />
              <span className="text-neutral-400 text-[10px] ml-1">% a.a.</span>
            </div>
          </div>

          <input
            type="range"
            min={4.0}
            max={30.0}
            step={0.1}
            value={inputs.interestRateYearly}
            onChange={(e) => {
              const val = Number(e.target.value);
              setRawInterestRate(val.toString());
              onChange({ ...inputs, interestRateYearly: val });
            }}
            className="w-full"
          />
          <div className="text-[10px] text-neutral-500 mt-1 font-mono text-right">
            ~{formatPercent(inputs.interestRateYearly / 12, 2)} / mês
          </div>
        </div>

        {/* Prazo */}
        <div>
          <div className="flex justify-between items-center mb-2 gap-2">
            <div className="flex items-center space-x-1 truncate">
              <label className="text-xs font-normal uppercase tracking-wider text-neutral-300">
                Prazo
              </label>
              <button
                type="button"
                onClick={() => setTermUnit(termUnit === 'years' ? 'months' : 'years')}
                className="text-[10px] text-neutral-400 hover:text-white underline ml-1"
              >
                ({termUnit === 'years' ? 'Anos' : 'Meses'})
              </button>
            </div>

            <div className="flex items-center bg-black border border-white/20 rounded-none px-2 py-0.5 shrink-0 focus-within:border-white">
              <input
                type="number"
                value={termUnit === 'years' ? termInYears : inputs.termMonths}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const termMonths = termUnit === 'years' ? Math.round(val * 12) : val;
                  onChange({ ...inputs, termMonths: Math.max(1, termMonths) });
                }}
                onMouseEnter={() => setCursorVariant('input')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-12 bg-transparent text-right font-mono text-white text-xs focus:outline-none"
              />
              <span className="text-neutral-400 text-[10px] ml-1">
                {termUnit === 'years' ? 'anos' : 'meses'}
              </span>
            </div>
          </div>

          <input
            type="range"
            min={6}
            max={inputs.category === 'property' ? 420 : 72}
            step={6}
            value={inputs.termMonths}
            onChange={(e) => onChange({ ...inputs, termMonths: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-[10px] text-neutral-500 mt-1 font-mono text-right">
            {inputs.termMonths} meses ({termInYears} anos)
          </div>
        </div>

      </div>

      {/* 5. Seguros & Encargos Toggle */}
      <div
        className={`p-3.5 border rounded-none flex items-center justify-between gap-2 transition-all duration-300 ${
          inputs.includeInsurances
            ? 'bg-white/[0.03] border-white/30'
            : 'bg-black border-white/15 hover:border-white/30'
        }`}
      >
        <div>
          <h4 className="text-xs font-normal uppercase tracking-wider text-white">Seguros &amp; Taxas Administrativas</h4>
          <p className="text-[10px] text-neutral-400 font-light">Seguros MIP/DFI e taxa mensal R$ 25,00</p>
        </div>

        <label
          className="relative inline-flex items-center cursor-pointer shrink-0"
          onMouseEnter={() => setCursorVariant('native')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <input
            type="checkbox"
            checked={inputs.includeInsurances}
            onChange={(e) => onChange({ ...inputs, includeInsurances: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-gold-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-neutral-400 after:border-neutral-400 after:border after:h-4 after:w-4 after:rounded-full after:transition-all after:duration-300 peer-checked:bg-gold-gradient-btn peer-checked:shadow-gold-glow-sm peer-checked:after:bg-white peer-checked:after:border-white" />
        </label>
      </div>

      {/* 6. Botão SIMULAR (Pill 75px full radius) */}
      {onSimulate && (
        <div className="mt-8 pt-2">
          <button
            type="button"
            onClick={onSimulate}
            className="btn-gold-fill btn-lift btn-shine btn-shine-gold w-full flex items-center justify-center space-x-3 text-sm font-normal uppercase tracking-widest shadow-none cursor-pointer"
          >
            <Calculator className="w-4 h-4 text-white" />
            <span>SIMULAR</span>
          </button>
        </div>
      )}

    </MouseGlow>
  );
};
