'use client';

import React, { useState } from 'react';
import { FinancingResult, Installment } from '@/types/financing';
import { formatBRL } from '@/lib/financing-calculator';
import { Table, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface AmortizationTableProps {
  result: FinancingResult;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ result }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 12; // 1 ano por página

  const installments = result.installments || [];

  // Filtro por mês ou ano digitado
  const filtered = installments.filter((inst) => {
    if (!searchTerm) return true;
    const searchNum = parseInt(searchTerm, 10);
    if (isNaN(searchNum)) return true;
    return inst.number === searchNum || Math.ceil(inst.number / 12) === searchNum;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentInstallments = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Função de Exportação CSV
  const handleExportCSV = () => {
    const headers = ['Mes', 'Parcela_Total', 'Amortizacao', 'Juros', 'Seguros_Taxas', 'Saldo_Devedor'];
    const rows = installments.map((i) => [
      i.number,
      i.installmentTotal.toFixed(2),
      i.principalAmortization.toFixed(2),
      i.interestPaid.toFixed(2),
      i.insuranceAndFees.toFixed(2),
      i.outstandingBalance.toFixed(2),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aurafinance_amortizacao_${result.method.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-gold-500/20">
      
      {/* Top Bar da Tabela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-gold-500/10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Cronograma Mês a Mês</h3>
            <p className="text-xs text-gray-400">Detalhamento exato de amortização, juros e saldo devedor</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Busca */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar mês/ano..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-obsidian-950 border border-gold-500/20 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-gold-400 focus:outline-none w-36 sm:w-44"
            />
          </div>

          {/* Download CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 text-xs font-semibold text-gold-400 hover:text-white px-3 py-1.5 rounded-xl border border-gold-500/30 hover:border-gold-400 bg-gold-500/10 hover:bg-gold-500/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gold-500/20 text-gold-300 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Mês / Ano</th>
              <th className="py-3 px-4 text-right">Parcela Total</th>
              <th className="py-3 px-4 text-right">Amortização</th>
              <th className="py-3 px-4 text-right">Juros</th>
              <th className="py-3 px-4 text-right">Encargos/Seguros</th>
              <th className="py-3 px-4 text-right">Saldo Devedor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800/60 font-mono">
            {currentInstallments.map((inst) => {
              const yearNum = Math.ceil(inst.number / 12);
              return (
                <tr key={inst.number} className="hover:bg-gold-500/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    Mês {inst.number} <span className="text-[10px] text-gray-500 font-normal">({yearNum}º ano)</span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white">
                    {formatBRL(inst.installmentTotal)}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    {formatBRL(inst.principalAmortization)}
                  </td>
                  <td className="py-3 px-4 text-right text-gold-400">
                    {formatBRL(inst.interestPaid)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400">
                    {formatBRL(inst.insuranceAndFees)}
                  </td>
                  <td className="py-3 px-4 text-right text-amber-200 font-bold">
                    {formatBRL(inst.outstandingBalance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gold-500/10 text-xs">
        <span className="text-gray-400">
          Exibindo {currentInstallments.length} de {filtered.length} parcelas
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-gold-500/20 disabled:opacity-40 text-gray-300 hover:text-white hover:border-gold-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-white font-mono font-bold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-gold-500/20 disabled:opacity-40 text-gray-300 hover:text-white hover:border-gold-400"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
