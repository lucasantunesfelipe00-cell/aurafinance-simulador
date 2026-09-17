'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  calculateAcquisitionCosts,
  COMMON_CITY_ITBI_RATES,
  buildWhatsAppAcquisitionCostsMessage,
  DEFAULT_ACQUISITION_PARAMS,
} from '@/lib/acquisition-costs';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MagneticButton } from '@/components/MagneticButton';
import {
  X,
  Landmark,
  ShieldCheck,
  Building2,
  FileText,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  HelpCircle,
  Percent,
  Coins,
  Scale,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound } from '@/lib/sound';
import { normalizeWhatsAppPhone } from '@/lib/whatsapp';

interface AcquisitionCostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyValue: number;
}

export const AcquisitionCostsModal: React.FC<AcquisitionCostsModalProps> = ({
  isOpen,
  onClose,
  propertyValue: initialPropertyValue,
}) => {
  const [propertyValue, setPropertyValue] = useState<number>(initialPropertyValue || 800000);
  const [itbiRate, setItbiRate] = useState<number>(3.0);
  const [registrationRate, setRegistrationRate] = useState<number>(1.2);
  const [bankAppraisalFee, setBankAppraisalFee] = useState<number>(3400);
  const [certificatesFee, setCertificatesFee] = useState<number>(900);
  const [isFirstPropertySFH, setIsFirstPropertySFH] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('São Paulo');
  const [includeInFinancing, setIncludeInFinancing] = useState<boolean>(false);

  // Sync if initialPropertyValue changes
  React.useEffect(() => {
    if (initialPropertyValue > 0) {
      setPropertyValue(initialPropertyValue);
    }
  }, [initialPropertyValue]);

  const result = useMemo(() => {
    return calculateAcquisitionCosts({
      propertyValue,
      itbiRate,
      registrationRate,
      bankAppraisalFee,
      certificatesFee,
      isFirstPropertySFH,
      includeInFinancing,
    });
  }, [
    propertyValue,
    itbiRate,
    registrationRate,
    bankAppraisalFee,
    certificatesFee,
    isFirstPropertySFH,
    includeInFinancing,
  ]);

  if (!isOpen) return null;

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    const found = COMMON_CITY_ITBI_RATES.find((c) => c.name === cityName);
    if (found) {
      setItbiRate(found.rate);
      vibrateShort();
      playClickSound();
    }
  };

  const handleReset = () => {
    vibrateShort();
    playClickSound();
    setPropertyValue(initialPropertyValue || 800000);
    setItbiRate(DEFAULT_ACQUISITION_PARAMS.itbiRate);
    setRegistrationRate(DEFAULT_ACQUISITION_PARAMS.registrationRate);
    setBankAppraisalFee(DEFAULT_ACQUISITION_PARAMS.bankAppraisalFee);
    setCertificatesFee(DEFAULT_ACQUISITION_PARAMS.certificatesFee);
    setIsFirstPropertySFH(false);
    setSelectedCity('São Paulo');
    setIncludeInFinancing(false);
  };

  const handleShareWhatsApp = () => {
    vibrateShort();
    playClickSound();
    const msg = buildWhatsAppAcquisitionCostsMessage(result, isFirstPropertySFH);
    const phone = normalizeWhatsAppPhone('');
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="w-full max-w-[1236px] mx-auto editorial-card editorial-card-gold-border p-4 sm:p-8 md:p-10 bg-black rounded-none flex flex-col relative overflow-hidden font-sans animate-fadeIn">
      
      {/* Luz ambiente dourada de fundo */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-[#c2a25b]/15 via-[#a47e35]/5 to-transparent pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-none bg-gradient-to-br from-[#c2a25b]/20 to-[#a47e35]/10 border border-[#c2a25b]/40 text-gold-400 shadow-inner">
            <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center space-x-2">
              <span>Custos de Cartório, ITBI &amp; Aquisição</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Planejamento de despesas de transferência e registro legal do imóvel
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            vibrateShort();
            onClose();
          }}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="p-2 rounded-none text-gold-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-gold-400/60 transition-all cursor-pointer"
          title="Fechar"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Hero Banner: Total em Caixa Necessário */}
      <div className="my-6 p-5 sm:p-6 bg-gradient-to-r from-[#1a160d] via-black to-[#1a160d] border border-gold-400/60 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_25px_rgba(194,162,91,0.2)]">
        <div>
          <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-gold-400 block mb-1">
            Total Estimado de Despesas no Fechamento
          </span>
          <div className="flex items-baseline space-x-2">
            <FormattedBRL
              value={result.totalCosts}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight"
              animate
            />
            <span className="text-xs sm:text-sm text-neutral-300 font-mono">
              (~{formatPercent(result.totalCostsPercent, 1)} do valor do imóvel)
            </span>
          </div>
          <p className="text-xs text-neutral-300 mt-1">
            Valor em dinheiro vivo necessário no dia da assinatura e registro em cartório.
          </p>
        </div>

        {isFirstPropertySFH && result.registrationDiscountAmount > 0 && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 flex items-center space-x-2.5 rounded-none">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                Benefício Lei 6.015/73
              </span>
              <span className="text-xs font-semibold text-emerald-300">
                Economia de <FormattedBRL value={result.registrationDiscountAmount} className="font-bold text-emerald-200" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Grid de 4 Cards de Composição */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative z-10 mb-6">
        
        {/* Card 1: ITBI */}
        <div className="p-4 bg-neutral-950 border border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gold-400">
                1. ITBI Municipal
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                {formatPercent(result.itbiRate, 1)}
              </span>
            </div>
            <FormattedBRL
              value={result.itbiAmount}
              className="text-lg sm:text-xl font-bold text-white tracking-tight block mb-1"
            />
          </div>
          <p className="text-[11px] text-neutral-400 border-t border-white/10 pt-2 mt-2">
            Imposto sobre transmissão de bens imóveis recolhido à prefeitura.
          </p>
        </div>

        {/* Card 2: Registro de Imóveis */}
        <div className={`p-4 bg-neutral-950 border flex flex-col justify-between ${
          isFirstPropertySFH ? 'border-emerald-500/50 bg-emerald-950/15' : 'border-white/15'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                isFirstPropertySFH ? 'text-emerald-400' : 'text-gold-400'
              }`}>
                2. Registro Cartório
              </span>
              {isFirstPropertySFH ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  -50% SFH
                </span>
              ) : (
                <span className="text-[10px] font-mono text-neutral-400">
                  ~{formatPercent(registrationRate, 1)}
                </span>
              )}
            </div>
            <FormattedBRL
              value={result.registrationFinalAmount}
              className="text-lg sm:text-xl font-bold text-white tracking-tight block mb-1"
            />
          </div>
          <p className="text-[11px] text-neutral-400 border-t border-white/10 pt-2 mt-2">
            {isFirstPropertySFH
              ? 'Emolumentos do Cartório de Registro com 50% de abatimento legal.'
              : 'Emolumentos tabelados do Cartório de Registro de Imóveis (RGI).'}
          </p>
        </div>

        {/* Card 3: Avaliação & Laudo Bancário */}
        <div className="p-4 bg-neutral-950 border border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gold-400">
                3. Laudo Bancário
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Taxa Fixa
              </span>
            </div>
            <FormattedBRL
              value={result.bankAppraisalFee}
              className="text-lg sm:text-xl font-bold text-white tracking-tight block mb-1"
            />
          </div>
          <p className="text-[11px] text-neutral-400 border-t border-white/10 pt-2 mt-2">
            Vistoria de engenharia e análise jurídica da documentação pelo banco.
          </p>
        </div>

        {/* Card 4: Certidões & Despachante */}
        <div className="p-4 bg-neutral-950 border border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gold-400">
                4. Certidões
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Estimado
              </span>
            </div>
            <FormattedBRL
              value={result.certificatesFee}
              className="text-lg sm:text-xl font-bold text-white tracking-tight block mb-1"
            />
          </div>
          <p className="text-[11px] text-neutral-400 border-t border-white/10 pt-2 mt-2">
            Certidões de matrícula atualizada, ônus reais e assessoria documental.
          </p>
        </div>

      </div>

      {/* Controles & Parâmetros Interativos */}
      <div className="space-y-4 bg-neutral-950 p-4 sm:p-6 border border-white/10 relative z-10 mb-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-gold-400" />
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
              Personalizar Parâmetros da Simulação
            </h3>
          </div>

          <button
            type="button"
            onClick={handleReset}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="flex items-center space-x-1 text-[11px] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Alíquota de ITBI por Cidade */}
          <div className="space-y-1.5">
            <label className="text-xs text-neutral-300 font-medium flex items-center justify-between">
              <span>Município do Imóvel:</span>
              <span className="font-mono text-gold-400 font-bold">{formatPercent(itbiRate, 1)}</span>
            </label>
            <select
              value={selectedCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="w-full bg-black border border-white/15 text-white text-xs sm:text-sm px-3 py-2 rounded-none focus:outline-none focus:border-gold-400 transition-colors cursor-pointer"
            >
              {COMMON_CITY_ITBI_RATES.map((c) => (
                <option key={c.name} value={c.name} className="bg-black text-white">
                  {c.name} - {c.state} ({formatPercent(c.rate, 1)})
                </option>
              ))}
            </select>
          </div>

          {/* Toggle: 1º Imóvel SFH */}
          <div
            onClick={() => {
              vibrateShort();
              playClickSound();
              setIsFirstPropertySFH(!isFirstPropertySFH);
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`p-3 border flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
              isFirstPropertySFH
                ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-black border-white/15 hover:border-gold-400/50'
            }`}
          >
            <div className="min-w-0 pr-2">
              <span className={`text-xs font-semibold uppercase tracking-wider block ${
                isFirstPropertySFH ? 'text-emerald-300' : 'text-neutral-200'
              }`}>
                É seu 1º imóvel financiado (SFH)?
              </span>
              <span className="text-[11px] text-neutral-400">
                Garante 50% de desconto legal no registro (Lei 6.015/73 Art. 290)
              </span>
            </div>

            <div
              className={`w-10 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                isFirstPropertySFH ? 'bg-emerald-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isFirstPropertySFH ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

        </div>

      </div>

      {/* Caixa de Consultoria: Financiamento das Despesas */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#a47e35]/20 via-black to-[#a47e35]/15 border border-gold-400/50 relative z-10 mb-6 flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          <p className="font-semibold text-gold-300">
            Você pode financiar até <FormattedBRL value={result.maxFinanciableDocumentation} className="text-white font-bold" /> dessas despesas!
          </p>
          <p className="text-neutral-300 text-xs">
            As principais instituições bancárias (Caixa, Itaú, Santander e Bradesco) permitem incorporar até <strong>5% do valor do imóvel</strong> para cobrir o ITBI e os emolumentos cartorários diretamente no saldo financiado. Isso evita a necessidade de desembolsar dinheiro à vista na hora da assinatura.
          </p>
        </div>
      </div>

      {/* Footer de Ações */}
      <div className="pt-4 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <button
          type="button"
          onClick={handleShareWhatsApp}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="w-full sm:w-auto btn-lift flex items-center justify-center space-x-2 text-xs uppercase font-semibold text-white bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/60 py-3 px-6 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/25"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Compartilhar Relatório no WhatsApp</span>
        </button>

        <MagneticButton
          type="button"
          onClick={() => {
            vibrateShort();
            onClose();
          }}
          onMouseEnter={() => setCursorVariant('button')}
          onMouseLeave={() => setCursorVariant('default')}
          className="w-full sm:w-auto btn-gold-fill btn-lift btn-shine btn-shine-gold flex items-center justify-center space-x-1.5 text-xs font-normal uppercase tracking-widest px-8 py-3 rounded-[75px] cursor-pointer"
        >
          <span>Voltar à Simulação</span>
        </MagneticButton>
      </div>

    </section>
  );
};
