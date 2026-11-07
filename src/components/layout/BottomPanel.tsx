"use client";

import React from "react";
import {
  Terminal,
  AlertCircle,
  FileText,
  Monitor,
  X,
  ChevronDown,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { BottomPanelTab } from "@/types/ide";
import IntegratedTerminal from "@/components/terminal/IntegratedTerminal";
import ProblemsPanel from "@/components/panels/ProblemsPanel";
import OutputPanel from "@/components/panels/OutputPanel";
import WebPreviewModal from "@/components/preview/WebPreviewModal";

export default function BottomPanel() {
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
    { id: "terminal", label: "Terminal", icon: <Terminal size={13} strokeWidth={1.75} /> },
    { id: "output", label: "Output", icon: <FileText size={13} strokeWidth={1.75} /> },
    {
      id: "problems",
      label: "Problems",
      icon: <AlertCircle size={13} strokeWidth={1.75} />,
      badge: errorCount > 0 ? errorCount : undefined,
    },
    { id: "preview", label: "Live Preview", icon: <Monitor size={13} strokeWidth={1.75} /> },
  ];

  return (
    <div className="h-64 bg-ide-panel border-t border-ide-border flex flex-col shrink-0 select-none z-10">
      {/* Panel header tabs */}
      <div className="h-7 bg-ide-sidebar border-b border-ide-border flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = bottomPanelTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setBottomPanelTab(tab.id)}
                className={`h-7 px-3 flex items-center gap-1.5 font-medium transition-colors border-b-2 ${
                  isActive
                    ? "border-blue-500 text-white bg-ide-panel"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Panel controls */}
        <div className="flex items-center gap-1 text-zinc-400">
          <button
            onClick={() => setIsBottomOpen(false)}
            title="Close Panel"
            className="p-1 hover:text-white rounded hover:bg-zinc-800"
          >
            <X size={13} />
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

