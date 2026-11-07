"use client";

import React from "react";
import {
  Code2,
  Search,
  Play,
  Sparkles,
  ExternalLink,
  PanelLeft,
  PanelRight,
  PanelBottom,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";

export default function TitleBar() {
  const {
    activeFile,
    providers,
    settings,
    setIsCommandPaletteOpen,
    runProject,
    isRunning,
    toggleSidebar,
    toggleAIPanel,
    toggleBottomPanel,
    isSidebarOpen,
    isAIPanelOpen,
    isBottomOpen,
    setBottomPanelTab,
    setIsBottomOpen,
  } = useIDE();

  const activeProvider = providers[settings.activeProviderId];

  return (
    <header className="h-9 bg-ide-header border-b border-ide-border flex items-center justify-between px-3 select-none text-xs text-zinc-300 z-30">
      {/* Left: App Brand & Window controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Code2 size={13} strokeWidth={2.2} />
          </div>
          <span className="font-semibold text-zinc-100 tracking-wide">Ela IDE</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
            Preview
          </span>
        </div>

        {/* File / Edit / View / Terminal menus */}
        <div className="hidden md:flex items-center gap-1 text-zinc-400">
          <span className="px-2 py-1 rounded hover:bg-zinc-800/60 hover:text-zinc-200 cursor-pointer">File</span>
          <span className="px-2 py-1 rounded hover:bg-zinc-800/60 hover:text-zinc-200 cursor-pointer">Edit</span>
          <span className="px-2 py-1 rounded hover:bg-zinc-800/60 hover:text-zinc-200 cursor-pointer">Selection</span>
          <span className="px-2 py-1 rounded hover:bg-zinc-800/60 hover:text-zinc-200 cursor-pointer">View</span>
          <span
            onClick={() => {
              setIsBottomOpen(true);
              setBottomPanelTab("terminal");
            }}
            className="px-2 py-1 rounded hover:bg-zinc-800/60 hover:text-zinc-200 cursor-pointer"
          >
            Terminal
          </span>
        </div>
      </div>

      {/* Center: Command Palette / File Quick Open */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full h-6 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-700/60 hover:border-zinc-600 rounded flex items-center justify-between px-3 text-zinc-400 hover:text-zinc-200 transition-colors shadow-inner"
        >
          <div className="flex items-center gap-2 truncate">
            <Search size={12} strokeWidth={1.75} />
            <span className="truncate">
              {activeFile ? `Ela IDE — ${activeFile.name}` : "Search files and commands..."}
            </span>
          </div>
          <kbd className="hidden sm:inline-block text-[10px] font-mono bg-zinc-800 border border-zinc-700 px-1.5 rounded text-zinc-400">
            Ctrl+Shift+P
          </kbd>
        </button>
      </div>

      {/* Right: Actions, AI indicator, and layout toggles */}
      <div className="flex items-center gap-2">
        {/* Active AI Provider pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-950/40 border border-blue-800/40 text-blue-300 text-[11px]">
          <Sparkles size={11} strokeWidth={2} className="text-blue-400" />
          <span className="font-medium">{activeProvider?.name || "AI Ready"}</span>
          <span className="text-zinc-500">•</span>
          <span className="font-mono text-[10px] text-zinc-400">{activeProvider?.selectedModel}</span>
        </div>

        {/* Run button */}
        <button
          onClick={runProject}
          disabled={isRunning}
          className="h-6 px-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-60"
        >
          <Play size={11} strokeWidth={2.2} fill="currentColor" />
          <span>{isRunning ? "Running..." : "Run"}</span>
        </button>

        {/* Live Preview Toggle */}
        <button
          onClick={() => {
            setIsBottomOpen(true);
            setBottomPanelTab("preview");
          }}
          title="Open Live Web Preview"
          className="h-6 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1 transition-colors"
        >
          <ExternalLink size={12} strokeWidth={1.75} />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

        {/* Layout panel toggle icons */}
        <button
          onClick={toggleSidebar}
          title="Toggle Primary Sidebar"
          className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
            isSidebarOpen ? "text-zinc-200" : "text-zinc-500"
          }`}
        >
          <PanelLeft size={14} strokeWidth={1.5} />
        </button>
        <button
          onClick={toggleBottomPanel}
          title="Toggle Bottom Panel"
          className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
            isBottomOpen ? "text-zinc-200" : "text-zinc-500"
          }`}
        >
          <PanelBottom size={14} strokeWidth={1.5} />
        </button>
        <button
          onClick={toggleAIPanel}
          title="Toggle AI Assistant"
          className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
            isAIPanelOpen ? "text-blue-400" : "text-zinc-500"
          }`}
        >
          <PanelRight size={14} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
