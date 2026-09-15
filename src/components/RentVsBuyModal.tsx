'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FinancingInputs } from '@/types/financing';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MagneticButton } from '@/components/MagneticButton';
import {
  X,
  Scale,
  Sparkles,
  TrendingUp,
  Building,
  Coins,
  MessageCircle,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import {
  calculateRentVsBuy,
  DEFAULT_RENT_VS_BUY_PARAMS,
  RentVsBuyParams,
  buildWhatsAppRentVsBuyMessage,
} from '@/lib/rent-vs-buy-calculator';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound, playTypeSound } from '@/lib/sound';
import { normalizeWhatsAppPhone } from '@/lib/whatsapp';

interface RentVsBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInputs: FinancingInputs;
}

export const RentVsBuyModal: React.FC<RentVsBuyModalProps> = ({
  isOpen,
  onClose,
  currentInputs,
}) => {
  const [params, setParams] = useState<RentVsBuyParams>(DEFAULT_RENT_VS_BUY_PARAMS);
  const [isSlidersExpanded, setIsSlidersExpanded] = useState(false);
  const [activeViewTab, setActiveViewTab] = useState<'patrimony' | 'behavior'>('patrimony');

  const result = useMemo(() => {
    return calculateRentVsBuy(currentInputs, params);
  }, [currentInputs, params]);

  if (!isOpen) return null;

  const handleResetParams = () => {
    vibrateShort();
    playClickSound();
    setParams(DEFAULT_RENT_VS_BUY_PARAMS);
  };

  const handleWhatsAppShare = () => {
    vibrateShort();
    playClickSound();
    const message = buildWhatsAppRentVsBuyMessage(result);
    const encoded = encodeURIComponent(message);
    const phone = normalizeWhatsAppPhone();
    const url = `https://wa.me/${phone}?text=${encoded}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const initialRentValue = currentInputs.propertyValue * (params.initialRentYieldMonthly / 100);
  const { milestones, finalWinner, finalDifference, finalBuyerNetWorth, finalRenterNetWorth, breakEvenMonth, timeline } = result;

  // Pontos de amostragem para o Gráfico SVG de Trajetória Patrimonial (1 ponto por ano)
  const chartPoints = timeline.filter((_, idx) => (idx + 1) % 12 === 0 || idx === timeline.length - 1);
  const maxNetWorth = Math.max(
    ...chartPoints.map((p) => Math.max(p.buyerNetWorth, p.renterNetWorth)),
    100000
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-4xl editorial-card border border-[#c2a25b]/50 bg-black rounded-none flex flex-col relative overflow-hidden font-sans my-auto shadow-[0_0_50px_rgba(194,162,91,0.2)]">
        
        {/* Linha Decorativa Dourada Superior */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35]" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-7 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-br from-[#c2a25b]/20 to-[#a47e35]/10 border border-[#c2a25b]/40 text-[#c2a25b] shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-bold text-white uppercase tracking-wider">
                  Comprar vs. Alugar &amp; Investir
                </h2>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 border border-gold-500/40 text-gold-400 bg-gold-400/10 uppercase">
                  Estudo Patrimonial
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-light mt-0.5">
                O grande dilema imobiliário: Imóvel quitado vs. Carteira de investimentos CDI no tempo
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
            title="Fechar Estudo"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Rolável */}
        <div className="p-5 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">

          {/* Veredito Executivo em Destaque */}
          <div
            className={`p-5 sm:p-6 border rounded-none relative overflow-hidden transition-all ${
              finalWinner === 'BUY'
                ? 'border-gold-400 bg-gradient-to-r from-amber-950/30 via-black to-amber-950/30 shadow-[0_0_25px_rgba(194,162,91,0.2)]'
                : finalWinner === 'RENT'
                ? 'border-emerald-500 bg-gradient-to-r from-emerald-950/30 via-black to-emerald-950/30 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                : 'border-white/20 bg-neutral-900/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2.5 rounded-none border ${
                    finalWinner === 'BUY'
                      ? 'bg-gold-400/20 text-gold-400 border-gold-400/40'
                      : finalWinner === 'RENT'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-white/10 text-white border-white/20'
                  }`}
                >
                  {finalWinner === 'BUY' ? <Building className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    Veredito Patrimonial ao Final do Contrato
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {finalWinner === 'BUY'
                      ? '🏛️ COMPRAR O IMÓVEL ACUMULOU MAIS PATRIMÔNIO'
                      : finalWinner === 'RENT'
                      ? '📈 ALUGAR E INVESTIR A DIFERENÇA VENCEU'
                      : '⚖️ AMBAS AS ESTRATÉGIAS EMPATARAM'}
                  </h3>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                  Vantagem Financeira Líquida
                </span>
                <span
                  className={`text-base sm:text-xl font-mono font-bold ${
                    finalWinner === 'BUY' ? 'text-gold-400' : 'text-emerald-400'
                  }`}
                >
                  +{formatBRL(finalDifference)}
                </span>
              </div>
            </div>

            {/* Diagnóstico em Texto */}
            <div className="flex items-start space-x-3 text-xs sm:text-sm text-neutral-200 font-light leading-relaxed">
              <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <p>{result.executiveInsight}</p>
            </div>
          </div>

          {/* Painel de Controle de Premissas Econômicas (Ajustáveis pelo Usuário) */}
          <div className="border border-white/15 bg-black/60 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-gold-400 font-bold">
                  Premissas Econômicas &amp; Mercado (Ajuste Interativo)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleResetParams}
                  className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  title="Restaurar valores padrão de mercado"
                >
                  <RotateCcw className="w-3 h-3" /> Restaurar Padrões
                </button>
              </div>
            </div>

            {/* Sliders em Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 font-sans">
              
              {/* 1. Taxa CDI / Investimento */}
              <div className="space-y-2 bg-white/[0.02] p-3 border border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Rentabilidade CDI / Tesouro:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {formatPercent(params.investmentReturnYearly, 1)} a.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="6.0"
                  max="16.0"
                  step="0.25"
                  value={params.investmentReturnYearly}
                  onChange={(e) => {
                    setParams({ ...params, investmentReturnYearly: parseFloat(e.target.value) });
                    vibrateShort();
                  }}
                  className="w-full cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>6.0%</span>
                  <span>Líquido: {formatPercent(params.investmentReturnYearly * (1 - params.investmentTaxRate / 100), 2)}</span>
                  <span>16.0%</span>
                </div>
              </div>

              {/* 2. Valorização Anual do Imóvel */}
              <div className="space-y-2 bg-white/[0.02] p-3 border border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Valorização do Imóvel:</span>
                  <span className="text-gold-400 font-mono font-bold">
                    {formatPercent(params.propertyAppreciationYearly, 1)} a.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="12.0"
                  step="0.25"
                  value={params.propertyAppreciationYearly}
                  onChange={(e) => {
                    setParams({ ...params, propertyAppreciationYearly: parseFloat(e.target.value) });
                    vibrateShort();
                  }}
                  className="w-full cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>2.0% a.a.</span>
                  <span>Apreciação real</span>
                  <span>12.0% a.a.</span>
                </div>
              </div>

              {/* 3. Aluguel Inicial */}
              <div className="space-y-2 bg-white/[0.02] p-3 border border-white/10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Aluguel Inicial (% a.m.):</span>
                  <span className="text-white font-mono font-bold">
                    {formatPercent(params.initialRentYieldMonthly, 2)} a.m.
                  </span>
                </div>
                <input
                  type="range"
                  min="0.20"
                  max="0.80"
                  step="0.02"
                  value={params.initialRentYieldMonthly}
                  onChange={(e) => {
                    setParams({ ...params, initialRentYieldMonthly: parseFloat(e.target.value) });
                    vibrateShort();
                  }}
                  className="w-full cursor-pointer accent-gold-400"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>0.20%</span>
                  <span className="text-gold-400 font-medium">{formatBRL(initialRentValue)}/mês</span>
                  <span>0.80%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Seletor de Abas de Conteúdo (Patrimônio vs Comportamento) */}
          <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
            <button
              type="button"
              onClick={() => setActiveViewTab('patrimony')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeViewTab === 'patrimony'
                  ? 'bg-gold-gradient-btn text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-white/5 border border-white/10'
              }`}
            >
              📊 Comparativo de Patrimônio &amp; Marcos
            </button>
            <button
              type="button"
              onClick={() => setActiveViewTab('behavior')}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                activeViewTab === 'behavior'
                  ? 'bg-gold-gradient-btn text-black font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white bg-white/5 border border-white/10'
              }`}
            >
              🧠 Fatores Emocionais &amp; Intangíveis
            </button>
          </div>

          {activeViewTab === 'patrimony' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Marcos Temporais (Milestones em 5, 10, 15 anos e Final) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {milestones.map((m) => (
                  <div
                    key={m.years}
                    className={`p-4 border bg-black/80 space-y-3 ${
                      m.winner === 'BUY'
                        ? 'border-gold-500/50 hover:border-gold-400'
                        : 'border-emerald-500/50 hover:border-emerald-400'
                    }`}
                  >
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <span className="text-xs font-mono uppercase font-bold text-white">
                        Em {m.years} Anos
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 uppercase font-bold ${
                          m.winner === 'BUY'
                            ? 'bg-gold-400/20 text-gold-400 border border-gold-400/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {m.winner === 'BUY' ? 'Compra +' : 'Aluguel +'}
                        {formatBRL(m.difference)}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs font-sans">
                      <div>
                        <span className="text-[10px] text-neutral-500 block uppercase font-mono">
                          Imóvel Quitado:
                        </span>
                        <span className="font-mono font-medium text-white">
                          {formatBRL(m.buyerNetWorth)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block uppercase font-mono">
                          Carteira CDI:
                        </span>
                        <span className="font-mono font-medium text-emerald-400">
                          {formatBRL(m.renterNetWorth)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Gráfico Simplificado de Evolução das Duas Curvas */}
              <div className="p-5 border border-white/15 bg-black space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Curva de Evolução Patrimonial (Horizonte Completo)
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Veja o crescimento do patrimônio em tijolo valorizado vs. carteira de investimentos composta
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-mono">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 bg-gold-400 rounded-none inline-block" />
                      <span className="text-gold-400 font-medium">Imóvel Quitado</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 bg-emerald-400 rounded-none inline-block" />
                      <span className="text-emerald-400 font-medium">Carteira CDI</span>
                    </div>
                  </div>
                </div>

                {/* Área de Visualização das Barras / Trajetória */}
                <div className="space-y-2 pt-2">
                  {chartPoints.filter((_, i) => i % 2 === 0 || i === chartPoints.length - 1).map((point) => {
                    const buyerPct = Math.min(100, (point.buyerNetWorth / maxNetWorth) * 100);
                    const renterPct = Math.min(100, (point.renterNetWorth / maxNetWorth) * 100);

                    return (
                      <div key={point.month} className="space-y-1 font-mono text-[11px]">
                        <div className="flex justify-between text-neutral-400 text-[10px]">
                          <span>Ano {point.year} (mês {point.month})</span>
                          <span className="text-white">
                            Compra {formatBRL(point.buyerNetWorth)} • Aluguel {formatBRL(point.renterNetWorth)}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {/* Barra Comprador (Gold) */}
                          <div className="w-full bg-white/5 h-2 rounded-none overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#a47e35] to-[#c2a25b] h-full transition-all duration-300"
                              style={{ width: `${buyerPct}%` }}
                            />
                          </div>
                          {/* Barra Inquilino (Emerald) */}
                          <div className="w-full bg-white/5 h-2 rounded-none overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-300"
                              style={{ width: `${renterPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {activeViewTab === 'behavior' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-fadeIn font-sans">
              
              {/* Lado A: Comprar */}
              <div className="p-5 border border-gold-400/40 bg-black/70 space-y-4">
                <div className="flex items-center space-x-2 text-gold-400 border-b border-white/10 pb-3">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="font-bold text-sm uppercase tracking-wider text-white">
                    Vantagens &amp; Fatores da Compra
                  </h4>
                </div>

                <ul className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span><strong>Segurança &amp; Sem Risco de Despejo:</strong> Ninguém pode pedir o imóvel de volta para uso próprio ou encerrar o contrato inesperadamente.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span><strong>Liberdade Total de Reforma:</strong> Personalize acabamentos, derrube paredes e deixe o imóvel com o seu padrão de vida.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span><strong>Poupança Forçada:</strong> Cada parcela paga amortiza o saldo devedor e constrói patrimônio palpável e blindado.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Atenção:</strong> Imobilização de capital (baixa liquidez imediata) e custos de ITBI/registro na entrada.</span>
                  </li>
                </ul>
              </div>

              {/* Lado B: Alugar */}
              <div className="p-5 border border-emerald-500/40 bg-black/70 space-y-4">
                <div className="flex items-center space-x-2 text-emerald-400 border-b border-white/10 pb-3">
                  <Compass className="w-5 h-5" />
                  <h4 className="font-bold text-sm uppercase tracking-wider text-white">
                    Vantagens &amp; Fatores do Aluguel
                  </h4>
                </div>

                <ul className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Liquidez &amp; Flexibilidade Geográfica:</strong> Seu capital fica 100% líquido em D+0 no CDI/Tesouro para oportunidades ou mudanças de cidade.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Zero Custos Estruturais:</strong> Manutenções pesadas e reformas de condomínio extraordinárias são de responsabilidade do proprietário.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>A Armadilha Comportamental:</strong> A matemática do aluguel só funciona se você tiver disciplina férrea de aportar a diferença todo mês sem gastar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Reajuste Contratual:</strong> O aluguel sobe perpetuamente pela inflação, enquanto a parcela SAC do financiamento decresce até zerar.</span>
                  </li>
                </ul>
              </div>

            </div>
          )}

        </div>

        {/* Rodapé com CTA Concierge */}
        <div className="p-5 sm:p-6 border-t border-white/10 bg-black/90 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <p className="text-xs text-neutral-400 font-light text-center sm:text-left">
            💡 Os cálculos consideram tributação regressiva de IR (15%), reajustes de inflação e custos de aquisição.
          </p>

          <MagneticButton
            type="button"
            onClick={handleWhatsAppShare}
            className="btn-lift flex items-center justify-center space-x-2 uppercase tracking-wider text-xs font-medium text-white bg-gradient-to-r from-emerald-950/80 via-black to-emerald-950/80 border border-emerald-500/60 hover:border-emerald-400 py-3 px-6 rounded-full transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.45)] w-full sm:w-auto group shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="text-white group-hover:text-emerald-300 transition-colors">
              Falar com Especialista sobre Comprar vs. Alugar
            </span>
          </MagneticButton>
        </div>

      </div>
    </div>
  );
};
