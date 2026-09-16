'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowRight,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import {
  assessIncomeCommitment,
  IncomeAssessmentResult,
} from '@/lib/income-assessment';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound, playTypeSound } from '@/lib/sound';
import { setCursorVariant } from '@/lib/cursor-store';

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

  // Cores do termômetro
  const isSafe = assessment.status === 'APPROVED' && hasEnteredIncome;
  const isAttention = assessment.status === 'ATTENTION';
  const isNeedCoBorrower = assessment.status === 'NEED_CO_BORROWER';

  return (
    <div className="w-full editorial-card border border-[#c2a25b]/40 bg-black rounded-none p-5 sm:p-6 space-y-5 relative overflow-hidden shadow-[0_0_25px_rgba(194,162,91,0.12)] font-sans">
      
      {/* Linha Decorativa Superior */}
      <div className="h-1 w-full bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] -mt-5 sm:-mt-6 -mx-5 sm:-mx-6 mb-5" />

      {/* Topo do Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-none bg-gold-400/10 border border-gold-400/30 text-gold-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Termômetro de Renda Mínima Exigida
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 border border-gold-500/40 text-gold-400 bg-gold-400/10 uppercase">
                Regra dos 30%
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Diretriz oficial dos bancos para aprovação da 1ª parcela
            </p>
          </div>
        </div>

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
            className="text-xs font-mono text-gold-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="underline underline-offset-4">Compor Renda com + Pessoas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid Principal: Renda Mínima Sugerida vs. Renda do Usuário */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        
        {/* Coluna 1: Valor da Renda Mínima Sugerida */}
        <div className="p-4 bg-white/[0.02] border border-white/10 space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
            Renda Familiar Mínima Sugerida
          </span>
          <div className="flex items-baseline space-x-2">
            <FormattedBRL
              value={assessment.minimumRequiredIncome}
              className="text-xl sm:text-2xl font-bold text-gold-400 tracking-tight"
            />
            <span className="text-xs text-neutral-400 font-mono">/ mês</span>
          </div>
          <p className="text-[11px] text-neutral-400 font-light">
            Garante que a 1ª parcela ({formatBRL(firstInstallment)}) não ultrapasse o teto de 30%.
          </p>
        </div>

        {/* Coluna 2: Teste sua Renda em Tempo Real */}
        <div className="p-4 bg-gradient-to-br from-[#1a160d] via-black to-black border border-gold-400/30 space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-mono uppercase tracking-wider text-gold-400 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-gold-400" />
              <span>Sua Renda Bruta Familiar:</span>
            </label>
            {hasEnteredIncome && (
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-none ${
                isSafe
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : isAttention
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-red-500/20 text-red-300 border border-red-500/40'
              }`}>
                {assessment.commitmentPercent}% Comprometido
              </span>
            )}
          </div>

          <div className="flex items-center bg-black border border-white/20 focus-within:border-gold-400 transition-colors px-3 py-2">
            <span className="text-xs font-mono text-neutral-400 mr-2">R$</span>
            <input
              type="text"
              inputMode="numeric"
              value={maskedInput}
              onChange={handleIncomeChange}
              placeholder="Digite sua renda (ex: 15.000,00)..."
              onMouseEnter={() => setCursorVariant('input')}
              onMouseLeave={() => setCursorVariant('default')}
              className="w-full bg-transparent text-white text-sm sm:text-base font-mono focus:outline-none placeholder:text-neutral-600"
            />
            {hasEnteredIncome && (
              <button
                type="button"
                onClick={() => {
                  setUserIncome(0);
                  setMaskedInput('');
                }}
                className="text-xs text-neutral-500 hover:text-white font-mono ml-2 cursor-pointer"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Barra Visual do Termômetro */}
      {hasEnteredIncome && (
        <div className="space-y-1.5 pt-1 animate-fadeIn">
          <div className="flex justify-between text-[11px] font-mono text-neutral-400">
            <span>Comprometimento da Renda:</span>
            <span className={isSafe ? 'text-emerald-400 font-bold' : isAttention ? 'text-amber-300 font-bold' : 'text-red-400 font-bold'}>
              {assessment.commitmentPercent}% (Máx. Recomendado: 30%)
            </span>
          </div>

          <div className="w-full h-2.5 bg-neutral-900 border border-white/10 rounded-none overflow-hidden relative">
            {/* Marcador dos 30% */}
            <div className="absolute top-0 bottom-0 left-[30%] w-0.5 bg-white/60 z-10" title="Limite prudencial de 30%" />
            
            {/* Barra de Progresso */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${commitmentClamped}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className={`h-full transition-all ${
                isSafe
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                  : isAttention
                  ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                  : 'bg-gradient-to-r from-red-600 to-red-400'
              }`}
            />
          </div>
        </div>
      )}

      {/* Banner de Diagnóstico & Dica Inteligente de Composição */}
      <div
        className={`p-3.5 sm:p-4 border text-xs leading-relaxed flex items-start space-x-3 transition-all ${
          !hasEnteredIncome
            ? 'bg-neutral-950 border-white/15 text-neutral-300'
            : isSafe
            ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
            : isAttention
            ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
            : 'bg-gradient-to-r from-neutral-950 via-amber-950/20 to-neutral-950 border-gold-500/50 text-neutral-200'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {!hasEnteredIncome ? (
            <Info className="w-4 h-4 text-gold-400" />
          ) : isSafe ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Users className="w-4 h-4 text-gold-400" />
          )}
        </div>

        <div className="flex-1 space-y-1">
          <p className="font-light">
            {assessment.diagnosticMessage}
          </p>

          {!hasEnteredIncome && (
            <p className="text-[11px] text-gold-400 font-medium pt-0.5">
              💡 <strong>Dica de Crédito:</strong> Você pode compor renda com cônjuge, pais, filhos ou sócios para atingir este valor.
            </p>
          )}

          {isNeedCoBorrower && (
            <div className="pt-1.5">
              <button
                type="button"
                onClick={() => {
                  vibrateShort();
                  playClickSound();
                  if (onOpenDetailedAssessment) onOpenDetailedAssessment();
                }}
                className="px-3 py-1.5 bg-gold-gradient-btn text-black font-bold uppercase text-[10px] tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-black" />
                <span>Simular Composição com +{formatBRL(assessment.incomeGap)}</span>
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
