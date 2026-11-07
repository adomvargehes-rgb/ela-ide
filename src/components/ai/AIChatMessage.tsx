"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  FileDiff,
  Code,
  AlertTriangle,
} from "lucide-react";
import { ChatMessage } from "@/types/ide";
import { useIDE } from "@/context/IDEContext";

export default function AIChatMessage({ message }: { message: ChatMessage }) {
  const { setDiffReview, activeFile, updateFileContent, addOutputLog, updateSettings } = useIDE();
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const isAssistant = message.role === "assistant";

  // Parse markdown code blocks: ```lang ... ```
  const renderFormattedContent = (content: string) => {
    // Strip raw internal agent markers if present
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
              description: `Proposed modifications for ${activeFile.name}`,
              isOpen: true,
            });
          }
        };

        return (
          <div
            key={index}
            className="my-2.5 rounded-xl border border-zinc-800 bg-[#0d0d10] overflow-hidden font-mono text-xs shadow-inner"
          >
            {/* Code block header */}
            <div className="h-7 px-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="uppercase font-semibold tracking-wider text-blue-400 text-[10px]">
                {language}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReviewDiff}
                  title="Inspect Side-by-Side Diff"
                  className="px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1 text-[10px] transition-colors"
                >
                  <FileDiff size={11} className="text-amber-400" />
                  <span>Review Diff</span>
                </button>
                <button
                  onClick={handleApplyToActive}
                  title="Apply code directly to active file"
                  className="px-2 py-0.5 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center gap-1 text-[10px] transition-colors"
                >
                  <Code size={11} className="text-blue-400" />
                  <span>Apply</span>
                </button>
                <button
                  onClick={handleCopy}
                  title="Copy Code"
                  className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                >
                  {copiedCodeIdx === index ? (
                    <Check size={11} className="text-emerald-400" />
                  ) : (
                    <Copy size={11} />
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

  if (!isAssistant) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] bg-[#222226] text-zinc-200 text-xs px-3.5 py-1.5 rounded-lg border border-zinc-700/30 shadow-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  // Credit notice or error message styling matching Qoder
  const isWarningOrError =
    message.content.toLowerCase().includes("credit") ||
    message.content.toLowerCase().includes("rate limit") ||
    message.content.toLowerCase().includes("quota") ||
    message.content.toLowerCase().includes("api key");

  if (isWarningOrError) {
    return (
      <div className="text-xs text-zinc-300 space-y-2 leading-relaxed pt-1">
        <div className="flex items-start gap-2">
          <AlertTriangle size={13} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <div>{renderFormattedContent(message.content)}</div>
            <button
              onClick={() => updateSettings({ activeProviderId: "groq" })}
              className="px-2.5 py-1 rounded-md bg-[#222226] hover:bg-[#2a2a2e] text-zinc-300 text-xs border border-zinc-700/50 transition-colors block"
            >
              Get More Credits / Switch to Free Models
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Clean, borderless stream matching Qoder layout
  return (
    <div className="text-xs text-zinc-200 space-y-2 leading-relaxed">
      {renderFormattedContent(message.content)}
    </div>
  );
}
