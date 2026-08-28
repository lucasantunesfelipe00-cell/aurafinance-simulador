'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FinancingInputs, CategoryType } from '@/types/financing';
import { DEFAULT_FINANCING_INPUTS, formatBRL, formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { setCursorVariant } from '@/lib/cursor-store';
import { playTypeSound } from '@/lib/sound';
import { vibrateShort } from '@/lib/haptics';
import {
  Calculator,
  Home as HomeIcon,
  Car,
  User,
  Sliders,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SimulatorCarouselProps {
  inputs: FinancingInputs;
  onChange: (newInputs: FinancingInputs) => void;
  onReset: () => void;
  onSimulate: () => void;
}

const TOTAL_CONFIG_STEPS = 5;

// Formata valores com centavos pt-BR (ex: 600000 -> 600.000,00)
function formatCurrencyMask(val: number): string {
  if (isNaN(val)) return '0,00';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

/**
 * Carrossel de configuração da simulação: categoria → sistema de amortização →
 * valor do bem → entrada → taxa de juros → prazo. Cada passo é um slide que
 * desliza horizontalmente (nunca scroll vertical), com navegação Voltar/Próximo
 * e o botão Simular só no último passo.
 */
export const SimulatorCarousel: React.FC<SimulatorCarouselProps> = ({
  inputs,
  onChange,
  onReset,
  onSimulate,
}) => {
  const [step, setStep] = useState(0);
  const [hasSelectedCategory, setHasSelectedCategory] = useState(false);
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');

  const [maskedPropertyValue, setMaskedPropertyValue] = useState(formatCurrencyMask(inputs.propertyValue));
  const [maskedDownPayment, setMaskedDownPayment] = useState(formatCurrencyMask(inputs.downPayment));
  const [rawInterestRate, setRawInterestRate] = useState(inputs.interestRateYearly.toString());

  useEffect(() => {
    setMaskedPropertyValue(formatCurrencyMask(inputs.propertyValue));
  }, [inputs.propertyValue]);

  useEffect(() => {
    setMaskedDownPayment(formatCurrencyMask(inputs.downPayment));
  }, [inputs.downPayment]);

  useEffect(() => {
    setRawInterestRate(inputs.interestRateYearly.toString());
  }, [inputs.interestRateYearly]);

  const cardWrapperRefs = useRef<Record<CategoryType, HTMLDivElement | null>>({
    property: null,
    vehicle: null,
    personal: null,
  });
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [trackHeight, setTrackHeight] = useState<number>();

  // Altura do trilho acompanha o slide ativo (os slides têm alturas bem diferentes)
  useEffect(() => {
    const measure = () => {
      const el = slideRefs.current[step];
      if (el) setTrackHeight(el.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [step, inputs, termUnit]);

  const goNext = () => setStep((s) => Math.min(5, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSelectCategory = (category: CategoryType) => {
    if (category === 'property') {
      onChange({ ...DEFAULT_FINANCING_INPUTS, category: 'property', propertyValue: 600000, downPayment: 120000, downPaymentPercent: 20, interestRateYearly: 10.5, termMonths: 360 });
    } else if (category === 'vehicle') {
      onChange({ ...DEFAULT_FINANCING_INPUTS, category: 'vehicle', propertyValue: 120000, downPayment: 36000, downPaymentPercent: 30, interestRateYearly: 16.8, termMonths: 48, includeInsurances: false });
    } else if (category === 'personal') {
      onChange({ ...DEFAULT_FINANCING_INPUTS, category: 'personal', propertyValue: 40000, downPayment: 0, downPaymentPercent: 0, interestRateYearly: 24.5, termMonths: 24, includeInsurances: false });
    }
    setHasSelectedCategory(true);
    setTimeout(() => {
      cardWrapperRefs.current[category]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handlePropertyValueInput = (valStr: string) => {
    const digitsOnly = valStr.replace(/\D/g, '');
    const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
    setMaskedPropertyValue(formatCurrencyMask(numericVal));

    const propertyValue = Math.max(0, numericVal);
    const downPayment = Math.min(propertyValue, (propertyValue * inputs.downPaymentPercent) / 100);
    setMaskedDownPayment(formatCurrencyMask(downPayment));
    onChange({ ...inputs, propertyValue, downPayment });
  };

  const handleDownPaymentInput = (valStr: string) => {
    const digitsOnly = valStr.replace(/\D/g, '');
    const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
    const downPayment = Math.min(inputs.propertyValue, Math.max(0, numericVal));
    setMaskedDownPayment(formatCurrencyMask(downPayment));

    const downPaymentPercent = inputs.propertyValue > 0 ? (downPayment / inputs.propertyValue) * 100 : 0;
    onChange({ ...inputs, downPayment, downPaymentPercent });
  };

  const handleDownPaymentPercentChange = (pct: number) => {
    const downPaymentPercent = Math.min(95, Math.max(0, pct));
    const downPayment = Math.round((inputs.propertyValue * downPaymentPercent) / 100);
    setMaskedDownPayment(formatCurrencyMask(downPayment));
    onChange({ ...inputs, downPayment, downPaymentPercent });
  };

  const termInYears = Math.round((inputs.termMonths / 12) * 10) / 10;

  const renderNav = (isLast: boolean) => (
    <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t-2 border-ink-950/10">
      <button
        type="button"
        onClick={goBack}
        onMouseEnter={() => setCursorVariant('button')}
        onMouseLeave={() => setCursorVariant('default')}
        className="btn-lift flex items-center space-x-1.5 text-xs text-ink-600 hover:text-ink-950 px-4 py-2.5 rounded-none border border-ink-950/20 hover:border-ink-950 transition-all uppercase tracking-wider"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Voltar</span>
      </button>

      {isLast ? (
        <button
          type="button"
          onClick={onSimulate}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="btn-gold-fill btn-lift flex items-center space-x-2 text-sm font-semibold uppercase tracking-widest px-8 py-2.5 rounded-none cursor-pointer"
        >
          <Calculator className="w-4 h-4" />
          <span>Simular</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={goNext}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="btn-gold-fill btn-lift flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-widest px-6 py-2.5 rounded-none cursor-pointer"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">

      {/* Cabeçalho persistente (a partir do passo 1) — centralizado acima da caixa de configuração */}
      {step >= 1 && (
        <div className="relative flex flex-col items-center mb-4 px-1 text-center">
          <div className="flex items-center justify-center space-x-2">
            <Sliders className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">Configurar Simulação</h2>
          </div>
          <p className="text-[11px] text-ink-600 mt-0.5">Passo {step} de {TOTAL_CONFIG_STEPS}</p>

          <button
            onClick={onReset}
            className="btn-lift absolute right-1 top-0 flex items-center justify-center text-ink-600 hover:text-ink-950 p-2 rounded-none border border-ink-950/20 hover:border-ink-950 transition-all shrink-0"
            title="Restaurar padrão"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Trilho do Carrossel */}
      <div
        className="overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{ height: trackHeight }}
      >
        <div
          className="flex items-start transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
          style={{ transform: `translateX(-${step * 100}%)` }}
        >

          {/* Slide 0: Categoria */}
          <div ref={(el) => { slideRefs.current[0] = el; }} className="w-full shrink-0 px-1">
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-ink-600 mb-4 text-center">
              ESCOLHA A MODALIDADE DE SIMULAÇÃO
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start text-left">

              {/* Card 1: Imóvel */}
              <div ref={(el) => { cardWrapperRefs.current.property = el; }} className="flex flex-col scroll-mt-24">
                <MouseGlow
                  onClick={() => handleSelectCategory('property')}
                  className={`group rounded-none transition-all duration-300 cursor-pointer ${
                    hasSelectedCategory && inputs.category === 'property'
                      ? 'border-2 border-accent bg-white'
                      : 'border border-ink-950/20 hover:border-ink-950/60 bg-white'
                  }`}
                >
                  <div className="h-40 w-full relative overflow-hidden bg-ink-200">
                    <img
                      src="/images/property.jpg"
                      alt="Financiamento Imobiliário"
                      className="w-full h-full object-cover grayscale contrast-[1.08] group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    />

                    {hasSelectedCategory && inputs.category === 'property' && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-none bg-accent text-white text-[10px] font-semibold uppercase tracking-widest">
                        SELECIONADO
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t-2 border-ink-950/10 bg-white">
                    <div className="flex items-center space-x-2">
                      <HomeIcon className="w-4 h-4 text-ink-950" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-950">Imóvel</h3>
                    </div>
                  </div>
                </MouseGlow>

                {hasSelectedCategory && inputs.category === 'property' && (
                  <button
                    onClick={goNext}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="btn-gold-fill btn-lift animate-fadeIn w-full mt-3 py-2.5 px-2 rounded-none text-[9px] font-semibold uppercase flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Calculator className="w-3 h-3 shrink-0" />
                    <span>Simular Agora</span>
                  </button>
                )}
              </div>

              {/* Card 2: Veículo */}
              <div ref={(el) => { cardWrapperRefs.current.vehicle = el; }} className="flex flex-col scroll-mt-24">
                <MouseGlow
                  onClick={() => handleSelectCategory('vehicle')}
                  className={`group rounded-none transition-all duration-300 cursor-pointer ${
                    hasSelectedCategory && inputs.category === 'vehicle'
                      ? 'border-2 border-accent bg-white'
                      : 'border border-ink-950/20 hover:border-ink-950/60 bg-white'
                  }`}
                >
                  <div className="h-40 w-full relative overflow-hidden bg-ink-200">
                    <img
                      src="/images/vehicle.jpg"
                      alt="Financiamento Veicular"
                      className="w-full h-full object-cover grayscale contrast-[1.08] group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    />

                    {hasSelectedCategory && inputs.category === 'vehicle' && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-none bg-accent text-white text-[10px] font-semibold uppercase tracking-widest">
                        SELECIONADO
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t-2 border-ink-950/10 bg-white">
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4 text-ink-950" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-950">Veículo</h3>
                    </div>
                  </div>
                </MouseGlow>

                {hasSelectedCategory && inputs.category === 'vehicle' && (
                  <button
                    onClick={goNext}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="btn-gold-fill btn-lift animate-fadeIn w-full mt-3 py-2.5 px-2 rounded-none text-[9px] font-semibold uppercase flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Calculator className="w-3 h-3 shrink-0" />
                    <span>Simular Agora</span>
                  </button>
                )}
              </div>

              {/* Card 3: Pessoal */}
              <div ref={(el) => { cardWrapperRefs.current.personal = el; }} className="flex flex-col scroll-mt-24">
                <MouseGlow
                  onClick={() => handleSelectCategory('personal')}
                  className={`group rounded-none transition-all duration-300 cursor-pointer ${
                    hasSelectedCategory && inputs.category === 'personal'
                      ? 'border-2 border-accent bg-white'
                      : 'border border-ink-950/20 hover:border-ink-950/60 bg-white'
                  }`}
                >
                  <div className="h-40 w-full relative overflow-hidden bg-ink-200">
                    <img
                      src="/images/personal.jpg"
                      alt="Crédito Pessoal"
                      className="w-full h-full object-cover grayscale contrast-[1.08] group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    />

                    {hasSelectedCategory && inputs.category === 'personal' && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-none bg-accent text-white text-[10px] font-semibold uppercase tracking-widest">
                        SELECIONADO
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t-2 border-ink-950/10 bg-white">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-ink-950" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-950">Crédito Pessoal</h3>
                    </div>
                  </div>
                </MouseGlow>

                {hasSelectedCategory && inputs.category === 'personal' && (
                  <button
                    onClick={goNext}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="btn-gold-fill btn-lift animate-fadeIn w-full mt-3 py-2.5 px-2 rounded-none text-[9px] font-semibold uppercase flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Calculator className="w-3 h-3 shrink-0" />
                    <span>Simular Agora</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Slide 1: Sistema de Amortização */}
          <div ref={(el) => { slideRefs.current[1] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow className="editorial-card-light p-6 sm:p-10">
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-ink-600 mb-3 text-center">
                Sistema de Amortização
              </label>
              <div className="relative grid grid-cols-2 gap-0 p-1 bg-surface border-2 border-ink-950/15 rounded-none">
                <div
                  className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-accent transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{ transform: inputs.amortizationMethod === 'PRICE' ? 'translateX(100%)' : 'translateX(0%)' }}
                />

                <button
                  type="button"
                  onClick={() => onChange({ ...inputs, amortizationMethod: 'SAC' })}
                  className={`relative z-10 py-3 px-3 rounded-none text-xs tracking-wider font-semibold transition-colors duration-300 ${
                    inputs.amortizationMethod === 'SAC' ? 'text-white' : 'text-ink-600 hover:text-ink-950'
                  }`}
                >
                  SAC (Decrescente)
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ ...inputs, amortizationMethod: 'PRICE' })}
                  className={`relative z-10 py-3 px-3 rounded-none text-xs tracking-wider font-semibold transition-colors duration-300 ${
                    inputs.amortizationMethod === 'PRICE' ? 'text-white' : 'text-ink-600 hover:text-ink-950'
                  }`}
                >
                  PRICE (Prestação Fixa)
                </button>
              </div>
              <p className="text-[10px] text-ink-500 mt-4 text-center">
                {inputs.amortizationMethod === 'SAC'
                  ? 'Amortização constante: parcelas decrescentes, mais economia de juros no total.'
                  : 'Prestação fixa: parcelas iguais do início ao fim do contrato.'}
              </p>

              {renderNav(false)}
            </MouseGlow>
          </div>

          {/* Slide 2: Valor do Bem */}
          <div ref={(el) => { slideRefs.current[2] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow className="editorial-card-light p-6 sm:p-10">
              <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                  Valor do Bem
                </label>

                <div className="flex items-center bg-white border border-ink-950/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-accent">
                  <span className="text-ink-950 text-xs font-semibold mr-1.5">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maskedPropertyValue}
                    onChange={(e) => handlePropertyValueInput(e.target.value)}
                    onKeyDown={() => playTypeSound()}
                    onMouseEnter={() => setCursorVariant('input')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-28 sm:w-36 bg-transparent text-right font-mono text-ink-950 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <input
                type="range"
                min={10000}
                max={50000000}
                step={5000}
                value={inputs.propertyValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setMaskedPropertyValue(formatCurrencyMask(val));
                  const downPayment = Math.min(val, (val * inputs.downPaymentPercent) / 100);
                  setMaskedDownPayment(formatCurrencyMask(downPayment));
                  onChange({ ...inputs, propertyValue: val, downPayment });
                }}
                onInput={() => vibrateShort()}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-ink-500 mt-1.5 font-mono">
                <span>R$ 10 mil</span>
                <span className="text-ink-950 font-semibold">{formatBRL(inputs.propertyValue)}</span>
                <span>R$ 50 mi</span>
              </div>

              {renderNav(false)}
            </MouseGlow>
          </div>

          {/* Slide 3: Valor da Entrada */}
          <div ref={(el) => { slideRefs.current[3] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow className="editorial-card-light p-6 sm:p-10">
              <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                  Valor da Entrada
                </label>

                <div className="flex items-center bg-white border border-ink-950/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-accent">
                  <span className="text-ink-950 text-xs font-semibold mr-1.5">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maskedDownPayment}
                    onChange={(e) => handleDownPaymentInput(e.target.value)}
                    onKeyDown={() => playTypeSound()}
                    onMouseEnter={() => setCursorVariant('input')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-28 sm:w-36 bg-transparent text-right font-mono text-ink-950 text-sm focus:outline-none"
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
                onInput={() => vibrateShort()}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-ink-500 mt-1.5 font-mono">
                <span>0%</span>
                <span>
                  Financiado: <FormattedBRL value={inputs.propertyValue - inputs.downPayment} className="text-ink-950" />
                  <span className="text-[9px] text-ink-500 ml-1">({formatPercent(inputs.downPaymentPercent, 1)})</span>
                </span>
                <span>80%</span>
              </div>

              {renderNav(false)}
            </MouseGlow>
          </div>

          {/* Slide 4: Taxa de Juros */}
          <div ref={(el) => { slideRefs.current[4] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow className="editorial-card-light p-6 sm:p-10">
              <div className="flex justify-between items-center mb-2 gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                  Taxa de Juros
                </label>

                <div className="flex items-center bg-white border border-ink-950/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-accent">
                  <input
                    type="number"
                    step="0.1"
                    value={rawInterestRate}
                    onChange={(e) => {
                      setRawInterestRate(e.target.value);
                      const num = parseFloat(e.target.value) || 0;
                      onChange({ ...inputs, interestRateYearly: Math.max(0.1, num) });
                    }}
                    onKeyDown={() => playTypeSound()}
                    onMouseEnter={() => setCursorVariant('input')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-14 bg-transparent text-right font-mono text-ink-950 text-sm focus:outline-none"
                  />
                  <span className="text-ink-600 text-[10px] ml-1">% a.a.</span>
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
                onInput={() => vibrateShort()}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-full"
              />
              <div className="text-[10px] text-ink-500 mt-1.5 font-mono text-right">
                ~{formatPercent(inputs.interestRateYearly / 12, 2)} / mês
              </div>

              {renderNav(false)}
            </MouseGlow>
          </div>

          {/* Slide 5: Prazo + Seguros + Simular */}
          <div ref={(el) => { slideRefs.current[5] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow className="editorial-card-light p-6 sm:p-10">
              <div className="flex justify-between items-center mb-2 gap-2">
                <div className="flex items-center space-x-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-ink-700">
                    Prazo
                  </label>
                  <button
                    type="button"
                    onClick={() => setTermUnit(termUnit === 'years' ? 'months' : 'years')}
                    className="text-[10px] text-ink-600 hover:text-ink-950 underline ml-1"
                  >
                    ({termUnit === 'years' ? 'Anos' : 'Meses'})
                  </button>
                </div>

                <div className="flex items-center bg-white border border-ink-950/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-accent">
                  <input
                    type="number"
                    value={termUnit === 'years' ? termInYears : inputs.termMonths}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const termMonths = termUnit === 'years' ? Math.round(val * 12) : val;
                      onChange({ ...inputs, termMonths: Math.max(1, termMonths) });
                    }}
                    onKeyDown={() => playTypeSound()}
                    onMouseEnter={() => setCursorVariant('input')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-14 bg-transparent text-right font-mono text-ink-950 text-sm focus:outline-none"
                  />
                  <span className="text-ink-600 text-[10px] ml-1">
                    {termUnit === 'years' ? 'anos' : 'meses'}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min={6}
                max={600}
                step={6}
                value={inputs.termMonths}
                onChange={(e) => onChange({ ...inputs, termMonths: Number(e.target.value) })}
                onInput={() => vibrateShort()}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-full"
              />
              <div className="text-[10px] text-ink-500 mt-1.5 font-mono text-right">
                {inputs.termMonths} meses ({termInYears} anos)
              </div>

              {/* Seguros & Encargos Toggle */}
              <div
                className={`mt-6 p-3.5 border rounded-none flex items-center justify-between gap-2 transition-all duration-300 ${
                  inputs.includeInsurances
                    ? 'bg-accent-100 border-accent'
                    : 'bg-white border-ink-950/15 hover:border-ink-950/30'
                }`}
              >
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-950">Seguros &amp; Taxas Administrativas</h4>
                  <p className="text-[10px] text-ink-600">Seguros MIP/DFI e taxa mensal R$ 25,00</p>
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
                  <div className="w-9 h-5 bg-ink-300 peer-focus:outline-none peer peer-checked:after:translate-x-full peer-checked:after:border-accent-700 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ink-400 after:border after:h-4 after:w-4 after:transition-all after:duration-300 peer-checked:bg-accent peer-checked:after:bg-white" />
                </label>
              </div>

              {renderNav(true)}
            </MouseGlow>
          </div>

        </div>
      </div>
    </div>
  );
};
