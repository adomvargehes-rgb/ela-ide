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
    <div className="h-full flex flex-col bg-ide-sidebar text-zinc-300 font-sans">
      <div className="h-[34px] px-3 border-b border-[#282828] flex items-center justify-between text-[13px] font-semibold uppercase tracking-wider text-[#858585]">
        <span>Source Control: Git</span>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <GitBranch size={13} />
          <span className="font-mono text-[12px] text-zinc-300">master</span>
        </div>
      </div>

      {/* Commit input box */}
      <div className="p-3 border-b border-[#282828] space-y-2.5">
        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Message (Ctrl+Enter to commit)..."
          rows={3}
          className="w-full bg-zinc-900 border border-zinc-700/80 rounded p-2.5 text-[14px] font-normal text-zinc-200 outline-none focus:border-blue-500 resize-none font-sans"
        />
        <button
          onClick={handleCommit}
          disabled={!commitMessage.trim()}
          className="w-full h-8 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-[13px] flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Check size={14} strokeWidth={2} />
          <span>Commit Changes</span>
        </button>
      </div>

      {/* Changes list */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="flex items-center justify-between px-2 py-1.5 text-[13px] font-semibold uppercase tracking-wider text-[#858585]">
          <span>Changes ({modifiedFiles.length})</span>
          <button title="Discard all changes" className="hover:text-zinc-200">
            <RotateCcw size={13} />
          </button>
        </div>

        {modifiedFiles.length === 0 ? (
          <div className="p-4 text-center text-[13px] text-zinc-500">
            No uncommitted changes in working tree.
          </div>
        ) : (
          <div className="space-y-1 mt-1">
            {modifiedFiles.map((f) => (
              <div
                key={f.id}
                onClick={() => openFile(f.path)}
                className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-zinc-800 cursor-pointer text-[14px] font-normal group"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileCode size={14} className="text-amber-400 shrink-0" />
                  <span className="truncate text-zinc-200">{f.name}</span>
                  <span className="text-zinc-500 text-[12px] truncate">{f.path}</span>
                </div>
                <span className="text-[11px] font-mono text-amber-400 font-bold ml-2">M</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

