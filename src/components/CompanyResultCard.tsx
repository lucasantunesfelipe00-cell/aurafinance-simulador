"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Mail,
  Phone,
  Server,
  FileCheck,
  AlertTriangle,
  XCircle,
  Copy,
  Check
} from "lucide-react";
import { CNPJData } from "@/types/cnpj";
import { formatarCNPJ, formatarMoeda } from "@/lib/cnpj";
import { audioSynth } from "@/lib/audio";

interface CompanyResultCardProps {
  data: CNPJData;
}

export const CompanyResultCard: React.FC<CompanyResultCardProps> = ({ data }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>("");
  const [decoding, setDecoding] = useState<boolean>(true);

  // Cipher Text Decoding Effect on mount or data change
  useEffect(() => {
    setDecoding(true);
    const targetText = data.razao_social;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*<>/\\";
    let iteration = 0;
    const maxIterations = 20;

    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < (iteration / maxIterations) * targetText.length) {
              return char;
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iteration++;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(targetText);
        setDecoding(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [data]);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    audioSynth.playKeyPress();
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes("ATIV")) {
      return (
        <span className="px-3 py-1 bg-matrix-green text-matrix-bg font-bold border-2 border-matrix-green flex items-center space-x-1.5">
          <FileCheck className="w-4 h-4" />
          <span>[ STATUS: ATIVA // OK ]</span>
        </span>
      );
    }
    if (s.includes("SUSP") || s.includes("PEND")) {
      return (
        <span className="px-3 py-1 bg-matrix-yellow text-matrix-bg font-bold border-2 border-matrix-yellow flex items-center space-x-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>[ STATUS: {s} // WARN ]</span>
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-matrix-red text-matrix-bg font-bold border-2 border-matrix-red flex items-center space-x-1.5">
        <XCircle className="w-4 h-4" />
        <span>[ STATUS: {s} // FAIL ]</span>
      </span>
    );
  };

  return (
    <div className="w-full brutalist-card p-6 my-6 bg-matrix-darkgreen/90 font-mono">
      {/* Header section with Company Name & Status */}
      <div className="border-b-2 border-matrix-green pb-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-matrix-green/80 uppercase mb-1">
              <Building2 className="w-4 h-4 text-matrix-green" />
              <span>REGISTRO_EMPRESARIAL_DECIFRADO</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold tracking-widest text-matrix-green uppercase matrix-glow">
              {decoding ? displayText : data.razao_social}
            </h2>
            {data.nome_fantasia && (
              <p className="text-base text-matrix-mint font-semibold mt-1">
                FANTASIA: {data.nome_fantasia}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            {getStatusBadge(data.descricao_situacao_cadastral)}
            <div className="text-xs text-matrix-green/70 flex items-center space-x-1">
              <Server className="w-3.5 h-3.5" />
              <span>FONTE: {data.source_api || "BrasilAPI"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Data Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Card 1: Identificação Cadastral */}
        <div className="border-2 border-matrix-muted p-4 bg-matrix-bg/60">
          <h3 className="text-sm font-bold border-b border-matrix-muted pb-2 mb-3 text-matrix-mint uppercase flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-matrix-mint" />
            <span>IDENTIFICAÇÃO_CADASTRAL</span>
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <span className="text-matrix-green/70">CNPJ:</span>{" "}
              <strong className="text-matrix-green text-sm">{formatarCNPJ(data.cnpj)}</strong>
            </li>
            <li>
              <span className="text-matrix-green/70">ABERTURA:</span>{" "}
              <span className="text-matrix-green">{data.data_inicio_atividade || "N/I"}</span>
            </li>
            <li>
              <span className="text-matrix-green/70">PORTE:</span>{" "}
              <span className="text-matrix-green">{data.porte || "N/I"}</span>
            </li>
            <li>
              <span className="text-matrix-green/70">NATUREZA JURÍDICA:</span>{" "}
              <span className="text-matrix-green">{data.natureza_juridica || "N/I"}</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Capital & Contato */}
        <div className="border-2 border-matrix-muted p-4 bg-matrix-bg/60">
          <h3 className="text-sm font-bold border-b border-matrix-muted pb-2 mb-3 text-matrix-mint uppercase flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-matrix-mint" />
            <span>CAPITAL_E_CONTATO</span>
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <span className="text-matrix-green/70">CAPITAL SOCIAL:</span>{" "}
              <strong className="text-matrix-yellow text-sm">{formatarMoeda(data.capital_social)}</strong>
            </li>
            <li className="flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-matrix-green/70" />
              <span className="text-matrix-green/70">TEL:</span>{" "}
              <span className="text-matrix-green">{data.ddd_telefone_1 || "NÃO INFORMADO"}</span>
            </li>
            <li className="flex items-center space-x-1 truncate">
              <Mail className="w-3.5 h-3.5 text-matrix-green/70" />
              <span className="text-matrix-green/70">EMAIL:</span>{" "}
              <span className="text-matrix-green truncate">{data.email || "NÃO INFORMADO"}</span>
            </li>
          </ul>
        </div>

        {/* Card 3: Endereço Sede */}
        <div className="border-2 border-matrix-muted p-4 bg-matrix-bg/60 md:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold border-b border-matrix-muted pb-2 mb-3 text-matrix-mint uppercase flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-matrix-mint" />
            <span>ENDEREÇO_SEDE</span>
          </h3>
          <p className="text-xs text-matrix-green leading-relaxed">
            {data.logradouro && `${data.logradouro}, `}
            {data.numero && `Nº ${data.numero} `}
            {data.complemento && `(${data.complemento}) `}
            <br />
            {data.bairro && `BAIRRO: ${data.bairro}`}
            <br />
            {data.municipio && `${data.municipio} - `}
            {data.uf && `${data.uf}`}
            <br />
            {data.cep && `CEP: ${data.cep}`}
          </p>
        </div>
      </div>

      {/* CNAE Principal & Secundários */}
      <div className="border-2 border-matrix-muted p-4 mb-6 bg-matrix-bg/60">
        <h3 className="text-sm font-bold border-b border-matrix-muted pb-2 mb-3 text-matrix-mint uppercase flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-matrix-mint" />
          <span>ATIVIDADE_ECONÔMICA (CNAE)</span>
        </h3>
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-matrix-green/70 font-bold">[ PRINCIPAL ]:</span>{" "}
            <span className="text-matrix-green font-bold">
              {data.cnae_fiscal ? `${data.cnae_fiscal} - ` : ""}
              {data.cnae_fiscal_descricao || "NÃO INFORMADA"}
            </span>
          </div>

          {data.cnaes_secundarios && data.cnaes_secundarios.length > 0 && (
            <div>
              <span className="text-matrix-green/70">[ SECUNDÁRIAS ]:</span>
              <ul className="mt-1 space-y-1 list-disc list-inside text-matrix-green/90 max-h-32 overflow-y-auto pr-2">
                {data.cnaes_secundarios.map((cnae, i) => (
                  <li key={i}>
                    <code>{cnae.codigo}</code> - {cnae.descricao}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* QSA: Quadro de Sócios e Administradores */}
      <div className="border-2 border-matrix-muted p-4 mb-6 bg-matrix-bg/60">
        <div className="flex items-center justify-between border-b border-matrix-muted pb-2 mb-3">
          <h3 className="text-sm font-bold text-matrix-mint uppercase flex items-center space-x-2">
            <Users className="w-4 h-4 text-matrix-mint" />
            <span>QUADRO_DE_SÓCIOS (QSA) [{data.qsa ? data.qsa.length : 0}]</span>
          </h3>
        </div>

        {data.qsa && data.qsa.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-matrix-green bg-matrix-darkgreen text-matrix-green">
                  <th className="p-2 uppercase">NOME DO SÓCIO</th>
                  <th className="p-2 uppercase">QUALIFICAÇÃO</th>
                  <th className="p-2 uppercase">ENTRADA</th>
                  <th className="p-2 uppercase">PAÍS / FAIXA ETÁRIA</th>
                </tr>
              </thead>
              <tbody>
                {data.qsa.map((socio, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-matrix-muted/50 hover:bg-matrix-darkgreen/60 transition-colors"
                  >
                    <td className="p-2 font-bold text-matrix-green">{socio.nome_socio}</td>
                    <td className="p-2 text-matrix-green/90">
                      {socio.qualificacao_socio || "SÓCIO/ADMINISTRADOR"}
                    </td>
                    <td className="p-2 text-matrix-green/80">
                      {socio.data_entrada_sociedade || "N/I"}
                    </td>
                    <td className="p-2 text-matrix-green/80">
                      {socio.pais || socio.faixa_etaria || "BRASIL"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-matrix-green/60 italic p-2">
            * Nenhum sócio individual listado publicamente para este CNPJ ou empresa individual/MEI.
          </p>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-matrix-muted text-xs">
        <div className="text-matrix-green/60 flex items-center space-x-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>CONSULTADO EM: {new Date(data.consulted_at || Date.now()).toLocaleString("pt-BR")}</span>
        </div>

        <button
          onClick={handleCopyJSON}
          className="brutalist-btn text-xs px-4 py-2 flex items-center space-x-2"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-matrix-mint" />
              <span>COPIADO_PARA_TRANSFERÊNCIA!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>[ COPIAR_DADOS_JSON ]</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
