import { describe, it, expect } from 'vitest';
import {
  calculateMinimumRequiredIncome,
  assessIncomeCommitment,
  buildWhatsAppIncomeMessage,
} from './income-assessment';

describe('income-assessment engine', () => {
  it('calculates minimum required income using standard 30% rule', () => {
    // 1st installment = 4,350 -> 4350 / 0.30 = 14,500
    const income = calculateMinimumRequiredIncome(4350);
    expect(income).toBe(14500);

    // 1st installment = 6,000 -> 6000 / 0.30 = 20,000
    expect(calculateMinimumRequiredIncome(6000)).toBe(20000);
  });

  it('handles zero or negative installments gracefully', () => {
    expect(calculateMinimumRequiredIncome(0)).toBe(0);
    expect(calculateMinimumRequiredIncome(-500)).toBe(0);
  });

  it('correctly assesses status when user income is provided', () => {
    const firstInstallment = 4350; // Required: 14,500

    // User has 16,000 (Commitment: ~27.2%) -> APPROVED
    const resultApproved = assessIncomeCommitment(firstInstallment, 16000);
    expect(resultApproved.status).toBe('APPROVED');
    expect(resultApproved.commitmentPercent).toBe(27.2);
    expect(resultApproved.incomeGap).toBe(0);

    // User has 13,000 (Commitment: ~33.5%) -> ATTENTION
    const resultAttention = assessIncomeCommitment(firstInstallment, 13000);
    expect(resultAttention.status).toBe('ATTENTION');
    expect(resultAttention.incomeGap).toBe(1500); // 14500 - 13000

    // User has 8,000 (Commitment: ~54.4%) -> NEED_CO_BORROWER
    const resultCoBorrower = assessIncomeCommitment(firstInstallment, 8000);
    expect(resultCoBorrower.status).toBe('NEED_CO_BORROWER');
    expect(resultCoBorrower.incomeGap).toBe(6500); // 14500 - 8000
  });

  it('combines primary income and co-borrower income properly', () => {
    const firstInstallment = 4350; // Required: 14,500
    // Primary: 8,000 + Co-borrower (spouse): 7,000 = 15,000 (Commitment: 29.0%) -> APPROVED
    const combined = assessIncomeCommitment(firstInstallment, 8000, 7000);
    expect(combined.totalFamilyIncome).toBe(15000);
    expect(combined.status).toBe('APPROVED');
    expect(combined.commitmentPercent).toBe(29.0);
    expect(combined.incomeGap).toBe(0);
  });

  it('builds a formatted WhatsApp message for credit approval', () => {
    const assessment = assessIncomeCommitment(4350, 15000);
    const message = buildWhatsAppIncomeMessage(assessment, 1000000);

    expect(message).toContain('*ANÁLISE DE RENDA & ELEGIBILIDADE DE CRÉDITO*');
    expect(message).toContain('R$ 4.350,00');
    expect(message).toContain('R$ 14.500,00');
    expect(message).toContain('R$ 15.000,00');
    expect(message).toContain('✅ APROVAÇÃO ELEGÍVEL');
  });
});
