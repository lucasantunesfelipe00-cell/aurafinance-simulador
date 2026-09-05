'use client';

import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Building2,
  FileText,
} from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  id: string;
  question: string;
  category: 'Amortização' | 'SAC vs PRICE' | 'FGTS' | 'Taxas & Crédito';
  answer: string;
  highlight?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Qual a diferença entre abater do "Prazo" e abater da "Parcela"?',
    category: 'Amortização',
    answer:
      'Quando você faz um aporte extraordinário, o banco permite escolher entre reduzir o tempo restante do contrato ou o valor da prestação mensal. Abater do PRAZO é imensamente mais vantajoso, pois elimina as parcelas distantes que possuem a maior carga proporcional de juros acumulados.',
    highlight: 'Dica Prática: Reduzir o prazo gera até 5x mais economia em juros do que diminuir a parcela.',
  },
  {
    id: 'faq-2',
    question: 'Por que a modalidade SAC economiza mais juros que a Tabela PRICE?',
    category: 'SAC vs PRICE',
    answer:
      'No SAC (Sistema de Amortização Constante), o valor que realmente reduz sua dívida (o principal) é fixo desde o primeiro mês. Como o saldo devedor cai mais rápido, os juros dos meses seguintes diminuem progressivamente. Na PRICE, as primeiras parcelas cobram quase 100% de juros e amortizam muito pouco a dívida original.',
    highlight: 'Recomendação: O SAC costuma economizar entre 20% a 35% a mais em juros totais.',
  },
  {
    id: 'faq-3',
    question: 'Como utilizar o saldo do FGTS para amortizar o financiamento?',
    category: 'FGTS',
    answer:
      'Pelas regras do Sistema Financeiro da Habitação (SFH), para imóveis avaliados em até R$ 1,5 milhão, você pode usar todo o saldo retido na conta do FGTS a cada 24 meses (2 anos) para abater o saldo devedor ou diminuir até 80% do valor de 12 parcelas consecutivas.',
    highlight: 'Regra: O titular deve ter pelo menos 3 anos de trabalho sob o regime do FGTS.',
  },
  {
    id: 'faq-4',
    question: 'Existe alguma multa ou cobrança de taxa bancária para fazer amortização extra?',
    category: 'Amortização',
    answer:
      'Não! Pela Resolução nº 3.516 do Banco Central do Brasil, é expressamente proibida a cobrança de qualquer taxa, tarifa ou penalidade por liquidação antecipada ou amortização parcial de débitos em instituições financeiras.',
    highlight: 'Garantia Legal: Você tem o direito de amortizar qualquer valor a qualquer momento sem custos extras.',
  },
  {
    id: 'faq-5',
    question: 'O que é CET (Custo Efetivo Total) e qual sua importância?',
    category: 'Taxas & Crédito',
    answer:
      'O CET representa a porcentagem anual real cobrada pelo banco. Ele soma a taxa de juros nominal negociada + os seguros obrigatórios por lei (MIP e DFI) + as tarifas de administração contratual (~R$ 25/mês). Ao comparar bancos, compare sempre pelo CET e nunca apenas pela taxa de juros pura.',
    highlight: 'Importante: Dois bancos com a mesma taxa de juros podem ter CETs bem diferentes devido ao custo dos seguros.',
  },
  {
    id: 'faq-6',
    question: 'O que acontece se a TR (Taxa Referencial) subir durante o contrato?',
    category: 'Taxas & Crédito',
    answer:
      'A TR é o indexador que atualiza o saldo devedor mensalmente antes de incidir a taxa de juros do contrato. Quando a Selic está acima de 8,5% ao ano, a TR fica ligeiramente positiva (~0,05% a 0,15% ao mês), promovendo um pequeno ajuste monetário no saldo devedor.',
  },
  {
    id: 'faq-7',
    question: 'Como funciona a Portabilidade de Crédito Imobiliário?',
    category: 'Taxas & Crédito',
    answer:
      'Se outro banco oferecer uma taxa de juros menor do que a do seu contrato atual, você tem o direito garantido pelo Banco Central de transferir sua dívida gratuitamente para essa nova instituição, sem perder o valor que já amortizou.',
  },
  {
    id: 'faq-8',
    question: 'Quais são os custos extras na hora de assinar o financiamento imobiliário?',
    category: 'Taxas & Crédito',
    answer:
      'Além do valor de entrada do imóvel, você precisa reservar cerca de 4% a 5% do valor total para cobrir o ITBI (Imposto de Transmissão de Bens Imóveis pago à prefeitura), o Registro no Cartório de Imóveis e a Taxa de Avaliação/Engenharia cobrada pelo banco.',
  },
];

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  if (!isOpen) return null;

  const categories = ['Todos', 'Amortização', 'SAC vs PRICE', 'FGTS', 'Taxas & Crédito'];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    vibrateShort();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] rounded-2xl border border-[#c2a25b]/30 p-4 sm:p-6 flex flex-col relative shadow-2xl overflow-hidden bg-neutral-950/95">
        
        {/* Ambient Glow */}
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
                <span>Perguntas Frequentes (FAQ)</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Respostas diretas e fundamentadas sobre financiamento imobiliário e amortização
              </p>
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
            title="Fechar FAQ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Pesquisa e Filtros */}
        <div className="my-4 space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar dúvida (ex: prazo, FGTS, juros, multa, SAC)..."
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
        </div>

        {/* FAQ Accordion List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 rounded-xl bg-neutral-900/70 border border-white/10 space-y-2.5 relative z-10 custom-scrollbar">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 text-xs">
              Nenhuma pergunta encontrada para &quot;{searchTerm}&quot;. Tente pesquisar por outro termo.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'bg-neutral-900/90 border-[#c2a25b]/50 shadow-lg shadow-[#c2a25b]/5'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Question Header Button */}
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="w-full p-3.5 sm:p-4 text-left flex items-start justify-between space-x-3 cursor-pointer"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`p-1.5 rounded-lg mt-0.5 shrink-0 transition-colors ${
                          isExpanded
                            ? 'bg-[#c2a25b] text-black'
                            : 'bg-white/10 text-neutral-400'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#c2a25b] block mb-0.5">
                          {faq.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                          {faq.question}
                        </h4>
                      </div>
                    </div>

                    <div
                      className={`p-1 rounded-lg text-neutral-400 shrink-0 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180 text-[#c2a25b]' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expanded Answer Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-3 animate-fadeIn text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      <p>{faq.answer}</p>
                      
                      {faq.highlight && (
                        <div className="p-3 rounded-lg bg-[#c2a25b]/10 border border-[#c2a25b]/30 flex items-start space-x-2 text-xs text-[#c2a25b] font-medium">
                          <Sparkles className="w-4 h-4 text-[#c2a25b] shrink-0 mt-0.5" />
                          <span>{faq.highlight}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 relative z-10">
          <div className="flex items-center space-x-1.5 text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-[#c2a25b]" />
            <span className="hidden sm:inline">Respostas auditadas segundo as diretrizes do Banco Central do Brasil</span>
            <span className="sm:hidden">FAQ Brasil Finance</span>
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
            Fechar FAQ
          </button>
        </div>

      </div>
    </div>
  );
};
