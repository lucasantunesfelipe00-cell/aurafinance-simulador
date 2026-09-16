import { formatBRL, formatPercent } from './financing-calculator';

export type IncomeStatus = 'APPROVED' | 'ATTENTION' | 'NEED_CO_BORROWER';

export interface IncomeAssessmentResult {
  /** Valor da 1ª parcela do financiamento */
  firstInstallment: number;
  /** Renda bruta mensal mínima recomendada pelos bancos (regra dos 30%) */
  minimumRequiredIncome: number;
  /** Renda bruta informada pelo usuário (Proponente 1) */
  primaryIncome: number;
  /** Renda bruta do 2º proponente (Cônjuge / Pai / Sócio) */
  coBorrowerIncome: number;
  /** Renda familiar total combinada */
  totalFamilyIncome: number;
  /** Percentual da renda comprometido com a parcela (0% a 100%+) */
  commitmentPercent: number;
  /** Status da probabilidade de aprovação */
  status: IncomeStatus;
  /** Diferença em R$ que falta para atingir os 30% recomendados (ou 0 se já suficiente) */
  incomeGap: number;
  /** Parcela máxima permitida para a renda informada (30% da renda) */
  maxAllowedInstallment: number;
  /** Mensagem executiva de diagnóstico */
  diagnosticMessage: string;
}

export const DEFAULT_MAX_COMMITMENT_RATE = 0.30; // 30% de comprometimento máximo

/**
 * Calcula a renda bruta familiar mínima necessária para aprovar a parcela do financiamento.
 */
export function calculateMinimumRequiredIncome(
  firstInstallment: number,
  maxCommitmentRate: number = DEFAULT_MAX_COMMITMENT_RATE
): number {
  if (!Number.isFinite(firstInstallment) || firstInstallment <= 0) return 0;
  const rate = maxCommitmentRate > 0 && maxCommitmentRate <= 1 ? maxCommitmentRate : DEFAULT_MAX_COMMITMENT_RATE;
  return Math.ceil(firstInstallment / rate);
}

/**
 * Avalia o comprometimento de renda e a probabilidade de aprovação de crédito bancário.
 */
export function assessIncomeCommitment(
  firstInstallment: number,
  primaryIncome: number = 0,
  coBorrowerIncome: number = 0,
  maxCommitmentRate: number = DEFAULT_MAX_COMMITMENT_RATE
): IncomeAssessmentResult {
  const safeInstallment = Math.max(0, Number(firstInstallment) || 0);
  const safePrimary = Math.max(0, Number(primaryIncome) || 0);
  const safeCoBorrower = Math.max(0, Number(coBorrowerIncome) || 0);
  const totalFamilyIncome = safePrimary + safeCoBorrower;

  const minimumRequiredIncome = calculateMinimumRequiredIncome(safeInstallment, maxCommitmentRate);
  const maxAllowedInstallment = Math.round(totalFamilyIncome * maxCommitmentRate);

  let commitmentPercent = 0;
  if (totalFamilyIncome > 0) {
    commitmentPercent = (safeInstallment / totalFamilyIncome) * 100;
  }

  let status: IncomeStatus = 'APPROVED';
  let incomeGap = 0;

  if (totalFamilyIncome === 0) {
    status = 'APPROVED';
    incomeGap = minimumRequiredIncome;
  } else if (commitmentPercent <= maxCommitmentRate * 100) {
    status = 'APPROVED';
    incomeGap = 0;
  } else if (commitmentPercent <= 35.0) {
    status = 'ATTENTION';
    incomeGap = Math.max(0, minimumRequiredIncome - totalFamilyIncome);
  } else {
    status = 'NEED_CO_BORROWER';
    incomeGap = Math.max(0, minimumRequiredIncome - totalFamilyIncome);
  }

  const diagnosticMessage = generateDiagnosticMessage({
    status,
    totalFamilyIncome,
    commitmentPercent,
    incomeGap,
    minimumRequiredIncome,
    safeInstallment,
  });

  return {
    firstInstallment: safeInstallment,
    minimumRequiredIncome,
    primaryIncome: safePrimary,
    coBorrowerIncome: safeCoBorrower,
    totalFamilyIncome,
    commitmentPercent: Number(commitmentPercent.toFixed(1)),
    status,
    incomeGap: Math.round(incomeGap),
    maxAllowedInstallment,
    diagnosticMessage,
  };
}

interface DiagnosticProps {
  status: IncomeStatus;
  totalFamilyIncome: number;
  commitmentPercent: number;
  incomeGap: number;
  minimumRequiredIncome: number;
  safeInstallment: number;
}

function generateDiagnosticMessage(props: DiagnosticProps): string {
  const { status, totalFamilyIncome, commitmentPercent, incomeGap, minimumRequiredIncome, safeInstallment } = props;

  if (totalFamilyIncome === 0) {
    return `Para aprovar esta 1ª parcela de ${formatBRL(safeInstallment)}, os bancos exigem uma renda bruta familiar mínima de ${formatBRL(minimumRequiredIncome)} (regra dos 30%).`;
  }

  if (status === 'APPROVED') {
    return `Crédito com alta probabilidade de aprovação! A parcela compromete apenas ${formatPercent(commitmentPercent, 1)} da sua renda (dentro do teto seguro de 30%).`;
  }

  if (status === 'ATTENTION') {
    return `A parcela compromete ${formatPercent(commitmentPercent, 1)} da renda. Está próxima do limite bancário. Uma composição de ${formatBRL(incomeGap)} adicionais garante aprovação imediata com as melhores taxas.`;
  }

  return `A parcela compromete ${formatPercent(commitmentPercent, 1)} da renda informada (acima dos 30% permitidos). Adicione um segundo proponente somando ${formatBRL(incomeGap)} para destravar o financiamento.`;
}

/**
 * Cria a mensagem de WhatsApp formatada com a análise de renda e crédito bancário.
 */
export function buildWhatsAppIncomeMessage(
  assessment: IncomeAssessmentResult,
  propertyValue?: number
): string {
  const { firstInstallment, minimumRequiredIncome, totalFamilyIncome, commitmentPercent, status, incomeGap } = assessment;

  const statusText = status === 'APPROVED'
    ? '✅ APROVAÇÃO ELEGÍVEL (Comprometimento Seguro)'
    : status === 'ATTENTION'
    ? '⚠️ COMPROMETIMENTO NO LIMITE (Requer Atenção)'
    : '💡 NECESSÁRIA COMPOSIÇÃO DE RENDA';

  return `*ANÁLISE DE RENDA & ELEGIBILIDADE DE CRÉDITO*
${propertyValue ? `📍 *Imóvel Simulado:* ${formatBRL(propertyValue)}\n` : ''}💰 *1ª Parcela Calculada:* ${formatBRL(firstInstallment)}
📊 *Renda Mínima Exigida (Regra dos 30%):* ${formatBRL(minimumRequiredIncome)}

👤 *MINHA RENDA FAMILIAR:*
• Renda Declarada: ${totalFamilyIncome > 0 ? formatBRL(totalFamilyIncome) : 'A informar'}
${totalFamilyIncome > 0 ? `• Comprometimento da Parcela: ${formatPercent(commitmentPercent, 1)}` : ''}
${incomeGap > 0 && totalFamilyIncome > 0 ? `• Complemento Necessário: ${formatBRL(incomeGap)}` : ''}

🏛️ *STATUS ESTIMADO:*
${statusText}

Gostaria de verificar com os bancos parceiros a aprovação oficial de crédito para esta simulação.`;
}
