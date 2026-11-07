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
  Play,
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
    runProject,
    setIsAIPanelOpen,
    createFile,
  } = useIDE();

  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "ts":
      case "tsx":
      case "js":
      case "jsx":
      case "py":
        return <FileCode size={13} className="text-blue-400 shrink-0" />;
      case "json":
        return <FileJson size={13} className="text-amber-400 shrink-0" />;
      case "html":
      case "css":
        return <FileCode size={13} className="text-emerald-400 shrink-0" />;
      case "md":
        return <FileText size={13} className="text-purple-400 shrink-0" />;
      default:
        return <File size={13} className="text-zinc-400 shrink-0" />;
    }
  };

  const breadcrumbs = activeFile ? activeFile.path.split("/").filter(Boolean) : [];

  return (
    <div className="flex-1 flex flex-col h-full bg-ide-editor overflow-hidden select-none">
      {/* Editor Tabs Bar */}
      <div className="h-9 bg-ide-sidebar border-b border-ide-border flex items-center overflow-x-auto scrollbar-none">
        {openTabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => openFile(tab.filePath)}
              className={`group h-full flex items-center gap-2 px-3 border-r border-ide-border text-xs cursor-pointer transition-colors relative min-w-[120px] max-w-[200px] ${
                isActive
                  ? "bg-ide-editor text-white font-medium"
                  : "bg-ide-sidebar text-zinc-400 hover:bg-ide-hover hover:text-zinc-200"
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
              {getFileIcon(tab.name)}
              <span className="truncate flex-1">{tab.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                title="Close Tab"
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-zinc-700/60 rounded text-zinc-400 hover:text-white transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Breadcrumbs */}
      {activeFile && (
        <div className="h-6 px-4 bg-ide-editor border-b border-ide-border/50 flex items-center gap-1 text-[11px] text-zinc-400">
          <span className="text-zinc-500">workspace</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={11} className="text-zinc-600" />
              <span className={idx === breadcrumbs.length - 1 ? "text-zinc-200 font-medium" : ""}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
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
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 p-6 text-center select-none">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
              <FileCode size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-zinc-300">No File Currently Open</h3>
            <p className="text-xs text-zinc-500 max-w-xs mt-1">
              Select a file from the explorer on the left or create a new file to start coding.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => createFile("/src", "Component.tsx", "file")}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Plus size={13} strokeWidth={2} />
                <span>New File</span>
              </button>
              <button
                onClick={() => setIsAIPanelOpen(true)}
                className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Sparkles size={13} className="text-blue-400" />
                <span>Ask AI Assistant</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
