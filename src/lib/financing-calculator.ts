import { FinancingInputs, FinancingResult, Installment, ComparisonResult } from '@/types/financing';

/**
 * Limites regulatórios e de segurança do motor financeiro
 */
export const FINANCIAL_LIMITS = {
  MIN_PROPERTY_VALUE: 1000,
  MAX_PROPERTY_VALUE: 100_000_000,
  MIN_TERM_MONTHS: 1,
  MAX_TERM_MONTHS: 420, // 35 anos (limite máximo SFH / SFI no Brasil)
  MIN_INTEREST_RATE_YEARLY: 0,
  MAX_INTEREST_RATE_YEARLY: 50,
  SFH_CEILING_VALUE: 2_250_000, // Teto regulatório oficial SFH atualizado (R$ 2,25 milhões)
};

/**
 * Valida e higieniza os parâmetros de entrada para evitar números infinitos,
 * negativos, NaN ou prazos absurdos que travariam o cálculo.
 */
export type SanitizedFinancingInputs = Required<FinancingInputs>;

export function sanitizeFinancingInputs(inputs: Partial<FinancingInputs>): SanitizedFinancingInputs {
  const rawPropVal = Number(inputs.propertyValue);
  const propertyValue = Number.isFinite(rawPropVal)
    ? Math.min(Math.max(FINANCIAL_LIMITS.MIN_PROPERTY_VALUE, rawPropVal), FINANCIAL_LIMITS.MAX_PROPERTY_VALUE)
    : DEFAULT_FINANCING_INPUTS.propertyValue;

  const rawDownPayment = Number(inputs.downPayment);
  const downPayment = Number.isFinite(rawDownPayment)
    ? Math.min(Math.max(0, rawDownPayment), propertyValue)
    : Math.min(DEFAULT_FINANCING_INPUTS.downPayment, propertyValue);

  const rawRate = Number(inputs.interestRateYearly);
  const interestRateYearly = Number.isFinite(rawRate)
    ? Math.min(Math.max(FINANCIAL_LIMITS.MIN_INTEREST_RATE_YEARLY, rawRate), FINANCIAL_LIMITS.MAX_INTEREST_RATE_YEARLY)
    : DEFAULT_FINANCING_INPUTS.interestRateYearly;

  const rawTerm = Number(inputs.termMonths);
  const termMonths = Number.isFinite(rawTerm)
    ? Math.min(Math.max(FINANCIAL_LIMITS.MIN_TERM_MONTHS, Math.round(rawTerm)), FINANCIAL_LIMITS.MAX_TERM_MONTHS)
    : DEFAULT_FINANCING_INPUTS.termMonths;

  const rawExtraMonthly = Number(inputs.extraMonthlyAmortization);
  const extraMonthlyAmortization = Number.isFinite(rawExtraMonthly) && rawExtraMonthly > 0 ? rawExtraMonthly : 0;

  const rawExtraAnnual = Number(inputs.extraAnnualAmortization);
  const extraAnnualAmortization = Number.isFinite(rawExtraAnnual) && rawExtraAnnual > 0 ? rawExtraAnnual : 0;

  const rawAdminFee = Number(inputs.monthlyAdminFee);
  const monthlyAdminFee = Number.isFinite(rawAdminFee) && rawAdminFee >= 0 ? rawAdminFee : DEFAULT_FINANCING_INPUTS.monthlyAdminFee;

  const rawMip = Number(inputs.mipRateYearly);
  const mipRateYearly = Number.isFinite(rawMip) && rawMip >= 0 ? rawMip : DEFAULT_FINANCING_INPUTS.mipRateYearly;

  const rawDfi = Number(inputs.dfiRateYearly);
  const dfiRateYearly = Number.isFinite(rawDfi) && rawDfi >= 0 ? rawDfi : DEFAULT_FINANCING_INPUTS.dfiRateYearly;

  const downPaymentPercent = propertyValue > 0 ? (downPayment / propertyValue) * 100 : 0;

  return {
    category: inputs.category || DEFAULT_FINANCING_INPUTS.category,
    propertyValue,
    downPayment,
    downPaymentPercent,
    interestRateYearly,
    termMonths,
    amortizationMethod: inputs.amortizationMethod === 'PRICE' ? 'PRICE' : 'SAC',
    includeInsurances: inputs.includeInsurances !== undefined ? Boolean(inputs.includeInsurances) : DEFAULT_FINANCING_INPUTS.includeInsurances,
    monthlyAdminFee,
    mipRateYearly,
    dfiRateYearly,
    extraMonthlyAmortization,
    extraAnnualAmortization,
  };
}

/**
 * Formata valores numéricos para a moeda brasileira (R$).
 */
export function formatBRL(value: number): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(safeValue);
}

/**
 * Formata valores numéricos para porcentagem (ex: 10,50%).
 */
export function formatPercent(value: number, decimals: number = 2): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return (
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(safeValue) + '%'
  );
}

/**
 * Calcula o financiamento pelo Sistema de Amortização Constante (SAC) ou Tabela PRICE.
 */
export function calculateFinancing(rawInputs: FinancingInputs): FinancingResult {
  const inputs = sanitizeFinancingInputs(rawInputs);
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
    extraMonthlyAmortization,
    extraAnnualAmortization,
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
  const monthlyRate = interestRateYearly > 0
    ? Math.pow(1 + interestRateYearly / 100, 1 / 12) - 1
    : 0;

  const mipMonthlyRate = includeInsurances ? (mipRateYearly / 100) / 12 : 0;
  const dfiMonthlyRate = includeInsurances ? (dfiRateYearly / 100) / 12 : 0;
  const adminFee = includeInsurances ? monthlyAdminFee : 0;

  const installments: Installment[] = [];
  let currentBalance = loanAmount;
  let accumulatedInterest = 0;
  let accumulatedPaid = 0;
  let totalInsurancesAndFees = 0;

  if (amortizationMethod === 'SAC') {
    // Amortização constante
    const fixedAmortization = loanAmount / termMonths;

    for (let m = 1; m <= termMonths; m++) {
      const interestPaid = currentBalance * monthlyRate;
      
      // Amortização normal + extra
      const annualExtraPaid = (m % 12 === 0) ? extraAnnualAmortization : 0;
      let principalAmortization = fixedAmortization + extraMonthlyAmortization + annualExtraPaid;

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
      const normalAmortization = Math.max(0, pmtPure - interestPaid);
      const annualExtraPaid = (m % 12 === 0) ? extraAnnualAmortization : 0;
      let principalAmortization = normalAmortization + extraMonthlyAmortization + annualExtraPaid;

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

  // Cálculo de estimativa simplificada do Custo Efetivo Total (CET) anualizado
  const totalFinancialCost = totalInterest + totalInsurancesAndFees;
  const actualMonths = Math.max(1, installments.length);
  const yearlyCostFactor = Math.pow((loanAmount + totalFinancialCost) / loanAmount, 12 / actualMonths) - 1;
  const effectiveYearlyRate = Math.max(interestRateYearly, (Number.isFinite(yearlyCostFactor) ? yearlyCostFactor * 100 : interestRateYearly));

  return {
    method: amortizationMethod,
    propertyValue,
    downPayment,
    loanAmount,
    termMonths: actualMonths,
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
  interestRateYearly: 11.39,
  termMonths: 360,
  amortizationMethod: 'SAC',
  includeInsurances: true,
  monthlyAdminFee: 25,
  mipRateYearly: 0.28,
  dfiRateYearly: 0.15,
  extraMonthlyAmortization: 0,
  extraAnnualAmortization: 0,
};
