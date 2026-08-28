import { FinancingInputs, FinancingResult, Installment, ComparisonResult } from '@/types/financing';

/**
 * Formata valores numéricos para a moeda brasileira (R$).
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(isNaN(value) ? 0 : value);
}

/**
 * Formata valores numéricos para porcentagem (ex: 10,50%).
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(isNaN(value) ? 0 : value) + '%';
}

/**
 * Calcula o financiamento pelo Sistema de Amortização Constante (SAC) ou Tabela PRICE.
 */
export function calculateFinancing(inputs: FinancingInputs): FinancingResult {
  const {
    propertyValue,
    downPayment,
    interestRateYearly,
    termMonths,
    amortizationMethod,
    includeInsurances,
    monthlyAdminFee,
    mipRateYearly,
    dfiRateYearly,
  } = inputs;

  const loanAmount = Math.max(0, propertyValue - downPayment);

  // Se o valor financiado for zero ou prazo zero, retorna estrutura zerada
  if (loanAmount <= 0 || termMonths <= 0) {
    return {
      method: amortizationMethod,
      propertyValue,
      downPayment,
      loanAmount: 0,
      termMonths,
      firstInstallment: 0,
      lastInstallment: 0,
      totalPaid: 0,
      totalInterest: 0,
      totalInsurancesAndFees: 0,
      effectiveYearlyRate: 0,
      installments: [],
    };
  }

  // Taxa mensal proporcional i = (1 + i_a)^(1/12) - 1
  const monthlyRate = Math.pow(1 + interestRateYearly / 100, 1 / 12) - 1;
  const mipMonthlyRate = includeInsurances ? (mipRateYearly / 100) / 12 : 0;
  const dfiMonthlyRate = includeInsurances ? (dfiRateYearly / 100) / 12 : 0;
  const adminFee = includeInsurances ? monthlyAdminFee : 0;

  const installments: Installment[] = [];
  let currentBalance = loanAmount;
  let accumulatedInterest = 0;
  let accumulatedPaid = 0;
  let totalInsurancesAndFees = 0;

  const extraMonthly = inputs.extraMonthlyAmortization || 0;
  const extraAnnual = inputs.extraAnnualAmortization || 0;

  if (amortizationMethod === 'SAC') {
    // Amortização constante
    const fixedAmortization = loanAmount / termMonths;

    for (let m = 1; m <= termMonths; m++) {
      const interestPaid = currentBalance * monthlyRate;
      
      // Amortização normal + extra
      const annualExtraPaid = (m % 12 === 0) ? extraAnnual : 0;
      let principalAmortization = fixedAmortization + extraMonthly + annualExtraPaid;

      if (principalAmortization > currentBalance) {
        principalAmortization = currentBalance;
      }

      // Seguros e encargos
      const mipInsurance = currentBalance * mipMonthlyRate;
      const dfiInsurance = propertyValue * dfiMonthlyRate;
      const insuranceAndFees = mipInsurance + dfiInsurance + adminFee;

      const installmentTotal = principalAmortization + interestPaid + insuranceAndFees;

      currentBalance = Math.max(0, currentBalance - principalAmortization);
      accumulatedInterest += interestPaid;
      totalInsurancesAndFees += insuranceAndFees;
      accumulatedPaid += installmentTotal;

      installments.push({
        number: m,
        installmentTotal,
        principalAmortization,
        interestPaid,
        insuranceAndFees,
        outstandingBalance: currentBalance,
        accumulatedInterest,
        accumulatedPaid,
      });

      if (currentBalance <= 0) {
        break;
      }
    }
  } else {
    // Tabela PRICE (Prestação constante da dívida pura)
    let pmtPure = 0;
    if (monthlyRate === 0) {
      pmtPure = loanAmount / termMonths;
    } else {
      const factor = Math.pow(1 + monthlyRate, termMonths);
      pmtPure = loanAmount * ((monthlyRate * factor) / (factor - 1));
    }

    for (let m = 1; m <= termMonths; m++) {
      const interestPaid = currentBalance * monthlyRate;
      
      // Amortização normal + extra
      const normalAmortization = pmtPure - interestPaid;
      const annualExtraPaid = (m % 12 === 0) ? extraAnnual : 0;
      let principalAmortization = normalAmortization + extraMonthly + annualExtraPaid;

      if (principalAmortization > currentBalance) {
        principalAmortization = currentBalance;
      }

      // Seguros e encargos
      const mipInsurance = currentBalance * mipMonthlyRate;
      const dfiInsurance = propertyValue * dfiMonthlyRate;
      const insuranceAndFees = mipInsurance + dfiInsurance + adminFee;

      const installmentTotal = principalAmortization + interestPaid + insuranceAndFees;

      currentBalance = Math.max(0, currentBalance - principalAmortization);
      accumulatedInterest += interestPaid;
      totalInsurancesAndFees += insuranceAndFees;
      accumulatedPaid += installmentTotal;

      installments.push({
        number: m,
        installmentTotal,
        principalAmortization,
        interestPaid,
        insuranceAndFees,
        outstandingBalance: currentBalance,
        accumulatedInterest,
        accumulatedPaid,
      });

      if (currentBalance <= 0) {
        break;
      }
    }
  }

  const firstInstallment = installments[0]?.installmentTotal || 0;
  const lastInstallment = installments[installments.length - 1]?.installmentTotal || 0;
  const totalPaid = accumulatedPaid;
  const totalInterest = accumulatedInterest;

  // Cálculo aproximado do Custo Efetivo Total (CET) anualizado
  const totalFinancialCost = totalInterest + totalInsurancesAndFees;
  const yearlyCostFactor = Math.pow((loanAmount + totalFinancialCost) / loanAmount, 12 / termMonths) - 1;
  const effectiveYearlyRate = Math.max(interestRateYearly, yearlyCostFactor * 100);

  return {
    method: amortizationMethod,
    propertyValue,
    downPayment,
    loanAmount,
    termMonths,
    firstInstallment,
    lastInstallment,
    totalPaid,
    totalInterest,
    totalInsurancesAndFees,
    effectiveYearlyRate,
    installments,
  };
}

/**
 * Gera a comparação direta entre os dois sistemas de amortização (SAC e PRICE).
 */
export function compareFinancing(inputs: FinancingInputs): ComparisonResult {
  const sacResult = calculateFinancing({ ...inputs, amortizationMethod: 'SAC' });
  const priceResult = calculateFinancing({ ...inputs, amortizationMethod: 'PRICE' });

  const interestSavingsSAC = Math.max(0, priceResult.totalInterest - sacResult.totalInterest);
  const percentageSavings = priceResult.totalInterest > 0
    ? (interestSavingsSAC / priceResult.totalInterest) * 100
    : 0;

  return {
    sac: sacResult,
    price: priceResult,
    interestSavingsSAC,
    percentageSavings,
  };
}

/**
 * Valores padrão para simulação inicial
 */
export const DEFAULT_FINANCING_INPUTS: FinancingInputs = {
  category: 'property',
  propertyValue: 500000,
  downPayment: 100000,
  downPaymentPercent: 20,
  interestRateYearly: 10.5,
  termMonths: 360,
  amortizationMethod: 'SAC',
  includeInsurances: true,
  monthlyAdminFee: 25,
  mipRateYearly: 0.28,
  dfiRateYearly: 0.15,
  extraMonthlyAmortization: 0,
  extraAnnualAmortization: 0,
};
