'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  FileText,
  CheckCircle,
  EyeOff,
  Scale,
} from 'lucide-react';
import { setCursorVariant } from '@/lib/cursor-store';
import { vibrateShort } from '@/lib/haptics';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>('privacy');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] rounded-2xl border border-[#c2a25b]/30 p-4 sm:p-6 flex flex-col relative shadow-2xl overflow-hidden bg-neutral-950/95 font-sans">
        
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#c2a25b]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#a47e35]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#c2a25b]/20 to-[#a47e35]/10 border border-[#c2a25b]/40 text-[#c2a25b] shadow-inner">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span>Termos de Uso & Política de Privacidade</span>
              </h2>
              <p className="text-xs text-neutral-400">
                Conformidade legal com a LGPD (Lei 13.709/2018) e regulação financeira
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
            title="Fechar Termos"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex space-x-2 my-4 border-b border-white/10 pb-3 relative z-10 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              vibrateShort();
              setActiveTab('privacy');
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] text-black font-bold shadow-md shadow-[#c2a25b]/20'
                : 'text-neutral-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacidade & LGPD</span>
          </button>

          <button
            onClick={() => {
              vibrateShort();
              setActiveTab('terms');
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] text-black font-bold shadow-md shadow-[#c2a25b]/20'
                : 'text-neutral-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Termos de Uso</span>
          </button>

          <button
            onClick={() => {
              vibrateShort();
              setActiveTab('disclaimer');
            }}
            onMouseEnter={() => setCursorVariant('button')}
            onMouseLeave={() => setCursorVariant('default')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              activeTab === 'disclaimer'
                ? 'bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] text-black font-bold shadow-md shadow-[#c2a25b]/20'
                : 'text-neutral-400 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Aviso Legal Financeiro</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 rounded-xl bg-neutral-900/70 border border-white/10 text-xs sm:text-sm text-neutral-300 leading-relaxed relative z-10 custom-scrollbar space-y-4">
          
          {/* TAB 1: PRIVACIDADE LGPD */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-3 text-emerald-400">
                <EyeOff className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Compromisso de Privacidade Total (Zero Data Collection)</h4>
                  <p className="text-xs text-neutral-300 mt-1">
                    Esta aplicação calcula e simula financiamentos **exclusivamente no seu próprio navegador**. Nenhum valor simulado, renda, dado pessoal ou histórico de cálculo é transmitido ou armazenado em servidores externos.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-neutral-400">
                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">1. Coleta de Dados Pessoais</h5>
                <p>
                  O **Brasil Finance Simulador** não exige cadastro, criação de conta, informante de CPF, e-mail ou número de telefone para a utilização plena de todas as suas funcionalidades de simulação.
                </p>

                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider pt-2">2. Armazenamento Local (LocalStorage)</h5>
                <p>
                  Definições de preferências de interface (como áudio ativado ou vibração tátil) são salvas unicamente na memória local do seu próprio dispositivo (`localStorage`) para sua conveniência e podem ser apagadas limpando o histórico do navegador a qualquer momento.
                </p>

                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider pt-2">3. Conformidade com a LGPD (Lei nº 13.709/2018)</h5>
                <p>
                  Ao atuar sem o recebimento ou tratamento de dados pessoais sensíveis em bancos de dados, a ferramenta atende integralmente aos princípios de privacidade por padrão (*Privacy by Design*) exigidos pela Autoridade Nacional de Proteção de Dados (ANPD).
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: TERMOS DE USO */}
          {activeTab === 'terms' && (
            <div className="space-y-4 text-xs text-neutral-400">
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-bold text-white text-xs sm:text-sm">1. Propósito da Ferramenta</h4>
                <p className="leading-relaxed">
                  O Brasil Finance Simulador é uma ferramenta digital analítica e educacional. Seu propósito é prover simulações interativas dos sistemas de amortização de financiamentos imobiliários (SAC e PRICE), auxiliando os usuários na compreensão do efeito da amortização extraordinária.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-bold text-white text-xs sm:text-sm">2. Propriedade Intelectual</h4>
                <p className="leading-relaxed">
                  Todos os elementos visuais, código-fonte, algoritmos matemáticos de projeção e identidade gráfica da marca Brasil Finance são protegidos pelas leis de direito autoral e propriedade intelectual. É vedada a cópia não autorizada para fins comerciais.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <h4 className="font-bold text-white text-xs sm:text-sm">3. Modificação dos Serviços</h4>
                <p className="leading-relaxed">
                  Reservamo-nos o direito de atualizar, aprimorar ou modificar as calculadoras e metodologias de simulação sem aviso prévio, sempre visando adequá-las às normas e índices divulgados pelo Banco Central do Brasil.
                </p>
              </div>

            </div>
          )}

          {/* TAB 3: AVISO LEGAL FINANCEIRO */}
          {activeTab === 'disclaimer' && (
            <div className="space-y-4 text-xs text-neutral-400">
              
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-2">
                <h4 className="font-bold text-white text-xs sm:text-sm flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-[#c2a25b]" />
                  <span>Caráter Informativo e Não Vinculante</span>
                </h4>
                <p className="text-neutral-300 leading-relaxed">
                  As simulações apresentadas possuem caráter estritamente **estimativo e informativo**. Elas não constituem proposta comercial, oferta vinculante de crédito ou garantia de aprovação de financiamento por nenhuma instituição financeira parceira.
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider">Variabilidade de Taxas e Regras Bancárias</h5>
                <p className="leading-relaxed">
                  Os valores finais de prestação, Custo Efetivo Total (CET), seguros obrigatórios (MIP e DFI) e taxas de administração dependem da avaliação de perfil de crédito, idade do proponente, teto do imóvel e políticas de concessão vigentes em cada banco emissor no momento da contratação.
                </p>

                <h5 className="font-bold text-white uppercase text-[11px] tracking-wider pt-2">Resolução CMN nº 3.954 do Banco Central</h5>
                <p className="leading-relaxed">
                  A atuação de intermediação ou consultoria de crédito atende rigorosamente aos ditames da Resolução nº 3.954/11 do Conselho Monetário Nacional (CMN), atuando como correspondente bancário autorizado no país.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400 relative z-10">
          <div className="flex items-center space-x-1.5 text-neutral-400">
            <CheckCircle className="w-4 h-4 text-[#c2a25b]" />
            <span>Versão 2.4 — Atualizado e auditado em 2026</span>
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
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
