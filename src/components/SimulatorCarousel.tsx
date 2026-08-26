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

  const ctaButtonRef = useRef<HTMLButtonElement>(null);
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
      ctaButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-white/10">
      <button
        type="button"
        onClick={goBack}
        onMouseEnter={() => setCursorVariant('button')}
        onMouseLeave={() => setCursorVariant('default')}
        className="btn-lift flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white px-4 py-2.5 rounded-[75px] border border-white/20 hover:border-white transition-all uppercase tracking-wider"
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
          className="btn-gold-fill btn-lift btn-shine btn-shine-gold flex items-center space-x-2 text-sm font-normal uppercase tracking-widest px-8 py-2.5 rounded-[75px] cursor-pointer"
        >
          <Calculator className="w-4 h-4 text-white" />
          <span>Simular</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={goNext}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="btn-gold-fill btn-lift btn-shine btn-shine-gold flex items-center space-x-1.5 text-xs font-normal uppercase tracking-widest px-6 py-2.5 rounded-[75px] cursor-pointer"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">

      {/* Cabeçalho persistente (a partir do passo 1) */}
      {step >= 1 && (
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-4 h-4 text-white" />
            <div>
              <h2 className="text-xs font-normal uppercase tracking-widest text-white">Configurar Simulação</h2>
              <p className="text-[11px] text-neutral-400 font-light">Passo {step} de {TOTAL_CONFIG_STEPS}</p>
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
            <label className="block text-[11px] font-normal uppercase tracking-widest text-neutral-400 mb-4 text-center">
              ESCOLHA A MODALIDADE DE SIMULAÇÃO
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start text-left">

              {/* Card 1: Imóvel */}
              <MouseGlow
                onClick={() => handleSelectCategory('property')}
                className={`group rounded-none border transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer ${
                  hasSelectedCategory && inputs.category === 'property'
                    ? 'border-gold-500 bg-black shadow-gold-glow'
                    : 'border-white/20 hover:border-white/60 bg-black/60'
                }`}
              >
                <div className="h-40 w-full relative overflow-hidden bg-black">
                  <img
                    src="/images/property.jpg"
                    alt="Financiamento Imobiliário"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {hasSelectedCategory && inputs.category === 'property' && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-[75px] bg-gold-gradient-btn text-black text-[10px] font-medium uppercase tracking-widest shadow-none">
                      SELECIONADO
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black">
                  <div className="flex items-center space-x-2">
                    <HomeIcon className="w-4 h-4 text-white" />
                    <h3 className="text-xs font-normal uppercase tracking-wider text-white">Imóvel</h3>
                  </div>

                  {hasSelectedCategory && inputs.category === 'property' && (
                    <button
                      ref={ctaButtonRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                      onMouseEnter={() => setCursorVariant('button')}
                      onMouseLeave={() => setCursorVariant('default')}
                      className="btn-gold-fill btn-lift btn-shine btn-shine-gold animate-ctaPulseGold animate-fadeIn w-full mt-4 py-2.5 px-2 rounded-[75px] text-[9px] font-normal uppercase flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Calculator className="w-3 h-3 shrink-0" />
                      <span>Simular Agora</span>
                    </button>
                  )}
                </div>
              </MouseGlow>

              {/* Card 2: Veículo */}
              <MouseGlow
                onClick={() => handleSelectCategory('vehicle')}
                className={`group rounded-none border transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer ${
                  hasSelectedCategory && inputs.category === 'vehicle'
                    ? 'border-gold-500 bg-black shadow-gold-glow'
                    : 'border-white/20 hover:border-white/60 bg-black/60'
                }`}
              >
                <div className="h-40 w-full relative overflow-hidden bg-black">
                  <img
                    src="/images/vehicle.jpg"
                    alt="Financiamento Veicular"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {hasSelectedCategory && inputs.category === 'vehicle' && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-[75px] bg-gold-gradient-btn text-black text-[10px] font-medium uppercase tracking-widest shadow-none">
                      SELECIONADO
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black">
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-white" />
                    <h3 className="text-xs font-normal uppercase tracking-wider text-white">Veículo</h3>
                  </div>

                  {hasSelectedCategory && inputs.category === 'vehicle' && (
                    <button
                      ref={ctaButtonRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                      onMouseEnter={() => setCursorVariant('button')}
                      onMouseLeave={() => setCursorVariant('default')}
                      className="btn-gold-fill btn-lift btn-shine btn-shine-gold animate-ctaPulseGold animate-fadeIn w-full mt-4 py-2.5 px-2 rounded-[75px] text-[9px] font-normal uppercase flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Calculator className="w-3 h-3 shrink-0" />
                      <span>Simular Agora</span>
                    </button>
                  )}
                </div>
              </MouseGlow>

              {/* Card 3: Pessoal */}
              <MouseGlow
                onClick={() => handleSelectCategory('personal')}
                className={`group rounded-none border transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] cursor-pointer ${
                  hasSelectedCategory && inputs.category === 'personal'
                    ? 'border-gold-500 bg-black shadow-gold-glow'
                    : 'border-white/20 hover:border-white/60 bg-black/60'
                }`}
              >
                <div className="h-40 w-full relative overflow-hidden bg-black">
                  <img
                    src="/images/personal.jpg"
                    alt="Crédito Pessoal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                  {hasSelectedCategory && inputs.category === 'personal' && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-[75px] bg-gold-gradient-btn text-black text-[10px] font-medium uppercase tracking-widest shadow-none">
                      SELECIONADO
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-white" />
                    <h3 className="text-xs font-normal uppercase tracking-wider text-white">Crédito Pessoal</h3>
                  </div>

                  {hasSelectedCategory && inputs.category === 'personal' && (
                    <button
                      ref={ctaButtonRef}
                      onClick={(e) => {
                        e.stopPropagation();
                        goNext();
                      }}
                      onMouseEnter={() => setCursorVariant('button')}
                      onMouseLeave={() => setCursorVariant('default')}
                      className="btn-gold-fill btn-lift btn-shine btn-shine-gold animate-ctaPulseGold animate-fadeIn w-full mt-4 py-2.5 px-2 rounded-[75px] text-[9px] font-normal uppercase flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Calculator className="w-3 h-3 shrink-0" />
                      <span>Simular Agora</span>
                    </button>
                  )}
                </div>
              </MouseGlow>

            </div>
          </div>

          {/* Slide 1: Sistema de Amortização */}
          <div ref={(el) => { slideRefs.current[1] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow size={260} className="editorial-card p-6 sm:p-10 border border-white/20 bg-black rounded-none">
              <label className="block text-[10px] font-normal uppercase tracking-widest text-neutral-400 mb-3 text-center">
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
                  className={`relative z-10 py-3 px-3 rounded-none text-xs tracking-wider font-normal transition-colors duration-300 ${
                    inputs.amortizationMethod === 'SAC' ? 'text-black font-medium' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  SAC (Decrescente)
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ ...inputs, amortizationMethod: 'PRICE' })}
                  className={`relative z-10 py-3 px-3 rounded-none text-xs tracking-wider font-normal transition-colors duration-300 ${
                    inputs.amortizationMethod === 'PRICE' ? 'text-black font-medium' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  PRICE (Prestação Fixa)
                </button>
              </div>
              <p className="text-[10px] text-neutral-500 font-light mt-4 text-center">
                {inputs.amortizationMethod === 'SAC'
                  ? 'Amortização constante: parcelas decrescentes, mais economia de juros no total.'
                  : 'Prestação fixa: parcelas iguais do início ao fim do contrato.'}
              </p>

              {renderNav(false)}
            </MouseGlow>
          </div>

          {/* Slide 2: Valor do Bem */}
          <div ref={(el) => { slideRefs.current[2] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow size={260} className="editorial-card p-6 sm:p-10 border border-white/20 bg-black rounded-none">
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
                    onKeyDown={() => playTypeSound()}
                    onMouseEnter={() => setCursorVariant('input')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-28 sm:w-36 bg-transparent text-right font-mono text-white text-sm focus:outline-none"
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
                onInput={() => vibrateShort()}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1.5 font-mono">
                <span>R$ 10 mil</span>
                <span className="text-white font-medium">{formatBRL(inputs.propertyValue)}</span>
                <span>R$ {inputs.category === 'property' ? '10 mi' : '500 mil'}</span>
              </div>

              {renderNav(false)}
            </MouseGlow>
          </div>

          {/* Slide 3: Valor da Entrada */}
          <div ref={(el) => { slideRefs.current[3] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow size={260} className="editorial-card p-6 sm:p-10 border border-white/20 bg-black rounded-none">
              <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                <label className="text-xs font-normal uppercase tracking-wider text-neutral-300">
                  Valor da Entrada
                </label>

                <div className="flex items-center bg-black border border-white/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-white">
                  <span className="text-white text-xs font-medium mr-1.5">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maskedDownPayment}
                    onChange={(e) => handleDownPaymentInput(e.target.value)}
                    onKeyDown={() => playTypeSound()}
                    onMouseEnter={() => setCursorVariant('input')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-28 sm:w-36 bg-transparent text-right font-mono text-white text-sm focus:outline-none"
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
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1.5 font-mono">
                <span>0%</span>
                <span>
                  Financiado: <FormattedBRL value={inputs.propertyValue - inputs.downPayment} className="text-white" />
                  <span className="text-[9px] text-neutral-500 ml-1">({formatPercent(inputs.downPaymentPercent, 1)})</span>
                </span>
                <span>80%</span>
              </div>

              {renderNav(false)}
            </MouseGlow>
          </div>

          {/* Slide 4: Taxa de Juros */}
          <div ref={(el) => { slideRefs.current[4] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow size={260} className="editorial-card p-6 sm:p-10 border border-white/20 bg-black rounded-none">
              <div className="flex justify-between items-center mb-2 gap-2">
                <label className="text-xs font-normal uppercase tracking-wider text-neutral-300">
                  Taxa de Juros
                </label>

                <div className="flex items-center bg-black border border-white/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-white">
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
                    className="w-14 bg-transparent text-right font-mono text-white text-sm focus:outline-none"
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
                onInput={() => vibrateShort()}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-full"
              />
              <div className="text-[10px] text-neutral-500 mt-1.5 font-mono text-right">
                ~{formatPercent(inputs.interestRateYearly / 12, 2)} / mês
              </div>

              {renderNav(false)}
            </MouseGlow>
          </div>

          {/* Slide 5: Prazo + Seguros + Simular */}
          <div ref={(el) => { slideRefs.current[5] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow size={260} className="editorial-card p-6 sm:p-10 border border-white/20 bg-black rounded-none">
              <div className="flex justify-between items-center mb-2 gap-2">
                <div className="flex items-center space-x-1">
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

                <div className="flex items-center bg-black border border-white/20 rounded-none px-2.5 py-1 shrink-0 focus-within:border-white">
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
                    className="w-14 bg-transparent text-right font-mono text-white text-sm focus:outline-none"
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
                onInput={() => vibrateShort()}
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-full"
              />
              <div className="text-[10px] text-neutral-500 mt-1.5 font-mono text-right">
                {inputs.termMonths} meses ({termInYears} anos)
              </div>

              {/* Seguros & Encargos Toggle */}
              <div
                className={`mt-6 p-3.5 border rounded-none flex items-center justify-between gap-2 transition-all duration-300 ${
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

              {renderNav(true)}
            </MouseGlow>
          </div>

        </div>
      </div>
    </div>
  );
};
