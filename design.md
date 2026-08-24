# Design System — Brasil Gold & Obsidian Glassmorphism

## 1. Filosofia de Design e Identidade Visual

A identidade visual do **BrasilFinance** foi criada sob a síntese do **Luxo Minimalista Moderno**, unindo a solidez do tom **Preto Obsidiana (#090A0F)**, o brilho nobre do **Ouro Escuro e Ouro Metálico (#D4AF37 / #996515)** e a clareza do **Branco Cristal (#FFFFFF)**. 

A interface utiliza **Glassmorphism de alta densidade**, sombras difusas néon em tons dourados, bordas de gradiente metálico e micro-interações fluidas ao mover sliders e alternar entre modalidades financeiras.

---

## 2. Tokens de Cor (Palette & Design Tokens)

### 2.1 Cores Primárias — Ouro Metálico (Gold Palette)
- **Gold Highlights (Brilho Supremo):** `#FFF7D6` / `rgb(255, 247, 214)`
- **Gold Primary (Ouro Nobre):** `#D4AF37` / `rgb(212, 175, 55)`
- **Gold Metallic (Ouro Escuro):** `#996515` / `rgb(153, 101, 21)`
- **Gold Deep (Sombra Dourada):** `#2C220E` / `rgb(44, 34, 14)`
- **Gold Glow (Sombreamento Neon):** `rgba(212, 175, 55, 0.25)`

### 2.2 Cores Neutras — Preto Obsidiana (Obsidian Dark)
- **Obsidian Pure (Fundo Total):** `#07080A`
- **Obsidian Surface (Cards & Painéis):** `#0E1017`
- **Obsidian Glass (Superfície Translúcida):** `rgba(14, 16, 23, 0.65)`
- **Obsidian Border (Bordas Sutis):** `rgba(255, 255, 255, 0.08)`

### 2.3 Cores de Suporte e Texto
- **Text Crisp White:** `#FFFFFF` (Títulos e destaques primários)
- **Text Slate Silver:** `#94A3B8` (Rótulos e descrições secundárias)
- **Text Gold Muted:** `#C5A059` (Unidades e valores de apoio)

---

## 3. Gradientes Metálicos e Efeitos Especiais

### 3.1 Gradiente de Texto Dourado (`.gold-gradient-text`)
```css
background: linear-gradient(135deg, #FFF8DB 0%, #E6C265 40%, #B8860B 80%, #D4AF37 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### 3.2 Gradiente de Borda Ouro Metálico (`.gold-border-glow`)
```css
border: 1px solid rgba(212, 175, 55, 0.25);
box-shadow: 0 0 20px -3px rgba(212, 175, 55, 0.2), inset 0 0 15px -5px rgba(212, 175, 55, 0.1);
```

### 3.3 Glassmorphism Premium (`.glass-card-gold`)
```css
background: linear-gradient(180deg, rgba(20, 24, 36, 0.75) 0%, rgba(10, 11, 16, 0.88) 100%);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(212, 175, 55, 0.18);
border-radius: 1rem;
```

---

## 4. Estilização de Controles e Sliders Interativos

### Range Slider Dourado Futurista (`input[type="range"]`)
- **Trilho (Track):** Gradiente de base preta com preenchimento dourado dinâmico conforme a porcentagem selecionada.
- **Botão (Thumb):** Círculo metálico dourado com anel de brilho externo (`box-shadow: 0 0 12px #D4AF37`) que expande ao receber foco ou ser arrastado.

---

## 5. Tipografia e Hierarquia Visual

- **Fonte Principal:** `Inter`, `Plus Jakarta Sans` ou `system-ui` sem serifa de alta legibilidade.
- **Valores Monetários Grandes (H1/Display):** Peso 700 / 800, com suporte a separadores de milhar claros e símbolo de moeda `R$` em tom dourado com leve opacidade.
- **Rótulos de Input:** Caixa alta levemente espaçada (`tracking-wider text-xs font-semibold uppercase text-amber-200/80`).

---

## 6. Micro-Interações e Transições

1. **Hover nos KPI Cards:** Elevação suave do card em Y (`transform: translateY(-3px)`) acompanhada por aumento da intensidade da luz dourada de fundo.
2. **Alternador SAC / PRICE:** Transição suave com `layoutId` do Framer Motion ou CSS transition no indicador metálico deslizante.
3. **Pulse de Atualização nos Números:** Brilho instantâneo dourado nos textos de KPI ao mover qualquer parâmetro de simulação.