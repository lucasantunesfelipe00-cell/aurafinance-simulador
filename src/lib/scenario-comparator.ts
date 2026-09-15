import { FinancingInputs, FinancingResult } from '../types/financing';
import { calculateFinancing, formatBRL, formatPercent } from './financing-calculator';

export interface ScenarioItem {
  id?: string;
  name: string;
  inputs: FinancingInputs;
  isCurrent?: boolean;
}

export interface ScenarioComparisonResult {
  scenarioA: {
    name: string;
    inputs: FinancingInputs;
    result: FinancingResult;
    isCurrent?: boolean;
  };
  scenarioB: {
    name: string;
    inputs: FinancingInputs;
    result: FinancingResult;
    isCurrent?: boolean;
  };
  deltas: {
    propertyValue: number;       // B - A
    downPayment: number;         // B - A
    loanAmount: number;          // B - A
    firstInstallment: number;    // B - A
    lastInstallment: number;     // B - A
    totalInterest: number;       // B - A
    totalPaid: number;           // B - A
    termMonths: number;          // B - A
    interestSavings: number;     // Math.abs(A.totalInterest - B.totalInterest)
    totalPaidSavings: number;    // Math.abs(A.totalPaid - B.totalPaid)
  };
  winners: {
    totalPaid: 'A' | 'B' | 'EQUAL';
    totalInterest: 'A' | 'B' | 'EQUAL';
    firstInstallment: 'A' | 'B' | 'EQUAL';
  };
  executiveInsight: string;
}

/**
 * Compara dois cenários de financiamento calculando métricas, deltas e gerando insights de tomada de decisão.
 */
export function compareTwoScenarios(
  itemA: ScenarioItem,
  itemB: ScenarioItem
): ScenarioComparisonResult {
  const resultA = calculateFinancing(itemA.inputs);
  const resultB = calculateFinancing(itemB.inputs);

  const totalPaidDiff = resultB.totalPaid - resultA.totalPaid;
  const interestDiff = resultB.totalInterest - resultA.totalInterest;
  const firstInstallmentDiff = resultB.firstInstallment - resultA.firstInstallment;

  const winnerTotalPaid: 'A' | 'B' | 'EQUAL' =
    Math.abs(totalPaidDiff) < 1 ? 'EQUAL' : totalPaidDiff < 0 ? 'B' : 'A';

  const winnerInterest: 'A' | 'B' | 'EQUAL' =
    Math.abs(interestDiff) < 1 ? 'EQUAL' : interestDiff < 0 ? 'B' : 'A';

  const winnerFirstInstallment: 'A' | 'B' | 'EQUAL' =
    Math.abs(firstInstallmentDiff) < 1 ? 'EQUAL' : firstInstallmentDiff < 0 ? 'B' : 'A';

  // Montagem do Insight Executivo
  let insight = '';
  if (winnerTotalPaid === 'EQUAL') {
    insight = `Ambos os cenários apresentam o mesmo custo total acumulado de ${formatBRL(resultA.totalPaid)}.`;
  } else {
    const winningScenario = winnerTotalPaid === 'A' ? itemA : itemB;
    const losingScenario = winnerTotalPaid === 'A' ? itemB : itemA;
    const winningResult = winnerTotalPaid === 'A' ? resultA : resultB;
    const losingResult = winnerTotalPaid === 'A' ? resultB : resultA;
    const savings = Math.abs(totalPaidDiff);
    const savingsPercent = losingResult.totalPaid > 0 ? ((savings / losingResult.totalPaid) * 100).toFixed(1) : '0';

    insight = `O cenário "${winningScenario.name}" gera uma economia total de ${formatBRL(savings)} (${savingsPercent}%) em relação a "${losingScenario.name}".`;

    if (winningResult.firstInstallment < losingResult.firstInstallment) {
      const installmentDiff = losingResult.firstInstallment - winningResult.firstInstallment;
      insight += ` Além disso, sua 1ª parcela é ${formatBRL(installmentDiff)} mais acessível.`;
    } else if (winningResult.firstInstallment > losingResult.firstInstallment) {
      const installmentDiff = winningResult.firstInstallment - losingResult.firstInstallment;
      insight += ` Note que a 1ª parcela de "${winningScenario.name}" é ${formatBRL(installmentDiff)} maior, mas compensa fortemente na redução expressiva dos juros totais.`;
    }
  }

  return {
    scenarioA: {
      name: itemA.name,
      inputs: itemA.inputs,
      result: resultA,
      isCurrent: itemA.isCurrent,
    },
    scenarioB: {
      name: itemB.name,
      inputs: itemB.inputs,
      result: resultB,
      isCurrent: itemB.isCurrent,
    },
    deltas: {
      propertyValue: itemB.inputs.propertyValue - itemA.inputs.propertyValue,
      downPayment: itemB.inputs.downPayment - itemA.inputs.downPayment,
      loanAmount: resultB.loanAmount - resultA.loanAmount,
      firstInstallment: firstInstallmentDiff,
      lastInstallment: resultB.lastInstallment - resultA.lastInstallment,
      totalInterest: interestDiff,
      totalPaid: totalPaidDiff,
      termMonths: itemB.inputs.termMonths - itemA.inputs.termMonths,
      interestSavings: Math.abs(interestDiff),
      totalPaidSavings: Math.abs(totalPaidDiff),
    },
    winners: {
      totalPaid: winnerTotalPaid,
      totalInterest: winnerInterest,
      firstInstallment: winnerFirstInstallment,
    },
    executiveInsight: insight,
  };
}

/**
 * Monta o texto de comparação formatado para envio direto ao WhatsApp do especialista.
 */
export function buildWhatsAppComparisonMessage(
  comparison: ScenarioComparisonResult,
  specialistNumber?: string
): string {
  const { scenarioA, scenarioB, deltas, winners, executiveInsight } = comparison;

  let text = `*Olá! Realizei uma comparação entre dois cenários no Brasil Finance e gostaria da avaliação de um especialista de crédito:*`;

  text += `\n\n📌 *CENÁRIO A:* ${scenarioA.name}`;
  text += `\n• Imóvel: ${formatBRL(scenarioA.inputs.propertyValue)}`;
  text += `\n• Entrada: ${formatBRL(scenarioA.inputs.downPayment)}`;
  text += `\n• 1ª Parcela: ${formatBRL(scenarioA.result.firstInstallment)}`;
  text += `\n• Juros Totais: ${formatBRL(scenarioA.result.totalInterest)}`;
  text += `\n• Total Pago: ${formatBRL(scenarioA.result.totalPaid)}`;

  text += `\n\n📌 *CENÁRIO B:* ${scenarioB.name}`;
  text += `\n• Imóvel: ${formatBRL(scenarioB.inputs.propertyValue)}`;
  text += `\n• Entrada: ${formatBRL(scenarioB.inputs.downPayment)}`;
  text += `\n• 1ª Parcela: ${formatBRL(scenarioB.result.firstInstallment)}`;
  text += `\n• Juros Totais: ${formatBRL(scenarioB.result.totalInterest)}`;
  text += `\n• Total Pago: ${formatBRL(scenarioB.result.totalPaid)}`;

  if (deltas.totalPaidSavings > 0) {
    const winningName = winners.totalPaid === 'A' ? scenarioA.name : scenarioB.name;
    text += `\n\n🏆 *Resultado:* O cenário "${winningName}" economiza ${formatBRL(deltas.totalPaidSavings)} no total.`;
  }

  text += `\n\n💡 *Insight:* ${executiveInsight}`;
  text += `\n\n_Qual dessas opções vocês recomendam para aprovação com as melhores taxas bancárias?_`;

  return text;
}
