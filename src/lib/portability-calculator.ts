import { FinancingMethod } from '@/types/financing';

export interface PortabilityInputs {
  currentBalance: number; // Saldo devedor atual (R$)
  currentRateYearly: number; // Taxa de juros anual atual (ex: 12.5% a.a.)
  newRateYearly: number; // Nova taxa anual proposta (ex: 9.8% a.a.)
  remainingMonths: number; // Prazo remanescente em meses (ex: 300)
  amortizationMethod: FinancingMethod; // 'SAC' | 'PRICE'
  currentMonthlyInstallment?: number; // Parcela atual opcional informada pelo usuário
}

export interface PortabilityContractMetrics {
  firstInstallment: number;
  lastInstallment: number;
  averageInstallment: number;
  totalInterest: number;
  totalPaid: number;
}

export interface PortabilityResult {
  currentContract: PortabilityContractMetrics;
  newContract: PortabilityContractMetrics;
  monthlySavingsFirst: number; // Economia na 1ª parcela
  monthlySavingsAverage: number; // Economia média mensal
  totalInterestSavings: number; // Economia total em juros
  totalPaidSavings: number; // Economia total de desembolso
  percentageInterestSavings: number; // % de economia nos juros futuros
  monthsAcceleratedIfReinvestingSavings: number; // Meses economizados se aplicar a diferença na parcela
}

export function calculatePortability(inputs: PortabilityInputs): PortabilityResult {
  const balance = Math.max(1000, inputs.currentBalance);
  const n = Math.max(12, Math.min(420, inputs.remainingMonths));
  const method = inputs.amortizationMethod || 'SAC';

  // Taxas mensais nominais (padrão Bacen / SFH / SFI)
  const currentMonthlyRate = inputs.currentRateYearly / 100 / 12;
  const newMonthlyRate = inputs.newRateYearly / 100 / 12;

  const currentContract = computeContractMetrics(balance, n, currentMonthlyRate, method);
  const newContract = computeContractMetrics(balance, n, newMonthlyRate, method);

  const monthlySavingsFirst = Math.max(0, currentContract.firstInstallment - newContract.firstInstallment);
  const monthlySavingsAverage = Math.max(0, currentContract.averageInstallment - newContract.averageInstallment);
  const totalInterestSavings = Math.max(0, currentContract.totalInterest - newContract.totalInterest);
  const totalPaidSavings = Math.max(0, currentContract.totalPaid - newContract.totalPaid);

  const percentageInterestSavings =
    currentContract.totalInterest > 0
      ? (totalInterestSavings / currentContract.totalInterest) * 100
      : 0;

  // Cálculo de quitação acelerada se o cliente mantiver o valor da parcela antiga como aporte
  const monthsAccelerated = computeAcceleratedMonths(
    balance,
    n,
    newMonthlyRate,
    method,
    currentContract.firstInstallment
  );

  return {
    currentContract,
    newContract,
    monthlySavingsFirst,
    monthlySavingsAverage,
    totalInterestSavings,
    totalPaidSavings,
    percentageInterestSavings,
    monthsAcceleratedIfReinvestingSavings: monthsAccelerated,
  };
}

function computeContractMetrics(
  balance: number,
  n: number,
  monthlyRate: number,
  method: FinancingMethod
): PortabilityContractMetrics {
  if (balance <= 0 || n <= 0) {
    return {
      firstInstallment: 0,
      lastInstallment: 0,
      averageInstallment: 0,
      totalInterest: 0,
      totalPaid: 0,
    };
  }

  if (method === 'SAC') {
    const principalAmortization = balance / n;
    let totalInterest = 0;
    let firstInstallment = 0;
    let lastInstallment = 0;

    let outstanding = balance;
    for (let m = 1; m <= n; m++) {
      const interest = outstanding * monthlyRate;
      totalInterest += interest;
      const installment = principalAmortization + interest;

      if (m === 1) firstInstallment = installment;
      if (m === n) lastInstallment = installment;

      outstanding -= principalAmortization;
    }

    const totalPaid = balance + totalInterest;
    const averageInstallment = totalPaid / n;

    return {
      firstInstallment,
      lastInstallment,
      averageInstallment,
      totalInterest,
      totalPaid,
    };
  } else {
    // PRICE
    if (monthlyRate === 0) {
      const p = balance / n;
      return {
        firstInstallment: p,
        lastInstallment: p,
        averageInstallment: p,
        totalInterest: 0,
        totalPaid: balance,
      };
    }

    const factor = Math.pow(1 + monthlyRate, n);
    const installment = balance * ((monthlyRate * factor) / (factor - 1));
    const totalPaid = installment * n;
    const totalInterest = Math.max(0, totalPaid - balance);

    return {
      firstInstallment: installment,
      lastInstallment: installment,
      averageInstallment: installment,
      totalInterest,
      totalPaid,
    };
  }
}

function computeAcceleratedMonths(
  balance: number,
  originalN: number,
  newMonthlyRate: number,
  method: FinancingMethod,
  targetPayment: number
): number {
  if (targetPayment <= 0 || balance <= 0) return 0;

  let outstanding = balance;
  let months = 0;

  // Simula evolução mês a mês pagando targetPayment
  while (outstanding > 1 && months < originalN) {
    months++;
    const interest = outstanding * newMonthlyRate;
    let payment = targetPayment;

    if (method === 'SAC') {
      const scheduledAmort = balance / originalN;
      payment = Math.max(targetPayment, scheduledAmort + interest);
    }

    const amort = Math.min(outstanding, payment - interest);
    if (amort <= 0) break; // Não amortiza

    outstanding -= amort;
  }

  return Math.max(0, originalN - months);
}
