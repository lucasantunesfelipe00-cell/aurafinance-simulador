import { describe, it, expect } from 'vitest';
import { buildWhatsAppMessage, generateWhatsAppUrl } from './whatsapp';
import { FinancingInputs, FinancingResult } from '../types/financing';

const sampleInputs: FinancingInputs = {
  category: 'property',
  propertyValue: 900000,
  downPayment: 200000,
  downPaymentPercent: 22.2,
  interestRateYearly: 10.5,
  termMonths: 360,
  amortizationMethod: 'SAC',
  includeInsurances: true,
  monthlyAdminFee: 25,
  mipRateYearly: 0.021,
  dfiRateYearly: 0.008,
};

const sampleResult: FinancingResult = {
  method: 'SAC',
  propertyValue: 900000,
  downPayment: 200000,
  loanAmount: 700000,
  termMonths: 360,
  firstInstallment: 8125,
  lastInstallment: 1960,
  totalPaid: 1815300,
  totalInterest: 1115300,
  totalInsurancesAndFees: 0,
  effectiveYearlyRate: 10.5,
  installments: [],
};

describe('whatsapp: Message and URL Generator', () => {
  it('builds a rich formatted message with financial data and share link', () => {
    const message = buildWhatsAppMessage(sampleInputs, sampleResult, {
      scenarioName: 'Apartamento Jardins',
      baseUrl: 'https://brasilfinance.app',
    });

    expect(message).toContain('Brasil Finance');
    expect(message).toContain('Apartamento Jardins');
    expect(message).toContain('900.000');
    expect(message).toContain('200.000');
    expect(message).toContain('700.000');
    expect(message).toContain('SAC');
    expect(message).toContain('360 meses');
    expect(message).toContain('8.125');
    expect(message).toContain('https://brasilfinance.app');
  });

  it('generates a valid wa.me URL with phone number if provided', () => {
    const url = generateWhatsAppUrl(sampleInputs, sampleResult, {
      phoneNumber: '5511999998888',
      baseUrl: 'https://brasilfinance.app',
    });

    expect(url.startsWith('https://wa.me/5511999998888?text=')).toBe(true);
    expect(url).toContain(encodeURIComponent('Brasil Finance'));
  });

  it('generates wa.me URL without phone if not configured', () => {
    const url = generateWhatsAppUrl(sampleInputs, sampleResult, {
      baseUrl: 'https://brasilfinance.app',
    });

    expect(url.startsWith('https://wa.me/?text=')).toBe(true);
  });
});
