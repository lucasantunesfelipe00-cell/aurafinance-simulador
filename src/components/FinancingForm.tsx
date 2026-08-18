'use client';

import React, { useState, useEffect } from 'react';
import { FinancingInputs, CategoryType } from '@/types/financing';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { Home, Car, User, Sliders, RefreshCw, Sparkles } from 'lucide-react';

interface FinancingFormProps {
  inputs: FinancingInputs;
  onChange: (newInputs: FinancingInputs) => void;
  onReset: () => void;
}

export const FinancingForm: React.FC<FinancingFormProps> = ({ inputs, onChange, onReset }) => {
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');

  // Estados locais de texto para edição fluida dos campos numéricos
  const [rawPropertyValue, setRawPropertyValue] = useState<string>(inputs.propertyValue.toString());
  const [rawDownPayment, setRawDownPayment] = useState<string>(inputs.downPayment.toString());
  const [rawInterestRate, setRawInterestRate] = useState<string>(inputs.interestRateYearly.toString());

  // Sincroniza estados locais com as props quando mudam externamente (ex: sliders)
  useEffect(() => {
    setRawPropertyValue(inputs.propertyValue.toString());
  }, [inputs.propertyValue]);

  useEffect(() => {
    setRawDownPayment(inputs.downPayment.toString());
  }, [inputs.downPayment]);

  useEffect(() => {
    setRawInterestRate(inputs.interestRateYearly.toString());
  }, [inputs.interestRateYearly]);

  // Alterar categoria
  const handleCategoryChange = (category: CategoryType) => {
    let defaults = { ...inputs, category };
    if (category === 'property') {
      defaults.propertyValue = 600000;
      defaults.downPayment = 120000;
      defaults.downPaymentPercent = 20;
      defaults.interestRateYearly = 10.5;
      defaults.termMonths = 360;
      defaults.includeInsurances = true;
    } else if (category === 'vehicle') {
      defaults.propertyValue = 120000;
      defaults.downPayment = 36000;
      defaults.downPaymentPercent = 30;
      defaults.interestRateYearly = 16.8;
      defaults.termMonths = 48;
      defaults.includeInsurances = false;
    } else {
      defaults.propertyValue = 40000;
      defaults.downPayment = 0;
      defaults.downPaymentPercent = 0;
      defaults.interestRateYearly = 24.5;
      defaults.termMonths = 24;
      defaults.includeInsurances = false;
    }
    onChange(defaults);
  };

  // Handler de alteração no Valor do Bem
  const handlePropertyValueInput = (valStr: string) => {
    setRawPropertyValue(valStr);
    const num = parseFloat(valStr.replace(/\D/g, '')) || 0;
    const propertyValue = Math.max(0, num);
    const downPayment = Math.min(propertyValue, (propertyValue * inputs.downPaymentPercent) / 100);
    onChange({
      ...inputs,
      propertyValue,
      downPayment,
    });
  };

  // Handler de alteração na Entrada em R$
  const handleDownPaymentInput = (valStr: string) => {
    setRawDownPayment(valStr);
    const num = parseFloat(valStr.replace(/\D/g, '')) || 0;
    const downPayment = Math.min(inputs.propertyValue, Math.max(0, num));
    const downPaymentPercent = inputs.propertyValue > 0 ? (downPayment / inputs.propertyValue) * 100 : 0;
    onChange({
      ...inputs,
      downPayment,
      downPaymentPercent,
    });
  };

  // Handler de alteração na Entrada em %
  const handleDownPaymentPercentChange = (pct: number) => {
    const downPaymentPercent = Math.min(95, Math.max(0, pct));
    const downPayment = (inputs.propertyValue * downPaymentPercent) / 100;
    onChange({
      ...inputs,
      downPayment,
      downPaymentPercent,
    });
  };

  const termInYears = Math.round((inputs.termMonths / 12) * 10) / 10;

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 gold-border-glow relative overflow-hidden">
      
      {/* Luz Dourada de Fundo */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Form */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-gold-500/15">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">Parâmetros do Financiamento</h2>
            <p className="text-[11px] text-gray-400">Ajuste os valores para simulação instantânea</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-1 text-[11px] text-gold-400 hover:text-white px-2.5 py-1 rounded-lg border border-gold-500/20 hover:border-gold-400 transition-colors"
          title="Restaurar padrão"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Redefinir</span>
        </button>
      </div>

      {/* 1. Seletor de Categoria */}
      <div className="mb-5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gold-400 mb-1.5">
          Tipo de Financiamento
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleCategoryChange('property')}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-[11px] font-medium transition-all ${
              inputs.category === 'property'
                ? 'bg-gradient-to-b from-gold-500/20 to-gold-950/40 border-gold-400 text-white shadow-gold-glow-sm'
                : 'bg-obsidian-850/60 border-obsidian-700 text-gray-400 hover:text-white hover:border-gold-500/30'
            }`}
          >
            <Home className={`w-4 h-4 mb-1 ${inputs.category === 'property' ? 'text-gold-400' : ''}`} />
            <span>Imóvel</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('vehicle')}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-[11px] font-medium transition-all ${
              inputs.category === 'vehicle'
                ? 'bg-gradient-to-b from-gold-500/20 to-gold-950/40 border-gold-400 text-white shadow-gold-glow-sm'
                : 'bg-obsidian-850/60 border-obsidian-700 text-gray-400 hover:text-white hover:border-gold-500/30'
            }`}
          >
            <Car className={`w-4 h-4 mb-1 ${inputs.category === 'vehicle' ? 'text-gold-400' : ''}`} />
            <span>Veículo</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('personal')}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-[11px] font-medium transition-all ${
              inputs.category === 'personal'
                ? 'bg-gradient-to-b from-gold-500/20 to-gold-950/40 border-gold-400 text-white shadow-gold-glow-sm'
                : 'bg-obsidian-850/60 border-obsidian-700 text-gray-400 hover:text-white hover:border-gold-500/30'
            }`}
          >
            <User className={`w-4 h-4 mb-1 ${inputs.category === 'personal' ? 'text-gold-400' : ''}`} />
            <span>Pessoal</span>
          </button>
        </div>
      </div>

      {/* 2. Sistema de Amortização (SAC vs PRICE) */}
      <div className="mb-5">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gold-400 mb-1.5">
          Sistema de Amortização
        </label>
        <div className="grid grid-cols-2 gap-2 p-1 bg-obsidian-950 border border-gold-500/20 rounded-xl">
          <button
            type="button"
            onClick={() => onChange({ ...inputs, amortizationMethod: 'SAC' })}
            className={`py-2 px-3 rounded-lg text-[11px] font-bold transition-all ${
              inputs.amortizationMethod === 'SAC'
                ? 'btn-gold-metallic'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SAC (Decrescente)
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...inputs, amortizationMethod: 'PRICE' })}
            className={`py-2 px-3 rounded-lg text-[11px] font-bold transition-all ${
              inputs.amortizationMethod === 'PRICE'
                ? 'btn-gold-metallic'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PRICE (Prestação Fixa)
          </button>
        </div>
      </div>

      {/* 3. Valor do Bem */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5 gap-2">
          <label className="text-[11px] font-semibold text-gray-300 truncate">
            Valor do Bem
          </label>
          <div className="relative shrink-0">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-400 text-[11px] font-bold">R$</span>
            <input
              type="text"
              inputMode="numeric"
              value={rawPropertyValue}
              onChange={(e) => handlePropertyValueInput(e.target.value)}
              className="w-32 sm:w-36 bg-obsidian-950 border border-gold-500/30 rounded-lg pl-8 pr-2 py-1 text-right font-mono font-bold text-white text-xs focus:border-gold-400 focus:outline-none"
            />
          </div>
        </div>

        <input
          type="range"
          min={10000}
          max={inputs.category === 'property' ? 3000000 : inputs.category === 'vehicle' ? 500000 : 150000}
          step={5000}
          value={inputs.propertyValue}
          onChange={(e) => {
            const val = Number(e.target.value);
            setRawPropertyValue(val.toString());
            const downPayment = Math.min(val, (val * inputs.downPaymentPercent) / 100);
            onChange({ ...inputs, propertyValue: val, downPayment });
          }}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
          <span>R$ 10 mil</span>
          <span className="text-gold-300 font-semibold">{formatBRL(inputs.propertyValue)}</span>
          <span>R$ {inputs.category === 'property' ? '3 mi' : '500 mil'}</span>
        </div>
      </div>

      {/* 4. Valor da Entrada */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5 gap-2">
          <div className="flex items-center space-x-1.5 shrink-0">
            <label className="text-[11px] font-semibold text-gray-300">
              Valor da Entrada
            </label>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-500/20 border border-gold-500/40 text-gold-300 font-bold">
              {formatPercent(inputs.downPaymentPercent, 1)}
            </span>
          </div>

          <div className="relative shrink-0">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gold-400 text-[11px] font-bold">R$</span>
            <input
              type="text"
              inputMode="numeric"
              value={rawDownPayment}
              onChange={(e) => handleDownPaymentInput(e.target.value)}
              className="w-32 sm:w-36 bg-obsidian-950 border border-gold-500/30 rounded-lg pl-8 pr-2 py-1 text-right font-mono font-bold text-white text-xs focus:border-gold-400 focus:outline-none"
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
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
          <span>0%</span>
          <span>Financiado: <FormattedBRL value={inputs.propertyValue - inputs.downPayment} className="text-gold-300" /></span>
          <span>80%</span>
        </div>
      </div>

      {/* 5. Taxa de Juros e Prazo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        
        {/* Taxa de Juros */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] font-semibold text-gray-300 truncate">
              Taxa de Juros
            </label>
            <div className="relative shrink-0">
              <input
                type="number"
                step="0.1"
                value={rawInterestRate}
                onChange={(e) => {
                  setRawInterestRate(e.target.value);
                  const num = parseFloat(e.target.value) || 0;
                  onChange({ ...inputs, interestRateYearly: Math.max(0.1, num) });
                }}
                className="w-20 bg-obsidian-950 border border-gold-500/30 rounded-lg pr-6 pl-2 py-1 text-right font-mono font-bold text-white text-xs focus:border-gold-400 focus:outline-none"
              />
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gold-400 text-[10px] font-bold">%a.a.</span>
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
          <div className="text-[10px] text-gray-500 mt-0.5 font-mono text-right">
            ~{formatPercent(inputs.interestRateYearly / 12, 2)} / mês
          </div>
        </div>

        {/* Prazo */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center space-x-1 truncate">
              <label className="text-[11px] font-semibold text-gray-300">
                Prazo
              </label>
              <button
                type="button"
                onClick={() => setTermUnit(termUnit === 'years' ? 'months' : 'years')}
                className="text-[9px] text-gold-400 hover:underline"
              >
                ({termUnit === 'years' ? 'Anos' : 'Meses'})
              </button>
            </div>

            <div className="relative shrink-0">
              <input
                type="number"
                value={termUnit === 'years' ? termInYears : inputs.termMonths}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const termMonths = termUnit === 'years' ? Math.round(val * 12) : val;
                  onChange({ ...inputs, termMonths: Math.max(1, termMonths) });
                }}
                className="w-20 bg-obsidian-950 border border-gold-500/30 rounded-lg pr-7 pl-2 py-1 text-right font-mono font-bold text-white text-xs focus:border-gold-400 focus:outline-none"
              />
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gold-400 text-[9px] font-bold">
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
          <div className="text-[10px] text-gray-500 mt-0.5 font-mono text-right">
            {inputs.termMonths} meses ({termInYears} anos)
          </div>
        </div>

      </div>

      {/* 6. Seguros & Encargos Toggle */}
      <div className="p-3 rounded-xl bg-obsidian-950/70 border border-gold-500/20 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
          <div>
            <h4 className="text-[11px] font-bold text-white">Seguros &amp; Taxas Administrativas</h4>
            <p className="text-[9px] text-gray-400">Seguros MIP/DFI e taxa mensal R$ 25,00</p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={inputs.includeInsurances}
            onChange={(e) => onChange({ ...inputs, includeInsurances: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-obsidian-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-gold-500 peer-checked:to-gold-700" />
        </label>
      </div>

    </div>
  );
};
