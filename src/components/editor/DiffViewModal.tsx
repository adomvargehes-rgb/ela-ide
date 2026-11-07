"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Check, X, FileDiff, Sparkles, Loader2 } from "lucide-react";
import { useIDE } from "@/context/IDEContext";

const DiffEditor = dynamic(
  () => import("@monaco-editor/react").then((mod) => mod.DiffEditor),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-zinc-950 text-zinc-500 gap-2">
        <Loader2 size={16} className="animate-spin text-blue-500" />
        <span className="text-xs">Loading Diff Review Engine...</span>
      </div>
    ),
  }
);

export default function DiffViewModal() {
  const { diffReview, acceptDiff, rejectDiff } = useIDE();

  if (!diffReview) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-4 md:p-8">
      {/* Header Modal Bar */}
      <div className="bg-zinc-900 border border-zinc-700 rounded-t-lg px-4 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
            <FileDiff size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">AI Diff Review</span>
              <span className="text-zinc-500">•</span>
              <span className="font-mono text-xs text-blue-300">{diffReview.filePath}</span>
            </div>
            <p className="text-xs text-zinc-400">{diffReview.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={rejectDiff}
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-zinc-700"
          >
            <X size={14} className="text-rose-400" />
            <span>Reject Changes</span>
          </button>
          <button
            onClick={acceptDiff}
            className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
          >
            <Check size={14} strokeWidth={2.5} />
            <span>Accept & Apply to File</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Monaco Diff Editor */}
      <div className="flex-1 bg-zinc-950 border-x border-b border-zinc-700 rounded-b-lg overflow-hidden shadow-2xl">
        <DiffEditor
          height="100%"
          original={diffReview.originalContent}
          modified={diffReview.newContent}
          theme="vs-dark"
          options={{
            renderSideBySide: true,
            readOnly: true,
            automaticLayout: true,
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
