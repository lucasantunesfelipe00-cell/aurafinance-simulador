import { describe, it, expect } from 'vitest';
import { calculatePortability, PortabilityInputs } from './portability-calculator';

describe('portability-calculator: Portability Savings Engine', () => {
  const baseInputs: PortabilityInputs = {
    currentBalance: 450000,
    currentRateYearly: 12.5,
    newRateYearly: 9.8,
    remainingMonths: 300,
    amortizationMethod: 'SAC',
  };

  it('calculates SAC portability savings accurately', () => {
    const res = calculatePortability(baseInputs);

    // Initial installment should drop
    expect(res.currentContract.firstInstallment).toBeGreaterThan(res.newContract.firstInstallment);
    expect(res.monthlySavingsFirst).toBeGreaterThan(0);

    // Total interest should drop significantly
    expect(res.totalInterestSavings).toBeGreaterThan(50000);
    expect(res.percentageInterestSavings).toBeGreaterThan(15);
    expect(res.totalPaidSavings).toEqual(res.totalInterestSavings);
  });

  it('calculates PRICE portability savings accurately', () => {
    const priceInputs: PortabilityInputs = {
      ...baseInputs,
      amortizationMethod: 'PRICE',
    };
    const res = calculatePortability(priceInputs);

    expect(res.currentContract.firstInstallment).toBeGreaterThan(res.newContract.firstInstallment);
    expect(res.currentContract.firstInstallment).toEqual(res.currentContract.lastInstallment);
    expect(res.monthlySavingsFirst).toBeGreaterThan(500);
    expect(res.totalInterestSavings).toBeGreaterThan(80000);
  });

  it('handles lower new rate with accelerated payoff simulation', () => {
    const res = calculatePortability(baseInputs);
    expect(res.monthsAcceleratedIfReinvestingSavings).toBeGreaterThan(0);
  });
});
