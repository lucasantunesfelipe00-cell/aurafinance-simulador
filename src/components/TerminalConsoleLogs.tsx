"use client";

import React, { useEffect, useRef } from "react";
import { Terminal as TerminalIcon, Trash2 } from "lucide-react";

export interface LogMessage {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warn" | "error";
  text: string;
}

interface TerminalConsoleLogsProps {
  logs: LogMessage[];
  onClearLogs: () => void;
}

export const TerminalConsoleLogs: React.FC<TerminalConsoleLogsProps> = ({ logs, onClearLogs }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: LogMessage["type"]) => {
    switch (type) {
      case "success":
        return "text-matrix-mint font-bold";
      case "warn":
        return "text-matrix-yellow";
      case "error":
        return "text-matrix-red font-bold";
      default:
        return "text-matrix-green/80";
    }
  };

  return (
    <div className="w-full brutalist-card-muted p-4 my-6 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-matrix-muted pb-2 mb-3">
        <div className="flex items-center space-x-2 text-matrix-green uppercase tracking-wider font-bold">
          <TerminalIcon className="w-4 h-4 text-matrix-green" />
          <span>CONSOLE_SYSTEM_LOGS // STREAM_EM_TEMPO_REAL</span>
        </div>

        <button
          onClick={onClearLogs}
          className="text-matrix-muted hover:text-matrix-green flex items-center space-x-1 transition-colors"
          title="Limpar histórico de logs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>LIMPAR</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className="h-36 overflow-y-auto space-y-1.5 bg-matrix-bg/90 p-3 border border-matrix-muted font-mono leading-relaxed"
      >
        {logs.length === 0 ? (
          <p className="text-matrix-muted italic">&gt; Nenhuma atividade registrada no console.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2">
              <span className="text-matrix-muted select-none">[{log.timestamp}]</span>
              <span className={getLogColor(log.type)}>&gt; {log.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
