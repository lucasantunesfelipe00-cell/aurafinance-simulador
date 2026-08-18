export type CategoryType = 'property' | 'vehicle' | 'personal';
export type AmortizationMethod = 'SAC' | 'PRICE';

export interface FinancingInputs {
  category: CategoryType;
  propertyValue: number;         // Valor total do bem (R$)
  downPayment: number;            // Valor da entrada (R$)
  downPaymentPercent: number;     // % de entrada
  interestRateYearly: number;     // Taxa de juros anual (% a.a.)
  termMonths: number;             // Prazo total em meses
  amortizationMethod: AmortizationMethod;
  includeInsurances: boolean;     // Incluir encargos adicionais
  monthlyAdminFee: number;        // Taxa fixa mensal de administração (R$)
  mipRateYearly: number;          // Taxa MIP (Morte/Invalidez) % a.a.
  dfiRateYearly: number;          // Taxa DFI (Danos ao imóvel) % a.a.
}

export interface Installment {
  number: number;                 // Mês (1..n)
  installmentTotal: number;       // Valor total a pagar no mês (R$)
  principalAmortization: number;  // Valor destinado a amortizar a dívida (R$)
  interestPaid: number;           // Juros do mês (R$)
  insuranceAndFees: number;       // Seguros + ADM do mês (R$)
  outstandingBalance: number;     // Saldo devedor remanescente (R$)
  accumulatedInterest: number;    // Juros acumulados até este mês (R$)
  accumulatedPaid: number;        // Total pago acumulado até este mês (R$)
}

export interface FinancingResult {
  method: AmortizationMethod;
  propertyValue: number;
  downPayment: number;
  loanAmount: number;             // Valor financiado (PV)
  termMonths: number;
  firstInstallment: number;       // Valor da 1ª parcela (R$)
  lastInstallment: number;        // Valor da última parcela (R$)
  totalPaid: number;              // Valor total desembolsado no fim do contrato (R$)
  totalInterest: number;          // Total pago apenas em juros (R$)
  totalInsurancesAndFees: number; // Total pago em taxas/seguros (R$)
  effectiveYearlyRate: number;    // CET aproximado (% a.a.)
  installments: Installment[];    // Tabela detalhada mês a mês
}

export interface ComparisonResult {
  sac: FinancingResult;
  price: FinancingResult;
  interestSavingsSAC: number;     // Economia em juros ao optar pelo SAC (R$)
  percentageSavings: number;      // Economia percentual do SAC em relação ao PRICE
}
