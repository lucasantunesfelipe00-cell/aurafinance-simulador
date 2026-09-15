import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  MAX_SAVED_SCENARIOS,
  LOCAL_STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  getSavedScenarios,
  saveScenario,
  deleteScenario,
  updateScenarioName,
  sanitizeFinancingInputs,
  validateAndSanitizeScenario,
  parseAndMigrateStorage,
} from './saved-scenarios';
import { FinancingInputs } from '../types/financing';

const validInputs: FinancingInputs = {
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
};

describe('saved-scenarios: Schema & Sanitization', () => {
  it('sanitizes valid inputs cleanly', () => {
    const result = sanitizeFinancingInputs(validInputs);
    expect(result).not.toBeNull();
    expect(result?.propertyValue).toBe(500000);
    expect(result?.downPayment).toBe(100000);
    expect(result?.category).toBe('property');
  });

  it('rejects completely invalid/null inputs', () => {
    expect(sanitizeFinancingInputs(null)).toBeNull();
    expect(sanitizeFinancingInputs({})).toBeNull();
    expect(sanitizeFinancingInputs({ propertyValue: -1000 })).toBeNull();
    expect(sanitizeFinancingInputs({ propertyValue: 'invalid' })).toBeNull();
  });

  it('sanitizes edge case numbers and applies defaults', () => {
    const result = sanitizeFinancingInputs({
      propertyValue: 300000,
      downPayment: -50, // negative down payment -> 0
      downPaymentPercent: 200, // > 100% -> recalculated
      interestRateYearly: -1, // negative rate -> 10.5 default
      termMonths: 1000, // > 480 -> 360 default
      amortizationMethod: 'OTHER', // invalid -> SAC
      monthlyAdminFee: -10, // negative -> 25 default
    });

    expect(result).not.toBeNull();
    expect(result?.propertyValue).toBe(300000);
    expect(result?.downPayment).toBe(0);
    expect(result?.interestRateYearly).toBe(10.5);
    expect(result?.termMonths).toBe(360);
    expect(result?.amortizationMethod).toBe('SAC');
    expect(result?.monthlyAdminFee).toBe(25);
  });

  it('validates and sanitizes a complete scenario item', () => {
    const scenario = validateAndSanitizeScenario({
      id: 'custom_id_1',
      name: '  Meu Imóvel dos Sonhos  ',
      createdAt: '2026-09-14T12:00:00.000Z',
      inputs: validInputs,
    });

    expect(scenario).not.toBeNull();
    expect(scenario?.id).toBe('custom_id_1');
    expect(scenario?.name).toBe('Meu Imóvel dos Sonhos');
    expect(scenario?.createdAt).toBe('2026-09-14T12:00:00.000Z');
  });
});

describe('saved-scenarios: Storage, Limit of 10 and Migrations', () => {
  let store: Record<string, string> = {};

  beforeEach(() => {
    store = {};
    const localStorageMock = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = String(value);
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
      length: 0,
    };

    Object.defineProperty(global, 'window', {
      value: { localStorage: localStorageMock },
      writable: true,
    });
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    vi.restoreAllMocks();
  });

  it('reads empty list when storage is empty', () => {
    expect(getSavedScenarios()).toEqual([]);
  });

  it('migrates legacy raw array format (v0) seamlessly', () => {
    const legacyArray = [
      {
        id: 'legacy_1',
        name: 'Cenário Legado',
        createdAt: '2026-09-01T00:00:00.000Z',
        inputs: validInputs,
      },
    ];

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(legacyArray));
    const loaded = getSavedScenarios();
    expect(loaded.length).toBe(1);
    expect(loaded[0].name).toBe('Cenário Legado');

    // Check that it was persisted in v1 envelope
    const rawSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
    expect(rawSaved).toContain('"version":1');
  });

  it('migrates from legacy key (aurafinance_saved_scenarios) to brasilfinance_saved_scenarios', () => {
    const legacyData = [
      {
        id: 'old_key_1',
        name: 'Cenário da Chave Antiga',
        createdAt: '2026-09-01T00:00:00.000Z',
        inputs: validInputs,
      },
    ];

    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(legacyData));
    const loaded = getSavedScenarios();

    expect(loaded.length).toBe(1);
    expect(loaded[0].name).toBe('Cenário da Chave Antiga');
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).not.toBeNull();
  });

  it('saves new scenarios and respects MAX_SAVED_SCENARIOS = 10', () => {
    expect(MAX_SAVED_SCENARIOS).toBe(10);

    // Save 10 scenarios
    for (let i = 1; i <= 10; i++) {
      const res = saveScenario(`Cenário ${i}`, {
        ...validInputs,
        propertyValue: 300000 + i * 10000,
      });
      expect(res.success).toBe(true);
      expect(res.scenarios.length).toBe(i);
    }

    // Attempting to save the 11th scenario should fail with friendly error
    const overflowRes = saveScenario('Cenário 11 Excedente', validInputs);
    expect(overflowRes.success).toBe(false);
    expect(overflowRes.error).toContain('Limite de 10 cenários atingido');
    expect(overflowRes.scenarios.length).toBe(10);
  });

  it('deletes and renames scenarios properly', () => {
    saveScenario('Cenário Alfa', { ...validInputs, propertyValue: 400000 });
    saveScenario('Cenário Beta', { ...validInputs, propertyValue: 500000 });

    let list = getSavedScenarios();
    expect(list.length).toBe(2);

    const betaId = list[0].id;
    updateScenarioName(betaId, 'Cenário Beta Renomeado');
    list = getSavedScenarios();
    expect(list[0].name).toBe('Cenário Beta Renomeado');

    deleteScenario(betaId);
    list = getSavedScenarios();
    expect(list.length).toBe(1);
    expect(list[0].name).toBe('Cenário Alfa');
  });

  it('handles localStorage quota exceeded gracefully', () => {
    vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      const err = new Error('Quota exceeded');
      err.name = 'QuotaExceededError';
      throw err;
    });

    const res = saveScenario('Teste Quota', validInputs);
    expect(res.success).toBe(false);
    expect(res.error).toContain('armazenamento do navegador');
  });

  it('blocks saving duplicate / identical scenarios and shows friendly error', () => {
    // 1. Salva o primeiro cenário
    const res1 = saveScenario('Primeira Proposta', validInputs);
    expect(res1.success).toBe(true);
    expect(res1.scenarios.length).toBe(1);

    // 2. Tenta salvar exatamente os mesmos parâmetros (mesmo com outro nome)
    const duplicateRes = saveScenario('Segunda Proposta com Mesmos Valores', validInputs);
    expect(duplicateRes.success).toBe(false);
    expect(duplicateRes.error).toContain('já está salvo no seu histórico');
    expect(duplicateRes.error).toContain('Primeira Proposta');
    expect(duplicateRes.scenarios.length).toBe(1);

    // 3. Salva um cenário com parâmetros ligeiramente diferentes (ex: entrada diferente) -> deve permitir
    const diffRes = saveScenario('Proposta com Entrada Maior', {
      ...validInputs,
      downPayment: 150000,
      downPaymentPercent: 30,
    });
    expect(diffRes.success).toBe(true);
    expect(diffRes.scenarios.length).toBe(2);
  });
});
