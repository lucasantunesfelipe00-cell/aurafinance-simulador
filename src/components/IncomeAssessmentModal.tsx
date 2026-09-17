'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Users,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  MessageCircle,
  Sparkles,
  Building,
} from 'lucide-react';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MagneticButton } from '@/components/MagneticButton';
import {
  assessIncomeCommitment,
  buildWhatsAppIncomeMessage,
  IncomeAssessmentResult,
} from '@/lib/income-assessment';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound, playTypeSound } from '@/lib/sound';
import { normalizeWhatsAppPhone } from '@/lib/whatsapp';

interface IncomeAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  firstInstallment: number;
  propertyValue: number;
}

function formatCurrencyMask(val: number): string {
  if (isNaN(val) || val === 0) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export const IncomeAssessmentModal: React.FC<IncomeAssessmentModalProps> = ({
  isOpen,
  onClose,
  firstInstallment,
  propertyValue,
}) => {
  const [primaryIncome, setPrimaryIncome] = useState<number>(0);
  const [coBorrowerIncome, setCoBorrowerIncome] = useState<number>(0);
  const [coBorrowerRole, setCoBorrowerRole] = useState<string>('Cônjuge / Companheiro(a)');
  const [thirdIncome, setThirdIncome] = useState<number>(0);
  const [hasThirdBorrower, setHasThirdBorrower] = useState<boolean>(false);

  const [primaryMask, setPrimaryMask] = useState<string>('');
  const [coBorrowerMask, setCoBorrowerMask] = useState<string>('');
  const [thirdMask, setThirdMask] = useState<string>('');

  if (!isOpen) return null;

  const totalCombinedIncome = primaryIncome + coBorrowerIncome + (hasThirdBorrower ? thirdIncome : 0);
  const assessment: IncomeAssessmentResult = assessIncomeCommitment(
    firstInstallment,
    totalCombinedIncome
  );

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    const val = digits ? parseInt(digits, 10) / 100 : 0;
    setPrimaryMask(digits ? formatCurrencyMask(val) : '');
    setPrimaryIncome(val);
    playTypeSound();
  };

  const handleCoBorrowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    const val = digits ? parseInt(digits, 10) / 100 : 0;
    setCoBorrowerMask(digits ? formatCurrencyMask(val) : '');
    setCoBorrowerIncome(val);
    playTypeSound();
  };

  const handleThirdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '');
    const val = digits ? parseInt(digits, 10) / 100 : 0;
    setThirdMask(digits ? formatCurrencyMask(val) : '');
    setThirdIncome(val);
    playTypeSound();
  };

  const handleWhatsAppConsultation = () => {
    vibrateShort();
    playClickSound();
    const message = buildWhatsAppIncomeMessage(assessment, propertyValue);
    const encoded = encodeURIComponent(message);
    const phone = normalizeWhatsAppPhone();
    const url = `https://wa.me/${phone}?text=${encoded}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const isApproved = assessment.status === 'APPROVED' && totalCombinedIncome > 0;
  const isAttention = assessment.status === 'ATTENTION';
  const isNeedMore = assessment.status === 'NEED_CO_BORROWER' || totalCombinedIncome === 0;

  return (
    <section className="w-full max-w-[1236px] mx-auto editorial-card editorial-card-gold-border p-5 sm:p-8 bg-black rounded-none flex flex-col relative overflow-hidden font-sans animate-fadeIn">
      
      {/* Linha Decorativa Superior */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] -mt-5 sm:-mt-8 -mx-5 sm:-mx-8 mb-6" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10 mb-6">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-none bg-gradient-to-br from-[#c2a25b]/20 to-[#a47e35]/10 border border-[#c2a25b]/40 text-[#c2a25b] shadow-inner">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                Simulador de Composição de Renda
              </h2>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 border border-gold-500/40 text-gold-400 bg-gold-400/10 uppercase">
                Aprovação Bancária
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-light mt-0.5">
              Some rendas com cônjuge, pais ou sócios para aprovar a parcela de {formatBRL(firstInstallment)}
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
          className="p-2.5 text-[#c2a25b] hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#c2a25b]/60 transition-all cursor-pointer shrink-0"
          title="Fechar"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className="space-y-6">

        {/* Resumo do Status Combinado */}
        <div
          className={`p-5 border rounded-none relative overflow-hidden transition-all ${
            isApproved
              ? 'border-emerald-500 bg-gradient-to-r from-emerald-950/30 via-black to-emerald-950/30 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
              : isAttention
              ? 'border-amber-500 bg-gradient-to-r from-amber-950/30 via-black to-amber-950/30'
              : 'border-gold-400/50 bg-neutral-950/80'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Renda Familiar Total Combinada
              </span>
              <div className="flex items-baseline space-x-2">
                <FormattedBRL
                  value={totalCombinedIncome}
                  className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                />
                <span className="text-xs text-neutral-400 font-mono">
                  (Mínimo exigido: {formatBRL(assessment.minimumRequiredIncome)})
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                Comprometimento da Parcela
              </span>
              <span
                className={`text-xl sm:text-2xl font-mono font-bold ${
                  isApproved ? 'text-emerald-400' : isAttention ? 'text-amber-300' : 'text-gold-400'
                }`}
              >
                {totalCombinedIncome > 0 ? `${assessment.commitmentPercent}%` : '0%'}
              </span>
              <span className="text-[10px] text-neutral-500 block font-mono">
                Teto máximo: 30%
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
            <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p>{assessment.diagnosticMessage}</p>
          </div>
        </div>

        {/* Formulário de Proponentes */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400 font-bold">
            Proponentes do Financiamento (Composição de Renda)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Proponente 1 (Principal) */}
            <div className="p-4 border border-white/15 bg-black space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase font-mono">1º Proponente (Você)</span>
                <span className="text-[10px] text-gold-400 font-mono">Titular</span>
              </div>
              <div className="flex items-center bg-white/[0.03] border border-white/20 focus-within:border-gold-400 px-3 py-2">
                <span className="text-xs font-mono text-neutral-400 mr-2">R$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={primaryMask}
                  onChange={handlePrimaryChange}
                  placeholder="0,00"
                  className="w-full bg-transparent text-white text-sm sm:text-base font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Proponente 2 (Co-Borrower) */}
            <div className="p-4 border border-gold-400/40 bg-black space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gold-400 uppercase font-mono">2º Proponente</span>
                <select
                  value={coBorrowerRole}
                  onChange={(e) => setCoBorrowerRole(e.target.value)}
                  className="bg-neutral-900 border border-white/20 text-neutral-300 text-[10px] font-mono px-2 py-0.5 focus:outline-none"
                >
                  <option value="Cônjuge / Companheiro(a)">Cônjuge / Companheiro(a)</option>
                  <option value="Pai / Mãe">Pai / Mãe</option>
                  <option value="Filho(a)">Filho(a)</option>
                  <option value="Sócio(a)">Sócio(a)</option>
                  <option value="Outro Familiar">Outro Familiar</option>
                </select>
              </div>
              <div className="flex items-center bg-white/[0.03] border border-white/20 focus-within:border-gold-400 px-3 py-2">
                <span className="text-xs font-mono text-neutral-400 mr-2">R$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={coBorrowerMask}
                  onChange={handleCoBorrowerChange}
                  placeholder="0,00"
                  className="w-full bg-transparent text-white text-sm sm:text-base font-mono focus:outline-none"
                />
              </div>
            </div>

          </div>

          {/* Adicionar 3º Proponente (Opcional) */}
          {hasThirdBorrower ? (
            <div className="p-4 border border-white/20 bg-black space-y-2 relative">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase font-mono">3º Proponente (Adicional)</span>
                <button
                  type="button"
                  onClick={() => {
                    setHasThirdBorrower(false);
                    setThirdIncome(0);
                    setThirdMask('');
                  }}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-mono cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remover
                </button>
              </div>
              <div className="flex items-center bg-white/[0.03] border border-white/20 focus-within:border-gold-400 px-3 py-2">
                <span className="text-xs font-mono text-neutral-400 mr-2">R$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={thirdMask}
                  onChange={handleThirdChange}
                  placeholder="0,00"
                  className="w-full bg-transparent text-white text-sm sm:text-base font-mono focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                vibrateShort();
                setHasThirdBorrower(true);
              }}
              className="px-4 py-2 border border-dashed border-white/20 hover:border-gold-400/60 text-neutral-400 hover:text-gold-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer w-full justify-center"
            >
              <Plus className="w-4 h-4" /> Adicionar 3º Proponente
            </button>
          )}
        </div>

        {/* Guia Rápido de Regras Bancárias */}
        <div className="border border-white/10 bg-neutral-950/60 p-5 space-y-3 font-sans text-xs">
          <div className="flex items-center space-x-2 text-gold-400 font-bold uppercase tracking-wider">
            <Building className="w-4 h-4" />
            <span>Como os bancos avaliam sua renda:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-neutral-300 leading-relaxed pt-1">
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px]">CLT &amp; Servidores:</strong>
              <p className="text-[11px] text-neutral-400">Holerites dos últimos 3 meses + declaração do Imposto de Renda recente.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px]">Autônomos &amp; PJ:</strong>
              <p className="text-[11px] text-neutral-400">Extratos bancários dos últimos 6 meses (pessoa física) + IRPF com recibo de entrega.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block font-mono text-[11px]">Composição Familiar:</strong>
              <p className="text-[11px] text-neutral-400">Todos os proponentes são proprietários do imóvel proporcionalmente à renda informada.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Rodapé com CTA Concierge */}
      <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <p className="text-xs text-neutral-400 font-light text-center sm:text-left">
          💡 Aprovamos crédito nos principais bancos (Caixa, Itaú, Bradesco, Santander e BB) com as menores taxas do mercado.
        </p>

        <MagneticButton
          type="button"
          onClick={handleWhatsAppConsultation}
          className="btn-lift flex items-center justify-center space-x-2 uppercase tracking-wider text-xs font-medium text-white bg-gradient-to-r from-emerald-950/80 via-black to-emerald-950/80 border border-emerald-500/60 hover:border-emerald-400 py-3 px-6 rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] w-full sm:w-auto group shrink-0"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
          <span className="text-white group-hover:text-emerald-300 transition-colors">
            Validar Aprovação com Especialista de Crédito
          </span>
        </MagneticButton>
      </div>

    </section>
  );
};
