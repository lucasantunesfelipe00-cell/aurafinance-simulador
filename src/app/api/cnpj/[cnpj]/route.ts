import { NextResponse } from 'next/server';
import { validarCNPJ } from '@/lib/cnpj';
import { CNPJData } from '@/types/cnpj';

export async function GET(
  request: Request,
  { params }: { params: { cnpj: string } }
) {
  const rawCnpj = params.cnpj || '';
  const cnpj = rawCnpj.replace(/\D/g, '');

  if (cnpj.length !== 14 || !validarCNPJ(cnpj)) {
    return NextResponse.json(
      { error: 'CNPJ inválido. Digite um número de 14 dígitos válido.' },
      { status: 400 }
    );
  }

  // 1. Tentar BrasilAPI com timeout de 5 segundos
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'CNPJ-Terminal-CyberLookup/1.0',
        'Accept': 'application/json',
      },
      // @ts-ignore
      next: { revalidate: 86400 } // Vercel Data Cache 24h
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const normalized: CNPJData = {
        cnpj: data.cnpj || cnpj,
        razao_social: data.razao_social || 'NÃO INFORMADO',
        nome_fantasia: data.nome_fantasia || '',
        descricao_situacao_cadastral: (data.descricao_situacao_cadastral || 'ATIVA').toUpperCase(),
        data_situacao_cadastral: data.data_situacao_cadastral || '',
        data_inicio_atividade: data.data_inicio_atividade || '',
        cnae_fiscal: data.cnae_fiscal || 0,
        cnae_fiscal_descricao: data.cnae_fiscal_descricao || '',
        cnaes_secundarios: data.cnaes_secundarios || [],
        capital_social: typeof data.capital_social === 'number' ? data.capital_social : parseFloat(data.capital_social || '0'),
        porte: data.porte || 'NÃO INFORMADO',
        natureza_juridica: data.natureza_juridica || '',
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        municipio: data.municipio || '',
        uf: data.uf || '',
        cep: data.cep || '',
        ddd_telefone_1: data.ddd_telefone_1 || '',
        email: data.email || '',
        qsa: data.qsa || [],
        source_api: 'BrasilAPI v1',
        consulted_at: new Date().toISOString(),
      };

      return NextResponse.json(normalized, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      });
    }

    if (res.status === 404) {
      return NextResponse.json(
        { error: 'CNPJ não encontrado na base de dados da Receita Federal.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.warn('BrasilAPI falhou ou atingiu timeout. Tentando fallback para MinhaReceita...', error);
  }

  // 2. Fallback: MinhaReceita API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const fallbackRes = await fetch(`https://minhareceita.org/${cnpj}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
      // @ts-ignore
      next: { revalidate: 86400 }
    });

    clearTimeout(timeoutId);

    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      const normalized: CNPJData = {
        cnpj: data.cnpj || cnpj,
        razao_social: data.razao_social || 'NÃO INFORMADO',
        nome_fantasia: data.nome_fantasia || '',
        descricao_situacao_cadastral: (data.descricao_situacao_cadastral || 'ATIVA').toUpperCase(),
        data_situacao_cadastral: data.data_situacao_cadastral || '',
        data_inicio_atividade: data.data_inicio_atividade || '',
        cnae_fiscal: data.cnae_fiscal || 0,
        cnae_fiscal_descricao: data.cnae_fiscal_descricao || '',
        cnaes_secundarios: (data.cnaes_secundarios || []).map((c: { codigo: number; descricao: string }) => ({
          codigo: c.codigo,
          descricao: c.descricao,
        })),
        capital_social: typeof data.capital_social === 'number' ? data.capital_social : parseFloat(data.capital_social || '0'),
        porte: data.porte || 'NÃO INFORMADO',
        natureza_juridica: data.natureza_juridica || '',
        logradouro: data.logradouro || '',
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        municipio: data.municipio || '',
        uf: data.uf || '',
        cep: data.cep || '',
        ddd_telefone_1: data.ddd_telefone_1 || '',
        email: data.email || '',
        qsa: (data.qsa || []).map((q: { nome_socio: string; qualificacao_socio: string }) => ({
          nome_socio: q.nome_socio,
          qualificacao_socio: q.qualificacao_socio,
        })),
        source_api: 'MinhaReceita API (Fallback)',
        consulted_at: new Date().toISOString(),
      };

      return NextResponse.json(normalized, {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      });
    }

    if (fallbackRes.status === 404) {
      return NextResponse.json(
        { error: 'CNPJ não encontrado na base de dados.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Erro na chamada de fallback da MinhaReceita API:', error);
  }

  return NextResponse.json(
    { error: 'Falha na comunicação com as APIs de consulta do CNPJ. Tente novamente em instantes.' },
    { status: 502 }
  );
}
