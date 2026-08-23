'use client';

import React, { useState } from 'react';
import { FinancingResult } from '@/types/financing';
import { FormattedBRL } from '@/components/FormattedBRL';
import { Table, Download, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface AmortizationTableProps {
  result: FinancingResult;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ result }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const pageSize = 12; // 12 meses por página

  const installments = result.installments || [];

  const filtered = installments.filter((inst) => {
    if (!searchTerm) return true;
    const searchNum = parseInt(searchTerm, 10);
    if (isNaN(searchNum)) return true;
    return inst.number === searchNum || Math.ceil(inst.number / 12) === searchNum;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentInstallments = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    <div className="editorial-card p-6 border border-white/20 bg-black rounded-none">
      
      {/* Bar Superior da Tabela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <Table className="w-4 h-4 text-white" />
          <div>
            <h3 className="text-xs font-normal uppercase tracking-widest text-white">Cronograma Mês a Mês</h3>
            <p className="text-[11px] text-neutral-400 font-light">Detalhamento completo das parcelas</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Campo de Busca (Full Pill 75px) */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar mês/ano..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-black border border-white/20 rounded-[75px] pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-white focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)] transition-all duration-300 w-full sm:w-40 font-mono"
            />
          </div>

          {/* Exportar CSV (Full Pill 75px Button) */}
          <button
            onClick={handleExportCSV}
            className="btn-lift flex items-center space-x-1.5 text-xs font-normal text-white hover:text-black px-4 py-1.5 rounded-[75px] border border-white/30 hover:bg-white transition-all uppercase tracking-wider shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Tabela de Parcelas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[550px]">
          <thead>
            <tr className="border-b border-white/20 text-neutral-400 font-normal uppercase tracking-widest text-[10px]">
              <th className="py-3 px-3">Mês / Ano</th>
              <th className="py-3 px-3 text-right">Parcela Total</th>
              <th className="py-3 px-3 text-right">Amortização</th>
              <th className="py-3 px-3 text-right">Juros</th>
              <th className="py-3 px-3 text-right">Encargos</th>
              <th className="py-3 px-3 text-right">Saldo Devedor</th>
            </tr>
          </thead>
          <tbody key={currentPage} className="divide-y divide-white/10 font-mono animate-fadeIn">
            {currentInstallments.map((inst) => {
              const yearNum = Math.ceil(inst.number / 12);
              return (
                <tr key={inst.number} className="group hover:bg-white/5 transition-colors">
                  <td className="py-3 px-3 font-normal text-white text-xs border-l-2 border-transparent group-hover:border-white transition-colors">
                    Mês {inst.number} <span className="text-[10px] text-neutral-500 font-normal">({yearNum}º ano)</span>
                  </td>
                  <td className="py-3 px-3 text-right font-normal text-white">
                    <FormattedBRL value={inst.installmentTotal} />
                  </td>
                  <td className="py-3 px-3 text-right text-white">
                    <FormattedBRL value={inst.principalAmortization} />
                  </td>
                  <td className="py-3 px-3 text-right text-neutral-300">
                    <FormattedBRL value={inst.interestPaid} />
                  </td>
                  <td className="py-3 px-3 text-right text-neutral-400">
                    <FormattedBRL value={inst.insuranceAndFees} />
                  </td>
                  <td className="py-3 px-3 text-right text-white font-normal">
                    <FormattedBRL value={inst.outstandingBalance} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10 text-xs">
        <span className="text-neutral-400 text-[11px] font-light">
          Página {currentPage} de {totalPages} ({filtered.length} parcelas)
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-lift p-1.5 rounded-[75px] border border-white/20 disabled:opacity-20 disabled:pointer-events-none text-white hover:border-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-white font-mono text-xs px-2">
            {currentPage}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-lift p-1.5 rounded-[75px] border border-white/20 disabled:opacity-20 disabled:pointer-events-none text-white hover:border-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
