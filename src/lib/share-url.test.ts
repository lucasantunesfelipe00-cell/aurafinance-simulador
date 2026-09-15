import { describe, it, expect } from 'vitest';
import { buildShareQueryString, generateShareUrl, parseShareUrl } from './share-url';
import { FinancingInputs } from '../types/financing';

const sampleInputs: FinancingInputs = {
  category: 'property',
  propertyValue: 850000,
  downPayment: 170000,
  downPaymentPercent: 20,
  interestRateYearly: 10.75,
  termMonths: 420,
  amortizationMethod: 'SAC',
  includeInsurances: true,
  monthlyAdminFee: 25,
  mipRateYearly: 0.021,
  dfiRateYearly: 0.008,
  extraMonthlyAmortization: 500,
};

describe('share-url: Query String Builder & URL Generation', () => {
  it('builds a clean query string with financial parameters', () => {
    const qs = buildShareQueryString(sampleInputs, 'Apartamento Jardins');
    const params = new URLSearchParams(qs);

    expect(params.get('imovel')).toBe('850000');
    expect(params.get('entrada')).toBe('170000');
    expect(params.get('taxa')).toBe('10.75');
    expect(params.get('prazo')).toBe('420');
    expect(params.get('sistema')).toBe('SAC');
    expect(params.get('extraMensal')).toBe('500');
    expect(params.get('cenario')).toBe('Apartamento Jardins');
  });

  it('generates full URL with custom or default baseUrl', () => {
    const url = generateShareUrl(sampleInputs, {
      name: 'Casa em Condomínio',
      baseUrl: 'https://brasilfinance.app',
    });

    expect(url).toContain('https://brasilfinance.app?');
    expect(url).toContain('imovel=850000');
    expect(url).toContain('cenario=Casa+em+Condom%C3%ADnio');
  });
});

describe('share-url: Parser & Sanitization', () => {
  it('parses valid query string into sanitized FinancingInputs', () => {
    const qs = '?imovel=600000&entrada=120000&taxa=9.8&prazo=360&sistema=PRICE&seguros=0&extraMensal=300&cenario=Meu+Ap';
    const parsed = parseShareUrl(qs);

    expect(parsed).not.toBeNull();
    expect(parsed?.inputs.propertyValue).toBe(600000);
    expect(parsed?.inputs.downPayment).toBe(120000);
    expect(parsed?.inputs.interestRateYearly).toBe(9.8);
    expect(parsed?.inputs.termMonths).toBe(360);
    expect(parsed?.inputs.amortizationMethod).toBe('PRICE');
    expect(parsed?.inputs.includeInsurances).toBe(false);
    expect(parsed?.inputs.extraMonthlyAmortization).toBe(300);
    expect(parsed?.scenarioName).toBe('Meu Ap');
  });

  it('handles alternative alias parameter names (e.g., valor, downPayment, taxaJuros, etc)', () => {
    const qs = '?valor=750000&downPayment=150000&taxaJuros=11.2&meses=240&amortizationMethod=SAC';
    const parsed = parseShareUrl(qs);

    expect(parsed).not.toBeNull();
    expect(parsed?.inputs.propertyValue).toBe(750000);
    expect(parsed?.inputs.downPayment).toBe(150000);
    expect(parsed?.inputs.interestRateYearly).toBe(11.2);
    expect(parsed?.inputs.termMonths).toBe(240);
    expect(parsed?.inputs.amortizationMethod).toBe('SAC');
  });

  it('returns null when no simulation parameters are present or property value is invalid', () => {
    expect(parseShareUrl('')).toBeNull();
    expect(parseShareUrl('?tab=summary&theme=dark')).toBeNull();
    expect(parseShareUrl('?imovel=-50000')).toBeNull();
    expect(parseShareUrl('?imovel=invalido')).toBeNull();
  });
});
