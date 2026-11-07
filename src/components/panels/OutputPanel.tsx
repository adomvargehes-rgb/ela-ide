"use client";

import React from "react";
import { Trash2, Terminal, CheckCircle2, AlertCircle, Info, Bot } from "lucide-react";
import { useIDE } from "@/context/IDEContext";

export default function OutputPanel() {
  const { outputLogs, clearOutputLogs } = useIDE();

  return (
    <div className="h-full flex flex-col bg-ide-panel text-zinc-300 font-mono text-[14px]">
      {/* Mini toolbar */}
      <div className="h-7 px-3 border-b border-ide-border flex items-center justify-between bg-zinc-900/60 text-[13px]">
        <span className="text-zinc-400 font-sans">Execution & Build Console</span>
        <button
          onClick={clearOutputLogs}
          title="Clear Output"
          className="p-1 hover:text-white text-zinc-500 rounded"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3.5 space-y-1.5 select-text">
        {outputLogs.length === 0 ? (
          <div className="text-zinc-600 text-[13px]">Console is clear.</div>
        ) : (
          outputLogs.map((log) => {
            let textColor = "text-zinc-300";
            let IconComponent = Info;

            if (log.type === "success") {
              textColor = "text-emerald-400";
              IconComponent = CheckCircle2;
            } else if (log.type === "error") {
              textColor = "text-rose-400";
              IconComponent = AlertCircle;
            } else if (log.type === "warn") {
              textColor = "text-amber-400";
            } else if (log.type === "ai") {
              textColor = "text-blue-400";
              IconComponent = Bot;
            }

            return (
              <div key={log.id} className="flex items-start gap-2.5 leading-relaxed text-[14px]">
                <span className="text-zinc-600 shrink-0 text-[12px] pt-0.5">{log.timestamp}</span>
                <span className={`${textColor} whitespace-pre-wrap break-all flex-1`}>
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

