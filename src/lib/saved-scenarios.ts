import { FinancingInputs } from '../types/financing';
import { formatBRL } from './financing-calculator';

export const MAX_SAVED_SCENARIOS = 10;
export const CURRENT_STORAGE_VERSION = 1;

export const LOCAL_STORAGE_KEY = 'brasilfinance_saved_scenarios';
export const LEGACY_STORAGE_KEY = 'aurafinance_saved_scenarios';

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: string; // ISO date string
  inputs: FinancingInputs;
}

export interface SavedScenariosEnvelope {
  version: number;
  updatedAt: string;
  scenarios: SavedScenario[];
}

export interface SaveScenarioResult {
  success: boolean;
  error?: string;
  scenarios: SavedScenario[];
}

/**
 * Valida e sanitiza os parâmetros de financiamento de um cenário.
 * Retorna null se os dados forem irrecuperáveis.
 */
export function sanitizeFinancingInputs(raw: unknown): FinancingInputs | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const propertyValue = Number(obj.propertyValue);
  if (!Number.isFinite(propertyValue) || propertyValue <= 0) return null;

  let downPayment = Number(obj.downPayment);
  if (!Number.isFinite(downPayment) || downPayment < 0) downPayment = 0;
  if (downPayment >= propertyValue) downPayment = propertyValue * 0.2;

  let downPaymentPercent = Number(obj.downPaymentPercent);
  if (!Number.isFinite(downPaymentPercent) || downPaymentPercent < 0 || downPaymentPercent >= 100) {
    downPaymentPercent = (downPayment / propertyValue) * 100;
  }

  let interestRateYearly = Number(obj.interestRateYearly);
  if (!Number.isFinite(interestRateYearly) || interestRateYearly < 0) {
    interestRateYearly = 10.5;
  }

  let termMonths = Math.round(Number(obj.termMonths));
  if (!Number.isFinite(termMonths) || termMonths <= 0 || termMonths > 480) {
    termMonths = 360;
  }

  const amortizationMethod = obj.amortizationMethod === 'PRICE' ? 'PRICE' : 'SAC';
  const includeInsurances = Boolean(obj.includeInsurances !== false);

  let monthlyAdminFee = Number(obj.monthlyAdminFee);
  if (!Number.isFinite(monthlyAdminFee) || monthlyAdminFee < 0) {
    monthlyAdminFee = 25;
  }

  let mipRateYearly = Number(obj.mipRateYearly);
  if (!Number.isFinite(mipRateYearly) || mipRateYearly < 0) {
    mipRateYearly = 0.021;
  }

  let dfiRateYearly = Number(obj.dfiRateYearly);
  if (!Number.isFinite(dfiRateYearly) || dfiRateYearly < 0) {
    dfiRateYearly = 0.008;
  }

  const extraMonthlyAmortization = Number(obj.extraMonthlyAmortization);
  const extraAnnualAmortization = Number(obj.extraAnnualAmortization);

  return {
    category: 'property',
    propertyValue,
    downPayment,
    downPaymentPercent,
    interestRateYearly,
    termMonths,
    amortizationMethod,
    includeInsurances,
    monthlyAdminFee,
    mipRateYearly,
    dfiRateYearly,
    ...(Number.isFinite(extraMonthlyAmortization) && extraMonthlyAmortization > 0
      ? { extraMonthlyAmortization }
      : {}),
    ...(Number.isFinite(extraAnnualAmortization) && extraAnnualAmortization > 0
      ? { extraAnnualAmortization }
      : {}),
  };
}

/**
 * Valida a estrutura completa de um cenário individual.
 */
export function validateAndSanitizeScenario(raw: unknown): SavedScenario | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  const id = typeof obj.id === 'string' && obj.id.trim()
    ? obj.id.trim()
    : `scenario_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const name = typeof obj.name === 'string' && obj.name.trim()
    ? obj.name.trim()
    : 'Cenário Imobiliário';

  let createdAt = typeof obj.createdAt === 'string' ? obj.createdAt : new Date().toISOString();
  if (isNaN(Date.parse(createdAt))) {
    createdAt = new Date().toISOString();
  }

  const sanitizedInputs = sanitizeFinancingInputs(obj.inputs);
  if (!sanitizedInputs) return null;

  return {
    id,
    name,
    createdAt,
    inputs: sanitizedInputs,
  };
}

/**
 * Converte string crua do storage para lista validada com migração de schema.
 */
export function parseAndMigrateStorage(rawData: string): SavedScenario[] {
  try {
    const parsed = JSON.parse(rawData);
    let rawList: unknown[] = [];

    if (Array.isArray(parsed)) {
      // Formato v0 legado (array direto)
      rawList = parsed;
    } else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as Record<string, unknown>).scenarios)) {
      // Formato versionado v1+
      rawList = (parsed as Record<string, unknown>).scenarios as unknown[];
    } else {
      return [];
    }

    const validList: SavedScenario[] = [];
    for (const item of rawList) {
      const sanitized = validateAndSanitizeScenario(item);
      if (sanitized) {
        validList.push(sanitized);
      }
      if (validList.length >= MAX_SAVED_SCENARIOS) break;
    }

    return validList;
  } catch {
    return [];
  }
}

/**
 * Persiste a lista envelopada no localStorage com captura de erros de quota.
 */
function persistEnvelope(scenarios: SavedScenario[]): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Ambiente sem window.' };

  const envelope: SavedScenariosEnvelope = {
    version: CURRENT_STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
    scenarios: scenarios.slice(0, MAX_SAVED_SCENARIOS),
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(envelope));
    return { success: true };
  } catch (err: unknown) {
    console.error('Erro ao gravar cenários no localStorage:', err);
    const errorObj = err as { name?: string; code?: number; number?: number };
    const isQuota =
      errorObj?.name === 'QuotaExceededError' ||
      errorObj?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      errorObj?.code === 22 ||
      errorObj?.code === 1014 ||
      errorObj?.number === -2147024882;

    return {
      success: false,
      error: isQuota
        ? 'Limite de armazenamento do navegador excedido. Exclua cenários antigos para liberar espaço.'
        : 'Não foi possível salvar o cenário no armazenamento do navegador.',
    };
  }
}

/**
 * Recupera a lista de cenários salvos no localStorage com validação, limite e migração.
 */
export function getSavedScenarios(): SavedScenario[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    // Migração automática de chave legada se existir
    if (!data) {
      const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyData) {
        const migratedList = parseAndMigrateStorage(legacyData);
        persistEnvelope(migratedList);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        return migratedList;
      }
      return [];
    }

    const scenarios = parseAndMigrateStorage(data);

    // Se estava em formato antigo de array cru, re-salva no envelope v1
    if (data.trim().startsWith('[')) {
      persistEnvelope(scenarios);
    }

    return scenarios;
  } catch (error) {
    console.error('Erro ao ler cenários salvos do localStorage:', error);
    return [];
  }
}

/**
 * Salva um novo cenário no localStorage e retorna o resultado estruturado.
 */
export function saveScenario(name: string, inputs: FinancingInputs): SaveScenarioResult {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Ambiente não suporta localStorage.', scenarios: [] };
  }

  const current = getSavedScenarios();

  if (current.length >= MAX_SAVED_SCENARIOS) {
    return {
      success: false,
      error: `Limite de ${MAX_SAVED_SCENARIOS} cenários atingido (${current.length}/${MAX_SAVED_SCENARIOS}). Exclua um cenário antigo para salvar um novo.`,
      scenarios: current,
    };
  }

  const sanitizedInputs = sanitizeFinancingInputs(inputs);
  if (!sanitizedInputs) {
    return {
      success: false,
      error: 'Parâmetros de simulação inválidos.',
      scenarios: current,
    };
  }

  const newScenario: SavedScenario = {
    id: `scenario_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim() || generateDefaultName(sanitizedInputs, current.length),
    createdAt: new Date().toISOString(),
    inputs: sanitizedInputs,
  };

  const updated = [newScenario, ...current].slice(0, MAX_SAVED_SCENARIOS);
  const persistRes = persistEnvelope(updated);

  if (!persistRes.success) {
    return {
      success: false,
      error: persistRes.error,
      scenarios: current,
    };
  }

  return {
    success: true,
    scenarios: updated,
  };
}

/**
 * Remove um cenário pelo ID e retorna a lista atualizada.
 */
export function deleteScenario(id: string): SavedScenario[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedScenarios();
    const updated = current.filter((s) => s.id !== id);
    persistEnvelope(updated);
    return updated;
  } catch (error) {
    console.error('Erro ao excluir cenário do localStorage:', error);
    return getSavedScenarios();
  }
}

/**
 * Renomeia um cenário existente.
 */
export function updateScenarioName(id: string, newName: string): SavedScenario[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedScenarios();
    const updated = current.map((s) => {
      if (s.id === id) {
        return { ...s, name: newName.trim() || s.name };
      }
      return s;
    });
    persistEnvelope(updated);
    return updated;
  } catch (error) {
    console.error('Erro ao atualizar nome do cenário:', error);
    return getSavedScenarios();
  }
}

/**
 * Gera um nome padrão sugestivo para o cenário.
 * Ex: "Cenário A: Imóvel (R$ 1,2M)" ou "Cenário B: Imóvel (R$ 800 mil)"
 */
export function generateDefaultName(inputs: FinancingInputs, existingCount: number): string {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const letter = letters[existingCount % letters.length] || `Nº ${existingCount + 1}`;
  
  const val = inputs.propertyValue;
  let formattedVal = '';
  if (val >= 1_000_000) {
    const inMillions = val / 1_000_000;
    formattedVal = `R$ ${inMillions.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M`;
  } else if (val >= 1_000) {
    const inThousands = val / 1_000;
    formattedVal = `R$ ${inThousands.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}k`;
  } else {
    formattedVal = formatBRL(val);
  }

  return `Cenário ${letter}: Imóvel (${formattedVal})`;
}
