"use client";

import React from "react";
import {
  X,
  ChevronRight,
  FileCode,
  FileText,
  FileJson,
  File,
  Plus,
  Sparkles,
  SplitSquareHorizontal,
  MoreHorizontal,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import MonacoWrapper from "./MonacoWrapper";

export default function EditorArea() {
  const {
    openTabs,
    activeTabId,
    activeFile,
    closeTab,
    openFile,
    updateFileContent,
    setIsAIPanelOpen,
    createFile,
  } = useIDE();

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "tsx":
      case "jsx":
        return <FileCode size={13} className="text-[#3B82F6] shrink-0" />;
      case "ts":
      case "js":
        return <FileCode size={13} className="text-[#3B82F6] shrink-0" />;
      case "json":
        return <FileJson size={13} className="text-amber-400 shrink-0" />;
      case "html":
      case "css":
        return <FileCode size={13} className="text-emerald-400 shrink-0" />;
      case "py":
        return <FileCode size={13} className="text-blue-400 shrink-0" />;
      case "md":
        return <FileText size={13} className="text-purple-400 shrink-0" />;
      default:
        return <File size={13} className="text-[#858585] shrink-0" />;
    }
  };

  const breadcrumbs = activeFile ? activeFile.path.split("/").filter(Boolean) : [];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1E1E1E] overflow-hidden select-none font-sans">
      {/* Editor Tabs Bar */}
      <div className="h-[32px] bg-[#181818] border-b border-[#282828] flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex items-center h-full overflow-x-auto scrollbar-none">
          {openTabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => openFile(tab.filePath)}
                className={`group h-full flex items-center gap-1.5 px-3 border-r border-[#282828] text-[12px] cursor-pointer transition-colors relative min-w-[120px] max-w-[210px] ${
                  isActive
                    ? "bg-[#1E1E1E] text-white font-medium border-t-2 border-[#10B981]"
                    : "bg-[#181818] text-[#858585] hover:bg-[#1E1E1E]/50 hover:text-[#CCCCCC]"
                }`}
              >
                {getFileIcon(tab.name)}
                <span className="truncate flex-1">{tab.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  title="Close Tab"
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#333333] rounded text-[#858585] hover:text-white transition-opacity"
                >
                  <X size={11} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right side of tabs strip (Split view and actions) */}
        <div className="flex items-center gap-1.5 pr-2 shrink-0">
          <button
            title="Split Editor Right"
            className="p-1 text-[#858585] hover:text-[#CCCCCC] hover:bg-[#2A2D32] rounded transition-colors"
          >
            <SplitSquareHorizontal size={13} />
          </button>
          <button
            title="More Options"
            className="p-1 text-[#858585] hover:text-[#CCCCCC] hover:bg-[#2A2D32] rounded transition-colors"
          >
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      {/* Breadcrumbs Bar */}
      {activeFile && (
        <div className="h-[22px] px-3 bg-[#1E1E1E] border-b border-[#282828]/60 flex items-center gap-1 text-[11px] text-[#858585]">
          <span className="text-[#666666]">workspace</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={10} className="text-[#555555]" />
              <span className={idx === breadcrumbs.length - 1 ? "text-[#CCCCCC] font-medium" : ""}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
          <span className="text-[#555555] ml-1">...</span>
        </div>
      )}

      {/* Main Code Editor View or Empty State */}
      <div className="flex-1 overflow-hidden relative">
        {activeFile ? (
          <MonacoWrapper
            filePath={activeFile.path}
            content={activeFile.content || ""}
            language={activeFile.language || "typescript"}
            onChange={(newContent) => updateFileContent(activeFile.path, newContent)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[#858585] p-6 text-center select-none">
            <div className="w-10 h-10 rounded-xl bg-[#252526] border border-[#333333] flex items-center justify-center text-[#858585] mb-2.5">
              <FileCode size={20} strokeWidth={1.5} />
            </div>
            <h3 className="text-xs font-semibold text-[#CCCCCC]">No File Open</h3>
            <p className="text-[11px] text-[#858585] max-w-xs mt-0.5">
              Select a file from the explorer on the left or create a new component.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => createFile("/src", "App.tsx", "file")}
                className="px-2.5 py-1 rounded bg-[#3B82F6] hover:bg-blue-500 text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors"
              >
                <Plus size={12} strokeWidth={2} />
                <span>New File</span>
              </button>
              <button
                onClick={() => setIsAIPanelOpen(true)}
                className="px-2.5 py-1 rounded bg-[#2A2D32] hover:bg-[#33373E] text-[#CCCCCC] text-[11px] font-medium flex items-center gap-1.5 transition-colors"
              >
                <Sparkles size={11} className="text-[#3B82F6]" />
                <span>Ask AI Agent</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
