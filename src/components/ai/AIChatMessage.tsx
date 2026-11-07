"use client";

import React, { useState } from "react";
import {
  Bot,
  User,
  Copy,
  Check,
  FileDiff,
  Code,
  FileText,
} from "lucide-react";
import { ChatMessage } from "@/types/ide";
import { useIDE } from "@/context/IDEContext";

export default function AIChatMessage({ message }: { message: ChatMessage }) {
  const { setDiffReview, activeFile, updateFileContent, addOutputLog } = useIDE();
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const isAssistant = message.role === "assistant";

  // Parse markdown code blocks: ```lang ... ```
  const renderFormattedContent = (content: string) => {
    // Check for agent plan markers
    const cleanContent = content
      .replace(/<<<FILE_WRITE:[\s\S]*?<<<END_FILE_WRITE>>>/g, "")
      .replace(/<<<RUN_COMMAND:[\s\S]*?>>>/g, "");

    const parts = cleanContent.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const firstLineEnd = part.indexOf("\n");
        const language = part.slice(3, firstLineEnd).trim() || "plaintext";
        const code = part.slice(firstLineEnd + 1, -3);

        const handleCopy = () => {
          navigator.clipboard.writeText(code);
          setCopiedCodeIdx(index);
          setTimeout(() => setCopiedCodeIdx(null), 2000);
        };

        const handleApplyToActive = () => {
          if (activeFile) {
            updateFileContent(activeFile.path, code);
            addOutputLog(`Applied AI code to ${activeFile.name}`, "success");
          }
        };

        const handleReviewDiff = () => {
          if (activeFile && activeFile.content) {
            setDiffReview({
              filePath: activeFile.path,
              originalContent: activeFile.content,
              newContent: code,
              description: `Diff Review proposed for ${activeFile.name}`,
              isOpen: true,
            });
          }
        };

        return (
          <div
            key={index}
            className="my-2 rounded border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-xs"
          >
            {/* Code block header */}
            <div className="h-7 px-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="uppercase font-semibold tracking-wider text-blue-400">
                {language}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleReviewDiff}
                  title="Inspect Side-by-Side Diff"
                  className="px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1 text-[10px]"
                >
                  <FileDiff size={11} className="text-amber-400" />
                  <span>Review Diff</span>
                </button>
                <button
                  onClick={handleApplyToActive}
                  title="Apply code directly to active editor file"
                  className="px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1 text-[10px]"
                >
                  <Code size={11} className="text-blue-400" />
                  <span>Apply</span>
                </button>
                <button
                  onClick={handleCopy}
                  title="Copy Code"
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                >
                  {copiedCodeIdx === index ? (
                    <Check size={12} className="text-emerald-400" />
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>
            </div>

            {/* Code text */}
            <pre className="p-3 overflow-x-auto text-zinc-200 leading-relaxed scrollbar-thin">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Plain paragraphs and bold text
      return (
        <div key={index} className="whitespace-pre-wrap leading-relaxed space-y-1">
          {part}
        </div>
      );
    });
  };

  return (
    <div
      className={`p-3 rounded-lg border text-xs ${
        isAssistant
          ? "bg-zinc-900/60 border-zinc-800 text-zinc-200"
          : "bg-blue-950/20 border-blue-900/40 text-zinc-100 ml-4"
      }`}
    >
      <div className="flex items-center justify-between mb-1.5 text-[10px] text-zinc-500">
        <div className="flex items-center gap-1.5">
          {isAssistant ? (
            <>
              <div className="w-4 h-4 rounded bg-blue-600/30 text-blue-400 flex items-center justify-center">
                <Bot size={11} />
              </div>
              <span className="font-semibold text-zinc-300">Ela AI</span>
              {message.modelUsed && (
                <span className="text-zinc-500 font-mono">({message.modelUsed})</span>
              )}
            </>
          ) : (
            <>
              <div className="w-4 h-4 rounded bg-zinc-700 text-zinc-300 flex items-center justify-center">
                <User size={11} />
              </div>
              <span className="font-semibold text-zinc-300">You</span>
            </>
          )}
        </div>
        <span>{message.timestamp}</span>
      </div>

      <div className="space-y-1.5">{renderFormattedContent(message.content)}</div>
    </div>
  );
}
