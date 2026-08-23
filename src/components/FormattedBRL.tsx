'use client';

import React, { useEffect, useRef, useState } from 'react';

interface FormattedBRLProps {
  value: number;
  className?: string;
  currencyClassName?: string;
  centsClassName?: string;
  /** Anima do valor anterior até o novo em vez de trocar instantaneamente. Use só onde o número representa um "resultado pronto" (KPIs, comparativo) — não em leituras ligadas a arraste de slider/tooltip. */
  animate?: boolean;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** Interpola de um valor numérico até outro via requestAnimationFrame. */
function useAnimatedNumber(target: number, enabled: boolean, duration = 600): number {
  const [displayed, setDisplayed] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!enabled) {
      setDisplayed(target);
      fromRef.current = target;
      return;
    }

    const from = fromRef.current;
    if (from === target) return;

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(progress);
      setDisplayed(from + (target - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, enabled, duration]);

  return displayed;
}

/**
 * Componente de formatação monetária R$ que renderiza a parte inteira
 * em tamanho normal/destaque e os centavos em tamanho menor (ex: R$ 500.000,00)
 */
export const FormattedBRL: React.FC<FormattedBRLProps> = ({
  value,
  className = '',
  currencyClassName = 'text-[0.75em] mr-0.5 opacity-80 font-normal',
  centsClassName = 'text-[0.65em] opacity-80 font-medium align-top leading-none ml-0.5',
  animate = false,
}) => {
  const animatedValue = useAnimatedNumber(value, animate);
  const safeVal = isNaN(animatedValue) ? 0 : Math.abs(animatedValue);
  const isNegative = animatedValue < 0;

  // Formata o número com 2 casas decimais
  const formattedStr = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeVal);

  // Separa parte inteira da parte decimal (,00)
  const parts = formattedStr.split(',');
  const integerPart = parts[0] || '0';
  const centsPart = parts[1] || '00';

  return (
    <span className={`inline-flex items-baseline font-mono whitespace-nowrap ${className}`}>
      {isNegative && <span className="mr-0.5">-</span>}
      <span className={currencyClassName}>R$</span>
      <span>{integerPart}</span>
      <span className={centsClassName}>,{centsPart}</span>
    </span>
  );
};
