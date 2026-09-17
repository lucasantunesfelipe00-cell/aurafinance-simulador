'use client';

import React, { useState } from 'react';
import { FinancingResult } from '@/types/financing';
import { FormattedBRL } from '@/components/FormattedBRL';
import { MouseGlow } from '@/components/MouseGlow';
import { playTypeSound } from '@/lib/sound';
import { Table, Download, Search, ChevronLeft, ChevronRight, FileDown, Loader2 } from 'lucide-react';
import { FinancingInputs } from '@/types/financing';
import { downloadExecutiveDossierPdf } from '@/lib/dossier-pdf';

interface AmortizationTableProps {
  result: FinancingResult;
  inputs?: FinancingInputs;
}

export const AmortizationTable: React.FC<AmortizationTableProps> = ({ result, inputs }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const pageSize = 12; // 12 meses por página

  const installments = result.installments || [];

  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      const activeInputs: FinancingInputs = inputs || {
        category: 'property',
        propertyValue: result.propertyValue,
        downPayment: result.downPayment,
        downPaymentPercent: (result.downPayment / result.propertyValue) * 100,
        interestRateYearly: 10.5,
        termMonths: result.termMonths,
        amortizationMethod: result.method,
        includeInsurances: true,
        monthlyAdminFee: 25,
        mipRateYearly: 0.021,
        dfiRateYearly: 0.008,
      };
      await downloadExecutiveDossierPdf({
        inputs: activeInputs,
        result,
      });
    } catch (err) {
      console.error('Erro ao exportar PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

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
    <MouseGlow size={210} className="editorial-card p-6 border border-white/20 bg-black rounded-none">
      
      {/* Bar Superior da Tabela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <Table className="w-4 h-4 text-white" />
          <div>
            <h3 className="text-xs font-normal uppercase tracking-widest text-gold-400">Cronograma Mês a Mês</h3>
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
              onKeyDown={() => playTypeSound()}
              className="bg-black border border-white/20 rounded-[75px] pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-gold-500 focus:outline-none focus:shadow-[0_0_0_3px_rgba(212,175,55,0.15)] transition-all duration-300 w-full sm:w-40 font-mono"
            />
          </div>

          {/* Exportar Dossiê PDF (Full Pill 75px Button) */}
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="btn-lift flex items-center space-x-1.5 text-xs font-semibold text-black bg-gradient-to-r from-[#a47e35] via-[#c2a25b] to-[#a47e35] px-3.5 sm:px-4 py-1.5 rounded-[75px] hover:brightness-110 transition-all uppercase tracking-wider shrink-0 cursor-pointer shadow-gold-glow-sm"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Gerando...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dossiê PDF</span>
              </>
            )}
          </button>

          {/* Exportar CSV (Full Pill 75px Button) */}
          <button
            onClick={handleExportCSV}
            className="btn-lift flex items-center space-x-1.5 text-xs font-normal text-white hover:text-black px-3.5 sm:px-4 py-1.5 rounded-[75px] border border-white/30 hover:bg-white transition-all uppercase tracking-wider shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Tabela de Parcelas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] min-w-[480px]">
          <thead>
            <tr className="border-b border-white/20 text-neutral-400 font-normal uppercase tracking-widest text-[9px]">
              <th className="py-2.5 px-2">Mês</th>
              <th className="py-2.5 px-2 text-center">Parcela Total</th>
              <th className="py-2.5 px-2 text-center">Amortização</th>
              <th className="py-2.5 px-2 text-center">Juros</th>
              <th className="py-2.5 px-2 text-center">Encargos</th>
              <th className="py-2.5 px-2 text-center">Saldo Devedor</th>
            </tr>
          </thead>
          <tbody key={currentPage} className="divide-y divide-white/10 font-mono animate-fadeIn">
            {currentInstallments.map((inst) => {
              const isFinalPayoff = inst.number === installments.length && installments.length < result.termMonths;
              return (
                <tr
                  key={inst.number}
                  className={`group transition-colors ${
                    isFinalPayoff
                      ? 'bg-emerald-950/40 border-l-2 border-emerald-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <td className="py-2.5 px-2 font-normal text-gold-400 text-[11px] whitespace-nowrap border-l-2 border-transparent group-hover:border-white transition-colors">
                    <div className="flex items-center space-x-1.5">
                      <span>Mês {inst.number}</span>
                      {isFinalPayoff && (
                        <span className="px-1 py-0.5 rounded-full bg-emerald-500 text-black text-[7px] font-bold uppercase tracking-wider leading-none shrink-0">
                          Dívida Quitada!
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-center font-normal text-white">
                    <FormattedBRL value={inst.installmentTotal} />
                  </td>
                  <td className="py-2.5 px-2 text-center text-white">
                    <FormattedBRL value={inst.principalAmortization} />
                  </td>
                  <td className="py-2.5 px-2 text-center text-neutral-300">
                    <FormattedBRL value={inst.interestPaid} />
                  </td>
                  <td className="py-2.5 px-2 text-center text-neutral-400">
                    <FormattedBRL value={inst.insuranceAndFees} />
                  </td>
                  <td className="py-2.5 px-2 text-center text-white font-normal">
                    <FormattedBRL value={inst.outstandingBalance} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginação — cada página cobre 12 meses, então a página vira o ano */}
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10 text-xs">
        <span className="text-neutral-400 text-[11px] font-light">
          {displayedYear}º ano de {totalPages} ({filtered.length} parcelas)
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn-lift p-1.5 rounded-[75px] border border-white/20 disabled:opacity-20 disabled:pointer-events-none text-white hover:border-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-white font-mono text-xs px-2 whitespace-nowrap">
            {displayedYear}º ano
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

    </MouseGlow>
  );
};
