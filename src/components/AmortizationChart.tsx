'use client';

import React, { useState } from 'react';
import { FinancingResult } from '@/types/financing';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { BarChart3 } from 'lucide-react';

interface AmortizationChartProps {
  result: FinancingResult;
}

export const AmortizationChart: React.FC<AmortizationChartProps> = ({ result }) => {
  const [hoverYear, setHoverYear] = useState<number | null>(null);

  const installments = result.installments;
  if (!installments || installments.length === 0) return null;

  const svgWidth = 800;
  const svgHeight = 300;
  const paddingX = 40;
  const paddingTop = 20;
  const paddingBottom = 34;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;
  const bottomY = paddingTop + chartHeight;

  const maxVal = Math.max(result.loanAmount, result.totalPaid);

  // Um valor por ano — pega a última parcela de cada ano (saldo/juros acumulados até ali)
  const numYears = Math.ceil(installments.length / 12);
  const yearly = Array.from({ length: numYears }, (_, i) => {
    const monthIndex = Math.min((i + 1) * 12, installments.length) - 1;
    return installments[monthIndex];
  });

  const groupWidth = chartWidth / numYears;
  const groupPadding = Math.min(groupWidth * 0.22, 10);
  const innerGap = 2;
  const barWidth = Math.max(1.5, (groupWidth - groupPadding * 2 - innerGap) / 2);

  const heightFor = (val: number) => (val / (maxVal || 1)) * chartHeight;

  // Só rotula todo ano quando couber; senão, engrossa o intervalo pra não amontoar texto
  const labelStep = numYears > 20 ? 5 : numYears > 10 ? 2 : 1;

  const activeYear = hoverYear ?? numYears;
  const activeData = yearly[activeYear - 1];

  // Chave que muda a cada novo cálculo (troca SAC/PRICE ou nova simulação) — remonta o SVG e reinicia a animação das barras
  const resultKey = `${result.method}-${result.loanAmount}-${result.totalInterest}-${result.termMonths}`;

  return (
    <MouseGlow size={210} className="editorial-card p-6 border border-white/20 bg-black rounded-none">

      {/* Header do Gráfico */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <BarChart3 className="w-4 h-4 text-white" />
          <div>
            <h3 className="text-xs font-normal uppercase tracking-widest text-gold-400">Evolução do Saldo Devedor x Juros</h3>
          </div>
        </div>

        {/* Legendas */}
        <div className="flex items-center space-x-4 text-[11px] uppercase tracking-wider">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-gold-500"></span>
            <span className="text-gold-500 font-normal">Saldo Devedor</span>
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
          key={resultKey}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[550px] overflow-visible"
          onMouseLeave={() => setHoverYear(null)}
        >
          <defs>
            <linearGradient id="balanceBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5D03A" />
              <stop offset="100%" stopColor="#996515" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingTop + chartHeight * (1 - pct);
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

          {/* Linha de base */}
          <line x1={paddingX} y1={bottomY} x2={paddingX + chartWidth} y2={bottomY} stroke="rgba(255,255,255,0.2)" />

          {yearly.map((inst, i) => {
            const yearNum = i + 1;
            const groupX = paddingX + i * groupWidth;
            const bar1X = groupX + groupPadding;
            const bar2X = bar1X + barWidth + innerGap;

            const balanceH = heightFor(inst.outstandingBalance);
            const interestH = heightFor(inst.accumulatedInterest);
            const isActive = activeYear === yearNum;
            const showLabel = yearNum === 1 || yearNum === numYears || yearNum % labelStep === 0;

            return (
              <g key={yearNum}>
                {/* Área de interação (cobre o grupo inteiro, inclusive o espaço entre as barras) */}
                <rect
                  x={groupX}
                  y={paddingTop}
                  width={groupWidth}
                  height={chartHeight}
                  fill="transparent"
                  onMouseEnter={() => setHoverYear(yearNum)}
                  onClick={() => setHoverYear(yearNum)}
                  className="cursor-pointer"
                />

                {/* Barra: Saldo Devedor */}
                <rect
                  x={bar1X}
                  y={bottomY - balanceH}
                  width={barWidth}
                  height={balanceH}
                  fill="url(#balanceBarGradient)"
                  opacity={isActive ? 1 : 0.85}
                  className="animate-barGrow pointer-events-none transition-opacity duration-200"
                  style={{ transformOrigin: `${bar1X + barWidth / 2}px ${bottomY}px`, animationDelay: `${i * 0.02}s` }}
                />

                {/* Barra: Juros Acumulados */}
                <rect
                  x={bar2X}
                  y={bottomY - interestH}
                  width={barWidth}
                  height={interestH}
                  fill="#666666"
                  opacity={isActive ? 1 : 0.85}
                  className="animate-barGrow pointer-events-none transition-opacity duration-200"
                  style={{ transformOrigin: `${bar2X + barWidth / 2}px ${bottomY}px`, animationDelay: `${i * 0.02 + 0.03}s` }}
                />

                {/* Rótulo do Ano */}
                {showLabel && (
                  <text
                    x={groupX + groupWidth / 2}
                    y={bottomY + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fill={isActive ? '#ffffff' : 'rgba(255,255,255,0.45)'}
                  >
                    {yearNum}
                  </text>
                )}

                {/* Marcador do grupo ativo */}
                {isActive && (
                  <line
                    x1={groupX + groupWidth / 2}
                    y1={bottomY + 6}
                    x2={groupX + groupWidth / 2}
                    y2={bottomY + 10}
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip de Inspeção */}
      {activeData && (
        <div className="mt-4 p-3 border border-white/15 bg-black rounded-none grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-neutral-400 text-[10px] uppercase block tracking-wider font-sans">Ano Selecionado</span>
            <span className="font-normal text-white text-xs">{activeYear}º ano</span>
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase block tracking-wider font-sans">Saldo Devedor</span>
            <FormattedBRL value={activeData.outstandingBalance} className="text-white font-normal" />
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase block tracking-wider font-sans">Juros Acumulados</span>
            <FormattedBRL value={activeData.accumulatedInterest} className="text-neutral-300 font-normal" />
          </div>
          <div>
            <span className="text-neutral-400 text-[10px] uppercase block tracking-wider font-sans">Total Pago até o Ano</span>
            <FormattedBRL value={activeData.accumulatedPaid} className="text-white font-normal" />
          </div>
        </div>
      )}

    </MouseGlow>
  );
};
