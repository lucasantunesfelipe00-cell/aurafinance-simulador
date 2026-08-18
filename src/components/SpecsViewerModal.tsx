'use client';

import React, { useState } from 'react';
import { X, FileText, Code2, Palette, ExternalLink } from 'lucide-react';

interface SpecsViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpecsViewerModal: React.FC<SpecsViewerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'prd' | 'spec' | 'design'>('prd');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-4xl max-h-[85vh] rounded-2xl border border-gold-500/30 p-6 flex flex-col relative shadow-gold-glow-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gold-400" />
              <span>Documentação Técnica & Design System</span>
            </h2>
            <p className="text-xs text-gray-400">Arquivos PRD, SPEC e Design System integrados no projeto</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-obsidian-850 border border-gold-500/20 hover:border-gold-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex space-x-2 my-4 border-b border-gold-500/10 pb-3">
          <button
            onClick={() => setActiveTab('prd')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'prd'
                ? 'btn-gold-metallic'
                : 'text-gray-400 bg-obsidian-900 border border-gold-500/10 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>PRD (Requisitos)</span>
          </button>

          <button
            onClick={() => setActiveTab('spec')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'spec'
                ? 'btn-gold-metallic'
                : 'text-gray-400 bg-obsidian-900 border border-gold-500/10 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>SPEC (Especificação Técnica)</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'design'
                ? 'btn-gold-metallic'
                : 'text-gray-400 bg-obsidian-900 border border-gold-500/10 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Design System (Aura Gold)</span>
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-obsidian-950/80 border border-gold-500/20 text-xs font-mono text-gray-300 leading-relaxed space-y-4">
          {activeTab === 'prd' && (
            <div>
              <h3 className="text-sm font-bold text-gold-400 mb-2">PRD — Product Requirement Document</h3>
              <p className="text-gray-400 mb-2">Arquivo original: <code className="text-amber-200">prd.md</code></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Visão Geral:</strong> Plataforma de inteligência financeira com simulação imobiliária, veicular e pessoal.</li>
                <li><strong>Modalidades:</strong> Suporte completo ao Sistema de Amortização Constante (SAC) e Tabela Price.</li>
                <li><strong>Funcionalidades P0:</strong> Form com sliders metálicos, máscaras monetárias, seguros adicionais (MIP/DFI) e matriz comparativa.</li>
              </ul>
            </div>
          )}

          {activeTab === 'spec' && (
            <div>
              <h3 className="text-sm font-bold text-gold-400 mb-2">SPEC — Especificação Técnica & Matemática</h3>
              <p className="text-gray-400 mb-2">Arquivo original: <code className="text-amber-200">spec.md</code></p>
              <div className="p-3 bg-obsidian-900 rounded-lg border border-gold-500/10 mb-2">
                <p className="text-amber-300 font-bold mb-1">Fórmula SAC:</p>
                <p className="text-gray-300">Amortização = PV / n | Prestação_k = Amortização + (Saldo_Devedor_{`k-1`} * i)</p>
              </div>
              <div className="p-3 bg-obsidian-900 rounded-lg border border-gold-500/10">
                <p className="text-amber-300 font-bold mb-1">Fórmula PRICE:</p>
                <p className="text-gray-300">PMT = PV * [ (i * (1+i)^n) / ((1+i)^n - 1) ]</p>
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div>
              <h3 className="text-sm font-bold text-gold-400 mb-2">Design System — Aura Gold & Obsidian</h3>
              <p className="text-gray-400 mb-2">Arquivo original: <code className="text-amber-200">design.md</code></p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3 font-sans">
                <div className="p-3 rounded-lg bg-[#D4AF37] text-obsidian-950 font-bold text-[10px]">
                  #D4AF37 (Gold Primary)
                </div>
                <div className="p-3 rounded-lg bg-[#996515] text-white font-bold text-[10px]">
                  #996515 (Gold Metallic)
                </div>
                <div className="p-3 rounded-lg bg-[#090A0F] text-gold-300 font-bold text-[10px] border border-gold-500/30">
                  #090A0F (Obsidian Dark)
                </div>
                <div className="p-3 rounded-lg bg-white text-obsidian-950 font-bold text-[10px]">
                  #FFFFFF (Crisp White)
                </div>
              </div>
              <p className="text-gray-400">Efeitos visuais aplicados: Glassmorphism (`backdrop-blur-16px`), Gradiente metálico em textos e botões, Glow box-shadows e sliders neon.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
