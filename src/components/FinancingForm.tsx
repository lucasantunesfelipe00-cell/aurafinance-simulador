'use client';

import React, { useState } from 'react';
import { FinancingInputs, CategoryType, AmortizationMethod } from '@/types/financing';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { Home, Car, User, Sliders, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface FinancingFormProps {
  inputs: FinancingInputs;
  onChange: (newInputs: FinancingInputs) => void;
  onReset: () => void;
}

export const FinancingForm: React.FC<FinancingFormProps> = ({ inputs, onChange, onReset }) => {
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');

  // Ajusta predefinições ao alterar categoria
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

  // Atualiza Valor do Bem e recalcula Entrada proporcionalmente se necessário
  const handlePropertyValueChange = (val: number) => {
    const propertyValue = Math.max(1000, val);
    const downPayment = Math.min(propertyValue, (propertyValue * inputs.downPaymentPercent) / 100);
    onChange({
      ...inputs,
      propertyValue,
      downPayment,
    });
  };

  // Atualiza Entrada por valor em R$
  const handleDownPaymentValueChange = (val: number) => {
    const downPayment = Math.min(inputs.propertyValue, Math.max(0, val));
    const downPaymentPercent = inputs.propertyValue > 0 ? (downPayment / inputs.propertyValue) * 100 : 0;
    onChange({
      ...inputs,
      downPayment,
      downPaymentPercent,
    });
  };

  // Atualiza Entrada por Porcentagem
  const handleDownPaymentPercentChange = (pct: number) => {
    const downPaymentPercent = Math.min(95, Math.max(0, pct));
    const downPayment = (inputs.propertyValue * downPaymentPercent) / 100;
    onChange({
      ...inputs,
      downPayment,
      downPaymentPercent,
    });
  };

  // Anos para meses e vice-versa
  const termInYears = Math.round((inputs.termMonths / 12) * 10) / 10;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 gold-border-glow relative overflow-hidden">
      
      {/* Luz Dourada de Fundo */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header do Form */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-gold-500/20">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">Parâmetros de Simulação</h2>
            <p className="text-xs text-gray-400">Ajuste os valores para ver o cálculo em tempo real</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center space-x-1.5 text-xs text-gold-400 hover:text-white px-3 py-1.5 rounded-lg border border-gold-500/20 hover:border-gold-400 transition-colors"
          title="Restaurar padrão"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Redefinir</span>
        </button>
      </div>

      {/* 1. Seletor de Categoria de Bem */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-2">
          Tipo de Bem a Financiar
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleCategoryChange('property')}
            className={`flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border text-xs font-medium transition-all ${
              inputs.category === 'property'
                ? 'bg-gradient-to-b from-gold-500/20 to-gold-950/40 border-gold-400 text-white shadow-gold-glow-sm'
                : 'bg-obsidian-850/60 border-obsidian-700 text-gray-400 hover:text-white hover:border-gold-500/30'
            }`}
          >
            <Home className={`w-5 h-5 mb-1.5 ${inputs.category === 'property' ? 'text-gold-400' : ''}`} />
            <span>Imóvel</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('vehicle')}
            className={`flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border text-xs font-medium transition-all ${
              inputs.category === 'vehicle'
                ? 'bg-gradient-to-b from-gold-500/20 to-gold-950/40 border-gold-400 text-white shadow-gold-glow-sm'
                : 'bg-obsidian-850/60 border-obsidian-700 text-gray-400 hover:text-white hover:border-gold-500/30'
            }`}
          >
            <Car className={`w-5 h-5 mb-1.5 ${inputs.category === 'vehicle' ? 'text-gold-400' : ''}`} />
            <span>Veículo</span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('personal')}
            className={`flex flex-col items-center justify-center py-3.5 px-3 rounded-xl border text-xs font-medium transition-all ${
              inputs.category === 'personal'
                ? 'bg-gradient-to-b from-gold-500/20 to-gold-950/40 border-gold-400 text-white shadow-gold-glow-sm'
                : 'bg-obsidian-850/60 border-obsidian-700 text-gray-400 hover:text-white hover:border-gold-500/30'
            }`}
          >
            <User className={`w-5 h-5 mb-1.5 ${inputs.category === 'personal' ? 'text-gold-400' : ''}`} />
            <span>Pessoal</span>
          </button>
        </div>
      </div>

      {/* 2. Modalidade de Amortização (SAC vs PRICE) */}
      <div className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gold-300 mb-2">
          Sistema de Amortização
        </label>
        <div className="grid grid-cols-2 gap-3 p-1 bg-obsidian-950 border border-gold-500/20 rounded-xl">
          <button
            type="button"
            onClick={() => onChange({ ...inputs, amortizationMethod: 'SAC' })}
            className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
              inputs.amortizationMethod === 'SAC'
                ? 'btn-gold-metallic'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            SAC (Parcelas Decrescentes)
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...inputs, amortizationMethod: 'PRICE' })}
            className={`py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
              inputs.amortizationMethod === 'PRICE'
                ? 'btn-gold-metallic'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PRICE (Parcelas Fixas)
          </button>
        </div>
      </div>

      {/* 3. Slider e Input: Valor Total do Bem */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
            Valor do Bem (Imóvel / Veículo)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 text-xs font-bold">R$</span>
            <input
              type="number"
              value={inputs.propertyValue}
              onChange={(e) => handlePropertyValueChange(Number(e.target.value))}
              className="w-36 sm:w-44 bg-obsidian-950 border border-gold-500/30 rounded-lg pl-9 pr-3 py-1.5 text-right font-mono font-bold text-white text-sm focus:border-gold-400 focus:outline-none"
            />
          </div>
        </div>

        <input
          type="range"
          min={10000}
          max={inputs.category === 'property' ? 3000000 : inputs.category === 'vehicle' ? 500000 : 150000}
          step={5000}
          value={inputs.propertyValue}
          onChange={(e) => handlePropertyValueChange(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
          <span>R$ 10.000</span>
          <span>{formatBRL(inputs.propertyValue)}</span>
          <span>R$ {inputs.category === 'property' ? '3.000.000' : '500.000'}</span>
        </div>
      </div>

      {/* 4. Slider e Input: Valor da Entrada */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Valor da Entrada
            </label>
            <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500/20 border border-gold-500/40 text-gold-300 font-bold">
              {formatPercent(inputs.downPaymentPercent, 1)}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-400 text-xs font-bold">R$</span>
            <input
              type="number"
              value={inputs.downPayment}
              onChange={(e) => handleDownPaymentValueChange(Number(e.target.value))}
              className="w-36 sm:w-44 bg-obsidian-950 border border-gold-500/30 rounded-lg pl-9 pr-3 py-1.5 text-right font-mono font-bold text-white text-sm focus:border-gold-400 focus:outline-none"
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
          <span>0% (Sem entrada)</span>
          <span>Financiado: {formatBRL(inputs.propertyValue - inputs.downPayment)}</span>
          <span>80%</span>
        </div>
      </div>

      {/* 5. Taxa de Juros Anual (% a.a.) e Prazo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        
        {/* Taxa de Juros */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Taxa de Juros
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={inputs.interestRateYearly}
                onChange={(e) => onChange({ ...inputs, interestRateYearly: Math.max(0.1, Number(e.target.value)) })}
                className="w-24 bg-obsidian-950 border border-gold-500/30 rounded-lg pr-7 pl-3 py-1.5 text-right font-mono font-bold text-white text-sm focus:border-gold-400 focus:outline-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gold-400 text-xs font-bold">% a.a.</span>
            </div>
          </div>
          <input
            type="range"
            min={4.0}
            max={30.0}
            step={0.1}
            value={inputs.interestRateYearly}
            onChange={(e) => onChange({ ...inputs, interestRateYearly: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-[10px] text-gray-500 mt-1 font-mono text-right">
            ~{formatPercent(inputs.interestRateYearly / 12, 2)} ao mês
          </div>
        </div>

        {/* Prazo */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Prazo Total
              </label>
              <button
                type="button"
                onClick={() => setTermUnit(termUnit === 'years' ? 'months' : 'years')}
                className="text-[10px] text-gold-400 hover:underline"
              >
                ({termUnit === 'years' ? 'em Anos' : 'em Meses'})
              </button>
            </div>

            <div className="relative">
              <input
                type="number"
                value={termUnit === 'years' ? termInYears : inputs.termMonths}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  const termMonths = termUnit === 'years' ? Math.round(val * 12) : val;
                  onChange({ ...inputs, termMonths: Math.max(1, termMonths) });
                }}
                className="w-24 bg-obsidian-950 border border-gold-500/30 rounded-lg pr-8 pl-3 py-1.5 text-right font-mono font-bold text-white text-sm focus:border-gold-400 focus:outline-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gold-400 text-[10px] font-bold">
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
          <div className="text-[10px] text-gray-500 mt-1 font-mono text-right">
            {inputs.termMonths} meses ({termInYears} anos)
          </div>
        </div>

      </div>

      {/* 6. Toggle de Seguros e Encargos (MIP / DFI / ADM) */}
      <div className="p-4 rounded-xl bg-obsidian-950/70 border border-gold-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-5 h-5 text-gold-400" />
          <div>
            <h4 className="text-xs font-bold text-white">Incluir Seguros & Taxas Administrativas</h4>
            <p className="text-[10px] text-gray-400">Seguros MIP (Morte), DFI (Danos) e taxa mensal R$ 25,00</p>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={inputs.includeInsurances}
            onChange={(e) => onChange({ ...inputs, includeInsurances: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-obsidian-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-gold-500 peer-checked:to-gold-700" />
        </label>
      </div>

    </div>
  );
};
