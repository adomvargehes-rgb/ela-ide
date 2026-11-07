"use client";

import React from "react";
import {
  GitBranch,
  AlertCircle,
  AlertTriangle,
  RotateCw,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";

export default function StatusBar() {
  const {
    activeFile,
    problems,
    settings,
    toggleBottomPanel,
    setBottomPanelTab,
    setIsBottomOpen,
    setIsLegalModalOpen,
  } = useIDE();

  const errors = problems.filter((p) => p.severity === "error").length;
  const warnings = problems.filter((p) => p.severity === "warning" || p.severity === "info").length;

  return (
    <footer className="h-[24px] bg-[#181818] border-t border-[#282828] flex items-center justify-between px-3 select-none text-[12px] text-[#858585] z-30 font-sans">
      {/* Left side items */}
      <div className="flex items-center gap-3.5">
        {/* Git Branch */}
        <div className="flex items-center gap-1.5 hover:text-[#CCCCCC] cursor-pointer">
          <GitBranch size={12} strokeWidth={1.75} />
          <span>master*</span>
        </div>

        {/* Sync Status */}
        <div title="Synchronized with cloud storage" className="flex items-center gap-1 hover:text-[#CCCCCC] cursor-pointer">
          <RotateCw size={11} strokeWidth={1.75} />
          <span>0</span>
        </div>

        {/* Errors & Warnings */}
        <button
          onClick={() => {
            setIsBottomOpen(true);
            setBottomPanelTab("problems");
          }}
          className="flex items-center gap-2.5 hover:text-[#CCCCCC] transition-colors"
        >
          <div className="flex items-center gap-1 text-rose-400">
            <AlertCircle size={12} strokeWidth={2} />
            <span>{errors}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <AlertTriangle size={12} strokeWidth={2} />
            <span>{warnings}</span>
          </div>
        </button>
      </div>

      {/* Right side items (Status bar: 12px) */}
      <div className="flex items-center gap-3.5 text-[12px] text-[#858585]">
        {/* Cursor Position */}
        <div className="hover:text-[#CCCCCC] cursor-pointer">
          <span>Ln 1, Col 1</span>
        </div>

        {/* Indentation */}
        <div className="hover:text-[#CCCCCC] cursor-pointer">
          <span>Spaces: {settings.tabSize || 2}</span>
        </div>

        {/* Encoding */}
        <div className="hover:text-[#CCCCCC] cursor-pointer">
          <span>UTF-8</span>
        </div>

        {/* Line Endings */}
        <div className="hover:text-[#CCCCCC] cursor-pointer">
          <span>CRLF</span>
        </div>

        {/* Language Mode */}
        <div className="hover:text-[#CCCCCC] cursor-pointer font-medium text-[#CCCCCC] flex items-center gap-1.5">
          <span className="font-mono text-[11px]">&#123; &#125;</span>
          <span>{activeFile?.language ? activeFile.language.toUpperCase() : "TYPESCRIPT JSX"}</span>
        </div>

        {/* Legal & Proprietary License */}
        <button
          onClick={() => setIsLegalModalOpen(true)}
          title="ELA IDE Proprietary License & IP Protection Policy"
          className="flex items-center gap-1 text-[#858585] hover:text-[#CCCCCC] transition-colors"
        >
          <Shield size={11} />
          <span className="hidden xl:inline">Proprietary</span>
          <span>© 2026</span>
        </button>

        {/* Status Check */}
        <div className="text-emerald-400" title="ELA Engine Ready">
          <CheckCircle2 size={12} strokeWidth={2} />
        </div>
      </div>
    </footer>
  );
}
