'use client';

import React, { useState } from 'react';
import { FinancingResult } from '@/types/financing';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { playTypeSound } from '@/lib/sound';
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
  // Cada página cobre 12 meses (um ano); deriva o ano exibido da própria linha visível,
  // pra continuar correto mesmo quando a busca filtra os resultados.
  const displayedYear = currentInstallments[0]
    ? Math.ceil(currentInstallments[0].number / 12)
    : currentPage;

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
    link.setAttribute('download', `brasilfinance_amortizacao_${result.method.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MouseGlow className="editorial-card-light p-6">

      {/* Bar Superior da Tabela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b-2 border-ink-950/10">
        <div className="flex items-center space-x-2.5">
          <Table className="w-4 h-4 text-ink-950" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">Cronograma Mês a Mês</h3>
            <p className="text-[11px] text-ink-600">Detalhamento completo das parcelas</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Campo de Busca */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar mês/ano..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              onKeyDown={() => playTypeSound()}
              className="bg-white border border-ink-950/20 rounded-none pl-9 pr-3 py-1.5 text-xs text-ink-950 placeholder-ink-500 focus:border-accent focus:outline-none transition-all duration-300 w-full sm:w-40 font-mono"
            />
          </div>

          {/* Exportar CSV */}
          <button
            onClick={handleExportCSV}
            className="btn-lift flex items-center space-x-1.5 text-xs font-semibold text-ink-950 hover:text-white px-4 py-1.5 rounded-none border border-ink-950/30 hover:bg-ink-950 transition-all uppercase tracking-wider shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Tabela de Parcelas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] min-w-[480px]">
          <thead>
            <tr className="border-b-2 border-ink-950/20 text-ink-600 font-semibold uppercase tracking-widest text-[9px]">
              <th className="py-2.5 px-2">Mês</th>
              <th className="py-2.5 px-2 text-center">Parcela Total</th>
              <th className="py-2.5 px-2 text-center">Amortização</th>
              <th className="py-2.5 px-2 text-center">Juros</th>
              <th className="py-2.5 px-2 text-center">Encargos</th>
              <th className="py-2.5 px-2 text-center">Saldo Devedor</th>
            </tr>
          </thead>
          <tbody key={currentPage} className="divide-y divide-ink-950/10 font-mono animate-fadeIn">
            {currentInstallments.map((inst) => (
              <tr key={inst.number} className="group hover:bg-ink-100 transition-colors">
                <td className="py-2.5 px-2 font-semibold text-accent text-[11px] whitespace-nowrap border-l-2 border-transparent group-hover:border-ink-950 transition-colors">
                  Mês {inst.number}
                </td>
                <td className="py-2.5 px-2 text-center font-semibold text-ink-950">
                  <FormattedBRL value={inst.installmentTotal} />
                </td>
                <td className="py-2.5 px-2 text-center text-ink-950">
                  <FormattedBRL value={inst.principalAmortization} />
                </td>
                <td className="py-2.5 px-2 text-center text-ink-700">
                  <FormattedBRL value={inst.interestPaid} />
                </td>
                <td className="py-2.5 px-2 text-center text-ink-600">
                  <FormattedBRL value={inst.insuranceAndFees} />
                </td>
                <td className="py-2.5 px-2 text-center text-ink-950 font-semibold">
                  <FormattedBRL value={inst.outstandingBalance} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação — cada página cobre 12 meses, então a página vira o ano */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t-2 border-ink-950/10 text-xs">
        <span className="text-ink-600 text-[11px]">
          {displayedYear}º ano de {totalPages} ({filtered.length} parcelas)
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-lift p-1.5 rounded-none border border-ink-950/20 disabled:opacity-20 disabled:pointer-events-none text-ink-950 hover:border-ink-950 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-ink-950 font-mono text-xs px-2 whitespace-nowrap">
            {displayedYear}º ano
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn-lift p-1.5 rounded-none border border-ink-950/20 disabled:opacity-20 disabled:pointer-events-none text-ink-950 hover:border-ink-950 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </MouseGlow>
  );
};
