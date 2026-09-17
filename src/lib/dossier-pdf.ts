import { jsPDF } from 'jspdf';
import { FinancingResult, FinancingInputs, ComparisonResult } from '@/types/financing';
import { calculateAcquisitionCosts } from './acquisition-costs';
import { assessIncomeCommitment } from './income-assessment';
import { calculateFinancing, formatPercent } from './financing-calculator';

export interface DossierPdfOptions {
  inputs: FinancingInputs;
  result: FinancingResult;
  comparison?: ComparisonResult;
  scenarioName?: string;
  bankName?: string;
}

const formatBRL = (val: number): string => {
  if (isNaN(val) || !isFinite(val)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export async function generateExecutiveDossierPdf({
  inputs,
  result,
  comparison,
  scenarioName,
  bankName,
}: DossierPdfOptions): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Paleta de Cores Corporativa Aura Finance
  const GOLD_PRIMARY = [194, 162, 91] as const; // #c2a25b
  const GOLD_DARK = [164, 126, 53] as const; // #a47e35
  const DARK_BG = [15, 15, 15] as const; // #0f0f0f
  const CARD_BG = [248, 248, 248] as const;
  const TEXT_DARK = [24, 24, 27] as const;
  const TEXT_MUTED = [100, 100, 100] as const;
  const BORDER_COLOR = [220, 220, 225] as const;

  // Cálculos complementares
  const acquisition = calculateAcquisitionCosts({
    propertyValue: inputs.propertyValue,
    itbiRate: 3.0,
    registrationRate: 1.2,
    bankAppraisalFee: 3400,
    certificatesFee: 900,
    isFirstPropertySFH: false,
  });

  const incomeAssessment = assessIncomeCommitment(result.firstInstallment, 0);

  const baseline = calculateFinancing({
    ...inputs,
    extraMonthlyAmortization: 0,
    extraAnnualAmortization: 0,
  });

  const totalInterestSaved = Math.max(0, baseline.totalInterest - result.totalInterest);
  const monthsSaved = Math.max(0, baseline.termMonths - (result.installments?.length || baseline.termMonths));

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR');
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const dossierId = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;

  // =========================================================================
  // PÁGINA 1: RESUMO EXECUTIVO, PARÂMETROS, KPIS E DIAGNÓSTICO BANCÁRIO
  // =========================================================================

  // Cabeçalho de Topo Preto & Dourado
  doc.setFillColor(DARK_BG[0], DARK_BG[1], DARK_BG[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Linha de Destaque Dourada abaixo do topo
  doc.setFillColor(GOLD_PRIMARY[0], GOLD_PRIMARY[1], GOLD_PRIMARY[2]);
  doc.rect(0, 28, pageWidth, 1.2, 'F');

  // Marca Aura Finance
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(GOLD_PRIMARY[0], GOLD_PRIMARY[1], GOLD_PRIMARY[2]);
  doc.text('AURA FINANCE', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('INTELIGÊNCIA & ESTRATÉGIA IMOBILIÁRIA', margin, 17);

  // Título do Documento no topo direito
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('DOSSIÊ EXECUTIVO DE FINANCIAMENTO', pageWidth - margin, 12, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(GOLD_PRIMARY[0], GOLD_PRIMARY[1], GOLD_PRIMARY[2]);
  doc.text(`CÓDIGO: ${dossierId}  •  EMISSÃO: ${dateStr} ${timeStr}`, pageWidth - margin, 17, { align: 'right' });

  let y = 35;

  // Sub-cabeçalho de Contexto
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('1. RESUMO EXECUTIVO E PARÂMETROS DA OPERAÇÃO', margin, y);

  if (scenarioName) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`Cenário: ${scenarioName}`, pageWidth - margin, y, { align: 'right' });
  }

  y += 4;

  // Grid de Parâmetros Base (Tabela Limpa 2x4)
  doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.rect(margin, y, contentWidth, 22, 'FD');

  const paramColW = contentWidth / 4;
  const paramY = y + 5;

  // Col 1: Imóvel e Entrada
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('VALOR DO IMÓVEL', margin + 3, paramY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(formatBRL(inputs.propertyValue), margin + 3, paramY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('ENTRADA', margin + 3, paramY + 10.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(`${formatBRL(inputs.downPayment)} (${inputs.downPaymentPercent.toFixed(1)}%)`, margin + 3, paramY + 15);

  // Col 2: Financiado e Prazo
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('VALOR FINANCIADO', margin + paramColW + 3, paramY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(formatBRL(inputs.propertyValue - inputs.downPayment), margin + paramColW + 3, paramY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('PRAZO CONTRATADO', margin + paramColW + 3, paramY + 10.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(`${inputs.termMonths} meses (${Math.round(inputs.termMonths / 12)} anos)`, margin + paramColW + 3, paramY + 15);

  // Col 3: Sistema e Banco
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('SISTEMA DE AMORTIZAÇÃO', margin + paramColW * 2 + 3, paramY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(GOLD_DARK[0], GOLD_DARK[1], GOLD_DARK[2]);
  doc.text(inputs.amortizationMethod === 'SAC' ? 'SAC (Parcelas Decrescentes)' : 'PRICE (Parcelas Fixas)', margin + paramColW * 2 + 3, paramY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('BANCO / LINHA', margin + paramColW * 2 + 3, paramY + 10.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(bankName || 'SFH / SFI Mercado', margin + paramColW * 2 + 3, paramY + 15);

  // Col 4: Taxas e Seguros
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('TAXA DE JUROS ANUAL', margin + paramColW * 3 + 3, paramY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(`${formatPercent(inputs.interestRateYearly)} a.a.`, margin + paramColW * 3 + 3, paramY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('TAXA MENSAL EQUIVALENTE', margin + paramColW * 3 + 3, paramY + 10.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  const monthlyRate = (Math.pow(1 + inputs.interestRateYearly / 100, 1 / 12) - 1) * 100;
  doc.text(`${formatPercent(monthlyRate)} a.m.`, margin + paramColW * 3 + 3, paramY + 15);

  y += 26;

  // Grade de 6 KPIs Estratégicos (Design Cartões)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('2. INDICADORES-CHAVE DA SIMULAÇÃO (KPIS)', margin, y);

  y += 4;
  const kpiGridCols = 3;
  const kpiGridRows = 2;
  const kpiColW = (contentWidth - 6) / kpiGridCols;
  const kpiRowH = 16;

  const kpis = [
    { title: '1ª PARCELA', value: formatBRL(result.firstInstallment), highlight: false },
    { title: `${result.installments.length}ª PARCELA (FINAL)`, value: formatBRL(result.lastInstallment), highlight: false },
    { title: 'TOTAL DE JUROS', value: formatBRL(result.totalInterest), highlight: false },
    { title: 'TOTAL GERAL PAGO', value: formatBRL(result.totalPaid), highlight: true },
    { title: 'CUSTOS DE CARTÓRIO / ITBI', value: formatBRL(acquisition.totalCosts), highlight: false },
    { title: 'RENDA FAMILIAR SUGERIDA', value: formatBRL(incomeAssessment.minimumRequiredIncome), highlight: false },
  ];

  kpis.forEach((kpi, index) => {
    const col = index % kpiGridCols;
    const row = Math.floor(index / kpiGridCols);
    const kpiX = margin + col * (kpiColW + 3);
    const kpiY = y + row * (kpiRowH + 3);

    if (kpi.highlight) {
      doc.setFillColor(26, 22, 13);
      doc.setDrawColor(GOLD_PRIMARY[0], GOLD_PRIMARY[1], GOLD_PRIMARY[2]);
      doc.rect(kpiX, kpiY, kpiColW, kpiRowH, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(GOLD_PRIMARY[0], GOLD_PRIMARY[1], GOLD_PRIMARY[2]);
      doc.text(kpi.title, kpiX + 3, kpiY + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(255, 255, 255);
      doc.text(kpi.value, kpiX + 3, kpiY + 11.5);
    } else {
      doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
      doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
      doc.rect(kpiX, kpiY, kpiColW, kpiRowH, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(GOLD_DARK[0], GOLD_DARK[1], GOLD_DARK[2]);
      doc.text(kpi.title, kpiX + 3, kpiY + 4.5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
      doc.text(kpi.value, kpiX + 3, kpiY + 11.5);
    }
  });

  y += kpiGridRows * (kpiRowH + 3) + 4;

  // 3. ANÁLISE DE CAPACIDADE DE PAGAMENTO & DIRETRIZES BACEN
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('3. ENQUADRAMENTO DE RENDA E DIRETRIZES DO BANCO CENTRAL (BACEN)', margin, y);

  y += 4;
  doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.rect(margin, y, contentWidth, 23, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(
    `• Renda Bruta Familiar Mínima Recomendada: ${formatBRL(incomeAssessment.minimumRequiredIncome)} (Teto de 30% de comprometimento)`,
    margin + 4,
    y + 5.5
  );
  doc.text(
    `• Parcela Inicial: ${formatBRL(result.firstInstallment)} representa exatamente 30% da renda recomendada para aprovação sem exigência de cotitular.`,
    margin + 4,
    y + 10.5
  );
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text(
    'Conforme a Resolução CMN nº 3.932/2010 e práticas bancárias dos principais agentes financeiros do país (Caixa, Itaú, Bradesco, Santander, Banco do Brasil).',
    margin + 4,
    y + 16
  );

  y += 27;

  // 4. DESCRITIVO DE CUSTOS DE TRANSFERÊNCIA E CARTÓRIO
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('4. CUSTOS ESTIMADOS DE TRANSFERÊNCIA E CARTÓRIO', margin, y);

  y += 4;
  doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.rect(margin, y, contentWidth, 23, 'FD');

  const costColW = contentWidth / 4;
  const costY = y + 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('ITBI (MÉDIA 3,0%)', margin + 3, costY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(formatBRL(acquisition.itbiAmount), margin + 3, costY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('REGISTRO / ESCRITURA (1,2%)', margin + costColW + 3, costY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(formatBRL(acquisition.registrationAmount), margin + costColW + 3, costY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('AVALIAÇÃO + CERTIDÕES', margin + costColW * 2 + 3, costY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text(formatBRL(acquisition.bankAppraisalFee + acquisition.certificatesFee), margin + costColW * 2 + 3, costY + 4.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(GOLD_DARK[0], GOLD_DARK[1], GOLD_DARK[2]);
  doc.text('TOTAL DE DESPESAS', margin + costColW * 3 + 3, costY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(GOLD_DARK[0], GOLD_DARK[1], GOLD_DARK[2]);
  doc.text(formatBRL(acquisition.totalCosts), margin + costColW * 3 + 3, costY + 4.5);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text(
    '* Alíquotas e emolumentos podem sofrer variações conforme legislação municipal e tabela estadual de cartórios.',
    margin + 3,
    costY + 12
  );

  // Rodapé da Página 1
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Aura Finance • Inteligência Imobiliária  |  Página 1 de 2', margin, pageHeight - 8);
  doc.text('Documento gerado para fins de planejamento e suporte a negociação', pageWidth - margin, pageHeight - 8, { align: 'right' });

  // =========================================================================
  // PÁGINA 2: ESTRATÉGIA DE AMORTIZAÇÃO, CRONOGRAMA ANUAL E GUIA DE MESA
  // =========================================================================
  doc.addPage('a4', 'portrait');

  // Cabeçalho da Página 2
  doc.setFillColor(DARK_BG[0], DARK_BG[1], DARK_BG[2]);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setFillColor(GOLD_PRIMARY[0], GOLD_PRIMARY[1], GOLD_PRIMARY[2]);
  doc.rect(0, 20, pageWidth, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(GOLD_PRIMARY[0], GOLD_PRIMARY[1], GOLD_PRIMARY[2]);
  doc.text('AURA FINANCE', margin, 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('ESTRATÉGIA DE QUITAÇÃO & PROJEÇÃO EVOLUTIVA', pageWidth - margin, 12, { align: 'right' });

  y = 28;

  // 5. ESTRATÉGIA DE AMORTIZAÇÃO ACELERADA
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('5. IMPACTO DA AMORTIZAÇÃO ACELERADA (ECONOMIA DE JUROS)', margin, y);

  y += 4;
  doc.setFillColor(CARD_BG[0], CARD_BG[1], CARD_BG[2]);
  doc.setDrawColor(BORDER_COLOR[0], BORDER_COLOR[1], BORDER_COLOR[2]);
  doc.rect(margin, y, contentWidth, 26, 'FD');

  const extraMonthly = inputs.extraMonthlyAmortization || 0;
  const extraAnnual = inputs.extraAnnualAmortization || 0;
  const isAmortizing = extraMonthly > 0 || extraAnnual > 0;

  const amortColW = contentWidth / 3;
  const amortY = y + 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('APORTE PROGRAMADO', margin + 3, amortY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  if (isAmortizing) {
    const monthlyStr = extraMonthly > 0 ? `${formatBRL(extraMonthly)}/mês` : '';
    const annualStr = extraAnnual > 0 ? `${formatBRL(extraAnnual)}/ano` : '';
    doc.text([monthlyStr, annualStr].filter(Boolean).join(' + '), margin + 3, amortY + 4.5);
  } else {
    doc.text('Simulação Padrão (Sem Aportes)', margin + 3, amortY + 4.5);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('TEMPO ECONOMIZADO NA QUITAÇÃO', margin + amortColW + 3, amortY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(GOLD_DARK[0], GOLD_DARK[1], GOLD_DARK[2]);
  if (monthsSaved > 0) {
    const yrs = Math.floor(monthsSaved / 12);
    const mths = monthsSaved % 12;
    const timeSavedTxt = yrs > 0 ? `${yrs} ano(s)${mths > 0 ? ` e ${mths} m` : ''}` : `${mths} meses`;
    doc.text(`${monthsSaved} meses (${timeSavedTxt})`, margin + amortColW + 3, amortY + 4.5);
  } else {
    doc.text('Prazo Integral Contratado', margin + amortColW + 3, amortY + 4.5);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('ECONOMIA REAL EM JUROS', margin + amortColW * 2 + 3, amortY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(GOLD_DARK[0], GOLD_DARK[1], GOLD_DARK[2]);
  doc.text(formatBRL(totalInterestSaved), margin + amortColW * 2 + 3, amortY + 4.5);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text(
    isAmortizing
      ? `Com essa estratégia de aportes, o contrato é quitado em ${result.installments.length} meses economizando ${formatBRL(totalInterestSaved)} em juros futuros.`
      : 'Dica Aura Finance: Aportes extras mensais ou anuais direcionados para amortização de saldo devedor reduzem substancialmente os juros totais.',
    margin + 3,
    amortY + 14
  );

  y += 30;

  // 6. TABELA DE PROJEÇÃO ANUAL CONSOLIDADA (CRONOGRAMA EXECUTIVO)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('6. PROJEÇÃO EVOLUTIVA ANUAL DO FINANCIAMENTO', margin, y);

  y += 4;

  // Cabeçalho da Tabela
  const thY = y;
  doc.setFillColor(DARK_BG[0], DARK_BG[1], DARK_BG[2]);
  doc.rect(margin, thY, contentWidth, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(GOLD_PRIMARY[0], GOLD_PRIMARY[1], GOLD_PRIMARY[2]);
  doc.text('ANO', margin + 3, thY + 4.2);
  doc.text('PARCELA MÉDIA', margin + 26, thY + 4.2);
  doc.text('AMORTIZAÇÃO NO ANO', margin + 68, thY + 4.2);
  doc.text('JUROS NO ANO', margin + 115, thY + 4.2);
  doc.text('SALDO DEVEDOR FINAL', pageWidth - margin - 3, thY + 4.2, { align: 'right' });

  y += 6;

  // Agrupamento anual
  const installments = result.installments || [];
  const yearsCount = Math.ceil(installments.length / 12);
  const maxRowsToShow = Math.min(yearsCount, 12);

  // Amostragem de anos estratégicos se forem muitos anos
  const yearsToRender: number[] = [];
  if (yearsCount <= 12) {
    for (let i = 1; i <= yearsCount; i++) yearsToRender.push(i);
  } else {
    // 1, 2, 3, 4, 5, 10, 15, 20, 25, 30, ou ano final
    for (let i = 1; i <= 5; i++) if (i <= yearsCount) yearsToRender.push(i);
    [8, 10, 15, 20, 25, 30, 35].forEach((yr) => {
      if (yr <= yearsCount && !yearsToRender.includes(yr)) yearsToRender.push(yr);
    });
    if (!yearsToRender.includes(yearsCount)) yearsToRender.push(yearsCount);
  }

  yearsToRender.slice(0, 12).forEach((yearNum, rIdx) => {
    const startIdx = (yearNum - 1) * 12;
    const endIdx = Math.min(yearNum * 12, installments.length);
    const slice = installments.slice(startIdx, endIdx);

    if (slice.length === 0) return;

    const avgInstallment = slice.reduce((acc, curr) => acc + curr.totalPayment, 0) / slice.length;
    const yearAmortization = slice.reduce((acc, curr) => acc + curr.amortization, 0);
    const yearInterest = slice.reduce((acc, curr) => acc + curr.interest, 0);
    const endBalance = slice[slice.length - 1].balanceAfterPayment;

    const rowBg = rIdx % 2 === 0 ? [255, 255, 255] : [246, 246, 248];
    doc.setFillColor(rowBg[0], rowBg[1], rowBg[2]);
    doc.rect(margin, y, contentWidth, 5.5, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
    doc.text(`Ano ${yearNum}`, margin + 3, y + 3.8);
    doc.text(formatBRL(avgInstallment), margin + 26, y + 3.8);
    doc.text(formatBRL(yearAmortization), margin + 68, y + 3.8);
    doc.text(formatBRL(yearInterest), margin + 115, y + 3.8);
    doc.setFont('helvetica', 'bold');
    doc.text(formatBRL(endBalance), pageWidth - margin - 3, y + 3.8, { align: 'right' });

    y += 5.5;
  });

  y += 4;

  // 7. GUIA EXECUTIVO PARA A MESA DE NEGOCIAÇÃO (BANCO / CORRETOR)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(TEXT_DARK[0], TEXT_DARK[1], TEXT_DARK[2]);
  doc.text('7. GUIA PRÁTICO PARA A MESA DE NEGOCIAÇÃO', margin, y);

  y += 4;
  doc.setFillColor(26, 22, 13);
  doc.setDrawColor(GOLD_PRIMARY[0], GOLD_PRIMARY[1], GOLD_PRIMARY[2]);
  doc.rect(margin, y, contentWidth, 30, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(GOLD_PRIMARY[0], GOLD_PRIMARY[1], GOLD_PRIMARY[2]);
  doc.text('RECOMENDAÇÕES PARA APRESENTAÇÃO AO GERENTE OU CORRETOR:', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(230, 230, 230);
  doc.text('1. Solicite ao banco o Custo Efetivo Total (CET) detalhado com inclusão de seguros obrigatórios (MIP e DFI).', margin + 4, y + 10);
  doc.text('2. Verifique se a sua pontuação / relacionamento bancário permite redução de 0,3% a 0,8% a.a. na taxa de juros balcão.', margin + 4, y + 14.5);
  doc.text('3. Exija a portabilidade ou livre opção de contratação de apólice de seguro habitacional individual caso mais vantajosa.', margin + 4, y + 19);
  doc.text('4. Confirme que todos os aportes extras serão lançados na modalidade "Redução de Prazo" para maximizar a economia de juros.', margin + 4, y + 23.5);

  // Rodapé da Página 2
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
  doc.text('Aura Finance • Inteligência Imobiliária  |  Página 2 de 2', margin, pageHeight - 8);
  doc.text(`Autenticação: ${dossierId}  •  Documento Válido para Negociação`, pageWidth - margin, pageHeight - 8, { align: 'right' });

  return doc;
}

export async function downloadExecutiveDossierPdf(options: DossierPdfOptions, filename?: string): Promise<void> {
  const doc = await generateExecutiveDossierPdf(options);
  const defaultName = `Aura_Finance_Dossie_Simulacao_${options.inputs.amortizationMethod}_${options.inputs.propertyValue}.pdf`;
  doc.save(filename || defaultName);
}
