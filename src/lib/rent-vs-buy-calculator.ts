import { FinancingInputs, FinancingResult } from '@/types/financing';
import { calculateFinancing, formatBRL, formatPercent } from './financing-calculator';

export interface RentVsBuyParams {
  /** Taxa de aluguel inicial (% ao mês sobre o valor do imóvel, ex: 0.40 para 0.40% a.m.) */
  initialRentYieldMonthly: number;
  /** Valorização anual estimada do imóvel (% a.a., ex: 6.0 para 6.0% a.a.) */
  propertyAppreciationYearly: number;
  /** Reajuste anual da inflação do aluguel / IPCA (% a.a., ex: 4.5 para 4.5% a.a.) */
  rentInflationYearly: number;
  /** Rentabilidade bruta anual do investimento / CDI / Tesouro (% a.a., ex: 10.5 para 10.5% a.a.) */
  investmentReturnYearly: number;
  /** Alíquota de IR sobre o investimento (% sobre o rendimento, ex: 15.0 para 15% IR longo prazo) */
  investmentTaxRate: number;
  /** Custos iniciais de aquisição: ITBI, cartório e registro (% sobre o imóvel, ex: 4.0 para 4.0%) */
  acquisitionCostsRate: number;
  /** Custo anual de manutenção e reformas do proprietário (% sobre o valor do imóvel, ex: 0.5 para 0.5% a.a.) */
  annualMaintenanceRate: number;
}

export const DEFAULT_RENT_VS_BUY_PARAMS: RentVsBuyParams = {
  initialRentYieldMonthly: 0.40, // 0.40% ao mês
  propertyAppreciationYearly: 6.0, // 6.0% ao ano
  rentInflationYearly: 4.5, // 4.5% ao ano (IPCA)
  investmentReturnYearly: 10.5, // 10.5% ao ano (CDI)
  investmentTaxRate: 15.0, // 15% IR longo prazo
  acquisitionCostsRate: 4.0, // 4% ITBI + Registro
  annualMaintenanceRate: 0.5, // 0.5% a.a. conservação
};

export interface RentVsBuyMonthPoint {
  month: number;
  year: number;
  /** Valor de mercado do imóvel no mês */
  propertyMarketValue: number;
  /** Saldo devedor restante do financiamento */
  loanBalance: number;
  /** Patrimônio líquido do comprador (Imóvel - Dívida) */
  buyerNetWorth: number;
  /** Parcela paga pelo comprador no mês */
  buyerPayment: number;
  /** Aluguel pago pelo inquilino no mês */
  renterRentPayment: number;
  /** Diferença mensal (Desembolso Compra - Aluguel) que o inquilino aporta/resgata */
  monthlyDeltaInvested: number;
  /** Saldo acumulado na carteira de investimentos do inquilino */
  renterPortfolioValue: number;
  /** Patrimônio líquido do inquilino (Carteira de Investimentos) */
  renterNetWorth: number;
}

export interface RentVsBuyMilestone {
  years: number;
  month: number;
  buyerNetWorth: number;
  renterNetWorth: number;
  winner: 'BUY' | 'RENT' | 'TIE';
  difference: number;
  propertyValue: number;
  renterPortfolio: number;
}

export interface RentVsBuyResult {
  params: RentVsBuyParams;
  inputs: FinancingInputs;
  financingResult: FinancingResult;
  /** Custo inicial total do comprador (Entrada + ITBI/Registro) que vira aporte inicial do inquilino */
  initialCapitalInvested: number;
  acquisitionCosts: number;
  /** Série temporal mês a mês */
  timeline: RentVsBuyMonthPoint[];
  /** Marcos temporais (5 anos, 10 anos, 15 anos, Prazo Final) */
  milestones: RentVsBuyMilestone[];
  /** Mês em que o comprador supera o inquilino em patrimônio (ou null se nunca superar) */
  breakEvenMonth: number | null;
  /** Vencedor ao final do contrato */
  finalWinner: 'BUY' | 'RENT' | 'TIE';
  finalBuyerNetWorth: number;
  finalRenterNetWorth: number;
  finalDifference: number;
  /** Resumo em texto com diagnóstico financeiro e comportamental */
  executiveInsight: string;
}

/**
 * Executa a simulação financeira comparativa Comprar Financiado vs. Alugar e Investir a Diferença.
 */
export function calculateRentVsBuy(
  inputs: FinancingInputs,
  customParams: Partial<RentVsBuyParams> = {}
): RentVsBuyResult {
  const params: RentVsBuyParams = {
    ...DEFAULT_RENT_VS_BUY_PARAMS,
    ...customParams,
  };

  const financingResult = calculateFinancing(inputs);
  const totalMonths = financingResult.installments.length;

  const initialPropertyValue = inputs.propertyValue;
  const initialDownPayment = inputs.downPayment;
  const acquisitionCosts = initialPropertyValue * (params.acquisitionCostsRate / 100);
  
  // O inquilino economiza a entrada + custos de ITBI/cartório no D0
  const initialCapitalInvested = initialDownPayment + acquisitionCosts;

  // Taxa mensal de rendimento líquido do investimento
  // CDI líquido anual = R_bruto * (1 - IR)
  const netAnnualReturn = (params.investmentReturnYearly / 100) * (1 - params.investmentTaxRate / 100);
  const netMonthlyReturnRate = Math.pow(1 + netAnnualReturn, 1 / 12) - 1;

  // Taxa mensal de valorização do imóvel
  const monthlyAppreciationRate = Math.pow(1 + params.propertyAppreciationYearly / 100, 1 / 12) - 1;

  // Custo mensal de manutenção do imóvel para o proprietário
  const monthlyMaintenanceRate = (params.annualMaintenanceRate / 100) / 12;

  let currentPortfolio = initialCapitalInvested;
  let currentRent = initialPropertyValue * (params.initialRentYieldMonthly / 100);
  let currentPropertyValue = initialPropertyValue;

  const timeline: RentVsBuyMonthPoint[] = [];
  let breakEvenMonth: number | null = null;

  for (let m = 1; m <= totalMonths; m++) {
    const installment = financingResult.installments[m - 1];
    const loanBalance = installment ? installment.outstandingBalance : 0;
    const loanPayment = installment ? installment.installmentTotal : 0;

    // Atualiza valor de mercado do imóvel no mês
    currentPropertyValue = currentPropertyValue * (1 + monthlyAppreciationRate);

    // Custo de manutenção mensal do proprietário
    const buyerMaintenance = currentPropertyValue * monthlyMaintenanceRate;
    const totalBuyerOutflow = loanPayment + buyerMaintenance;

    // Reajuste anual do aluguel pela inflação no aniversário de cada ano (mês 13, 25, 37...)
    if (m > 1 && (m - 1) % 12 === 0) {
      currentRent = currentRent * (1 + params.rentInflationYearly / 100);
    }

    // Diferença que o inquilino aporta ou resgata
    // Se a compra custa mais que o aluguel, o inquilino investe o excedente.
    // Se o aluguel ficou mais caro que a compra, o inquilino retira da carteira.
    const monthlyDelta = totalBuyerOutflow - currentRent;

    // Rendimento da carteira no mês + aporte/resgate
    currentPortfolio = currentPortfolio * (1 + netMonthlyReturnRate) + monthlyDelta;
    if (currentPortfolio < 0) {
      currentPortfolio = 0;
    }

    const propRounded = Math.round(currentPropertyValue);
    const loanRounded = Math.round(loanBalance);
    const buyerNetWorth = Math.max(0, propRounded - loanRounded);
    const renterNetWorth = Math.round(currentPortfolio);

    // Checa ponto de equilíbrio onde o comprador ultrapassa o inquilino
    if (breakEvenMonth === null && buyerNetWorth > renterNetWorth && m > 1) {
      breakEvenMonth = m;
    }

    timeline.push({
      month: m,
      year: Math.ceil(m / 12),
      propertyMarketValue: propRounded,
      loanBalance: loanRounded,
      buyerNetWorth,
      buyerPayment: Math.round(totalBuyerOutflow),
      renterRentPayment: Math.round(currentRent),
      monthlyDeltaInvested: Math.round(monthlyDelta),
      renterPortfolioValue: Math.round(currentPortfolio),
      renterNetWorth,
    });
  }

  // Extrai Marcos Temporais Relevantes
  const targetYears = [5, 10, 15, Math.ceil(totalMonths / 12)];
  const uniqueYears = Array.from(new Set(targetYears)).filter((y) => y * 12 <= totalMonths || y === Math.ceil(totalMonths / 12));

  const milestones: RentVsBuyMilestone[] = uniqueYears.map((years) => {
    const targetMonth = Math.min(years * 12, totalMonths);
    const point = timeline[targetMonth - 1] || timeline[timeline.length - 1];

    let winner: 'BUY' | 'RENT' | 'TIE' = 'TIE';
    const diff = Math.abs(point.buyerNetWorth - point.renterNetWorth);

    if (point.buyerNetWorth > point.renterNetWorth) {
      winner = 'BUY';
    } else if (point.renterNetWorth > point.buyerNetWorth) {
      winner = 'RENT';
    }

    return {
      years: Math.round(point.month / 12),
      month: point.month,
      buyerNetWorth: point.buyerNetWorth,
      renterNetWorth: point.renterNetWorth,
      winner,
      difference: diff,
      propertyValue: point.propertyMarketValue,
      renterPortfolio: point.renterPortfolioValue,
    };
  });

  const lastPoint = timeline[timeline.length - 1];
  const finalBuyerNetWorth = lastPoint ? lastPoint.buyerNetWorth : 0;
  const finalRenterNetWorth = lastPoint ? lastPoint.renterNetWorth : 0;
  const finalDifference = Math.abs(finalBuyerNetWorth - finalRenterNetWorth);

  let finalWinner: 'BUY' | 'RENT' | 'TIE' = 'TIE';
  if (finalBuyerNetWorth > finalRenterNetWorth) {
    finalWinner = 'BUY';
  } else if (finalRenterNetWorth > finalBuyerNetWorth) {
    finalWinner = 'RENT';
  }

  // Gera o Insight Executivo Inteligente
  const executiveInsight = generateRentVsBuyInsight({
    finalWinner,
    finalBuyerNetWorth,
    finalRenterNetWorth,
    finalDifference,
    breakEvenMonth,
    totalMonths,
    params,
    inputs,
  });

  return {
    params,
    inputs,
    financingResult,
    initialCapitalInvested: Math.round(initialCapitalInvested),
    acquisitionCosts: Math.round(acquisitionCosts),
    timeline,
    milestones,
    breakEvenMonth,
    finalWinner,
    finalBuyerNetWorth,
    finalRenterNetWorth,
    finalDifference,
    executiveInsight,
  };
}

interface InsightGenerationProps {
  finalWinner: 'BUY' | 'RENT' | 'TIE';
  finalBuyerNetWorth: number;
  finalRenterNetWorth: number;
  finalDifference: number;
  breakEvenMonth: number | null;
  totalMonths: number;
  params: RentVsBuyParams;
  inputs: FinancingInputs;
}

function generateRentVsBuyInsight(props: InsightGenerationProps): string {
  const {
    finalWinner,
    finalBuyerNetWorth,
    finalRenterNetWorth,
    finalDifference,
    breakEvenMonth,
    totalMonths,
    params,
    inputs,
  } = props;

  const hasExtraAmortization = (inputs.extraMonthlyAmortization || 0) > 0 || (inputs.extraAnnualAmortization || 0) > 0;
  const totalYears = Math.round(totalMonths / 12);

  if (finalWinner === 'BUY') {
    const breakEvenText = breakEvenMonth
      ? `A partir do ${Math.ceil(breakEvenMonth / 12)}º ano (mês ${breakEvenMonth}), a compra superou a locação`
      : `Ao longo do contrato`;

    return `${breakEvenText} e gerou uma vantagem patrimonial de ${formatBRL(finalDifference)} ao fim de ${totalYears} anos. ` +
      `A valorização do tijolo (${formatPercent(params.propertyAppreciationYearly, 1)} a.a.) somada à quitação integral do bem superou a carteira de CDI (${formatPercent(params.investmentReturnYearly, 1)} a.a.), ` +
      `já que o aluguel sofre reajuste de inflação (${formatPercent(params.rentInflationYearly, 1)} a.a.) enquanto o saldo devedor amortiza a zero.` +
      (hasExtraAmortization ? ' A sua estratégia de amortização acelerada foi determinante para antecipar o ponto de virada.' : '');
  }

  if (finalWinner === 'RENT') {
    return `Morar de aluguel e investir a entrada no CDI líquido (${formatPercent(params.investmentReturnYearly * (1 - params.investmentTaxRate / 100), 2)} a.a.) ` +
      `acumulou ${formatBRL(finalDifference)} a mais em patrimônio líquido ao fim de ${totalYears} anos (${formatBRL(finalRenterNetWorth)} vs ${formatBRL(finalBuyerNetWorth)}). ` +
      `Esse cenário é impulsionado por um custo de locação inicial atrativo (${formatPercent(params.initialRentYieldMonthly, 2)} a.m.) e taxa de juros reais elevadas no mercado financeiro. ` +
      `Atenção: essa estratégia exige disciplina inegociável de reinvestir a diferença mensal todo mês sem falhar.`;
  }

  return `Ambas as estratégias empataram com patrimônio equivalente (${formatBRL(finalBuyerNetWorth)}). A decisão dependerá do seu objetivo de vida: estabilidade e ausência de risco de despejo (comprar) ou liquidez e mobilidade geográfica (alugar).`;
}

/**
 * Cria a mensagem de WhatsApp formatada com a análise Comprar vs. Alugar para envio a um Private Banker.
 */
export function buildWhatsAppRentVsBuyMessage(result: RentVsBuyResult): string {
  const { inputs, params, milestones, finalWinner, finalDifference, finalBuyerNetWorth, finalRenterNetWorth, breakEvenMonth } = result;
  const totalYears = Math.round(result.timeline.length / 12);

  const winnerText = finalWinner === 'BUY'
    ? `🏛️ COMPRA VENCEU (+${formatBRL(finalDifference)} de patrimônio)`
    : finalWinner === 'RENT'
    ? `📈 ALUGAR & INVESTIR VENCEU (+${formatBRL(finalDifference)} de carteira)`
    : '⚖️ EMPATE PATRIMONIAL';

  return `*ESTUDO PATRIMONIAL: COMPRAR VS. ALUGAR*
📍 *Imóvel:* ${formatBRL(inputs.propertyValue)}
💰 *Entrada Disponível:* ${formatBRL(inputs.downPayment)}
⏱️ *Horizonte de Análise:* ${totalYears} anos (${result.timeline.length} meses)

📊 *PREMISSAS DE MERCADO:*
• CDI / Investimentos: ${formatPercent(params.investmentReturnYearly, 1)} a.a.
• Valorização Imóvel: ${formatPercent(params.propertyAppreciationYearly, 1)} a.a.
• Aluguel Inicial: ${formatPercent(params.initialRentYieldMonthly, 2)} a.m. (${formatBRL(inputs.propertyValue * (params.initialRentYieldMonthly / 100))}/mês)
• Reajuste do Aluguel: ${formatPercent(params.rentInflationYearly, 1)} a.a. (IPCA)

🏆 *VEREDITO FINAL:*
${winnerText}
• Patrimônio Comprando (Imóvel Quitado): ${formatBRL(finalBuyerNetWorth)}
• Patrimônio Alugando (Carteira Investida): ${formatBRL(finalRenterNetWorth)}
${breakEvenMonth ? `• Ponto de Virada (Break-even): Mês ${breakEvenMonth} (~${Math.ceil(breakEvenMonth / 12)}º ano)` : ''}

📌 *EVOLUÇÃO NOS MARCOS:*
${milestones.map((m) => `• Em ${m.years} anos: Compra ${formatBRL(m.buyerNetWorth)} vs. Aluguel ${formatBRL(m.renterNetWorth)} (${m.winner === 'BUY' ? 'Compra +' : 'Aluguel +'}${formatBRL(m.difference)})`).join('\n')}

Gostaria de agendar uma consultoria financeira para avaliar este estudo patrimonial e validar as premissas para o meu perfil.`;
}
