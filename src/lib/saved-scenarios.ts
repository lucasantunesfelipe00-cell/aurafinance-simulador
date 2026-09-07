import { FinancingInputs } from '@/types/financing';
import { formatBRL } from '@/lib/financing-calculator';

export interface SavedScenario {
  id: string;
  name: string;
  createdAt: string; // ISO date string
  inputs: FinancingInputs;
}

const LOCAL_STORAGE_KEY = 'aurafinance_saved_scenarios';

/**
 * Recupera a lista de cenários salvos no localStorage.
 */
export function getSavedScenarios(): SavedScenario[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Erro ao ler cenários salvos do localStorage:', error);
    return [];
  }
}

/**
 * Salva um novo cenário no localStorage e retorna a lista atualizada.
 */
export function saveScenario(name: string, inputs: FinancingInputs): SavedScenario[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedScenarios();
    const newScenario: SavedScenario = {
      id: `scenario_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: name.trim() || generateDefaultName(inputs, current.length),
      createdAt: new Date().toISOString(),
      inputs: { ...inputs },
    };
    const updated = [newScenario, ...current];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Erro ao salvar cenário no localStorage:', error);
    return getSavedScenarios();
  }
}

/**
 * Remove um cenário pelo ID e retorna a lista atualizada.
 */
export function deleteScenario(id: string): SavedScenario[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getSavedScenarios();
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
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
