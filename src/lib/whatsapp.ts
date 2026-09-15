import { FinancingInputs, FinancingResult } from '../types/financing';
import { formatBRL, formatPercent } from './financing-calculator';
import { generateShareUrl } from './share-url';

export interface WhatsAppMessageOptions {
  phoneNumber?: string;
  scenarioName?: string;
  baseUrl?: string;
}

/**
 * Monta o texto inteligente e formatado para o WhatsApp com os dados exatos da simulação do cliente.
 */
export function buildWhatsAppMessage(
  inputs: FinancingInputs,
  result?: FinancingResult,
  options?: WhatsAppMessageOptions
): string {
  const propertyVal = formatBRL(inputs.propertyValue);
  const downPaymentVal = formatBRL(inputs.downPayment);
  const loanVal = formatBRL(Math.max(0, inputs.propertyValue - inputs.downPayment));
  const downPct = inputs.propertyValue > 0 ? ((inputs.downPayment / inputs.propertyValue) * 100).toFixed(1) : '0';
  const rateYearly = formatPercent(inputs.interestRateYearly, 2);
  const termYears = Math.round(inputs.termMonths / 12);
  const shareLink = generateShareUrl(inputs, { name: options?.scenarioName, baseUrl: options?.baseUrl });

  let text = `*Olá! Acabei de realizar uma simulação no Brasil Finance e gostaria de falar com um especialista em crédito imobiliário.*`;

  if (options?.scenarioName) {
    text += `\n\n📌 *Cenário:* ${options.scenarioName}`;
  }

  text += `\n\n📊 *Resumo da Simulação:*`;
  text += `\n• *Valor do Imóvel:* ${propertyVal}`;
  text += `\n• *Entrada:* ${downPaymentVal} (${downPct}%)`;
  text += `\n• *Valor Financiado:* ${loanVal}`;
  text += `\n• *Sistema de Amortização:* Tabela ${inputs.amortizationMethod}`;
  text += `\n• *Prazo:* ${inputs.termMonths} meses (${termYears} anos)`;
  text += `\n• *Taxa de Juros:* ${rateYearly} a.a.`;

  if (result) {
    text += `\n• *1ª Parcela Estimada:* ${formatBRL(result.firstInstallment)}`;
    text += `\n• *Última Parcela Estimada:* ${formatBRL(result.lastInstallment)}`;
  }

  if (inputs.extraMonthlyAmortization && inputs.extraMonthlyAmortization > 0) {
    text += `\n• *Aporte Mensal Extra:* ${formatBRL(inputs.extraMonthlyAmortization)}`;
  }

  text += `\n\n🔗 *Acessar Simulação Completa:* ${shareLink}`;
  text += `\n\n_Gostaria de saber as melhores opções de aprovação de crédito e taxas com os bancos parceiros._`;

  return text;
}

export const DEFAULT_WHATSAPP_PHONE = '5519997550603';

export function normalizeWhatsAppPhone(rawPhone?: string): string {
  if (!rawPhone) return DEFAULT_WHATSAPP_PHONE;
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return DEFAULT_WHATSAPP_PHONE;
  // Se tiver 10 ou 11 dígitos (ex: 19997550603), adiciona o DDI 55 do Brasil
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}

/**
 * Gera a URL wa.me pronta para abrir o WhatsApp no celular ou web com a mensagem pré-carregada.
 */
export function generateWhatsAppUrl(
  inputs: FinancingInputs,
  result?: FinancingResult,
  options?: WhatsAppMessageOptions
): string {
  const message = buildWhatsAppMessage(inputs, result, options);
  const encodedMessage = encodeURIComponent(message);

  let phone = options?.phoneNumber;
  if (!phone && typeof process !== 'undefined' && process.env) {
    phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
  }

  const cleanPhone = normalizeWhatsAppPhone(phone);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Abre a janela do WhatsApp de forma segura.
 */
export function openWhatsAppChat(
  inputs: FinancingInputs,
  result?: FinancingResult,
  options?: WhatsAppMessageOptions
): void {
  const url = generateWhatsAppUrl(inputs, result, options);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
