export interface QSAItem {
  nome_socio: string;
  qualificacao_socio?: string;
  data_entrada_sociedade?: string;
  faixa_etaria?: string;
  cnpj_cpf_do_socio?: string;
  pais?: string;
}

export interface CnaeItem {
  codigo: number;
  descricao: string;
}

export interface CNPJData {
  cnpj: string;
  razao_social: string;
  nome_fantasia?: string;
  descricao_situacao_cadastral: string; // 'ATIVA' | 'SUSPENSA' | 'INAPTA' | 'BAIXADA' | 'NULA'
  data_situacao_cadastral?: string;
  data_inicio_atividade?: string;
  cnae_fiscal?: number;
  cnae_fiscal_descricao?: string;
  cnaes_secundarios?: CnaeItem[];
  capital_social?: number;
  porte?: string;
  natureza_juridica?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
  ddd_telefone_1?: string;
  email?: string;
  qsa?: QSAItem[];
  source_api?: string;
  consulted_at?: string;
}

export interface CNPJSearchHistoryItem {
  cnpj: string;
  razao_social: string;
  descricao_situacao_cadastral: string;
  timestamp: number;
}
