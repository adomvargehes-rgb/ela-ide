"use client";

import React from "react";
import {
  Files,
  Search,
  GitBranch,
  Blocks,
  Settings2,
  Bot,
  Terminal,
  PanelBottom,
  Play,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { ActiveSidebarTab } from "@/types/ide";

export default function ActivityBar() {
  const {
    activeSidebarTab,
    setActiveSidebarTab,
    isSidebarOpen,
    setIsSidebarOpen,
    isAIPanelOpen,
    toggleAIPanel,
    isBottomOpen,
    toggleBottomPanel,
    runProject,
    isRunning,
  } = useIDE();

  const handleTabClick = (tab: ActiveSidebarTab) => {
    if (activeSidebarTab === tab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveSidebarTab(tab);
      setIsSidebarOpen(true);
    }
  };

  const topItems: { id: ActiveSidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: "explorer", label: "Explorer (Ctrl+Shift+E)", icon: <Files size={20} strokeWidth={1.5} /> },
    { id: "search", label: "Search (Ctrl+Shift+F)", icon: <Search size={20} strokeWidth={1.5} /> },
    { id: "source-control", label: "Source Control (Ctrl+Shift+G)", icon: <GitBranch size={20} strokeWidth={1.5} /> },
    { id: "extensions", label: "Extensions (Ctrl+Shift+X)", icon: <Blocks size={20} strokeWidth={1.5} /> },
  ];

  return (
    <aside className="w-12 bg-ide-activity border-r border-ide-border flex flex-col justify-between items-center py-2 select-none z-20">
      {/* Top action items */}
      <div className="flex flex-col items-center gap-1 w-full">
        {topItems.map((item) => {
          const isActive = isSidebarOpen && activeSidebarTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              title={item.label}
              className={`relative w-10 h-10 flex items-center justify-center rounded transition-colors group ${
                isActive
                  ? "text-white bg-ide-hover"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-ide-hover/50"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-blue-500 rounded-r" />
              )}
              {item.icon}
            </button>
          );
        })}

        <div className="w-6 h-[1px] bg-ide-border my-1" />

        {/* AI Assistant Quick Toggle */}
        <button
          onClick={toggleAIPanel}
          title="Toggle AI Coding Assistant (Ctrl+Shift+A)"
          className={`relative w-10 h-10 flex items-center justify-center rounded transition-colors ${
            isAIPanelOpen
              ? "text-blue-400 bg-blue-950/40 border border-blue-800/40"
              : "text-zinc-400 hover:text-blue-300 hover:bg-ide-hover/50"
          }`}
        >
          <Bot size={20} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </button>

        {/* Run Project Button */}
        <button
          onClick={runProject}
          disabled={isRunning}
          title="Run Active File / Project"
          className="w-10 h-10 flex items-center justify-center rounded text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30 transition-colors"
        >
          <Play size={18} strokeWidth={1.75} className={isRunning ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Bottom utility items */}
      <div className="flex flex-col items-center gap-1 w-full">
        <button
          onClick={toggleBottomPanel}
          title="Toggle Terminal Panel (Ctrl+`)"
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
            isBottomOpen
              ? "text-zinc-200 bg-ide-hover"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-ide-hover/50"
          }`}
        >
          <Terminal size={19} strokeWidth={1.5} />
        </button>

        <button
          onClick={() => handleTabClick("settings")}
          title="IDE & AI Provider Settings"
          className={`relative w-10 h-10 flex items-center justify-center rounded transition-colors ${
            isSidebarOpen && activeSidebarTab === "settings"
              ? "text-white bg-ide-hover"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-ide-hover/50"
          }`}
        >
          {isSidebarOpen && activeSidebarTab === "settings" && (
            <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-blue-500 rounded-r" />
          )}
          <Settings2 size={20} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
