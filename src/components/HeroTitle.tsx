import React from 'react';

/**
 * Wordmark do Hero — Brasil Finance
 * - Ícone "bf": O squircle original exato da Opção 3.
 * - Tipografia Customizada "BRASIL FINANCE": Vetorial SVG em tom #d4af37,
 *   com o "Growth Delta" nos 'A's (setas ascendentes ▲)
 *   e o "Rate Slash" nos 'I's e 'E' (corte diagonal de juros em 45º).
 */
export const HeroTitle: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 select-none py-2">
      {/* 1. Ícone Squircle Original da Opção 3 (bf) */}
      <img
        src="/brand/logo-source.png"
        alt="Brasil Finance Logo"
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl shrink-0 drop-shadow-md"
      />

      {/* 2. Tipografia Vetorial Exclusiva BRASIL FINANCE (Growth Delta + Rate Slash) */}
      <svg
        viewBox="0 0 650 64"
        className="w-[260px] sm:w-[380px] md:w-[460px] lg:w-[540px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* WORD: BRASIL */}
        {/* B */}
        <path
          d="M0 2 H28 C40 2 40 26 28 26 H11 V34 H30 C44 34 44 62 30 62 H0 V2 Z M11 12 V18 H24 C28 18 28 12 24 12 Z M11 42 V48 H26 C30 48 30 42 26 42 Z"
          fill="#d4af37"
        />
        {/* R */}
        <path
          d="M52 2 H82 C94 2 94 28 82 28 H64 V62 H52 V2 Z M64 12 V19 H79 C84 19 84 12 79 12 Z M76 28 L96 62 H82 L64 34 Z"
          fill="#d4af37"
        />
        {/* A — Concept 1: Growth Delta ▲ (Sem barra horizontal, topo e cutout em delta) */}
        <g>
          <path
            d="M130 2 L154 62 H140 L130 32 L120 62 H106 L130 2 Z"
            fill="#d4af37"
          />
          {/* Seta Delta Interna (Growth Peak) */}
          <polygon points="130,18 139,40 121,40" fill="#d4af37" />
        </g>
        {/* S */}
        <path
          d="M202 16 H190 C178 16 175 10 175 10 C175 10 175 2 189 2 C203 2 203 12 203 12 M163 48 H176 C188 48 191 54 191 54 C191 54 191 62 177 62 C163 62 163 52 163 52"
          fill="none"
          stroke="#d4af37"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* I — Concept 2: Rate Slash 45º (Corte diagonal de abatimento de juros) */}
        <g>
          <path d="M214 2 H226 V22 L214 34 V2 Z" fill="#d4af37" />
          <path d="M214 38 L226 26 V62 H214 V38 Z" fill="#d4af37" />
        </g>
        {/* L */}
        <path
          d="M238 2 H250 V51 H272 V62 H238 V2 Z"
          fill="#d4af37"
        />

        {/* ESPAÇAMENTO ENTRE PALAVRAS */}

        {/* WORD: FINANCE */}
        {/* F */}
        <path
          d="M294 2 H334 V13 H306 V26 H330 V37 H306 V62 H294 V2 Z"
          fill="#d4af37"
        />
        {/* I — Rate Slash 45º */}
        <g>
          <path d="M346 2 H358 V22 L346 34 V2 Z" fill="#d4af37" />
          <path d="M346 38 L358 26 V62 H346 V38 Z" fill="#d4af37" />
        </g>
        {/* N */}
        <path
          d="M370 2 H382 L402 46 V2 H414 V62 H402 L382 18 V62 H370 V2 Z"
          fill="#d4af37"
        />
        {/* A — Growth Delta ▲ */}
        <g>
          <path
            d="M448 2 L472 62 H458 L448 32 L438 62 H424 L448 2 Z"
            fill="#d4af37"
          />
          <polygon points="448,18 457,40 439,40" fill="#d4af37" />
        </g>
        {/* N */}
        <path
          d="M484 2 H496 L516 46 V2 H528 V62 H516 L496 18 V62 H484 V2 Z"
          fill="#d4af37"
        />
        {/* C */}
        <path
          d="M582 16 C577 6 567 2 559 2 C543 2 536 16 536 32 C536 48 543 62 559 62 C567 62 577 58 582 48"
          fill="none"
          stroke="#d4af37"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* E — Rate Slash no travessão central */}
        <path
          d="M594 2 H634 V13 H606 V25 H628 L616 37 H606 V51 H634 V62 H594 V2 Z"
          fill="#d4af37"
        />
      </svg>
    </div>
  );
};

