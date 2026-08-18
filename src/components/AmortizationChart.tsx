'use client';

import React, { useState } from 'react';
import { FinancingResult } from '@/types/financing';
import { FormattedBRL } from '@/components/FormattedBRL';
import { LineChart } from 'lucide-react';

interface AmortizationChartProps {
  result: FinancingResult;
}

export const AmortizationChart: React.FC<AmortizationChartProps> = ({ result }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const installments = result.installments;
  if (!installments || installments.length === 0) return null;

  // Pontos para renderização no SVG (largura 800, altura 260)
  const svgWidth = 800;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const maxVal = Math.max(result.loanAmount, result.totalPaid);

  // Amostragem de pontos para evitar excesso de vértices em prazos longos
  const step = Math.max(1, Math.floor(installments.length / 80));
  const sampled = installments.filter((_, idx) => idx % step === 0 || idx === installments.length - 1);

  // Coordenadas para Saldo Devedor
  const balancePoints = sampled.map((inst, idx) => {
    const x = paddingX + (idx / (sampled.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (inst.outstandingBalance / (maxVal || 1)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  // Coordenadas para Juros Acumulados
  const interestPoints = sampled.map((inst, idx) => {
    const x = paddingX + (idx / (sampled.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (inst.accumulatedInterest / (maxVal || 1)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const firstX = paddingX;
  const lastX = paddingX + chartWidth;
  const bottomY = paddingY + chartHeight;
  const balanceArea = `${firstX},${bottomY} ${balancePoints} ${lastX},${bottomY}`;
  const interestArea = `${firstX},${bottomY} ${interestPoints} ${lastX},${bottomY}`;

  const activePoint = hoverIndex !== null ? sampled[hoverIndex] : sampled[sampled.length - 1];
  const activeX = hoverIndex !== null ? paddingX + (hoverIndex / (sampled.length - 1)) * chartWidth : 0;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-gold-500/20 relative overflow-hidden">
      
      {/* Header do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-gold-500/10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400">
            <LineChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Evolução do Saldo Devedor x Juros</h3>
            <p className="text-[11px] text-gray-400">Trajetória temporal de amortização ao longo dos anos</p>
          </div>
        </div>

        {/* Legendas */}
        <div className="flex items-center space-x-4 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-gold-glow-sm"></span>
            <span className="text-gray-300 font-medium">Saldo Devedor</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-700"></span>
            <span className="text-gray-400 font-medium">Juros Acumulados</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Gráfico */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[550px] overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#996515" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#996515" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Linhas de Grade */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingY + chartHeight * (1 - pct);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={paddingX + chartWidth}
                y2={y}
                stroke="rgba(212, 175, 55, 0.08)"
                strokeDasharray="4 4"
              />
            );
          })}

          <polygon points={interestArea} fill="url(#interestGradient)" />
          <polygon points={balanceArea} fill="url(#balanceGradient)" />

          <polyline
            fill="none"
            stroke="#996515"
            strokeWidth="2.5"
            points={interestPoints}
          />

          <polyline
            fill="none"
            stroke="#F5D03A"
            strokeWidth="3"
            points={balancePoints}
            filter="drop-shadow(0px 0px 6px rgba(212,175,55,0.6))"
          />

          {sampled.map((inst, idx) => {
            const x = paddingX + (idx / (sampled.length - 1)) * chartWidth;
            return (
              <rect
                key={idx}
                x={x - (chartWidth / sampled.length) / 2}
                y={paddingY}
                width={chartWidth / sampled.length}
                height={chartHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(idx)}
                className="cursor-pointer"
              />
            );
          })}

          {hoverIndex !== null && (
            <line
              x1={activeX}
              y1={paddingY}
              x2={activeX}
              y2={paddingY + chartHeight}
              stroke="#FFF7D6"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}
        </svg>
      </div>

      {/* Tooltip de Inspeção */}
      {activePoint && (
        <div className="mt-3 p-2.5 rounded-xl bg-obsidian-950/80 border border-gold-500/20 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div>
            <span className="text-gray-400 text-[10px] block font-sans">Mês Selecionado</span>
            <span className="font-bold text-white text-xs">{activePoint.number}º mês ({Math.ceil(activePoint.number / 12)}º ano)</span>
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block font-sans">Saldo Devedor</span>
            <FormattedBRL value={activePoint.outstandingBalance} className="text-amber-400 font-bold" />
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block font-sans">Juros Acumulados</span>
            <FormattedBRL value={activePoint.accumulatedInterest} className="text-gold-400 font-bold" />
          </div>
          <div>
            <span className="text-gray-400 text-[10px] block font-sans">Total Pago até Mês</span>
            <FormattedBRL value={activePoint.accumulatedPaid} className="text-white font-bold" />
          </div>
        </div>
      )}

    </div>
  );
};
