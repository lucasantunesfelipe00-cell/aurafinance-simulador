# Technical Specification (SPEC) — BrasilFinance Simulador de Financiamentos

## 1. Arquitetura do Sistema

A aplicação foi construída sobre uma arquitetura **Single Page Application (SPA) reativa e de alta performance** utilizando **Next.js 14 (App Router)** com **React 18** e **TypeScript**. Todo o processamento financeiro e geração de tabelas de amortização é executado no client-side em tempo real via hooks reativos do React.

```
[ Usuário / UI Layer ]
       │
       ├── Inputs (Sliders & Form) ──> [ React State: FinancingInputs ]
       │                                         │
       │                                         ▼
       │                          [ Engine: financing-calculator.ts ]
       │                                 ├── SAC Algorithm
       │                                 └── PRICE Algorithm
       │                                         │
       │                                         ▼
       └── Display (KPIs, Charts, Table) <── [ FinancingResult State ]
```

---

## 2. Fórmulas e Engenharia Financeira

### 2.1 Notação de Variáveis
- \( V \): Valor total do bem (R$)
- \( E \): Valor da entrada (R$)
- \( PV \): Valor a ser financiado (\( PV = V - E \))
- \( n \): Prazo em meses
- \( i_a \): Taxa de juros anual (% a.a.)
- \( i \): Taxa de juros mensal proporcional (\( i = (1 + i_a)^{1/12} - 1 \) ou \( i = i_a / 12 \))
- \( MIP \): Seguro Morte e Invalidez Permanente (taxa sobre saldo devedor)
- \( DFI \): Seguro Danos Físicos ao Imóvel (taxa fixa sobre valor do imóvel)
- \( ADM \): Taxa mensal de administração fixa (ex: R$ 25,00)

### 2.2 Sistema de Amortização Constante (SAC)
No SAC, a parcela de amortização do capital é constante durante todo o contrato:

\[
A = \frac{PV}{n}
\]

Para cada mês \( k \) (onde \( 1 \le k \le n \)):
- Saldo devedor anterior: \( SD_{k-1} \) (com \( SD_0 = PV \))
- Juros do mês: \( J_k = SD_{k-1} \times i \)
- Amortização do mês: \( A_k = A \)
- Prestação pura: \( P_k = A_k + J_k \)
- Seguros e Taxas: \( S_k = (SD_{k-1} \times \text{MIP}) + (V \times \text{DFI}) + ADM \)
- Parcela total a pagar: \( PMT_k = P_k + S_k \)
- Novo saldo devedor: \( SD_k = SD_{k-1} - A_k \)

### 2.3 Sistema de Amortização Francês (Tabela PRICE)
Na Tabela Price, a prestação pura (amortização + juros) é fixa ao longo de todo o prazo:

\[
PMT_{\text{pura}} = PV \times \left[ \frac{i \times (1 + i)^n}{(1 + i)^n - 1} \right]
\]

Para cada mês \( k \):
- Juros do mês: \( J_k = SD_{k-1} \times i \)
- Amortização do mês: \( A_k = PMT_{\text{pura}} - J_k \)
- Seguros e Taxas: \( S_k = (SD_{k-1} \times \text{MIP}) + (V \times \text{DFI}) + ADM \)
- Parcela total a pagar: \( PMT_k = PMT_{\text{pura}} + S_k \)
- Novo saldo devedor: \( SD_k = SD_{k-1} - A_k \)

---

## 3. Estrutura de Dados e Tipos TypeScript

### `src/types/financing.ts`

```typescript
export type CategoryType = 'property' | 'vehicle' | 'personal';
export type AmortizationMethod = 'SAC' | 'PRICE';

export interface FinancingInputs {
  category: CategoryType;
  propertyValue: number;       // Valor total do bem
  downPayment: number;          // Valor da entrada
  downPaymentPercent: number;   // % de entrada em relação ao valor total
  interestRateYearly: number;   // Taxa de juros anual (% a.a.)
  termMonths: number;           // Prazo em meses
  amortizationMethod: AmortizationMethod;
  includeInsurances: boolean;   // Se inclui seguros MIP/DFI e ADM
  monthlyAdminFee: number;      // Taxa fixa mensal R$
}

export interface Installment {
  number: number;               // Mês (1..n)
  installmentTotal: number;     // Valor total da parcela (R$)
  principalAmortization: number;// Valor que amortiza a dívida (R$)
  interestPaid: number;         // Juros cobrados no mês (R$)
  insuranceAndFees: number;     // Seguros + taxa ADM (R$)
  outstandingBalance: number;   // Saldo devedor final do mês (R$)
  accumulatedInterest: number;  // Juros acumulados até o mês (R$)
}

export interface FinancingResult {
  method: AmortizationMethod;
  loanAmount: number;           // Valor financiado (PV)
  firstInstallment: number;     // Valor da 1ª parcela
  lastInstallment: number;      // Valor da última parcela
  totalPaid: number;            // Total acumulado desembolsado
  totalInterest: number;        // Total acumulado pago de juros
  totalInsurancesAndFees: number; // Total acumulado de tarifas/seguros
  effectiveYearlyRate: number;  // CET aproximado (% a.a.)
  installments: Installment[];  // Tabela mês a mês
}
```

---

## 4. Componentes da Interface de Usuário

1. **`Header`**: Logo com gradiente Ouro Metálico (`bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500`), badge de status live e controle de visualização.
2. **`FinancingForm`**: Painel de inputs com máscaras monetárias, seletores de modalidade (Imóvel/Veículo/Pessoal, SAC/PRICE) e range sliders estilizados com luz de néon dourada (`shadow-[0_0_15px_rgba(212,175,55,0.4)]`).
3. **`ResultsSummary`**: Grade 4-column de KPIs em cartões com glassmorphism (`backdrop-blur-md bg-black/40 border border-amber-500/20`), destacando a economia entre sistemas de amortização.
4. **`AmortizationChart`**: Gráfico vetorial SVG interativo construído com áreas sombreadas douradas, exibindo o declínio do saldo devedor e o crescimento acumulado de juros pago.
5. **`AmortizationTable`**: Tabela com scroll virtual ou paginação de 12 meses por página, filtros de busca por número do mês/ano e exportação em formato `.csv` / impressão.
6. **`ComparatorModal`**: Comparador lado a lado gerando recálculo instantâneo para SAC e PRICE com métricas de economia.

---

## 5. Tratamento de Exceções e Edge Cases

- **Entrada maior que valor do bem:** Se a entrada \( E \ge V \), a interface impede o envio e exibe alerta visual dourado solicitando reajuste.
- **Entrada mínima:** Para imóveis, valida-se alerta se a entrada for menor que 20% do valor do bem.
- **Divisão por zero ou taxas nulas:** O motor de cálculo suporta juros 0.0% a.a. sem quebrar a equação da Tabela Price (chaveando diretamente para \( PMT = PV / n \)).