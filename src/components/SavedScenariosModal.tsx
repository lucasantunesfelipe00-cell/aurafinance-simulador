'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Bookmark,
  Plus,
  Trash2,
  Check,
  Pencil,
  Building,
  Calendar,
  Percent,
  SlidersHorizontal,
  FolderHeart,
  ExternalLink,
} from 'lucide-react';
import { FinancingInputs } from '@/types/financing';
import { formatBRL, formatPercent } from '@/lib/financing-calculator';
import {
  SavedScenario,
  getSavedScenarios,
  saveScenario,
  deleteScenario,
  updateScenarioName,
  generateDefaultName,
} from '@/lib/saved-scenarios';
import { vibrateShort } from '@/lib/haptics';
import { playClickSound } from '@/lib/sound';
import { setCursorVariant } from '@/lib/cursor-store';

interface SavedScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInputs: FinancingInputs;
  onSelectScenario: (inputs: FinancingInputs) => void;
}

export const SavedScenariosModal: React.FC<SavedScenariosModalProps> = ({
  isOpen,
  onClose,
  currentInputs,
  onSelectScenario,
}) => {
  const [mounted, setMounted] = useState(false);
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const list = getSavedScenarios();
      setScenarios(list);
      setNewScenarioName(generateDefaultName(currentInputs, list.length));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCursorVariant('default');
    }
    return () => {
      document.body.style.overflow = '';
      setCursorVariant('default');
    };
  }, [isOpen, currentInputs]);

  if (!mounted) return null;

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    vibrateShort();
    playClickSound();
    const updated = saveScenario(newScenarioName, currentInputs);
    setScenarios(updated);
    setNewScenarioName(generateDefaultName(currentInputs, updated.length));
  };

  const handleDelete = (id: string) => {
    vibrateShort();
    playClickSound();
    const updated = deleteScenario(id);
    setScenarios(updated);
  };

  const handleStartEdit = (scenario: SavedScenario) => {
    vibrateShort();
    setEditingId(scenario.id);
    setEditingName(scenario.name);
  };

  const handleSaveEdit = (id: string) => {
    vibrateShort();
    playClickSound();
    const updated = updateScenarioName(id, editingName);
    setScenarios(updated);
    setEditingId(null);
  };

  const handleApply = (inputs: FinancingInputs) => {
    vibrateShort();
    playClickSound();
    onSelectScenario(inputs);
    onClose();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 font-sans select-none">
          {/* Overlay de Fundo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              vibrateShort();
              onClose();
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Card do Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-neutral-950/95 border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
            {/* Linha Decorativa Dourada Superior */}
            <div className="h-1 w-full bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35]" />

            {/* Cabeçalho */}
            <div className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between bg-black/50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-gold-400/10 border border-gold-400/30 text-gold-400 shrink-0">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Histórico de Simulações Salvas
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                    Salve cenários na memória local para comparar e alternar propostas com 1 clique.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  vibrateShort();
                  onClose();
                }}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/15"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
              
              {/* Caixa para Salvar Configuração Atual */}
              <div className="p-4 rounded-xl border border-[#c2a25b]/40 bg-gradient-to-br from-[#c2a25b]/10 via-black to-black space-y-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Salvar Configuração Atual
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    Memória do Navegador
                  </span>
                </div>

                {/* Resumo da configuração atual */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-neutral-300 bg-black/60 p-2.5 rounded-lg border border-white/10">
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase">Imóvel:</span>
                    <strong className="text-white">{formatBRL(currentInputs.propertyValue)}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase">Entrada:</span>
                    <strong className="text-gold-400">{formatBRL(currentInputs.downPayment)}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase">Taxa:</span>
                    <strong className="text-white">{formatPercent(currentInputs.interestRateYearly, 2)} a.a.</strong>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[9px] uppercase">Sistema:</span>
                    <strong className="text-gold-400">{currentInputs.amortizationMethod}</strong>
                  </div>
                </div>

                {/* Formulário de salvamento */}
                <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newScenarioName}
                    onChange={(e) => setNewScenarioName(e.target.value)}
                    placeholder="Nome do cenário (ex: Apto Jardins R$ 1.2M)..."
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-black border border-white/20 text-white text-xs sm:text-sm focus:outline-none focus:border-gold-400 transition-all font-sans"
                  />
                  <button
                    type="submit"
                    onMouseEnter={() => setCursorVariant('button')}
                    onMouseLeave={() => setCursorVariant('default')}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] hover:from-[#b88f3c] hover:to-[#b88f3c] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 shrink-0"
                  >
                    <Bookmark className="w-4 h-4" /> Salvar este Cenário
                  </button>
                </form>
              </div>

              {/* Lista de Cenários Salvos */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                  <span>Cenários Salvos ({scenarios.length})</span>
                  {scenarios.length > 0 && (
                    <span className="text-[10px] text-neutral-500 lowercase font-normal">
                      clique em "carregar" para alternar
                    </span>
                  )}
                </h4>

                {scenarios.length === 0 ? (
                  <div className="p-8 border border-dashed border-white/15 rounded-xl text-center space-y-2 bg-white/[0.01]">
                    <FolderHeart className="w-8 h-8 text-neutral-600 mx-auto" />
                    <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                      Nenhum cenário salvo no histórico.
                    </p>
                    <p className="text-[11px] text-neutral-500 max-w-md mx-auto">
                      Use a caixa acima para registrar propostas de diferentes imóveis ou condições para alternar instantaneamente.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {scenarios.map((sc) => {
                      const isEditing = editingId === sc.id;
                      const loan = Math.max(0, sc.inputs.propertyValue - sc.inputs.downPayment);
                      const downPct = sc.inputs.propertyValue > 0 
                        ? (sc.inputs.downPayment / sc.inputs.propertyValue) * 100 
                        : 0;

                      return (
                        <div
                          key={sc.id}
                          className="p-3.5 rounded-xl border border-white/15 bg-black/60 hover:border-gold-400/50 transition-all space-y-3 group"
                        >
                          {/* Topo do Card do Cenário */}
                          <div className="flex items-center justify-between gap-2">
                            {isEditing ? (
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  className="flex-1 px-2.5 py-1 rounded bg-black border border-gold-400 text-white text-xs font-semibold focus:outline-none"
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(sc.id)}
                                  className="p-1.5 rounded bg-gold-400 text-black hover:bg-gold-300"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 min-w-0 flex-1">
                                <span className="font-bold text-xs sm:text-sm text-white truncate">
                                  {sc.name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(sc)}
                                  className="text-neutral-500 hover:text-gold-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                  title="Renomear cenário"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            <span className="text-[10px] font-mono text-neutral-500 shrink-0">
                              {new Date(sc.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          {/* Grid de Resumo do Cenário */}
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono text-neutral-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                            <div>
                              <span className="text-neutral-500 block text-[9px] uppercase">Imóvel:</span>
                              <span>{formatBRL(sc.inputs.propertyValue)}</span>
                            </div>
                            <div>
                              <span className="text-neutral-500 block text-[9px] uppercase">Entrada:</span>
                              <span className="text-gold-400">{formatBRL(sc.inputs.downPayment)} ({downPct.toFixed(0)}%)</span>
                            </div>
                            <div>
                              <span className="text-neutral-500 block text-[9px] uppercase">Financiado:</span>
                              <span>{formatBRL(loan)}</span>
                            </div>
                            <div>
                              <span className="text-neutral-500 block text-[9px] uppercase">Taxa:</span>
                              <span>{formatPercent(sc.inputs.interestRateYearly, 2)}</span>
                            </div>
                            <div>
                              <span className="text-neutral-500 block text-[9px] uppercase">Prazo / Amort.:</span>
                              <span className="text-gold-400">{sc.inputs.termMonths}m ({sc.inputs.amortizationMethod})</span>
                            </div>
                          </div>

                          {/* Botões de Ação do Cenário */}
                          <div className="flex items-center justify-end space-x-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(sc.id)}
                              onMouseEnter={() => setCursorVariant('button')}
                              onMouseLeave={() => setCursorVariant('default')}
                              className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 text-xs flex items-center gap-1 transition-all"
                              title="Excluir este cenário"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Excluir
                            </button>

                            <button
                              type="button"
                              onClick={() => handleApply(sc.inputs)}
                              onMouseEnter={() => setCursorVariant('button')}
                              onMouseLeave={() => setCursorVariant('default')}
                              className="px-3.5 py-1.5 rounded-lg bg-gold-400/15 hover:bg-gold-400 border border-gold-400/50 hover:border-gold-400 text-gold-400 hover:text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Carregar Cenário
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Rodapé */}
            <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>{scenarios.length} cenário(s) salvo(s)</span>
              <button
                type="button"
                onClick={() => {
                  vibrateShort();
                  onClose();
                }}
                onMouseEnter={() => setCursorVariant('button')}
                onMouseLeave={() => setCursorVariant('default')}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-sans text-xs transition-all"
              >
                Concluído
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
