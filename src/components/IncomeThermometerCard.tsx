'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ChevronDown,
  Users,
  Sparkles,
  Wallet,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
  MessageCircle,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import {
  assessIncomeCommitment,
  IncomeAssessmentResult,
  buildWhatsAppIncomeMessage,
} from '@/lib/income-assessment';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound, playTypeSound } from '@/lib/sound';
import { normalizeWhatsAppPhone } from '@/lib/whatsapp';

interface IncomeThermometerCardProps {
  firstInstallment: number;
  propertyValue: number;
  onOpenDetailedAssessment?: () => void;
}

function formatCurrencyMask(val: number): string {
  if (isNaN(val) || val === 0) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export const IncomeThermometerCard: React.FC<IncomeThermometerCardProps> = ({
  firstInstallment,
  propertyValue,
  onOpenDetailedAssessment,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userIncome, setUserIncome] = useState<number>(0);
  const [maskedInput, setMaskedInput] = useState<string>('');

  const assessment: IncomeAssessmentResult = assessIncomeCommitment(
    firstInstallment,
    userIncome
  );

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valStr = e.target.value;
    const digitsOnly = valStr.replace(/\D/g, '');
    const numericVal = digitsOnly ? parseInt(digitsOnly, 10) / 100 : 0;
    setMaskedInput(digitsOnly ? formatCurrencyMask(numericVal) : '');
    setUserIncome(numericVal);
    playTypeSound();
  };

  const hasEnteredIncome = userIncome > 0;
  const commitmentClamped = Math.min(100, assessment.commitmentPercent);

  const isSafe = assessment.status === 'APPROVED' && hasEnteredIncome;
  const isAttention = assessment.status === 'ATTENTION';
  const isNeedCoBorrower = assessment.status === 'NEED_CO_BORROWER';

  const handleShareWhatsApp = () => {
    vibrateShort();
    playClickSound();
    const msg = buildWhatsAppIncomeMessage(assessment, propertyValue);
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
            <ShieldCheck
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                isExpanded ? 'text-amber-300' : 'text-gold-400 group-hover:text-amber-300'
              }`}
            />
          </div>

          <div className="min-w-0">
            <span
              className={`text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors duration-200 block truncate ${
                isExpanded ? 'text-amber-300' : 'text-gold-400 group-hover:text-amber-300'
              }`}
            >
              Termômetro de Renda Mínima Exigida
            </span>
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
              Renda Familiar Sugerida
            </span>
            <FormattedBRL
              value={assessment.minimumRequiredIncome}
              className={`text-sm sm:text-base lg:text-lg font-semibold tracking-tight transition-colors duration-200 ${
                isExpanded ? 'text-amber-300' : 'text-white group-hover:text-amber-300'
              }`}
              animate
            />
          </div>

          <button
            type="button"
            aria-label={isExpanded ? 'Recolher detalhes de renda' : 'Expandir detalhes de renda'}
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
            {/* Controles Rápidos: Teste sua Renda & Indicador do Termômetro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Campo: Digite sua Renda Bruta */}
              <div className="p-3 bg-black/70 border border-white/10 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="user-income-input" className="text-[11px] font-medium uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
                    <Wallet className="w-3.5 h-3.5 text-gold-400" />
                    <span>Sua Renda Bruta Familiar</span>
                  </label>
                  {hasEnteredIncome && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none ${
                      isSafe
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : isAttention
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}>
                      {isSafe ? 'APROVADO' : isAttention ? 'ATENÇÃO' : 'COMPOR RENDA'}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-mono text-xs">
                    R$
                  </span>
                  <input
                    id="user-income-input"
                    type="text"
                    inputMode="numeric"
                    placeholder="Ex: 15.000,00"
                    value={maskedInput}
                    onChange={handleIncomeChange}
                    className="w-full bg-neutral-900 border border-white/15 text-white text-xs sm:text-sm pl-9 pr-3 py-1.5 rounded-none focus:outline-none focus:border-gold-400 font-mono transition-colors"
                  />
                </div>
              </div>

              {/* Indicador do Termômetro / Barra de Comprometimento */}
              <div className="p-3 bg-black/70 border border-white/10 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-300 flex items-center space-x-1.5">
                    <Percent className="w-3.5 h-3.5 text-gold-400" />
                    <span>Comprometimento da Renda</span>
                  </span>
                  <span className={`text-xs font-mono font-bold ${
                    hasEnteredIncome
                      ? isSafe
                        ? 'text-emerald-400'
                        : isAttention
                        ? 'text-amber-400'
                        : 'text-red-400'
                      : 'text-neutral-400'
                  }`}>
                    {hasEnteredIncome ? formatPercent(assessment.commitmentPercent, 1) : 'Teto: 30,0%'}
                  </span>
                </div>

                {/* Barra de Progresso do Termômetro */}
                <div className="space-y-1">
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden relative">
                    {/* Linha do teto de 30% */}
                    <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-gold-400/80 z-10" title="Teto Bancário (30%)" />
                    
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${hasEnteredIncome ? commitmentClamped : 30}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full ${
                        !hasEnteredIncome
                          ? 'bg-gradient-to-r from-gold-500/40 to-gold-400/60'
                          : isSafe
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                          : isAttention
                          ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                          : 'bg-gradient-to-r from-red-600 to-red-400'
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                    <span>0%</span>
                    <span className="text-gold-400 font-bold">30% (Teto Oficial)</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Grid com os 4 Pilares de Análise de Renda */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              
              {/* 1. Primeira Parcela */}
              <div className="p-3 bg-black border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">
                  1. 1ª Parcela (Base)
                </span>
                <div className="my-1">
                  <FormattedBRL
                    value={firstInstallment}
                    className="text-xs sm:text-sm font-semibold text-white tracking-tight"
                  />
                </div>
                <span className="text-[9px] text-neutral-500 truncate">Valor inicial SAC</span>
              </div>

              {/* 2. Renda Familiar Mínima */}
              <div className="p-3 bg-black border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">
                  2. Renda Mínima Exigida
                </span>
                <div className="my-1">
                  <FormattedBRL
                    value={assessment.minimumRequiredIncome}
                    className="text-xs sm:text-sm font-semibold text-gold-400 tracking-tight"
                  />
                </div>
                <span className="text-[9px] text-neutral-500 truncate">Para 30% exatos</span>
              </div>

              {/* 3. Parcela Máxima na sua Renda */}
              <div className="p-3 bg-black border border-white/10 flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">
                  3. Parcela Permitida
                </span>
                <div className="my-1">
                  <FormattedBRL
                    value={hasEnteredIncome ? assessment.maxAllowedInstallment : Math.round(assessment.minimumRequiredIncome * 0.3)}
                    className="text-xs sm:text-sm font-semibold text-white tracking-tight"
                  />
                </div>
                <span className="text-[9px] text-neutral-500 truncate">30% da sua renda</span>
              </div>

              {/* 4. Diagnóstico / Diferença */}
              <div className={`p-3 bg-black border flex flex-col justify-between ${
                hasEnteredIncome
                  ? isSafe
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : isAttention
                    ? 'border-amber-500/40 bg-amber-950/10'
                    : 'border-red-500/40 bg-red-950/10'
                  : 'border-white/10'
              }`}>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 block truncate">
                  4. {hasEnteredIncome && assessment.incomeGap > 0 ? 'Falta Compor' : 'Status Aprovação'}
                </span>
                <div className="my-1">
                  {hasEnteredIncome && assessment.incomeGap > 0 ? (
                    <FormattedBRL
                      value={assessment.incomeGap}
                      className="text-xs sm:text-sm font-semibold text-red-400 tracking-tight"
                    />
                  ) : (
                    <span className={`text-xs sm:text-sm font-semibold tracking-tight ${
                      isSafe ? 'text-emerald-400' : 'text-neutral-300'
                    }`}>
                      {hasEnteredIncome ? '100% Aprovado' : 'Pronto p/ Análise'}
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-neutral-500 truncate">
                  {hasEnteredIncome && assessment.incomeGap > 0 ? 'Com cônjuge/sócio' : 'Regra dos bancos'}
                </span>
              </div>

            </div>

            {/* Aviso de Diagnóstico da Renda se Informada */}
            {hasEnteredIncome && (
              <div className={`p-3 border text-xs flex items-center justify-between ${
                isSafe
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : isAttention
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                  : 'bg-red-950/20 border-red-500/40 text-red-300'
              }`}>
                <div className="flex items-center space-x-2">
                  {isSafe ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span>{assessment.diagnosticMessage}</span>
                </div>
              </div>
            )}

            {/* Dica de Consultoria: Composição de Renda */}
            <div className="p-3.5 bg-gradient-to-r from-[#a47e35]/15 via-black to-[#a47e35]/10 border border-gold-400/40 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <div className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                <strong className="text-gold-300">Dica do Especialista: </strong>
                Caso sua renda individual não atinja o valor mínimo, você pode <strong>compor renda com até 3 proponentes</strong> (cônjuge, pais, filhos ou sócios). Os bancos somam os rendimentos brutos para liberar 100% do crédito.
              </div>
            </div>

            {/* Botões de Ação: Detalhes & Compartilhamento WhatsApp */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-white/10">
              {onOpenDetailedAssessment && (
                <button
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    playClickSound();
                    onOpenDetailedAssessment();
                  }}
                  onMouseEnter={() => setCursorVariant('button')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className="w-full sm:w-auto text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center justify-center space-x-1 py-1.5 px-3 transition-colors cursor-pointer"
                >
                  <span>Compor Renda com + Pessoas (Multi-Proponente)</span>
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
                <span>Enviar Diagnóstico no WhatsApp</span>
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};
