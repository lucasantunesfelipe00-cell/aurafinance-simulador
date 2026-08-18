"use client";

import React from "react";
import { Zap, Building2 } from "lucide-react";
import { audioSynth } from "@/lib/audio";

interface DemoShortcut {
  name: string;
  cnpj: string;
  category: string;
}

const DEMO_CNPJS: DemoShortcut[] = [
  { name: "PETROBRAS", cnpj: "33000167000101", category: "Energia" },
  { name: "GOOGLE BRASIL", cnpj: "06990590000123", category: "Tecnologia" },
  { name: "BANCO DO BRASIL", cnpj: "00000000000191", category: "Financeiro" },
  { name: "MAGAZINE LUIZA", cnpj: "47960950000121", category: "Varejo" },
  { name: "ITAÚ UNIBANCO", cnpj: "60701190000104", category: "Financeiro" },
];

interface DemoShortcutsProps {
  onSelect: (cnpj: string) => void;
  disabled?: boolean;
}

export const DemoShortcuts: React.FC<DemoShortcutsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="w-full brutalist-card-muted p-4 mb-6">
      <div className="flex items-center space-x-2 text-xs font-bold text-matrix-green mb-3 uppercase tracking-wider">
        <Zap className="w-4 h-4 text-matrix-yellow animate-pulse" />
        <span>ATALHOS_DEMO // AMBOSTRAS_RÁPIDAS:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {DEMO_CNPJS.map((item) => (
          <button
            key={item.cnpj}
            disabled={disabled}
            onClick={() => {
              audioSynth.playKeyPress();
              onSelect(item.cnpj);
            }}
            className="brutalist-btn text-xs px-3 py-1.5 flex items-center space-x-2 hover:bg-matrix-green hover:text-matrix-bg transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>[{item.name}]</span>
          </button>
        ))}
      </div>
    </div>
  );
};
