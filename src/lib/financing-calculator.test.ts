import { describe, it, expect } from 'vitest';
import {
  calculateFinancing,
  compareFinancing,
  sanitizeFinancingInputs,
  formatBRL,
  formatPercent,
  DEFAULT_FINANCING_INPUTS,
  FINANCIAL_LIMITS,
} from './financing-calculator';
import { FinancingInputs } from '@/types/financing';

describe('financing-calculator: Sanitize and Safety Limits', () => {
  it('deve usar valores padrão quando inputs forem vazios ou indefinidos', () => {
    const sanitized = sanitizeFinancingInputs({});
    expect(sanitized.propertyValue).toBe(DEFAULT_FINANCING_INPUTS.propertyValue);
    expect(sanitized.termMonths).toBe(DEFAULT_FINANCING_INPUTS.termMonths);
    expect(sanitized.interestRateYearly).toBe(DEFAULT_FINANCING_INPUTS.interestRateYearly);
    expect(sanitized.amortizationMethod).toBe('SAC');
  });

  it('deve limitar entrada máxima ao valor do imóvel', () => {
    const sanitized = sanitizeFinancingInputs({
      propertyValue: 500000,
      downPayment: 800000, // Maior que o imóvel
    });
    expect(sanitized.downPayment).toBe(500000);
    expect(sanitized.downPaymentPercent).toBe(100);
  });

  it('deve proteger contra valores negativos ou NaN', () => {
    const sanitized = sanitizeFinancingInputs({
      propertyValue: -100000,
      downPayment: -50000,
      interestRateYearly: -5,
      termMonths: -12,
    });
    expect(sanitized.propertyValue).toBe(FINANCIAL_LIMITS.MIN_PROPERTY_VALUE);
    expect(sanitized.downPayment).toBe(0);
    expect(sanitized.interestRateYearly).toBe(0);
    expect(sanitized.termMonths).toBe(1);
  });

  it('deve impor teto máximo de 420 meses (35 anos regulatórios)', () => {
    const sanitized = sanitizeFinancingInputs({
      termMonths: 1000000, // Tentativa de travar o navegador
    });
    expect(sanitized.termMonths).toBe(FINANCIAL_LIMITS.MAX_TERM_MONTHS);
  });
});

describe('financing-calculator: Sistema de Amortização Constante (SAC)', () => {
  const baseSacInputs: FinancingInputs = {
    ...DEFAULT_FINANCING_INPUTS,
    propertyValue: 500000,
    downPayment: 100000,
    interestRateYearly: 10,
    termMonths: 360,
    amortizationMethod: 'SAC',
    includeInsurances: false,
    extraMonthlyAmortization: 0,
    extraAnnualAmortization: 0,
  };

  it('deve manter a amortização principal constante ao longo de todas as parcelas normais', () => {
    const result = calculateFinancing(baseSacInputs);
    const expectedAmortization = 400000 / 360;

    expect(result.installments.length).toBe(360);
    expect(result.loanAmount).toBe(400000);

    // Amortização de todas as parcelas deve ser exatamente 400.000 / 360
    result.installments.forEach((inst) => {
      expect(inst.principalAmortization).toBeCloseTo(expectedAmortization, 2);
    });

    // Saldo devedor final deve ser zero
    expect(result.installments[result.installments.length - 1].outstandingBalance).toBe(0);
  });

  it('primeira parcela no SAC deve ser maior que a última parcela', () => {
    const result = calculateFinancing(baseSacInputs);
    expect(result.firstInstallment).toBeGreaterThan(result.lastInstallment);
  });

  it('deve calcular corretamente com taxa de juros ZERO (0%)', () => {
    const zeroRateInputs: FinancingInputs = {
      ...baseSacInputs,
      interestRateYearly: 0,
    };
    const result = calculateFinancing(zeroRateInputs);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPaid).toBeCloseTo(400000, 2);
    expect(result.firstInstallment).toBeCloseTo(400000 / 360, 2);
    expect(result.lastInstallment).toBeCloseTo(400000 / 360, 2);
  });

  it('amortização extra mensal deve reduzir o número total de parcelas e os juros pagos', () => {
    const normalResult = calculateFinancing(baseSacInputs);
    const extraResult = calculateFinancing({
      ...baseSacInputs,
      extraMonthlyAmortization: 2000,
    });

    expect(extraResult.installments.length).toBeLessThan(normalResult.installments.length);
    expect(extraResult.totalInterest).toBeLessThan(normalResult.totalInterest);
  });
});

describe('financing-calculator: Tabela PRICE (Prestação Fixa)', () => {
  const basePriceInputs: FinancingInputs = {
    ...DEFAULT_FINANCING_INPUTS,
    propertyValue: 500000,
    downPayment: 100000,
    interestRateYearly: 10,
    termMonths: 360,
    amortizationMethod: 'PRICE',
    includeInsurances: false,
    extraMonthlyAmortization: 0,
    extraAnnualAmortization: 0,
  };

  it('deve manter a prestação pura constante quando não há amortizações extras', () => {
    const result = calculateFinancing(basePriceInputs);
    expect(result.installments.length).toBe(360);

    const firstPMT = result.installments[0].installmentTotal;
    // Todas as parcelas devem ter o mesmo valor (exceto possíveis ajustes de arredondamento final)
    result.installments.slice(0, 359).forEach((inst) => {
      expect(inst.installmentTotal).toBeCloseTo(firstPMT, 1);
    });

    expect(result.installments[result.installments.length - 1].outstandingBalance).toBe(0);
  });

  it('na Tabela PRICE, os juros decrescem e a amortização principal cresce a cada mês', () => {
    const result = calculateFinancing(basePriceInputs);
    const firstMonth = result.installments[0];
    const lastMonth = result.installments[result.installments.length - 1];

    expect(firstMonth.interestPaid).toBeGreaterThan(lastMonth.interestPaid);
    expect(firstMonth.principalAmortization).toBeLessThan(lastMonth.principalAmortization);
  });

  it('deve calcular corretamente com taxa de juros ZERO (0%) na Tabela PRICE', () => {
    const result = calculateFinancing({
      ...basePriceInputs,
      interestRateYearly: 0,
    });
    expect(result.totalInterest).toBe(0);
    expect(result.totalPaid).toBeCloseTo(400000, 2);
    expect(result.firstInstallment).toBeCloseTo(400000 / 360, 2);
  });
});

describe('financing-calculator: Comparativo SAC x PRICE', () => {
  it('o total de juros no SAC deve ser sempre menor do que na Tabela PRICE para taxas positivas', () => {
    const inputs: FinancingInputs = {
      ...DEFAULT_FINANCING_INPUTS,
      propertyValue: 600000,
      downPayment: 120000,
      interestRateYearly: 11.5,
      termMonths: 360,
    };

    const comparison = compareFinancing(inputs);
    expect(comparison.sac.totalInterest).toBeLessThan(comparison.price.totalInterest);
    expect(comparison.interestSavingsSAC).toBeGreaterThan(0);
    expect(comparison.percentageSavings).toBeGreaterThan(0);
  });

  it('deve lidar com caso de entrada de 100% (financiamento zero)', () => {
    const fullDownPaymentInputs: FinancingInputs = {
      ...DEFAULT_FINANCING_INPUTS,
      propertyValue: 500000,
      downPayment: 500000,
    };

    const result = calculateFinancing(fullDownPaymentInputs);
    expect(result.loanAmount).toBe(0);
    expect(result.totalPaid).toBe(0);
    expect(result.totalInterest).toBe(0);
    expect(result.installments.length).toBe(0);
  });
});

describe('financing-calculator: Formatadores BRL e Percent', () => {
  it('formatBRL formata moeda corretamente e protege contra NaN', () => {
    expect(formatBRL(1000)).toContain('1.000,00');
    expect(formatBRL(NaN)).toContain('0,00');
  });

  it('formatPercent formata percentual corretamente', () => {
    expect(formatPercent(10.5)).toBe('10,50%');
    expect(formatPercent(NaN)).toBe('0,00%');
  });
});
