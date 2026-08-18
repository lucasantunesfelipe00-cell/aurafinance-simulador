"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Search, CheckCircle2, AlertTriangle, XCircle, RotateCcw } from "lucide-react";
import { formatarCNPJ, validarCNPJ, limparCNPJ } from "@/lib/cnpj";
import { audioSynth } from "@/lib/audio";

interface CnpjInputFormProps {
  onSearch: (cnpj: string) => void;
  isLoading: boolean;
  externalCnpj?: string;
}

export const CnpjInputForm: React.FC<CnpjInputFormProps> = ({
  onSearch,
  isLoading,
  externalCnpj = "",
}) => {
  const [inputVal, setInputVal] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (externalCnpj) {
      const formatted = formatarCNPJ(externalCnpj);
      setInputVal(formatted);
      const clean = limparCNPJ(formatted);
      setIsValid(clean.length === 14 ? validarCNPJ(clean) : null);
    }
  }, [externalCnpj]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const formatted = formatarCNPJ(raw);
    setInputVal(formatted);
    audioSynth.playKeyPress();

    const clean = limparCNPJ(formatted);
    if (clean.length === 14) {
      const valid = validarCNPJ(clean);
      setIsValid(valid);
    } else {
      setIsValid(null);
    }
  };

  const handleClear = () => {
    setInputVal("");
    setIsValid(null);
    audioSynth.playKeyPress();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = limparCNPJ(inputVal);

    if (clean.length !== 14 || !validarCNPJ(clean)) {
      setIsValid(false);
      audioSynth.playErrorBuzz();
      return;
    }

    audioSynth.playScanBeep();
    onSearch(clean);
  };

  return (
    <div className="w-full brutalist-card p-6 my-6 bg-matrix-darkgreen/80">
      <div className="flex items-center justify-between border-b-2 border-matrix-green pb-3 mb-4">
        <div className="flex items-center space-x-2 text-sm font-bold uppercase tracking-wider">
          <Search className="w-4 h-4 text-matrix-green" />
          <span className="matrix-glow">ENTRADA_DE_DADOS // CONSULTA_CNPJ</span>
        </div>
        <div className="text-xs text-matrix-green/70">
          [ MÁSCARA: 00.000.000/0001-00 ]
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="relative">
          <label htmlFor="cnpj-input" className="sr-only">
            Número do CNPJ
          </label>
          <div className="flex items-center border-2 border-matrix-green bg-matrix-bg p-2 focus-within:border-matrix-mint focus-within:ring-1 focus-within:ring-matrix-mint">
            <span className="text-matrix-green font-bold text-lg mr-2 select-none">
              &gt;
            </span>
            <input
              id="cnpj-input"
              type="text"
              value={inputVal}
              onChange={handleChange}
              placeholder="00.000.000/0001-00"
              maxLength={18}
              disabled={isLoading}
              className="w-full bg-transparent text-matrix-green font-mono text-xl md:text-3xl font-bold tracking-widest outline-none placeholder:text-matrix-muted uppercase"
              autoComplete="off"
              spellCheck="false"
            />

            {/* Status indicator badge */}
            <div className="flex items-center space-x-2 px-2 select-none">
              {inputVal.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-matrix-muted hover:text-matrix-red p-1 transition-colors"
                  title="Limpar campo"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}

              {isValid === true && (
                <div className="flex items-center space-x-1 text-xs text-matrix-green bg-matrix-darkgreen border border-matrix-green px-2 py-1">
                  <CheckCircle2 className="w-4 h-4 text-matrix-green" />
                  <span className="hidden sm:inline font-bold">DIGITOS_OK</span>
                </div>
              )}

              {isValid === false && (
                <div className="flex items-center space-x-1 text-xs text-matrix-red bg-matrix-darkgreen border border-matrix-red px-2 py-1">
                  <XCircle className="w-4 h-4 text-matrix-red animate-bounce" />
                  <span className="hidden sm:inline font-bold">CNPJ_INVÁLIDO</span>
                </div>
              )}

              {isValid === null && inputVal.length > 0 && (
                <div className="flex items-center space-x-1 text-xs text-matrix-yellow bg-matrix-darkgreen border border-matrix-yellow px-2 py-1">
                  <AlertTriangle className="w-4 h-4 text-matrix-yellow" />
                  <span className="hidden sm:inline font-bold">DIGITANDO...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-matrix-green/80">
            * Validação local imediata dos 2 dígitos verificadores antes da requisição.
          </p>

          <button
            type="submit"
            disabled={isLoading || isValid === false || limparCNPJ(inputVal).length !== 14}
            className="w-full sm:w-auto brutalist-btn px-8 py-3 text-base flex items-center justify-center space-x-3"
          >
            <Search className="w-5 h-5" />
            <span>{isLoading ? "PROCESSANDO..." : "[ EXAMINAR_EMPRESA ]"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
