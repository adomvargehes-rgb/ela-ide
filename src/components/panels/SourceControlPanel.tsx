"use client";

import React, { useState } from "react";
import {
  GitBranch,
  Check,
  RotateCcw,
  FileCode,
  GitCommit,
  Layers,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { FileItem } from "@/types/ide";

export default function SourceControlPanel() {
  const { files, openFile, addOutputLog } = useIDE();
  const [commitMessage, setCommitMessage] = useState("");

  // Find modified files
  const modifiedFiles: FileItem[] = [];
  const findModified = (items: FileItem[]) => {
    for (const item of items) {
      if (item.type === "file" && item.isModified) {
        modifiedFiles.push(item);
      }
      if (item.children) findModified(item.children);
    }
  };
  findModified(files);

  const handleCommit = () => {
    if (!commitMessage.trim()) return;
    addOutputLog(`Git commit: "${commitMessage}" (${modifiedFiles.length} files)`, "success");
    setCommitMessage("");
  };

  return (
    <div className="h-full flex flex-col bg-ide-sidebar text-zinc-300">
      <div className="h-8 px-3 border-b border-ide-border flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <span>Source Control: Git</span>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <GitBranch size={13} />
          <span className="font-mono text-[11px] text-zinc-300">main</span>
        </div>
      </div>

      {/* Commit input box */}
      <div className="p-3 border-b border-ide-border space-y-2">
        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Message (Ctrl+Enter to commit)..."
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-700/80 rounded p-2 text-xs text-zinc-200 outline-none focus:border-blue-500 resize-none font-sans"
        />
        <button
          onClick={handleCommit}
          disabled={!commitMessage.trim()}
          className="w-full h-7 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Check size={14} strokeWidth={2} />
          <span>Commit Changes</span>
        </button>
      </div>

      {/* Changes list */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between px-1.5 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          <span>Changes ({modifiedFiles.length})</span>
          <button title="Discard all changes" className="hover:text-zinc-200">
            <RotateCcw size={12} />
          </button>
        </div>

        {modifiedFiles.length === 0 ? (
          <div className="p-4 text-center text-xs text-zinc-500">
            No uncommitted changes in working tree.
          </div>
        ) : (
          <div className="space-y-1 mt-1">
            {modifiedFiles.map((f) => (
              <div
                key={f.id}
                onClick={() => openFile(f.path)}
                className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-800 cursor-pointer text-xs group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode size={13} className="text-amber-400 shrink-0" />
                  <span className="truncate text-zinc-200">{f.name}</span>
                  <span className="text-zinc-500 text-[10px] truncate">{f.path}</span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-bold ml-2">M</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
