"use client";

import React from "react";
import { AlertCircle, AlertTriangle, Info, FileCode } from "lucide-react";
import { useIDE } from "@/context/IDEContext";

export default function ProblemsPanel() {
  const { problems, openFile } = useIDE();

  return (
    <div className="h-full flex flex-col bg-ide-panel text-zinc-300 font-sans text-[14px]">
      <div className="flex-1 overflow-y-auto p-2.5">
        {problems.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-500 text-[13px]">
            No problems detected in workspace.
          </div>
        ) : (
          <div className="space-y-1">
            {problems.map((prob) => {
              const isError = prob.severity === "error";
              const isWarn = prob.severity === "warning";

              return (
                <div
                  key={prob.id}
                  onClick={() => openFile(prob.filePath)}
                  className="flex items-center gap-2.5 py-1.5 px-2.5 rounded hover:bg-zinc-800/80 cursor-pointer group transition-colors text-[14px]"
                >
                  {isError ? (
                    <AlertCircle size={15} className="text-rose-400 shrink-0" />
                  ) : isWarn ? (
                    <AlertTriangle size={15} className="text-amber-400 shrink-0" />
                  ) : (
                    <Info size={15} className="text-blue-400 shrink-0" />
                  )}

                  <span className="text-zinc-200 group-hover:text-white flex-1 truncate">
                    {prob.message}
                  </span>

                  <span className="text-zinc-500 text-[12px] font-mono shrink-0">
                    [{prob.source}] {prob.filePath}:{prob.line}:{prob.column}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

