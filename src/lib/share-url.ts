import { FinancingInputs } from '../types/financing';
import { sanitizeFinancingInputs } from './saved-scenarios';

export interface ShareUrlOptions {
  name?: string;
  baseUrl?: string;
}

/**
 * Converte um objeto FinancingInputs em parâmetros de URL limpos e legíveis.
 */
export function buildShareQueryString(inputs: FinancingInputs, name?: string): string {
  const params = new URLSearchParams();

  params.set('imovel', String(Math.round(inputs.propertyValue)));
  params.set('entrada', String(Math.round(inputs.downPayment)));
  params.set('taxa', String(inputs.interestRateYearly));
  params.set('prazo', String(inputs.termMonths));
  params.set('sistema', inputs.amortizationMethod);

  if (!inputs.includeInsurances) {
    params.set('seguros', '0');
  }

  if (inputs.monthlyAdminFee !== 25) {
    params.set('taxaAdm', String(inputs.monthlyAdminFee));
  }

  if (inputs.mipRateYearly !== 0.021) {
    params.set('mip', String(inputs.mipRateYearly));
  }

  if (inputs.dfiRateYearly !== 0.008) {
    params.set('dfi', String(inputs.dfiRateYearly));
  }

  if (inputs.extraMonthlyAmortization && inputs.extraMonthlyAmortization > 0) {
    params.set('extraMensal', String(inputs.extraMonthlyAmortization));
  }

  if (inputs.extraAnnualAmortization && inputs.extraAnnualAmortization > 0) {
    params.set('extraAnual', String(inputs.extraAnnualAmortization));
  }

  if (name && name.trim().length > 0) {
    params.set('cenario', name.trim());
  }

  return params.toString();
}

/**
 * Gera a URL completa para compartilhamento direto de um cenário ou simulação.
 */
export function generateShareUrl(inputs: FinancingInputs, options?: ShareUrlOptions): string {
  const queryString = buildShareQueryString(inputs, options?.name);

  let base = options?.baseUrl;
  if (!base) {
    if (typeof window !== 'undefined' && window.location) {
      base = `${window.location.origin}${window.location.pathname}`;
    } else {
      base = 'https://brasilfinance.app/';
    }
  }

  // Remove qualquer trailing slash duplicado antes da query string se base não tiver path
  return `${base}?${queryString}`;
}

export interface ParsedShareResult {
  inputs: FinancingInputs;
  scenarioName?: string;
}

/**
 * Analisa a query string ou URLSearchParams e reconstrói os FinancingInputs sanitizados.
 * Retorna null se a URL não contiver dados de simulação válidos.
 */
export function parseShareUrl(searchOrParams: string | URLSearchParams): ParsedShareResult | null {
  const params = typeof searchOrParams === 'string'
    ? new URLSearchParams(searchOrParams.startsWith('?') ? searchOrParams.slice(1) : searchOrParams)
    : searchOrParams;

  // Verifica se pelo menos o parâmetro de imóvel ou prazo/taxa existe
  const rawPropertyValue = params.get('imovel') || params.get('valor') || params.get('propertyValue');
  if (!rawPropertyValue) {
    return null;
  }

  const propertyValue = parseFloat(rawPropertyValue);
  if (isNaN(propertyValue) || propertyValue <= 0) {
    return null;
  }

  const rawDownPayment = params.get('entrada') || params.get('downPayment');
  const downPayment = rawDownPayment ? parseFloat(rawDownPayment) : propertyValue * 0.2;

  const rawTaxa = params.get('taxa') || params.get('taxaJuros') || params.get('interestRateYearly');
  const interestRateYearly = rawTaxa ? parseFloat(rawTaxa) : 10.5;

  const rawPrazo = params.get('prazo') || params.get('termMonths') || params.get('meses');
  const termMonths = rawPrazo ? parseInt(rawPrazo, 10) : 360;

  const rawSistema = params.get('sistema') || params.get('amortizationMethod');
  const amortizationMethod = rawSistema && rawSistema.toUpperCase() === 'PRICE' ? 'PRICE' : 'SAC';

  const rawSeguros = params.get('seguros') || params.get('includeInsurances');
  const includeInsurances = rawSeguros === '0' || rawSeguros === 'false' ? false : true;

  const rawTaxaAdm = params.get('taxaAdm') || params.get('monthlyAdminFee');
  const monthlyAdminFee = rawTaxaAdm ? parseFloat(rawTaxaAdm) : 25;

  const rawMip = params.get('mip') || params.get('mipRateYearly');
  const mipRateYearly = rawMip ? parseFloat(rawMip) : 0.021;

  const rawDfi = params.get('dfi') || params.get('dfiRateYearly');
  const dfiRateYearly = rawDfi ? parseFloat(rawDfi) : 0.008;

  const rawExtraMensal = params.get('extraMensal') || params.get('extraMonthlyAmortization');
  const extraMonthlyAmortization = rawExtraMensal ? parseFloat(rawExtraMensal) : undefined;

  const rawExtraAnual = params.get('extraAnual') || params.get('extraAnnualAmortization');
  const extraAnnualAmortization = rawExtraAnual ? parseFloat(rawExtraAnual) : undefined;

  const rawCenarioName = params.get('cenario') || params.get('nome') || params.get('name');
  const scenarioName = rawCenarioName && rawCenarioName.trim().length > 0 ? rawCenarioName.trim() : undefined;

  const sanitized = sanitizeFinancingInputs({
    category: 'property',
    propertyValue,
    downPayment,
    interestRateYearly,
    termMonths,
    amortizationMethod,
    includeInsurances,
    monthlyAdminFee,
    mipRateYearly,
    dfiRateYearly,
    extraMonthlyAmortization,
    extraAnnualAmortization,
  });

  if (!sanitized) return null;

  return {
    inputs: sanitized,
    scenarioName,
  };
}

/**
 * Utilitário para copiar a URL de compartilhamento para a área de transferência do usuário.
 */
export async function copyShareUrlToClipboard(inputs: FinancingInputs, options?: ShareUrlOptions): Promise<boolean> {
  const url = generateShareUrl(inputs, options);

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      // Fallback para textarea temporário caso a API de Clipboard falhe
    }
  }

  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch {
      return false;
    }
  }

  return false;
}
