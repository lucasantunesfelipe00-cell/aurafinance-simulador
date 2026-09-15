import { describe, it, expect } from 'vitest';
import {
  calculateRentVsBuy,
  DEFAULT_RENT_VS_BUY_PARAMS,
  buildWhatsAppRentVsBuyMessage,
} from './rent-vs-buy-calculator';
import { FinancingInputs } from '@/types/financing';
import { DEFAULT_FINANCING_INPUTS } from './financing-calculator';

describe('rent-vs-buy-calculator engine', () => {
  const standardInputs: FinancingInputs = {
    ...DEFAULT_FINANCING_INPUTS,
    propertyValue: 1000000,
    downPayment: 200000,
    termMonths: 360,
    interestRateYearly: 10.5,
    amortizationMethod: 'SAC',
  };

  it('calculates initial capital invested including acquisition costs', () => {
    const result = calculateRentVsBuy(standardInputs);
    // 200k downPayment + 4% of 1M (40k) = 240k
    expect(result.initialCapitalInvested).toBe(240000);
    expect(result.acquisitionCosts).toBe(40000);
    expect(result.timeline.length).toBe(360);
  });

  it('properly calculates buyer net worth as property market value minus remaining loan balance', () => {
    const result = calculateRentVsBuy(standardInputs);
    const month1 = result.timeline[0];
    const month120 = result.timeline[119]; // Year 10
    const finalMonth = result.timeline[359]; // Month 360

    expect(month1.buyerNetWorth).toBe(month1.propertyMarketValue - month1.loanBalance);
    expect(month120.buyerNetWorth).toBe(month120.propertyMarketValue - month120.loanBalance);
    // In month 360, loan is fully paid off
    expect(finalMonth.loanBalance).toBe(0);
    expect(finalMonth.buyerNetWorth).toBe(finalMonth.propertyMarketValue);
  });

  it('generates milestones with coherent winner and differences', () => {
    const result = calculateRentVsBuy(standardInputs);
    expect(result.milestones.length).toBeGreaterThanOrEqual(3);

    const m5 = result.milestones.find((m) => m.years === 5);
    expect(m5).toBeDefined();
    if (m5) {
      expect(m5.difference).toBe(Math.abs(m5.buyerNetWorth - m5.renterNetWorth));
    }
  });

  it('handles scenario with high CDI and low rent yield', () => {
    // When CDI is 14% a.a., low property appreciation 3% and low rent yield 0.30%
    const result = calculateRentVsBuy(standardInputs, {
      investmentReturnYearly: 14.0,
      propertyAppreciationYearly: 3.0,
      initialRentYieldMonthly: 0.30, // Low rent
    });

    expect(result.finalWinner).toBe('RENT');
    expect(result.finalRenterNetWorth).toBeGreaterThan(result.finalBuyerNetWorth);
    expect(result.executiveInsight).toContain('Morar de aluguel e investir a entrada no CDI');
  });

  it('accelerated amortization shifts benefit towards buying sooner', () => {
    const baseline = calculateRentVsBuy(standardInputs);
    const accelerated = calculateRentVsBuy({
      ...standardInputs,
      extraMonthlyAmortization: 2000,
    });

    // Accelerated finishes loan much earlier and has lower total interest
    expect(accelerated.timeline.length).toBeLessThan(baseline.timeline.length);
    expect(accelerated.executiveInsight).toContain('amortização acelerada');
  });

  it('builds a clean and complete WhatsApp message', () => {
    const result = calculateRentVsBuy(standardInputs);
    const message = buildWhatsAppRentVsBuyMessage(result);

    expect(message).toContain('*ESTUDO PATRIMONIAL: COMPRAR VS. ALUGAR*');
    expect(message).toContain('CDI / Investimentos');
    expect(message).toContain('EVOLUÇÃO NOS MARCOS');
  });
});
