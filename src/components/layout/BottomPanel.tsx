"use client";

import React from "react";
import {
  Terminal,
  AlertCircle,
  FileText,
  Monitor,
  X,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { BottomPanelTab } from "@/types/ide";
import IntegratedTerminal from "@/components/terminal/IntegratedTerminal";
import ProblemsPanel from "@/components/panels/ProblemsPanel";
import OutputPanel from "@/components/panels/OutputPanel";
import WebPreviewModal from "@/components/preview/WebPreviewModal";

export default function BottomPanel({ height = 200 }: { height?: number }) {
  const {
    isBottomOpen,
    setIsBottomOpen,
    bottomPanelTab,
    setBottomPanelTab,
    problems,
  } = useIDE();

  if (!isBottomOpen) return null;

  const errorCount = problems.filter((p) => p.severity === "error").length;

  const tabs: { id: BottomPanelTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "terminal", label: "Terminal", icon: <Terminal size={12} strokeWidth={1.75} /> },
    { id: "output", label: "Output", icon: <FileText size={12} strokeWidth={1.75} /> },
    {
      id: "problems",
      label: "Problems",
      icon: <AlertCircle size={12} strokeWidth={1.75} />,
      badge: errorCount > 0 ? errorCount : undefined,
    },
    { id: "preview", label: "Live Preview", icon: <Monitor size={12} strokeWidth={1.75} /> },
  ];

  return (
    <div
      style={{ height: `${height}px` }}
      className="bg-[#181818] border-t border-[#282828] flex flex-col shrink-0 select-none z-10 font-sans"
    >
      {/* Panel header tabs */}
      <div className="h-[32px] bg-[#181818] border-b border-[#282828] flex items-center justify-between px-2.5 text-[13px]">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = bottomPanelTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setBottomPanelTab(tab.id)}
                className={`h-[32px] px-3 flex items-center gap-2 font-medium transition-colors border-b-2 text-[13px] ${
                  isActive
                    ? "border-[#3B82F6] text-white bg-[#1E1E1E]"
                    : "border-transparent text-[#858585] hover:text-[#CCCCCC]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Panel controls */}
        <div className="flex items-center gap-1 text-[#858585]">
          <button
            onClick={() => setIsBottomOpen(false)}
            title="Close Panel"
            className="p-1 hover:text-white rounded hover:bg-[#2A2D32]"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {bottomPanelTab === "terminal" && <IntegratedTerminal />}
        {bottomPanelTab === "output" && <OutputPanel />}
        {bottomPanelTab === "problems" && <ProblemsPanel />}
        {bottomPanelTab === "preview" && <WebPreviewModal />}
      </div>
    </div>
  );
}
