'use client';

import React from 'react';

interface FormattedBRLProps {
  value: number;
  className?: string;
  currencyClassName?: string;
  centsClassName?: string;
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
}) => {
  const safeVal = isNaN(value) ? 0 : Math.abs(value);
  const isNegative = value < 0;

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
