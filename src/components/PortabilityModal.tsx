'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AmortizationMethod } from '@/types/financing';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MagneticButton } from '@/components/MagneticButton';
import {
  X,
  ArrowRightLeft,
  Sparkles,
  TrendingDown,
  Building,
  Percent,
  MessageCircle,
  FileDown,
  Clock,
  ShieldCheck,
  Zap,
  RotateCcw,
} from 'lucide-react';
import {
  calculatePortability,
  PortabilityInputs,
} from '@/lib/portability-calculator';
import { calculateFinancing } from '@/lib/financing-calculator';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound, playTypeSound } from '@/lib/sound';
import { openWhatsAppPortabilityChat } from '@/lib/whatsapp';
import { downloadExecutiveDossierPdf } from '@/lib/dossier-pdf';

interface PortabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBalance?: number;
  defaultMethod?: AmortizationMethod;
}

const BANK_RATE_PRESETS = [
  { name: 'Caixa', rate: 9.4 },
  { name: 'Itaú', rate: 9.9 },
  { name: 'Bradesco', rate: 10.1 },
  { name: 'Santander', rate: 10.2 },
  { name: 'Banco do Brasil', rate: 9.8 },
];

export const PortabilityModal: React.FC<PortabilityModalProps> = ({
  isOpen,
  onClose,
  defaultBalance = 450000,
  defaultMethod = 'SAC',
}) => {
  const [balance, setBalance] = useState<number>(defaultBalance > 0 ? defaultBalance : 450000);
  const [currentRate, setCurrentRate] = useState<number>(12.5);
  const [newRate, setNewRate] = useState<number>(9.8);
  const [remainingMonths, setRemainingMonths] = useState<number>(300);
  const [method, setMethod] = useState<AmortizationMethod>(defaultMethod);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Masked string inputs for manual typing
  const [balanceInput, setBalanceInput] = useState<string>(
    (defaultBalance > 0 ? defaultBalance : 450000).toLocaleString('pt-BR')
  );

  const portabilityInputs: PortabilityInputs = useMemo(
    () => ({
      currentBalance: balance,
      currentRateYearly: currentRate,
      newRateYearly: newRate,
      remainingMonths,
      amortizationMethod: method,
    }),
    [balance, currentRate, newRate, remainingMonths, method]
  );

  const result = useMemo(() => {
    return calculatePortability(portabilityInputs);
  }, [portabilityInputs]);

  if (!isOpen) return null;

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = raw ? parseInt(raw, 10) : 0;
    setBalance(num);
    setBalanceInput(num ? num.toLocaleString('pt-BR') : '');
    playTypeSound();
  };

  const handleWhatsAppShare = () => {
    vibrateShort();
    playClickSound();
    openWhatsAppPortabilityChat(
      balance,
      currentRate,
      newRate,
      remainingMonths,
      result.totalInterestSavings,
      result.monthlySavingsFirst
    );
  };

  const handleDownloadPdf = async () => {
    vibrateShort();
    playClickSound();
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const pdfInputs = {
        category: 'property' as const,
        propertyValue: balance * 1.25,
        downPayment: balance * 0.25,
        downPaymentPercent: 20,
        interestRateYearly: newRate,
        termMonths: remainingMonths,
        amortizationMethod: method,
        includeInsurances: true,
        monthlyAdminFee: 25,
        mipRateYearly: 0.021,
        dfiRateYearly: 0.008,
      };
      const financingRes = calculateFinancing(pdfInputs);

      await downloadExecutiveDossierPdf({
        inputs: pdfInputs,
        result: financingRes,
        scenarioName: `Portabilidade_${currentRate}%_para_${newRate}%`,
        bankName: 'Portabilidade Aura Finance',
      });
    } catch (err) {
      console.error('Erro ao gerar Dossiê de Portabilidade:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const remainingYears = Math.floor(remainingMonths / 12);
  const remainingExtraMonths = remainingMonths % 12;

  return (
    <section className="w-full max-w-[1060px] mx-auto editorial-card editorial-card-gold-border p-5 sm:p-8 md:p-10 bg-black rounded-none flex flex-col relative overflow-hidden font-sans animate-fadeIn">
      {/* Luz ambiente dourada de fundo */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-gradient-to-bl from-[#c2a25b]/15 via-[#a47e35]/5 to-transparent pointer-events-none" />

      {/* Topo / Header */}
      <div className="flex items-start justify-between pb-5 border-b border-white/10 relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a47e35] via-[#c2a25b] to-[#a47e35] p-0.5 shadow-gold-glow-sm flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-gold-400">
                Portabilidade de Financiamento
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase tracking-wider">
                Economia Imediata
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              Comparador de Portabilidade de Crédito
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            vibrateShort();
            playClickSound();
            onClose();
          }}
          className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Fechar comparador de portabilidade"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <p className="text-xs sm:text-sm text-neutral-300 mt-4 leading-relaxed font-light">
        Já possui um financiamento ativo? Descubra em segundos quanto você economiza transferindo sua dívida para uma taxa de juros mais competitiva entre os principais bancos do país.
      </p>

      {/* GRADE PRINCIPAL: CONTROLES À ESQUERDA | RESULTADOS À DIREITA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-6">
        
        {/* COLUNA 1 (5 COLS): PARÂMETROS DO FINANCIAMENTO ATUAL & PROPOSTA */}
        <div className="lg:col-span-5 space-y-5 p-5 sm:p-6 bg-neutral-950/80 border border-white/15 rounded-none">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-gold-400" /> Seu Contrato Atual
            </span>
            <button
              onClick={() => {
                vibrateShort();
                playClickSound();
                setBalance(450000);
                setBalanceInput((450000).toLocaleString('pt-BR'));
                setCurrentRate(12.5);
                setNewRate(9.8);
                setRemainingMonths(300);
                setMethod('SAC');
              }}
              className="text-[10px] font-mono text-neutral-400 hover:text-gold-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Restaurar
            </button>
          </div>

          {/* 1. Saldo Devedor Atual */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="portability-balance" className="text-neutral-300 font-medium">Saldo Devedor Atual</label>
              <span className="font-mono text-gold-400 font-bold">
                <FormattedBRL value={balance} />
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-mono">
                R$
              </span>
              <input
                id="portability-balance"
                type="text"
                value={balanceInput}
                onChange={handleBalanceChange}
                placeholder="450.000"
                className="w-full bg-black border border-white/20 rounded-none pl-9 pr-3 py-2 text-sm text-white font-mono focus:border-gold-400 focus:outline-none transition-colors"
              />
            </div>
            <input
              type="range"
              min={50000}
              max={3000000}
              step={10000}
              value={balance}
              onChange={(e) => {
                const val = Number(e.target.value);
                setBalance(val);
                setBalanceInput(val.toLocaleString('pt-BR'));
              }}
              className="w-full accent-[#c2a25b] cursor-pointer"
            />
          </div>

          {/* 2. Taxa Atual do seu Banco */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <label htmlFor="portability-cur-rate" className="text-neutral-300 font-medium">Taxa do seu Banco Atual</label>
              <span className="font-mono text-red-400 font-bold">{currentRate.toFixed(2)}% a.a.</span>
            </div>
            <input
              type="range"
              min={8.0}
              max={18.0}
              step={0.1}
              value={currentRate}
              onChange={(e) => setCurrentRate(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
            <div className="flex gap-1.5 pt-1 overflow-x-auto">
              {[11.5, 12.5, 13.5, 14.5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    playClickSound();
                    setCurrentRate(r);
                  }}
                  className={`px-2 py-1 text-[10px] font-mono border transition-colors cursor-pointer ${
                    currentRate === r
                      ? 'bg-red-500/20 border-red-500 text-red-300'
                      : 'bg-black border-white/10 text-neutral-400 hover:border-white/30'
                  }`}
                >
                  {r.toFixed(1)}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Nova Taxa Alvo na Portabilidade */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex justify-between text-xs">
              <label htmlFor="portability-new-rate" className="text-gold-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Nova Taxa Proposta
              </label>
              <span className="font-mono text-emerald-400 font-bold text-sm">{newRate.toFixed(2)}% a.a.</span>
            </div>
            <input
              type="range"
              min={7.5}
              max={14.0}
              step={0.1}
              value={newRate}
              onChange={(e) => setNewRate(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            {/* Presets de Bancos Parceiros */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 pt-1">
              {BANK_RATE_PRESETS.map((bp) => (
                <button
                  key={bp.name}
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    playClickSound();
                    setNewRate(bp.rate);
                  }}
                  className={`px-1.5 py-1 text-[10px] font-mono border flex flex-col items-center text-center transition-colors cursor-pointer ${
                    newRate === bp.rate
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-black border-white/10 text-neutral-400 hover:border-gold-400/50 hover:text-white'
                  }`}
                >
                  <span className="text-[9px] font-medium truncate w-full">{bp.name}</span>
                  <span className="font-bold text-white text-[10px]">{bp.rate}%</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Prazo Restante & Sistema */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Prazo Restante</span>
              </div>
              <span className="font-mono text-white text-xs block">
                {remainingMonths} meses ({remainingYears}a {remainingExtraMonths > 0 ? `${remainingExtraMonths}m` : ''})
              </span>
              <input
                type="range"
                min={12}
                max={420}
                step={12}
                value={remainingMonths}
                onChange={(e) => setRemainingMonths(Number(e.target.value))}
                className="w-full accent-[#c2a25b] cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <span className="text-neutral-300 text-xs block">Sistema</span>
              <div className="grid grid-cols-2 gap-1 bg-black border border-white/20 p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    playClickSound();
                    setMethod('SAC');
                  }}
                  className={`py-1 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    method === 'SAC' ? 'bg-gold-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  SAC
                </button>
                <button
                  type="button"
                  onClick={() => {
                    vibrateShort();
                    playClickSound();
                    setMethod('PRICE');
                  }}
                  className={`py-1 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                    method === 'PRICE' ? 'bg-gold-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  PRICE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA 2 (7 COLS): RESULTADOS DA ECONOMIA & COMPARATIVO */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* BANNER DE DESTAQUE: ECONOMIA TOTAL ESTIMADA */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-[#1c180e] via-black to-black border-2 border-gold-400 shadow-[0_0_30px_rgba(194,162,91,0.25)] rounded-none space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-gold-400" /> Diagnóstico de Economia
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400 text-emerald-400 font-mono text-xs font-bold">
                -{result.percentageInterestSavings.toFixed(1)}% em juros
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 block mb-1">
                  Economia na 1ª Parcela
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight font-mono">
                  <FormattedBRL value={result.monthlySavingsFirst} />
                  <span className="text-xs text-neutral-400 font-normal ml-1">/mês a menos</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-gold-400 block mb-1 font-semibold">
                  Economia Total em Juros
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-gold-300 tracking-tight font-mono">
                  <FormattedBRL value={result.totalInterestSavings} />
                </div>
              </div>
            </div>

            {/* Alternativa de Aceleração com o Valor Economizado */}
            {result.monthsAcceleratedIfReinvestingSavings > 0 && (
              <div className="pt-3 border-t border-white/10 flex items-start gap-2.5 text-xs text-neutral-300">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-gold-300">Estratégia de Quitação Acelerada:</strong> Se você mantiver o valor da sua parcela atual como aporte na nova taxa, você quita seu contrato{' '}
                  <strong className="text-emerald-400 font-bold">
                    {Math.round(result.monthsAcceleratedIfReinvestingSavings / 12)} anos mais cedo
                  </strong>{' '}
                  ({result.monthsAcceleratedIfReinvestingSavings} meses a menos).
                </p>
              </div>
            )}
          </div>

          {/* TABELA COMPARATIVA LADO A LADO */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Card Contrato Atual */}
            <div className="p-4 bg-neutral-950 border border-red-500/30 rounded-none space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">Contrato Atual</span>
                <span className="text-[10px] font-mono text-neutral-400">{currentRate}% a.a.</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">1ª Parcela</span>
                  <span className="font-mono text-white font-semibold">
                    <FormattedBRL value={result.currentContract.firstInstallment} />
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">Total de Juros</span>
                  <span className="font-mono text-neutral-300">
                    <FormattedBRL value={result.currentContract.totalInterest} />
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">Total Geral Pago</span>
                  <span className="font-mono text-neutral-300 font-bold">
                    <FormattedBRL value={result.currentContract.totalPaid} />
                  </span>
                </div>
              </div>
            </div>

            {/* Card Nova Portabilidade Aura */}
            <div className="p-4 bg-gradient-to-br from-[#1c180e]/40 to-black border border-gold-400/60 shadow-gold-glow-sm rounded-none space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gold-400/30">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Portabilidade Aura</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">{newRate}% a.a.</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Nova 1ª Parcela</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm">
                    <FormattedBRL value={result.newContract.firstInstallment} />
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Novos Juros</span>
                  <span className="font-mono text-gold-300 font-semibold">
                    <FormattedBRL value={result.newContract.totalInterest} />
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase">Novo Total Pago</span>
                  <span className="font-mono text-white font-bold">
                    <FormattedBRL value={result.newContract.totalPaid} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO: WHATSAPP CONCIERGE & DOSSIÊ PDF */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <MagneticButton
              type="button"
              onClick={handleWhatsAppShare}
              className="btn-lift flex-1 flex items-center justify-center space-x-2 uppercase tracking-wider text-xs font-bold text-white bg-gradient-to-r from-emerald-950 via-black to-emerald-950 border border-emerald-500/70 hover:border-emerald-400 py-3 px-5 rounded-full transition-all cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Solicitar Portabilidade via WhatsApp</span>
            </MagneticButton>

            <MagneticButton
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="btn-lift flex items-center justify-center space-x-2 uppercase tracking-wider text-xs font-semibold text-black bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] hover:brightness-110 py-3 px-5 rounded-full transition-all cursor-pointer shadow-gold-glow-sm"
            >
              <FileDown className="w-4 h-4 text-black shrink-0" />
              <span>{isGeneratingPdf ? 'Gerando Dossiê...' : 'Baixar Dossiê (PDF)'}</span>
            </MagneticButton>
          </div>

          {/* Nota Legal Bacen Portabilidade */}
          <p className="text-[10px] text-neutral-500 text-center font-light leading-normal">
            * A portabilidade de crédito imobiliário é regulamentada pela Resolução Bacen nº 4.292/2013 e garante o direito de transferir sua operação sem cobrança de custos pelo banco credor original.
          </p>
        </div>
      </div>
    </section>
  );
};
