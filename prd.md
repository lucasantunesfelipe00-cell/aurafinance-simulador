# Product Requirement Document (PRD) — BrasilFinance Simulador de Financiamentos

## 1. Visão Geral do Produto

**Nome do Produto:** BrasilFinance — Simulador de Financiamentos Elite  
**Posicionamento:** Uma plataforma web de inteligência financeira e simulação avançada de crédito imobiliário de alta precisão. O produto alia matemática financeira precisa (Tabelas SAC e PRICE) a uma interface de alto luxo visual inspirada no conceito **"Obsidian & Gold Glassmorphism"**.

---

## 2. Objetivos do Produto

1. **Clareza e Transparência Financeira:** Permitir que qualquer comprador ou investidor imobiliário compare e compreenda com facilidade o peso dos juros, amortização, seguros (MIP/DFI) e taxas administrativas em um financiamento imobiliário antes de assinar contrato.
2. **Alta Precisão de Cálculo:** Calcular parcelas mês a mês considerando amortização constante (SAC) e parcelas fixas (PRICE), saldo devedor corrigido e encargos habitacionais regulamentares (seguros MIP/DFI e taxa de administração).
3. **Experiência de Usuário Memorável:** Proporcionar uma interface ultra fluida, com micro-animações, sliders com brilho neon dourado e cartões com transparência fosca (glassmorphism).
4. **Tomada de Decisão Ágil:** Permitir comparação direta lado a lado entre SAC e PRICE com indicativo numérico e gráfico do modelo mais econômico em juros totais para imóveis.

---

## 3. Público-Alvo e Casos de Uso

### Público-Alvo
- **Compradores de Imóveis:** Pessoas físicas planejando aquisição da casa própria, apartamentos ou terrenos através de financiamentos de longo prazo (SFH/SFI).
- **Consultores Financeiros e Corretores Imobiliários:** Profissionais que necessitam simular cenários rápidos para apresentar a clientes de alto padrão.
- **Investidores Imobiliários:** Pessoas que avaliam o impacto financeiro, fluxo de amortização e rentabilidade antes de alocar capital.

### Casos de Uso
1. **Simulação Imobiliária Completa:** O usuário informa o valor do imóvel (ex: R$ 600.000), a entrada (ex: R$ 120.000 - 20%), a taxa de juros anual (ex: 10.5% a.a.) e o prazo (ex: 360 meses). O sistema atualiza instantaneamente as parcelas inicial e final, o acumulado de juros e gera a evolução em gráfico.
2. **Comparação SAC vs. PRICE:** Com 1 clique no botão "Comparar Modalidades", o usuário visualiza uma matriz contrastante mostrando a economia em reais ao optar pelo sistema SAC frente ao PRICE no financiamento do seu imóvel.
3. **Análise de Amortização Extraordinária:** O usuário visualiza como aportes adicionais reduzem o prazo total ou o valor da prestação mensal do seu crédito imobiliário.

---

## 4. Funcionalidades Principais (Requirements)

| ID | Funcionalidade | Descrição | Prioridade |
|---|---|---|---|
| **FR-01** | **Inteligência de Crédito Imobiliário** | Simulação especializada para aquisição de imóveis residenciais e comerciais, com parametrização de valor do imóvel, entrada, taxa anual e prazos de até 420 meses. | **P0** |
| **FR-02** | **Entrada com Máscara e Sliders** | Campos numéricos sincronizados com sliders responsivos com iluminação dourada para Valor do Imóvel, Entrada, Taxa de Juros e Prazo. | **P0** |
| **FR-03** | **Alternador SAC / PRICE** | Troca instantânea entre o Sistema de Amortização Constante (SAC) e a Tabela Price com recálculo automático. | **P0** |
| **FR-04** | **Sumário de KPIs Luxuoso** | Exibição em destaque de: Primeira Parcela, Última Parcela, Total de Juros, Total de Taxas/Seguros e Total Pago do imóvel. | **P0** |
| **FR-05** | **Gráfico de Evolução de Saldo** | Visualização gráfica responsiva em curva SVG da trajetória do Saldo Devedor x Juros Pagos x Amortização Imobiliária. | **P1** |
| **FR-06** | **Tabela Detalhada de Parcelas** | Tabela interativa mês a mês mostrando número da parcela, valor, juros, amortização, seguros MIP/DFI/ADM e saldo devedor remanescente. | **P1** |
| **FR-07** | **Comparador Modal de Cenários** | Comparador analítico integrado que coloca SAC e PRICE lado a lado destacando a diferença de custo em reais para o imóvel financiado. | **P1** |
| **FR-08** | **Exportação e Compartilhamento** | Cópia rápida de parâmetros da simulação e impressão direta da página. *(Exportação de relatório analítico em PDF estruturado planejada para Roadmap V2)*. | **P2** |

---

## 5. Requisitos Não-Funcionais

- **Design & Estética:** Identidade limpa "Obsidian & Gold". Fundo escuro obsidiana, acentos em tom de ouro rico (`#D4AF37`), branco cristal (`#FFFFFF`) para textos e gradientes metálicos reluzentes com efeito glassmorphism.
- **Performance:** Tempo de cálculo client-side < 16ms (60 FPS contínuos durante o deslizar de range sliders).
- **Responsividade:** Layout 100% responsivo para mobile, tablet e desktop.
- **Acessibilidade:** Alto contraste entre textos e background escuro, suporte a navegação por teclado nos inputs.