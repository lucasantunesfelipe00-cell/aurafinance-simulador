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

  const svgWidth = 800;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const maxVal = Math.max(result.loanAmount, result.totalPaid);

  const step = Math.max(1, Math.floor(installments.length / 80));
  const sampled = installments.filter((_, idx) => idx % step === 0 || idx === installments.length - 1);

  const balancePoints = sampled.map((inst, idx) => {
    const x = paddingX + (idx / (sampled.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - (inst.outstandingBalance / (maxVal || 1)) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

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
    <div className="editorial-card p-6 border border-white/20 bg-black rounded-none">
      
      {/* Header do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <LineChart className="w-4 h-4 text-white" />
          <div>
            <h3 className="text-xs font-normal uppercase tracking-widest text-white">Evolução do Saldo Devedor x Juros</h3>
            <p className="text-[11px] text-neutral-400 font-light">Trajetória temporal de amortização</p>
          </div>
        </div>

        {/* Legendas */}
        <div className="flex items-center space-x-4 text-[11px] uppercase tracking-wider">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span className="text-white font-normal">Saldo Devedor</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-neutral-500"></span>
            <span className="text-neutral-400 font-normal">Juros Acumulados</span>
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
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#666666" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#666666" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingY + chartHeight * (1 - pct);
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={paddingX + chartWidth}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="2 2"
              />
            );
          })}

          <polygon points={interestArea} fill="url(#interestGradient)" />
          <polygon points={balanceArea} fill="url(#balanceGradient)" />

          <polyline
            fill="none"
            stroke="#666666"
            strokeWidth="2"
            points={interestPoints}
          />

          <polyline
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            points={balancePoints}
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
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}
        </svg>
      </div>

      {/* Tooltip de Inspeção */}
      {activePoint && (
        <div className="mt-4 p-3 border border-white/15 bg-black rounded-none grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-neutral-400 text-[10px] uppercase block tracking-wider font-sans">Mês Selecionado</span>
            <span className="font-normal text-white text-xs">{activePoint.number}º mês ({Math.ceil(activePoint.number / 12)}º ano)</span>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase block tracking-wider font-sans">Saldo Devedor</span>
            <FormattedBRL value={activePoint.outstandingBalance} className="text-white font-normal" />
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase block tracking-wider font-sans">Juros Acumulados</span>
            <FormattedBRL value={activePoint.accumulatedInterest} className="text-neutral-300 font-normal" />
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase block tracking-wider font-sans">Total Pago até Mês</span>
            <FormattedBRL value={activePoint.accumulatedPaid} className="text-white font-normal" />
          </div>
        </div>
      )}

    </div>
  );
};
