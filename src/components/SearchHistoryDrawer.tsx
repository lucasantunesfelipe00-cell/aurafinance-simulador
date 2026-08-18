"use client";

import React from "react";
import { History, Trash2, ArrowRight } from "lucide-react";
import { CNPJSearchHistoryItem } from "@/types/cnpj";
import { formatarCNPJ } from "@/lib/cnpj";
import { audioSynth } from "@/lib/audio";

interface SearchHistoryDrawerProps {
  history: CNPJSearchHistoryItem[];
  onSelect: (cnpj: string) => void;
  onClear: () => void;
}

export const SearchHistoryDrawer: React.FC<SearchHistoryDrawerProps> = ({
  history,
  onSelect,
  onClear,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full brutalist-card-muted p-4 my-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-matrix-muted pb-2 mb-3">
        <div className="flex items-center space-x-2 text-matrix-mint font-bold uppercase tracking-wider">
          <History className="w-4 h-4 text-matrix-mint" />
          <span>CYBER_LOG // HISTÓRICO_LOCAL_RECENTE ({history.length}/5)</span>
        </div>

        <button
          onClick={() => {
            audioSynth.playKeyPress();
            onClear();
          }}
          className="text-matrix-muted hover:text-matrix-red flex items-center space-x-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>LIMPAR_HISTÓRICO</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => (
          <button
            key={item.cnpj + item.timestamp}
            onClick={() => {
              audioSynth.playKeyPress();
              onSelect(item.cnpj);
            }}
            className="border border-matrix-muted bg-matrix-bg/80 hover:border-matrix-green hover:bg-matrix-darkgreen p-3 text-left transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-matrix-green group-hover:text-matrix-mint">
                  {formatarCNPJ(item.cnpj)}
                </span>
                <span className="text-[10px] text-matrix-muted">
                  {new Date(item.timestamp).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-matrix-green/80 font-semibold truncate group-hover:text-matrix-green">
                {item.razao_social}
              </p>
            </div>

            <div className="mt-2 pt-2 border-t border-matrix-muted/40 flex items-center justify-between text-[11px]">
              <span className="text-matrix-muted">[ {item.descricao_situacao_cadastral} ]</span>
              <ArrowRight className="w-3.5 h-3.5 text-matrix-green opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
