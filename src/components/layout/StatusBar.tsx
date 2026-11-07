"use client";

import React from "react";
import {
  GitBranch,
  AlertCircle,
  AlertTriangle,
  Cpu,
  Coins,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";

export default function StatusBar() {
  const {
    activeFile,
    problems,
    settings,
    providers,
    tokenStats,
    toggleBottomPanel,
    setBottomPanelTab,
    setIsBottomOpen,
  } = useIDE();

  const errors = problems.filter((p) => p.severity === "error").length;
  const warnings = problems.filter((p) => p.severity === "warning" || p.severity === "info").length;
  const activeProvider = providers[settings.activeProviderId];

  return (
    <footer className="h-6 bg-ide-status border-t border-ide-border flex items-center justify-between px-3 select-none text-[11px] text-zinc-400 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Git branch */}
        <div className="flex items-center gap-1 hover:text-zinc-200 cursor-pointer">
          <GitBranch size={12} strokeWidth={1.75} />
          <span>main</span>
        </div>

        {/* Problems button */}
        <button
          onClick={() => {
            setIsBottomOpen(true);
            setBottomPanelTab("problems");
          }}
          className="flex items-center gap-2 hover:text-zinc-200"
        >
          <div className="flex items-center gap-1 text-rose-400">
            <AlertCircle size={11} strokeWidth={2} />
            <span>{errors}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <AlertTriangle size={11} strokeWidth={2} />
            <span>{warnings}</span>
          </div>
        </button>

        {/* Terminal toggle */}
        <button
          onClick={() => {
            setIsBottomOpen(true);
            setBottomPanelTab("terminal");
          }}
          className="hidden sm:flex items-center gap-1 hover:text-zinc-200"
        >
          <Terminal size={11} strokeWidth={1.5} />
          <span>Terminal</span>
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Token stats and estimated cost */}
        <div
          title={`Prompt: ${tokenStats.totalPromptTokens} | Completion: ${tokenStats.totalCompletionTokens} tokens`}
          className="hidden md:flex items-center gap-1 text-zinc-400 hover:text-zinc-200 cursor-help"
        >
          <Coins size={11} strokeWidth={1.75} className="text-amber-400" />
          <span>{tokenStats.totalPromptTokens + tokenStats.totalCompletionTokens} toks</span>
          <span className="text-zinc-500">•</span>
          <span className="text-emerald-400 font-mono">${tokenStats.estimatedCostUSD.toFixed(4)}</span>
        </div>

        {/* Active AI Provider */}
        <div className="flex items-center gap-1 text-blue-400 font-medium">
          <Cpu size={12} strokeWidth={1.75} />
          <span>{activeProvider?.name?.split(" ")[0]}</span>
        </div>

        {/* File line / col info */}
        <div className="hidden sm:block">
          <span>Ln 1, Col 1</span>
        </div>

        {/* Encoding */}
        <div className="hidden sm:block">
          <span>UTF-8</span>
        </div>

        {/* Language */}
        <div className="font-medium text-zinc-300">
          <span>{activeFile?.language?.toUpperCase() || "TYPESCRIPT"}</span>
        </div>

        {/* Prettier / Format Check */}
        <div className="text-emerald-400" title="Code Formatter active">
          <CheckCircle2 size={12} strokeWidth={2} />
        </div>
      </div>
    </footer>
  );
}
