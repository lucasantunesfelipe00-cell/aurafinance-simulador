"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Volume2, VolumeX, Monitor, MonitorOff, Activity, ShieldCheck } from "lucide-react";
import { audioSynth } from "@/lib/audio";

interface TerminalHeaderProps {
  crtEnabled: boolean;
  onToggleCrt: () => void;
  audioMuted: boolean;
  onToggleAudio: () => void;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  crtEnabled,
  onToggleCrt,
  audioMuted,
  onToggleAudio,
}) => {
  const [timeStr, setTimeStr] = useState<string>("");
  const [latency] = useState<number>(14);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const brt = now.toLocaleTimeString("pt-BR", { hour12: false });
      const utc = now.toISOString().slice(11, 19);
      setTimeStr(`BRT ${brt} // UTC ${utc}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full border-b-2 border-matrix-green bg-matrix-darkgreen/90 backdrop-blur px-4 py-3 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Terminal Logo / Title */}
        <div className="flex items-center space-x-3">
          <div className="p-2 border-2 border-matrix-green bg-matrix-bg text-matrix-green shadow-brutalist-sm">
            <Terminal className="w-6 h-6 animate-pulse-glow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-widest uppercase matrix-glow">
                CNPJ_TERMINAL
              </h1>
              <span className="text-xs px-2 py-0.5 border border-matrix-green bg-matrix-green text-matrix-bg font-bold">
                CYBERLOOKUP v2.4
              </span>
            </div>
            <p className="text-xs text-matrix-green/80 hidden sm:block">
              PLATAFORMA DE CONSULTA CADASTRAL // RECEITA FEDERAL SERVERLESS
            </p>
          </div>
        </div>

        {/* Center: System Clock & Edge Status */}
        <div className="hidden lg:flex items-center space-x-6 text-xs text-matrix-green/90">
          <div className="flex items-center space-x-2 border border-matrix-muted px-3 py-1 bg-matrix-bg/50">
            <Activity className="w-3.5 h-3.5 text-matrix-green animate-pulse" />
            <span>EDGE_NODE: <strong className="text-matrix-mint">VERCEL-GRU1</strong> [{latency}ms]</span>
          </div>

          <div className="flex items-center space-x-2 border border-matrix-muted px-3 py-1 bg-matrix-bg/50">
            <ShieldCheck className="w-3.5 h-3.5 text-matrix-mint" />
            <span className="matrix-glow">{timeStr}</span>
          </div>
        </div>

        {/* Right: Controls & Toggles */}
        <div className="flex items-center space-x-3">
          {/* Audio Toggle */}
          <button
            onClick={() => {
              onToggleAudio();
              audioSynth.playKeyPress();
            }}
            className={`brutalist-btn text-xs px-3 py-1.5 flex items-center space-x-2 ${
              audioMuted ? "border-matrix-muted text-matrix-muted shadow-none opacity-80" : ""
            }`}
            title={audioMuted ? "Ativar Efeitos Sonoros" : "Desativar Efeitos Sonoros"}
          >
            {audioMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-matrix-muted" />
                <span>AUDIO: OFF</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-matrix-green animate-pulse" />
                <span>AUDIO: ON</span>
              </>
            )}
          </button>

          {/* CRT Toggle */}
          <button
            onClick={() => {
              onToggleCrt();
              audioSynth.playKeyPress();
            }}
            className={`brutalist-btn text-xs px-3 py-1.5 flex items-center space-x-2 ${
              !crtEnabled ? "border-matrix-muted text-matrix-muted shadow-none opacity-80" : ""
            }`}
            title="Alternar Efeitos de Tela CRT"
          >
            {crtEnabled ? (
              <>
                <Monitor className="w-4 h-4 text-matrix-green" />
                <span>CRT: ON</span>
              </>
            ) : (
              <>
                <MonitorOff className="w-4 h-4 text-matrix-muted" />
                <span>CRT: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
