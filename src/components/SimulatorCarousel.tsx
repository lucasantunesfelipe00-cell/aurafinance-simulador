'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FinancingInputs } from '@/types/financing';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { MagneticButton } from '@/components/MagneticButton';
import { setCursorVariant } from '@/lib/cursor-store';
import { playTypeSound } from '@/lib/sound';
import { vibrateShort } from '@/lib/haptics';
import {
  Calculator,
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
  onStepChange?: (step: number) => void;
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

export const SimulatorCarousel: React.FC<SimulatorCarouselProps> = ({
  inputs,
  onChange,
  onReset,
  onSimulate,
  onStepChange,
}) => {
  const [step, setStepState] = useState(1);
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');

  const setStep = (newStepOrFn: number | ((prev: number) => number)) => {
    setStepState((prev) => {
      const nextStep = typeof newStepOrFn === 'function' ? newStepOrFn(prev) : newStepOrFn;
      if (onStepChange) onStepChange(nextStep);
      return nextStep;
    });
  };

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

  const slideRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [trackHeight, setTrackHeight] = useState<number>();

  // Altura do trilho acompanha o slide ativo
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
  const goBack = () => setStep((s) => Math.max(1, s - 1));

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

  const renderNav = (isFirstStep: boolean, isLastStep: boolean) => (
    <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-white/10">
      {!isFirstStep ? (
        <button
          type="button"
          onClick={goBack}
          className="btn-lift flex items-center space-x-1.5 text-xs text-neutral-400 hover:text-white px-4 py-2.5 rounded-[75px] border border-white/20 hover:border-white transition-all uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      ) : (
        <div />
      )}

      {isLastStep ? (
        <MagneticButton
          type="button"
          onClick={onSimulate}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="btn-gold-fill btn-lift btn-shine btn-shine-gold btn-liquid-sweep flex items-center space-x-2 text-sm font-normal uppercase tracking-widest px-8 py-2.5 rounded-[75px] cursor-pointer shadow-gold-glow"
        >
          <Calculator className="w-4 h-4 text-white" />
          <span>Simular</span>
        </MagneticButton>
      ) : (
        <MagneticButton
          type="button"
          onClick={goNext}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="btn-gold-fill btn-lift btn-shine btn-shine-gold flex items-center space-x-1.5 text-xs font-normal uppercase tracking-widest px-6 py-2.5 rounded-[75px] cursor-pointer"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </MagneticButton>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">

      {/* Cabeçalho do topo da caixa de configuração */}
      <div className="relative flex flex-col items-center justify-center pt-1 mb-8 px-4 sm:px-8 text-center w-full min-h-[96px]">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            /* PASSO 1: Subido significativamente com distância generosa da caixa abaixo */
            <motion.div
              key="header-step-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center pt-12 sm:pt-16 pb-4"
            >
              <h2 className="text-xl min-[360px]:text-2xl min-[390px]:text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-center leading-tight max-w-[92vw] sm:max-w-2xl mx-auto line-clamp-3 overflow-hidden">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] tracking-tight">
                  Dê início à configuração
                </span>{' '}
                <span className="font-light text-neutral-300 tracking-normal">
                  escolhendo o sistema de amortização...
                </span>
              </h2>
            </motion.div>
          ) : (
            /* PASSO 2 EM DIANTE: "Configurar Simulação" + "Passo X de 5" */
            <motion.div
              key="header-step-2plus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-full flex flex-col items-center justify-center space-y-1 pt-16 sm:pt-10"
            >
              <div className="flex items-center space-x-2.5">
                <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-widest text-gold-400">
                  Configurar Simulação
                </h2>
              </div>

              <p className="text-base sm:text-lg lg:text-xl text-white font-medium tracking-wider">
                Passo {step} de {TOTAL_CONFIG_STEPS}
              </p>

              {/* Barra de Progresso Segmentada Retangular (Mesma largura exata do texto 'Passo X de 5') */}
              <div className="flex items-center space-x-1 w-[110px] sm:w-[130px] mx-auto pt-1">
                {[1, 2, 3, 4, 5].map((i) => {
                  const isCurrent = i === step;
                  const isCompleted = i < step;

                  return (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-none transition-all duration-300 ${
                        isCurrent
                          ? 'bg-gold-400 shadow-gold-glow-sm'
                          : isCompleted
                          ? 'bg-[#a47e35]/60'
                          : 'bg-white/15'
                      }`}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trilho do Carrossel (Física de mola editorial suave) */}
      <div
        className="overflow-hidden transition-[height] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ height: trackHeight }}
      >
        <div
          className="flex items-start transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >

          {/* Passo 1: Sistema de Amortização */}
          <div ref={(el) => { slideRefs.current[1] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow size={260} className="editorial-card p-6 sm:p-10 border border-white/20 bg-black rounded-none">
              <div className="relative grid grid-cols-2 gap-0 p-1 bg-black border border-white/15 rounded-none">
                <div
                  className="absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] bg-gold-gradient-btn shadow-gold-glow-sm transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{ transform: inputs.amortizationMethod === 'PRICE' ? 'translateX(100%)' : 'translateX(0%)' }}
                />

                <button
                  type="button"
                  onClick={() => onChange({ ...inputs, amortizationMethod: 'SAC' })}
                  className={`relative z-10 h-11 sm:h-12 py-1.5 px-2 rounded-none text-sm sm:text-lg lg:text-xl tracking-widest font-normal flex items-center justify-center text-center leading-none transition-colors duration-300 ${inputs.amortizationMethod === 'SAC' ? 'text-black font-normal' : 'text-neutral-400 hover:text-white'
                    }`}
                >
                  SAC
                </button>

                <button
                  type="button"
                  onClick={() => onChange({ ...inputs, amortizationMethod: 'PRICE' })}
                  className={`relative z-10 h-11 sm:h-12 py-1.5 px-2 rounded-none text-sm sm:text-lg lg:text-xl tracking-widest font-normal flex items-center justify-center text-center leading-none transition-colors duration-300 ${inputs.amortizationMethod === 'PRICE' ? 'text-black font-normal' : 'text-neutral-400 hover:text-white'
                    }`}
                >
                  PRICE
                </button>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-neutral-300 font-light mt-5 text-center leading-relaxed">
                {inputs.amortizationMethod === 'SAC' ? (
                  <>
                    <span className="font-medium text-white">Amortização constante</span>: parcelas decrescentes, mais economia de juros no total.
                  </>
                ) : (
                  <>
                    <span className="font-medium text-white">Prestação fixa</span>: parcelas iguais do início ao fim do contrato.
                  </>
                )}
              </p>

              {renderNav(true, false)}
            </MouseGlow>
          </div>

          {/* Passo 2: Valor do Bem */}
          <div ref={(el) => { slideRefs.current[2] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow size={260} className="editorial-card p-6 sm:p-10 border border-white/20 bg-black rounded-none">
              <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                <label className="text-xs sm:text-sm lg:text-base font-normal uppercase tracking-wider text-neutral-300">
                  Valor do Imóvel
                </label>

                <div className="h-9 sm:h-10 max-h-10 px-2.5 sm:px-3 py-0 flex items-center bg-black border border-white/20 rounded-none shrink-0 max-w-full overflow-hidden focus-within:border-white">
                  <span className="text-white text-xs sm:text-sm lg:text-base font-medium mr-1.5 shrink-0">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maskedPropertyValue}
                    onChange={(e) => handlePropertyValueInput(e.target.value)}
                    onKeyDown={() => playTypeSound()}
                    onMouseEnter={() => setCursorVariant('input')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="h-full w-28 sm:w-40 lg:w-44 max-w-full bg-transparent text-right font-mono text-white text-sm sm:text-base lg:text-lg focus:outline-none leading-none"
                  />
                </div>
              </div>

              <div
                className="relative py-5 -my-2 sm:py-6 sm:-my-3 cursor-pointer group"
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <input
                  type="range"
                  min={50000}
                  max={50000000}
                  step={10000}
                  value={inputs.propertyValue}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMaskedPropertyValue(formatCurrencyMask(val));
                    const downPayment = Math.min(val, (val * inputs.downPaymentPercent) / 100);
                    setMaskedDownPayment(formatCurrencyMask(downPayment));
                    onChange({ ...inputs, propertyValue: val, downPayment });
                  }}
                  onInput={() => vibrateShort()}
                  className="w-full cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs sm:text-sm lg:text-base text-neutral-400 mt-1.5 font-mono">
                <span>R$ 50 mil</span>
                <span className="text-white font-medium">{formatBRL(inputs.propertyValue)}</span>
                <span>R$ 50 mi</span>
              </div>

              {renderNav(false, false)}
            </MouseGlow>
          </div>

          {/* Passo 3: Valor da Entrada */}
          <div ref={(el) => { slideRefs.current[3] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow size={260} className="editorial-card p-6 sm:p-10 border border-white/20 bg-black rounded-none">
              <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                <label className="text-xs sm:text-sm lg:text-base font-normal uppercase tracking-wider text-neutral-300">
                  Valor da Entrada
                </label>

                <div className="h-9 sm:h-10 max-h-10 px-2.5 sm:px-3 py-0 flex items-center bg-black border border-white/20 rounded-none shrink-0 max-w-full overflow-hidden focus-within:border-white">
                  <span className="text-white text-xs sm:text-sm lg:text-base font-medium mr-1.5 shrink-0">R$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maskedDownPayment}
                    onChange={(e) => handleDownPaymentInput(e.target.value)}
                    onKeyDown={() => playTypeSound()}
                    onMouseEnter={() => setCursorVariant('input')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="h-full w-28 sm:w-40 lg:w-44 max-w-full bg-transparent text-right font-mono text-white text-sm sm:text-base lg:text-lg focus:outline-none leading-none"
                  />
                </div>
              </div>

              <div
                className="relative py-5 -my-2 sm:py-6 sm:-my-3 cursor-pointer group"
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={1}
                  value={inputs.downPaymentPercent}
                  onChange={(e) => handleDownPaymentPercentChange(Number(e.target.value))}
                  onInput={() => vibrateShort()}
                  className="w-full cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs sm:text-sm lg:text-base text-neutral-400 mt-1.5 font-mono">
                <span>0%</span>
                <span>
                  Entrada: <span className="text-white font-medium">{formatPercent(inputs.downPaymentPercent, 1)}</span>
                </span>
                <span>80%</span>
              </div>
              <div className="text-[10px] sm:text-xs lg:text-sm text-neutral-400 mt-2 font-mono text-center">
                Financiado: <FormattedBRL value={inputs.propertyValue - inputs.downPayment} className="text-white font-medium" /> <span className="text-neutral-500">({formatPercent(100 - inputs.downPaymentPercent, 1)})</span>
              </div>

              {renderNav(false, false)}
            </MouseGlow>
          </div>

          {/* Passo 4: Taxa de Juros */}
          <div ref={(el) => { slideRefs.current[4] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow size={260} className="editorial-card p-6 sm:p-10 border border-white/20 bg-black rounded-none">
              <div className="flex justify-between items-center mb-2 gap-2">
                <label className="text-xs sm:text-sm lg:text-base font-normal uppercase tracking-wider text-neutral-300">
                  Taxa de Juros
                </label>

                <div className="h-9 sm:h-10 max-h-10 px-2.5 sm:px-3 py-0 flex items-center bg-black border border-white/20 rounded-none shrink-0 overflow-hidden focus-within:border-white">
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
                    className="h-full w-12 sm:w-16 lg:w-20 bg-transparent text-right font-mono text-white text-sm sm:text-base lg:text-lg focus:outline-none leading-none"
                  />
                  <span className="text-neutral-400 text-xs sm:text-sm lg:text-base ml-1 shrink-0">% a.a.</span>
                </div>
              </div>

              <div
                className="relative py-5 -my-2 sm:py-6 sm:-my-3 cursor-pointer group"
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
              >
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
                  className="w-full cursor-pointer"
                />
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-neutral-400 mt-1.5 font-mono text-right">
                ~{formatPercent(inputs.interestRateYearly / 12, 2)} / mês
              </div>

              {renderNav(false, false)}
            </MouseGlow>
          </div>

          {/* Passo 5: Prazo + Seguros + Simular */}
          <div ref={(el) => { slideRefs.current[5] = el; }} className="w-full shrink-0 px-1">
            <MouseGlow size={260} className="editorial-card p-6 sm:p-10 border border-white/20 bg-black rounded-none">
              <div className="flex justify-between items-center mb-2 gap-2">
                <div className="flex items-center space-x-1">
                  <label className="text-xs sm:text-sm lg:text-base font-normal uppercase tracking-wider text-neutral-300">
                    Prazo
                  </label>
                  <button
                    type="button"
                    onClick={() => setTermUnit(termUnit === 'years' ? 'months' : 'years')}
                    className="text-[10px] sm:text-xs text-neutral-400 hover:text-white underline ml-1"
                  >
                    ({termUnit === 'years' ? 'Anos' : 'Meses'})
                  </button>
                </div>

                <div className="h-9 sm:h-10 max-h-10 px-2.5 sm:px-3 py-0 flex items-center bg-black border border-white/20 rounded-none shrink-0 overflow-hidden focus-within:border-white">
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
                    className="h-full w-12 sm:w-16 lg:w-20 bg-transparent text-right font-mono text-white text-sm sm:text-base lg:text-lg focus:outline-none leading-none"
                  />
                  <span className="text-neutral-400 text-xs sm:text-sm lg:text-base ml-1 shrink-0">
                    {termUnit === 'years' ? 'anos' : 'meses'}
                  </span>
                </div>
              </div>

              <div
                className="relative py-5 -my-2 sm:py-6 sm:-my-3 cursor-pointer group"
                onMouseEnter={() => setCursorVariant('native')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <input
                  type="range"
                  min={6}
                  max={420}
                  step={6}
                  value={inputs.termMonths}
                  onChange={(e) => onChange({ ...inputs, termMonths: Number(e.target.value) })}
                  onInput={() => vibrateShort()}
                  className="w-full cursor-pointer"
                />
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-neutral-400 mt-1.5 font-mono text-right">
                {inputs.termMonths} meses ({termInYears} anos)
              </div>

              {/* Seguros & Encargos Toggle */}
              <div
                className={`mt-6 p-3.5 border rounded-none flex items-center justify-between gap-2 transition-all duration-300 ${inputs.includeInsurances
                  ? 'bg-white/[0.03] border-white/30'
                  : 'bg-black border-white/15 hover:border-white/30'
                  }`}
              >
                <div className="min-w-0 flex-1 mr-2">
                  <h4 className="text-[10px] min-[360px]:text-[11px] sm:text-xs font-normal uppercase tracking-wider text-white whitespace-nowrap overflow-hidden text-ellipsis">Seguros &amp; Taxas Administrativas</h4>
                  <p className="text-[9px] min-[360px]:text-[10px] text-neutral-400 font-light whitespace-nowrap overflow-hidden text-ellipsis">Seguros MIP/DFI e taxa mensal R$ 25,00</p>
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

              {renderNav(false, true)}
            </MouseGlow>
          </div>

        </div>
      </div>
    </div>
  );
};
