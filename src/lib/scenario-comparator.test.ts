import { describe, it, expect } from 'vitest';
import { compareTwoScenarios, buildWhatsAppComparisonMessage, ScenarioItem } from './scenario-comparator';
import { FinancingInputs } from '../types/financing';

const scenarioA: ScenarioItem = {
  id: 'sc-1',
  name: 'Apto Jardins',
  inputs: {
    category: 'property',
    propertyValue: 1000000,
    downPayment: 200000,
    downPaymentPercent: 20,
    interestRateYearly: 10.5,
    termMonths: 360,
    amortizationMethod: 'SAC',
    includeInsurances: true,
    monthlyAdminFee: 25,
    mipRateYearly: 0.021,
    dfiRateYearly: 0.008,
  },
};

const scenarioB: ScenarioItem = {
  id: 'sc-2',
  name: 'Casa Alphaville (Com Entrada Maior)',
  inputs: {
    category: 'property',
    propertyValue: 1000000,
    downPayment: 300000,
    downPaymentPercent: 30,
    interestRateYearly: 10.5,
    termMonths: 360,
    amortizationMethod: 'SAC',
    includeInsurances: true,
    monthlyAdminFee: 25,
    mipRateYearly: 0.021,
    dfiRateYearly: 0.008,
  },
};

describe('scenario-comparator: Compare Two Scenarios', () => {
  it('correctly calculates deltas, winners and executive insight', () => {
    const comparison = compareTwoScenarios(scenarioA, scenarioB);

    expect(comparison.scenarioA.name).toBe('Apto Jardins');
    expect(comparison.scenarioB.name).toBe('Casa Alphaville (Com Entrada Maior)');
    expect(comparison.deltas.downPayment).toBe(100000);
    expect(comparison.deltas.loanAmount).toBe(-100000);
    expect(comparison.winners.totalPaid).toBe('B');
    expect(comparison.winners.totalInterest).toBe('B');
    expect(comparison.executiveInsight).toContain('Casa Alphaville (Com Entrada Maior)');
  });

  it('generates a formatted WhatsApp comparison message', () => {
    const comparison = compareTwoScenarios(scenarioA, scenarioB);
    const message = buildWhatsAppComparisonMessage(comparison);

    expect(message).toContain('Apto Jardins');
    expect(message).toContain('Casa Alphaville (Com Entrada Maior)');
    expect(message).toContain('1.000.000');
    expect(message).toContain('Resultado');
  });
});
