import { formatBRL, formatPercent } from './financing-calculator';

export interface AcquisitionCostsParams {
  /** Valor venal ou de compra do imóvel */
  propertyValue: number;
  /** Alíquota do ITBI em % (ex: 3.0 para 3.0%) */
  itbiRate: number;
  /** Alíquota das custas de registro no cartório (RGI) em % (ex: 1.2 para 1.2%) */
  registrationRate: number;
  /** Taxa de avaliação técnica / engenharia do banco em R$ (ex: 3400) */
  bankAppraisalFee: number;
  /** Custos com certidões e despachante em R$ (ex: 900) */
  certificatesFee: number;
  /** Beneficiário da Lei 6.015/73 Art. 290 (1º imóvel financiado pelo SFH -> 50% de desconto no cartório) */
  isFirstPropertySFH: boolean;
  /** Se o comprador deseja simular a inclusão dos custos de documentação no financiamento bancário */
  includeInFinancing: boolean;
}

export interface AcquisitionCostsResult {
  /** Valor do imóvel base */
  propertyValue: number;
  /** Valor do ITBI (Prefeitura) */
  itbiAmount: number;
  /** Alíquota efetiva do ITBI */
  itbiRate: number;
  /** Valor base do Registro de Imóveis antes de descontos */
  registrationBaseAmount: number;
  /** Desconto legal obtido (Lei 6.015/73 Art. 290) */
  registrationDiscountAmount: number;
  /** Valor final do Registro de Imóveis após desconto */
  registrationFinalAmount: number;
  /** Taxa de avaliação e engenharia do banco */
  bankAppraisalFee: number;
  /** Certidões e despachante */
  certificatesFee: number;
  /** Custo total de documentação e transferência */
  totalCosts: number;
  /** Percentual total dos custos em relação ao imóvel */
  totalCostsPercent: number;
  /** Desembolso à vista necessário se NÃO financiar a documentação */
  cashRequiredAtClosing: number;
  /** Limite máximo estimado que o banco permite financiar de despesas (até 5% do imóvel) */
  maxFinanciableDocumentation: number;
  /** Economia obtida caso tenha desconto da 1ª aquisição */
  hasFirstPropertyDiscount: boolean;
}

export const DEFAULT_ACQUISITION_PARAMS: AcquisitionCostsParams = {
  propertyValue: 800000,
  itbiRate: 3.0,
  registrationRate: 1.2,
  bankAppraisalFee: 3400,
  certificatesFee: 900,
  isFirstPropertySFH: false,
  includeInFinancing: false,
};

export const COMMON_CITY_ITBI_RATES: { name: string; rate: number; state: string }[] = [
  { name: 'São Paulo', rate: 3.0, state: 'SP' },
  { name: 'Rio de Janeiro', rate: 3.0, state: 'RJ' },
  { name: 'Belo Horizonte', rate: 3.0, state: 'MG' },
  { name: 'Curitiba', rate: 2.7, state: 'PR' },
  { name: 'Brasília', rate: 3.0, state: 'DF' },
  { name: 'Porto Alegre', rate: 3.0, state: 'RS' },
  { name: 'Salvador', rate: 3.0, state: 'BA' },
  { name: 'Florianópolis', rate: 2.0, state: 'SC' },
  { name: 'Goiânia', rate: 2.5, state: 'GO' },
  { name: 'Campinas', rate: 2.7, state: 'SP' },
];

/**
 * Calcula todos os custos de transferência, impostos, cartório e avaliação bancária.
 */
export function calculateAcquisitionCosts(
  params: Partial<AcquisitionCostsParams> = {}
): AcquisitionCostsResult {
  const propertyValue = Math.max(0, Number(params.propertyValue) || 0);
  const itbiRate = Math.max(0, Math.min(10, Number(params.itbiRate ?? DEFAULT_ACQUISITION_PARAMS.itbiRate)));
  const registrationRate = Math.max(0, Math.min(5, Number(params.registrationRate ?? DEFAULT_ACQUISITION_PARAMS.registrationRate)));
  const bankAppraisalFee = Math.max(0, Number(params.bankAppraisalFee ?? DEFAULT_ACQUISITION_PARAMS.bankAppraisalFee));
  const certificatesFee = Math.max(0, Number(params.certificatesFee ?? DEFAULT_ACQUISITION_PARAMS.certificatesFee));
  const isFirstPropertySFH = Boolean(params.isFirstPropertySFH);

  // 1. ITBI Municipal
  const itbiAmount = Math.round(propertyValue * (itbiRate / 100));

  // 2. Registro de Imóveis (Cartório RGI)
  const registrationBaseAmount = Math.round(propertyValue * (registrationRate / 100));
  const registrationDiscountAmount = isFirstPropertySFH ? Math.round(registrationBaseAmount * 0.5) : 0;
  const registrationFinalAmount = registrationBaseAmount - registrationDiscountAmount;

  // 3. Custo Total de Aquisição
  const totalCosts = itbiAmount + registrationFinalAmount + bankAppraisalFee + certificatesFee;
  const totalCostsPercent = propertyValue > 0 ? (totalCosts / propertyValue) * 100 : 0;

  // 4. Limite Financiável pelo Banco (geralmente até 5% do valor do imóvel)
  const maxFinanciableDocumentation = Math.round(propertyValue * 0.05);

  const cashRequiredAtClosing = totalCosts;

  return {
    propertyValue,
    itbiAmount,
    itbiRate,
    registrationBaseAmount,
    registrationDiscountAmount,
    registrationFinalAmount,
    bankAppraisalFee,
    certificatesFee,
    totalCosts,
    totalCostsPercent,
    cashRequiredAtClosing,
    maxFinanciableDocumentation,
    hasFirstPropertyDiscount: isFirstPropertySFH && registrationDiscountAmount > 0,
  };
}

/**
 * Gera mensagem formatada para WhatsApp com a assessoria completa de custos de transferência.
 */
export function buildWhatsAppAcquisitionCostsMessage(
  result: AcquisitionCostsResult,
  isFirstPropertySFH: boolean
): string {
  const lines: string[] = [];

  lines.push('🏛️ *ESTIMATIVA DE CUSTOS DE ESCRITURA & CARTÓRIO (ITBI)*');
  lines.push('----------------------------------------');
  lines.push(`🏠 *Valor do Imóvel:* ${formatBRL(result.propertyValue)}`);
  lines.push('');
  lines.push('📋 *Detalhamento das Despesas de Aquisição:*');
  lines.push(`• *ITBI (${formatPercent(result.itbiRate, 1)}):* ${formatBRL(result.itbiAmount)} (Pago à Prefeitura)`);
  
  if (isFirstPropertySFH && result.registrationDiscountAmount > 0) {
    lines.push(`• *Registro de Imóveis:* ~${formatBRL(result.registrationFinalAmount)} _(com 50% de desconto legal da Lei 6.015/73 - economia de ${formatBRL(result.registrationDiscountAmount)})_`);
  } else {
    lines.push(`• *Registro de Imóveis (Cartório):* ~${formatBRL(result.registrationFinalAmount)}`);
  }

  lines.push(`• *Taxa de Engenharia/Avaliação do Banco:* ${formatBRL(result.bankAppraisalFee)}`);
  lines.push(`• *Certidões & Despachante:* ${formatBRL(result.certificatesFee)}`);
  lines.push('----------------------------------------');
  lines.push(`💰 *TOTAL NECESSÁRIO EM CAIXA:* *${formatBRL(result.totalCosts)}* (~${formatPercent(result.totalCostsPercent, 1)} do valor)`);
  lines.push('');
  
  if (isFirstPropertySFH) {
    lines.push('✨ *Benefício Aplicado:* Desconto de 50% nas custas de registro concedido pelo Art. 290 da Lei Federal nº 6.015/1973.');
    lines.push('');
  }

  lines.push('💡 *Dica do Especialista:* A maioria dos bancos permite financiar até 5% das despesas de documentação junto com o saldo devedor, caso o limite de crédito (LTV) permita.');
  lines.push('');
  lines.push('_Simulação gerada por Brasil Finance • Simulador de Crédito Imobiliário_');

  return lines.join('\n');
}
