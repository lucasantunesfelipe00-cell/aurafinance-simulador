'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  calculateAcquisitionCosts,
  COMMON_CITY_ITBI_RATES,
  buildWhatsAppAcquisitionCostsMessage,
} from '@/lib/acquisition-costs';
import { formatPercent, formatBRL } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import {
  FileText,
  ChevronDown,
  Sparkles,
  HelpCircle,
  Building2,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Percent,
  MessageCircle,
  ArrowUpRight,
  Info,
  Scale,
} from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound } from '@/lib/sound';
import { normalizeWhatsAppPhone } from '@/lib/whatsapp';

interface AcquisitionCostsCardProps {
  propertyValue: number;
  onOpenDetailedModal?: () => void;
}

export const AcquisitionCostsCard: React.FC<AcquisitionCostsCardProps> = ({
  propertyValue,
  onOpenDetailedModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [itbiRate, setItbiRate] = useState(3.0);
  const [isFirstPropertySFH, setIsFirstPropertySFH] = useState(false);
  const [selectedCity, setSelectedCity] = useState('São Paulo');

  const result = useMemo(() => {
    return calculateAcquisitionCosts({
      propertyValue,
      itbiRate,
      registrationRate: 1.2,
      bankAppraisalFee: 3400,
      certificatesFee: 900,
      isFirstPropertySFH,
    });
  }, [propertyValue, itbiRate, isFirstPropertySFH]);

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const found = COMMON_CITY_ITBI_RATES.find((c) => c.name === cityName);
    if (found) {
      setItbiRate(found.rate);
      vibrateShort();
      playClickSound();
    }
  };

  const toggleFirstProperty = () => {
    vibrateShort();
    playClickSound();
    setIsFirstPropertySFH(!isFirstPropertySFH);
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
    <section
      className={`group editorial-card border bg-black rounded-none relative overflow-hidden transition-all duration-300 font-sans shadow-lg ${
        isExpanded
          ? '!border-amber-400 shadow-[0_0_22px_rgba(245,158,11,0.25)]'
          : 'border-white/20 hover:!border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] focus-within:!border-amber-400'
      }`}
    >
      {/* Glow de ambientação dourado sutil */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-[#c2a25b]/10 via-[#a47e35]/5 to-transparent pointer-events-none" />

      {/* Header do Card (Clicável para expandir/recolher) */}
      <div
        onClick={() => {
          vibrateShort();
          playClickSound();
          setIsExpanded(!isExpanded);
        }}
        onMouseEnter={() => setCursorVariant('button')}
        onMouseLeave={() => setCursorVariant('default')}
        className="w-full p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 cursor-pointer select-none hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start sm:items-center space-x-3 min-w-0">
          <div
            className={`p-2 sm:p-2.5 border shrink-0 transition-all duration-300 ${
              isExpanded
                ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-gradient-to-br from-[#c2a25b]/20 to-[#a47e35]/10 border-[#c2a25b]/40 text-gold-400 group-hover:border-amber-400 group-hover:bg-amber-400/20 group-hover:text-amber-300'
            }`}
          >
            <Landmark
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                isExpanded ? 'text-amber-300' : 'text-gold-400 group-hover:text-amber-300'
              }`}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span
                className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  isExpanded ? 'text-amber-300' : 'text-gold-400 group-hover:text-amber-300'
                }`}
              >
                Custos de Transferência &amp; Cartório
              </span>
              <span
                className={`px-2 py-0.5 border text-[9px] sm:text-[10px] font-mono rounded-[75px] transition-colors duration-200 ${
                  isExpanded
                    ? 'bg-amber-400/10 border-amber-400/50 text-amber-300'
                    : 'bg-white/5 border-white/10 text-neutral-300 group-hover:border-amber-400/40 group-hover:text-amber-300'
                }`}
              >
                ITBI + Escritura + Laudo
              </span>
            </div>
            <p
              className={`text-xs sm:text-sm font-light mt-0.5 transition-colors duration-200 ${
                isExpanded ? 'text-neutral-200' : 'text-neutral-300 group-hover:text-neutral-200'
              }`}
            >
              Estimativa de despesas necessárias para registro definitivo do imóvel
            </p>
          </div>
        </div>

        {/* Resumo do Valor Total + Botão de Expansão */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
          <div className="text-left sm:text-right">
            <span
              className={`text-[10px] sm:text-xs uppercase tracking-wider block transition-colors duration-200 ${
                isExpanded ? 'text-amber-400' : 'text-neutral-400 group-hover:text-amber-400'
              }`}
            >
              Total Estimado
            </span>
            <FormattedBRL
              value={result.totalCosts}
              className={`text-sm sm:text-base lg:text-lg font-semibold tracking-tight transition-colors duration-200 ${
                isExpanded ? 'text-amber-300' : 'text-white group-hover:text-amber-300'
              }`}
              animate
            />
          </div>

          <button
            type="button"
            aria-label={isExpanded ? 'Recolher detalhes de custos' : 'Expandir detalhes de custos'}
            className={`p-1.5 rounded-none border transition-all duration-200 ${
              isExpanded
                ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : 'bg-white/5 border-white/15 text-neutral-300 group-hover:border-amber-400/50 group-hover:text-amber-300'
            }`}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                isExpanded ? 'rotate-180 text-amber-300' : 'group-hover:text-amber-300'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Conteúdo Expansível com Detalhamento */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-white/10 bg-neutral-950/60 p-4 sm:p-6 space-y-5"
          >
            {/* Controles Rápidos: Município & Desconto da Lei 6.015/73 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Seletor de Município / Alíquota ITBI */}
              <div className="p-3 bg-black/70 border border-white/10 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="itbi-city-select" className="text-[11px] font-medium uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gold-400" />
                    <span>Município (Alíquota ITBI)</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-gold-400">
                    {formatPercent(itbiRate, 1)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    id="itbi-city-select"
                    value={selectedCity}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/15 text-white text-xs px-2.5 py-1.5 rounded-none focus:outline-none focus:border-gold-400 transition-colors cursor-pointer"
                  >
                    {COMMON_CITY_ITBI_RATES.map((c) => (
                      <option key={c.name} value={c.name} className="bg-neutral-900 text-white">
                        {c.name} - {c.state} ({formatPercent(c.rate, 1)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Toggle de 1º Imóvel Financiado (Lei 6.015/73 Art. 290) */}
              <div
                onClick={toggleFirstProperty}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className={`p-3 border flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                  isFirstPropertySFH
                    ? 'bg-emerald-950/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-black/70 border-white/10 hover:border-gold-400/40'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className={`w-3.5 h-3.5 ${isFirstPropertySFH ? 'text-emerald-400' : 'text-neutral-400'}`} />
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${isFirstPropertySFH ? 'text-emerald-300' : 'text-neutral-300'}`}>
                      1º Imóvel Financiado?
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Desconto legal de 50% nas taxas de cartório (Lei 6.015/73)
                  </p>
                </div>

                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 ${
                    isFirstPropertySFH ? 'bg-emerald-500' : 'bg-neutral-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isFirstPropertySFH ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Grid com os 4 Pilares de Custos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              
              {/* 1. ITBI */}
              <div className="p-3 bg-black border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">
                  1. ITBI ({formatPercent(result.itbiRate, 1)})
                </span>
                <div className="my-1">
                  <FormattedBRL
                    value={result.itbiAmount}
                    className="text-xs sm:text-sm font-semibold text-white tracking-tight"
                  />
                </div>
                <span className="text-[9px] text-neutral-500 truncate">Pago à Prefeitura</span>
              </div>

              {/* 2. Registro de Imóveis */}
              <div className={`p-3 bg-black border flex flex-col justify-between ${
                isFirstPropertySFH ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-white/10'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">
                    2. Registro Cartório
                  </span>
                  {isFirstPropertySFH && (
                    <span className="text-[8px] font-bold px-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      -50%
                    </span>
                  )}
                </div>
                <div className="my-1">
                  <FormattedBRL
                    value={result.registrationFinalAmount}
                    className="text-xs sm:text-sm font-semibold text-white tracking-tight"
                  />
                </div>
                <span className="text-[9px] text-neutral-500 truncate">
                  {isFirstPropertySFH ? 'Com desconto legal' : 'Emolumentos estaduais'}
                </span>
              </div>

              {/* 3. Laudo & Engenharia */}
              <div className="p-3 bg-black border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">
                  3. Laudo / Engenharia
                </span>
                <div className="my-1">
                  <FormattedBRL
                    value={result.bankAppraisalFee}
                    className="text-xs sm:text-sm font-semibold text-white tracking-tight"
                  />
                </div>
                <span className="text-[9px] text-neutral-500 truncate">Taxa fixa do banco</span>
              </div>

              {/* 4. Certidões & Despachante */}
              <div className="p-3 bg-black border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">
                  4. Certidões / Despach.
                </span>
                <div className="my-1">
                  <FormattedBRL
                    value={result.certificatesFee}
                    className="text-xs sm:text-sm font-semibold text-white tracking-tight"
                  />
                </div>
                <span className="text-[9px] text-neutral-500 truncate">Taxas complementares</span>
              </div>

            </div>

            {/* Aviso de Economia da 1ª Aquisição se Ativo */}
            {isFirstPropertySFH && result.registrationDiscountAmount > 0 && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/40 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Economia legal de <FormattedBRL value={result.registrationDiscountAmount} className="text-emerald-400 font-bold" /></strong> aplicada pelo Art. 290 da Lei 6.015/73!
                  </span>
                </div>
              </div>
            )}

            {/* Dica de Consultoria & Inclusão no Financiamento */}
            <div className="p-3.5 bg-gradient-to-r from-[#a47e35]/15 via-black to-[#a47e35]/10 border border-gold-400/40 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                <strong className="text-gold-300">Dica do Especialista: </strong>
                A maioria dos bancos (Caixa, Itaú, Bradesco, Santander) permite financiar até <strong>5% do valor do imóvel</strong> para cobrir as despesas de ITBI e cartório, diluindo esse valor nas parcelas para preservar seu caixa.
              </div>
            </div>

            {/* Botões de Ação: Detalhes & Compartilhamento WhatsApp */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-white/10">
              {onOpenDetailedModal && (
                <button
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    playClickSound();
                    onOpenDetailedModal();
                  }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className="w-full sm:w-auto text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center justify-center space-x-1 py-1.5 px-3 transition-colors cursor-pointer"
                >
                  <span>Abrir Simulador Completo de Escritura</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={handleShareWhatsApp}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className="w-full sm:w-auto btn-lift flex items-center justify-center space-x-1.5 text-xs font-semibold text-white bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/60 py-2 px-4 rounded-full transition-all cursor-pointer shadow-sm hover:shadow-emerald-500/20"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enviar Custos no WhatsApp</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
