import { describe, it, expect } from 'vitest';
import {
  calculateAcquisitionCosts,
  buildWhatsAppAcquisitionCostsMessage,
  DEFAULT_ACQUISITION_PARAMS,
} from './acquisition-costs';

describe('acquisition-costs calculator', () => {
  it('calculates standard acquisition costs for a R$ 800.000 property', () => {
    const result = calculateAcquisitionCosts({
      propertyValue: 800000,
      itbiRate: 3.0,
      registrationRate: 1.2,
      bankAppraisalFee: 3400,
      certificatesFee: 900,
      isFirstPropertySFH: false,
    });

    expect(result.propertyValue).toBe(800000);
    // ITBI = 3% of 800k = 24.000
    expect(result.itbiAmount).toBe(24000);
    // Registration = 1.2% of 800k = 9.600
    expect(result.registrationBaseAmount).toBe(9600);
    expect(result.registrationDiscountAmount).toBe(0);
    expect(result.registrationFinalAmount).toBe(9600);
    expect(result.bankAppraisalFee).toBe(3400);
    expect(result.certificatesFee).toBe(900);
    // Total = 24000 + 9600 + 3400 + 900 = 37.900
    expect(result.totalCosts).toBe(37900);
    expect(result.hasFirstPropertyDiscount).toBe(false);
  });

  it('applies 50% legal discount on cartório registration for 1st property SFH (Lei 6.015/73)', () => {
    const result = calculateAcquisitionCosts({
      propertyValue: 800000,
      itbiRate: 3.0,
      registrationRate: 1.2,
      bankAppraisalFee: 3400,
      certificatesFee: 900,
      isFirstPropertySFH: true,
    });

    expect(result.registrationBaseAmount).toBe(9600);
    expect(result.registrationDiscountAmount).toBe(4800);
    expect(result.registrationFinalAmount).toBe(4800);
    // Total = 24000 + 4800 + 3400 + 900 = 33.100 (economia de 4.800)
    expect(result.totalCosts).toBe(33100);
    expect(result.hasFirstPropertyDiscount).toBe(true);
  });

  it('handles zero or invalid values gracefully', () => {
    const result = calculateAcquisitionCosts({
      propertyValue: 0,
    });

    expect(result.propertyValue).toBe(0);
    expect(result.itbiAmount).toBe(0);
    expect(result.totalCosts).toBe(result.bankAppraisalFee + result.certificatesFee);
  });

  it('generates a well-formatted WhatsApp advisory message', () => {
    const result = calculateAcquisitionCosts({
      propertyValue: 1000000,
      itbiRate: 3.0,
      isFirstPropertySFH: true,
    });

    const msg = buildWhatsAppAcquisitionCostsMessage(result, true);
    expect(msg).toContain('ESTIMATIVA DE CUSTOS DE ESCRITURA & CARTÓRIO (ITBI)');
    expect(msg).toContain('1.000.000,00');
    expect(msg).toContain('Lei 6.015/73');
    expect(msg).toContain('Dica do Especialista');
  });
});
