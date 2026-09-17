import { describe, it, expect } from 'vitest';
import { generateExecutiveDossierPdf } from './dossier-pdf';
import { calculateFinancing } from './financing-calculator';
import { FinancingInputs } from '@/types/financing';

describe('dossier-pdf: Executive Dossier PDF Generation', () => {
  const sampleInputs: FinancingInputs = {
    category: 'property',
    propertyValue: 500000,
    downPayment: 100000,
    downPaymentPercent: 20,
    interestRateYearly: 10.5,
    termMonths: 360,
    amortizationMethod: 'SAC',
    includeInsurances: true,
    monthlyAdminFee: 25,
    mipRateYearly: 0.021,
    dfiRateYearly: 0.008,
    extraMonthlyAmortization: 500,
    extraAnnualAmortization: 5000,
  };

  it('generates a valid 2-page PDF document for SAC simulation with amortizations', async () => {
    const result = calculateFinancing(sampleInputs);
    const doc = await generateExecutiveDossierPdf({
      inputs: sampleInputs,
      result,
      scenarioName: 'Apartamento Jardins',
      bankName: 'Caixa Econômica Federal',
    });

    expect(doc).toBeDefined();
    // jsPDF uses internal getNumberOfPages() or getPageInfo()
    expect(doc.getNumberOfPages()).toBe(2);
  });

  it('generates a valid 2-page PDF document for PRICE simulation without amortizations', async () => {
    const priceInputs: FinancingInputs = {
      ...sampleInputs,
      amortizationMethod: 'PRICE',
      extraMonthlyAmortization: 0,
      extraAnnualAmortization: 0,
    };
    const result = calculateFinancing(priceInputs);
    const doc = await generateExecutiveDossierPdf({
      inputs: priceInputs,
      result,
    });

    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBe(2);
  });

  it('handles edge case numbers without crashing', async () => {
    const edgeInputs: FinancingInputs = {
      ...sampleInputs,
      propertyValue: 10000000,
      downPayment: 9000000,
      downPaymentPercent: 90,
      termMonths: 12,
    };
    const result = calculateFinancing(edgeInputs);
    const doc = await generateExecutiveDossierPdf({
      inputs: edgeInputs,
      result,
    });

    expect(doc).toBeDefined();
    expect(doc.getNumberOfPages()).toBe(2);
  });
});
