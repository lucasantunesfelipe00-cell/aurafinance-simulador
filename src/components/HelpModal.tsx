'use client';

import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  BookOpen,
  Search,
  Zap,
  TrendingDown,
  ShieldCheck,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GlossaryItem {
  term: string;
  category: 'Sistema' | 'Modalidades' | 'Seguros & Taxas' | 'Estratégia';
  shortDef: string;
  fullDesc: string;
}

const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: 'Amortização Acelerada',
    category: 'Estratégia',
    shortDef: 'Pagamento antecipado direto no saldo devedor principal.',
    fullDesc:
      'Consiste em realizar pagamentos extras (mensais ou anuais) diretamente abatidos do valor contratado da dívida, sem a incidência de juros futuros. Isso reduz drasticamente o número de parcelas restantes e gera economias que frequentemente superam R$ 500 mil em contratos de 30 anos.',
  },
  {
    term: 'SAC (Sistema de Amortização Constante)',
    category: 'Modalidades',
    shortDef: 'Amortização fixa mensal com parcelas decrescentes.',
    fullDesc:
      'Modalidade de financiamento onde o valor abatedor da dívida (principal) é rigorosamente o mesmo em todas as parcelas. Como a dívida cai a cada mês, os juros da parcela seguinte diminuem, fazendo com que as prestações fiquem cada vez mais baratas ao longo do tempo.',
  },
  {
    term: 'Tabela PRICE',
    category: 'Modalidades',
    shortDef: 'Prestação mensal constante do início ao fim.',
    fullDesc:
      'Sistema no qual as parcelas têm valor fixo durante todo o financiamento (desconsiderando a correção da TR). Nas primeiras parcelas, quase a totalidade do pagamento é composta por juros, e a dívida cai de forma muito mais lenta do que no SAC.',
  },
  {
    term: 'SFH (Sistema Financeiro da Habitação)',
    category: 'Sistema',
    shortDef: 'Regime regulamentado pelo governo para imóveis de até R$ 1,5 milhão.',
    fullDesc:
      'Criado para facilitar a aquisição da casa própria no Brasil. Possui teto de taxa de juros anual (geralmente limitado a 12% a.a. + TR) e permite o uso integral do saldo do FGTS para entrada ou amortização extraordinária.',
  },
  {
    term: 'SFI (Sistema de Financiamento Imobiliário)',
    category: 'Sistema',
    shortDef: 'Regime livre para imóveis acima de R$ 1,5 milhão ou perfis de investimento.',
    fullDesc:
      'Utilizado para imóveis que ultrapassam o teto do SFH ou para compras por pessoa jurídica. As taxas de juros são negociadas livremente entre o comprador e a instituição financeira.',
  },
  {
    term: 'TR (Taxa Referencial)',
    category: 'Seguros & Taxas',
    shortDef: 'Indexador diário de atualização do saldo devedor no Brasil.',
    fullDesc:
      'Taxa de juros de referência calculada pelo Banco Central. Na maioria dos contratos imobiliários no Brasil, o saldo devedor é corrigido mensalmente pela TR antes da aplicação dos juros contratuais.',
  },
  {
    term: 'CET (Custo Efetivo Total)',
    category: 'Seguros & Taxas',
    shortDef: 'A taxa real e completa cobrada pelo banco por ano.',
    fullDesc:
      'É a porcentagem anual real do financiamento. Engloba a taxa de juros nominal negociada, os seguros obrigatórios (MIP e DFI) e as tarifas bancárias de administração do contrato.',
  },
  {
    term: 'MIP (Morte e Invalidez Permanente)',
    category: 'Seguros & Taxas',
    shortDef: 'Seguro obrigatório de cobertura à pessoa do comprador.',
    fullDesc:
      'Exigido por lei em todos os financiamentos habitacionais no Brasil. Quita o saldo devedor proporcional do comprador em caso de falecimento ou invalidez permanente durante o contrato.',
  },
  {
    term: 'DFI (Danos Físicos ao Imóvel)',
    category: 'Seguros & Taxas',
    shortDef: 'Seguro obrigatório de proteção à estrutura física do imóvel.',
    fullDesc:
      'Garante a reconstrução ou indenização caso o imóvel financiado sofra sinistros graves de origem física, como incêndios, desmoronamentos, alagamentos ou vendavais.',
  },
];

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'glossary' | 'tips'>('manual');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  if (!isOpen) return null;

  const categories = ['Todos', 'Estratégia', 'Modalidades', 'Sistema', 'Seguros & Taxas'];

  const filteredGlossary = GLOSSARY_ITEMS.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.shortDef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] rounded-2xl border border-[#c2a25b]/30 p-4 sm:p-6 flex flex-col relative shadow-2xl overflow-hidden bg-neutral-950/95">
        
        {/* Glow de fundo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#c2a25b]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#a47e35]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#c2a25b]/20 to-[#a47e35]/10 border border-[#c2a25b]/40 text-[#c2a25b] shadow-inner">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span>Manual do Aplicativo & Glossário</span>
              </h2>
              <p className="text-xs text-neutral-400">Guia definitivo de inteligência e estratégia em financiamento imobiliário</p>
            </div>
          </div>

          <button
            onClick={() => {
              vibrateShort();
              onClose();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="p-2 rounded-xl text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#c2a25b]/50 transition-all cursor-pointer"
            title="Fechar manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex space-x-2 my-4 border-b border-white/10 pb-3 relative z-10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              vibrateShort();
              setActiveTab('manual');
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'manual'
                ? 'bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] text-black font-bold shadow-md shadow-[#c2a25b]/20'
                : 'text-neutral-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Propósito & Como Usar</span>
          </button>

          <button
            onClick={() => {
              vibrateShort();
              setActiveTab('glossary');
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'glossary'
                ? 'bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] text-black font-bold shadow-md shadow-[#c2a25b]/20'
                : 'text-neutral-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Glossário de Termos</span>
          </button>

          <button
            onClick={() => {
              vibrateShort();
              setActiveTab('tips');
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'tips'
                ? 'bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] text-black font-bold shadow-md shadow-[#c2a25b]/20'
                : 'text-neutral-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Dicas para Economizar</span>
          </button>
        </div>

        {/* Main Tab Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 rounded-xl bg-neutral-900/70 border border-white/10 text-xs sm:text-sm text-neutral-300 leading-relaxed relative z-10 custom-scrollbar">
          
          {/* TAB 1: MANUAL DO APLICATIVO */}
          {activeTab === 'manual' && (
            <div className="space-y-6">
              
              {/* Box Propósito */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#c2a25b]/10 via-neutral-900 to-black border border-[#c2a25b]/30">
                <h3 className="text-base sm:text-lg font-extrabold text-[#c2a25b] mb-2 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Propósito do Brasil Finance Simulador</span>
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-3">
                  O objetivo deste simulador é **desmistificar a matemática dos bancos** e dar ao comprador total controle sobre o seu patrimônio. 
                  Em contratos tradicionais de 30 anos (360 meses), o banco cobra frequentemente mais de **2x a 3x o valor original do imóvel** em juros acumulados.
                </p>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                  Com este aplicativo, você descobre em tempo real como **pequenos aportes de amortização extraordinária** (mensais ou anuais) eliminam décadas de juros futuros, reduzindo o tempo de quitação para até **5 a 10 anos**.
                </p>
              </div>

              {/* Guia em 3 Passos */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider text-xs">
                  Como utilizar o simulador em 3 passos
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-[#c2a25b]/20 border border-[#c2a25b]/40 text-[#c2a25b] font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">Configurar Valores</h5>
                    <p className="text-xs text-neutral-400">
                      Insira o valor total do imóvel, o valor de entrada e a taxa de juros anual acordada com a instituição financeira.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-[#c2a25b]/20 border border-[#c2a25b]/40 text-[#c2a25b] font-bold flex items-center justify-center text-xs">
                      2
                    </div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">Amortização Extra</h5>
                    <p className="text-xs text-neutral-400">
                      Adicione valores que pretende abater mensalmente ou anualmente (ex: 13º salário, bônus ou rendimentos).
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-[#c2a25b]/20 border border-[#c2a25b]/40 text-[#c2a25b] font-bold flex items-center justify-center text-xs">
                      3
                    </div>
                    <h5 className="font-bold text-white text-xs sm:text-sm">Analisar a Economia</h5>
                    <p className="text-xs text-neutral-400">
                      Compare a modalidade **SAC vs PRICE**, veja os anos economizados e o montante exato de juros não pagos ao banco.
                    </p>
                  </div>
                </div>
              </div>

              {/* Destaque da Amortização Acelerada */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-white/10 space-y-2">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs sm:text-sm">
                  <TrendingDown className="w-4 h-4 text-[#c2a25b]" />
                  <span>Por que a Amortização Acelerada é tão poderosa?</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Quando você paga a parcela mensal normal, o banco cobra primeiro os **juros do mês** e apenas uma fração vai para abater o imóvel. 
                  Quando você faz uma **Amortização Extra**, 100% do dinheiro vai direto para abater a dívida principal. Isso elimina instantaneamente os juros de dezenas de parcelas lá no final do contrato.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: GLOSSÁRIO DE TERMOS */}
          {activeTab === 'glossary' && (
            <div className="space-y-4">
              
              {/* Barra de Pesquisa e Filtros */}
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between pb-2 border-b border-white/10">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar termo (ex: SAC, CET, TR, Amortização)..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-white/10 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#c2a25b]/60 transition-colors"
                  />
                </div>

                <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        vibrateShort();
                        setSelectedCategory(cat);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-[#c2a25b]/20 text-[#c2a25b] border border-[#c2a25b]/40 font-bold'
                          : 'text-neutral-400 bg-white/5 border border-white/5 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Termos do Glossário */}
              <div className="space-y-3">
                {filteredGlossary.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500 text-xs">
                    Nenhum termo encontrado para &quot;{searchTerm}&quot;. Tente pesquisar com outro termo.
                  </div>
                ) : (
                  filteredGlossary.map((item, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#c2a25b]/30 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs sm:text-sm flex items-center space-x-2">
                          <span className="text-[#c2a25b] font-mono">#</span>
                          <span>{item.term}</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/10">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#c2a25b]/90">{item.shortDef}</p>
                      <p className="text-xs text-neutral-400 leading-relaxed pt-1 border-t border-white/5">
                        {item.fullDesc}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 3: DICAS E ESTRATÉGIAS PARA ECONOMIZAR */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-black border border-amber-500/30 flex items-start space-x-3">
                <Award className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Estratégias de Quitação Pró-Ativa</h4>
                  <p className="text-xs text-neutral-300">
                    Pequenas atitudes durante a vigência do contrato produzem resultados financeiros monumentais.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                
                {/* Dica 1 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-white text-xs sm:text-sm flex items-center space-x-2">
                      <ChevronRight className="w-4 h-4 text-[#c2a25b]" />
                      <span>1. Sempre opte por &quot;Reduzir o Prazo&quot; e não a Parcela</span>
                    </h5>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Recomendado
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Quando você faz uma amortização extraordinária, o banco costuma perguntar se você quer diminuir o valor da parcela mensal ou a quantidade de meses restantes. **Sempre escolha diminuir o prazo**. Ao eliminar os meses finais, você descarta as parcelas que possuem o maior valor relativo de juros.
                  </p>
                </div>

                {/* Dica 2 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <h5 className="font-bold text-white text-xs sm:text-sm flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-[#c2a25b]" />
                    <span>2. Utilize o FGTS a cada 24 meses (Regra do SFH)</span>
                  </h5>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    No Sistema Financeiro da Habitação (imóveis de até R$ 1,5 mi), você pode usar todo o saldo acumulado do FGTS a cada 2 anos exclusivamente para abater o saldo devedor. Isso funciona como uma super-amortização gratuita que não sai do seu orçamento mensal.
                  </p>
                </div>

                {/* Dica 3 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <h5 className="font-bold text-white text-xs sm:text-sm flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-[#c2a25b]" />
                    <span>3. Destine 50% do seu 13º Salário para o Imóvel</span>
                  </h5>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Se você guardar metade do seu 13º salário uma vez por ano para dar como amortização anual extra no simulador, um contrato de 30 anos cai para aproximadamente **12 a 15 anos**, economizando mais de R$ 300.000 em juros.
                  </p>
                </div>

                {/* Dica 4 */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <h5 className="font-bold text-white text-xs sm:text-sm flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-[#c2a25b]" />
                    <span>4. Portabilidade de Financiamento</span>
                  </h5>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Acompanhe as taxas Selic e de mercado. Se as taxas caírem 1,5% ao ano durante o seu contrato, você pode transferir gratuitamente o seu financiamento para outro banco com taxa menor e continuar amortizando com o valor economizado.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 relative z-10">
          <div className="flex items-center space-x-1.5 text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-[#c2a25b]" />
            <span className="hidden sm:inline">Brasil Finance Intelligence — Ferramenta Educativa e Analítica</span>
            <span className="sm:hidden">Brasil Finance Manual</span>
          </div>

          <button
            onClick={() => {
              vibrateShort();
              onClose();
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] text-black font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-md shadow-[#c2a25b]/20"
          >
            Entendido, Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
