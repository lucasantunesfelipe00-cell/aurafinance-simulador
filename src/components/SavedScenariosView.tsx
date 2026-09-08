'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  Plus,
  Trash2,
  Check,
  Pencil,
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

interface SavedScenariosViewProps {
  currentInputs: FinancingInputs;
  onSelectScenario: (inputs: FinancingInputs) => void;
  onScenarioSaved?: () => void;
}

export const SavedScenariosView: React.FC<SavedScenariosViewProps> = ({
  currentInputs,
  onSelectScenario,
  onScenarioSaved,
}) => {
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const list = getSavedScenarios();
    setScenarios(list);
    setNewScenarioName(generateDefaultName(currentInputs, list.length));
  }, [currentInputs]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    vibrateShort();
    playClickSound();
    const updated = saveScenario(newScenarioName, currentInputs);
    setScenarios(updated);
    setNewScenarioName(generateDefaultName(currentInputs, updated.length));
    if (onScenarioSaved) onScenarioSaved();
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto space-y-6 font-sans select-none"
    >
      {/* Card Principal de Cenários Salvos (Sharp 0px Editorial Corners) */}
      <div className="editorial-card border border-white/20 bg-black rounded-none overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
        
        {/* Linha Decorativa Dourada Superior */}
        <div className="h-1 w-full bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] -mt-6 -mx-6 sm:-mx-8 mb-6" />

        {/* Cabeçalho da Seção */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gold-400/10 border border-gold-400/30 text-gold-400 shrink-0 rounded-none">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white uppercase tracking-wider">
                Cenários Salvos
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-light">
                Alterne entre diferentes propostas e imóveis salvos com apenas 1 clique.
              </p>
            </div>
          </div>
        </div>

        {/* Formulário de Salvar Configuração Atual */}
        <div className="p-4 sm:p-5 border border-[#c2a25b]/40 bg-gradient-to-br from-[#c2a25b]/10 via-black to-black space-y-4 shadow-inner rounded-none">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Salvar Configuração Atual
            </span>
          </div>

          {/* Resumo da configuração atual */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-neutral-300 bg-black/80 p-3 border border-white/10">
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

          {/* Input + Botão Salvar */}
          <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              placeholder="Nome do cenário (ex: Apto Jardins R$ 1.2M)..."
              className="flex-1 px-4 py-3 rounded-none bg-black border border-white/20 text-white text-xs sm:text-sm focus:outline-none focus:border-gold-400 transition-all font-sans"
            />
            <button
              type="submit"
              onMouseEnter={() => setCursorVariant('button')}
              onMouseLeave={() => setCursorVariant('default')}
              className="px-6 py-3 rounded-none bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] hover:from-[#b88f3c] hover:to-[#b88f3c] text-black font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 shrink-0 cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-black" /> Salvar este Cenário
            </button>
          </form>
        </div>

        {/* Lista de Cenários Salvos */}
        <div className="space-y-4 pt-2">
          {scenarios.length === 0 ? (
            <div className="p-10 border border-dashed border-white/15 rounded-none text-center space-y-2.5 bg-white/[0.01]">
              <FolderHeart className="w-10 h-10 text-neutral-600 mx-auto" />
              <p className="text-xs sm:text-sm text-neutral-300 font-medium">
                Nenhum cenário salvo.
              </p>
              <p className="text-[11px] text-neutral-500 max-w-md mx-auto font-light">
                Use a caixa acima para registrar propostas de diferentes imóveis ou prazos e comparar a qualquer momento.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {scenarios.map((sc) => {
                const isEditing = editingId === sc.id;
                const loan = Math.max(0, sc.inputs.propertyValue - sc.inputs.downPayment);
                const downPct = sc.inputs.propertyValue > 0 
                  ? (sc.inputs.downPayment / sc.inputs.propertyValue) * 100 
                  : 0;

                return (
                  <div
                    key={sc.id}
                    className="p-4 rounded-none border border-white/15 bg-black/80 hover:border-gold-400/50 transition-all space-y-3.5 group"
                  >
                    {/* Topo do Card */}
                    <div className="flex items-center justify-between gap-2">
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-none bg-black border border-gold-400 text-white text-xs font-semibold focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(sc.id)}
                            className="p-2 rounded-none bg-gold-400 text-black hover:bg-gold-300"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <span className="font-bold text-sm sm:text-base text-white truncate">
                            {sc.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStartEdit(sc)}
                            className="text-neutral-500 hover:text-gold-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                            title="Renomear cenário"
                          >
                            <Pencil className="w-3.5 h-3.5" />
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
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono text-neutral-300 bg-white/[0.02] p-3 border border-white/10">
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

                    {/* Ações do Cenário */}
                    <div className="flex items-center justify-end space-x-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDelete(sc.id)}
                        onMouseEnter={() => setCursorVariant('button')}
                        onMouseLeave={() => setCursorVariant('default')}
                        className="px-3 py-2 rounded-none border border-white/15 hover:border-red-500/50 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Excluir este cenário"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApply(sc.inputs)}
                        onMouseEnter={() => setCursorVariant('button')}
                        onMouseLeave={() => setCursorVariant('default')}
                        className="px-4 py-2 rounded-none bg-gold-400/15 hover:bg-gold-400 border border-gold-400/50 hover:border-gold-400 text-gold-400 hover:text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
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
    </motion.div>
  );
};
