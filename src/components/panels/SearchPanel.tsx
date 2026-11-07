"use client";

import React, { useState } from "react";
import {
  Search,
  Replace,
  CaseSensitive,
  WholeWord,
  Regex,
  FileCode,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";

export default function SearchPanel() {
  const { searchQuery, setSearchQuery, searchResults, openFile } = useIDE();
  const [replaceQuery, setReplaceQuery] = useState("");
  const [showReplace, setShowReplace] = useState(false);

  // Group search results by filepath
  const groupedResults = searchResults.reduce<Record<string, { line: number; text: string }[]>>(
    (acc, cur) => {
      if (!acc[cur.path]) acc[cur.path] = [];
      acc[cur.path].push({ line: cur.line, text: cur.text });
      return acc;
    },
    {}
  );

  return (
    <div className="h-full flex flex-col bg-ide-sidebar text-zinc-300">
      <div className="h-8 px-3 border-b border-ide-border flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <span>Search</span>
      </div>

      <div className="p-3 space-y-2 border-b border-ide-border">
        {/* Search input */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workspace (regex or text)..."
            className="w-full h-7 bg-zinc-900 border border-zinc-700/80 rounded px-2 pr-16 text-xs text-zinc-200 outline-none focus:border-blue-500"
          />
          <div className="absolute right-1 flex items-center gap-0.5 text-zinc-500">
            <button title="Match Case" className="p-1 hover:text-zinc-200 rounded">
              <CaseSensitive size={13} />
            </button>
            <button title="Whole Word" className="p-1 hover:text-zinc-200 rounded">
              <WholeWord size={13} />
            </button>
            <button title="Use Regular Expression" className="p-1 hover:text-zinc-200 rounded">
              <Regex size={13} />
            </button>
          </div>
        </div>

        {/* Replace toggle and input */}
        <div>
          <button
            onClick={() => setShowReplace((v) => !v)}
            className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 mb-1"
          >
            <Replace size={12} />
            <span>{showReplace ? "Hide Replace" : "Replace in files"}</span>
          </button>
          {showReplace && (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={replaceQuery}
                onChange={(e) => setReplaceQuery(e.target.value)}
                placeholder="Replace with..."
                className="w-full h-7 bg-zinc-900 border border-zinc-700/80 rounded px-2 text-xs text-zinc-200 outline-none focus:border-blue-500"
              />
              <button
                title="Replace All"
                className="px-2 h-7 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                All
              </button>
            </div>
          )}
        </div>

        {/* Count summary */}
        <div className="text-[11px] text-zinc-400">
          {searchQuery.trim() ? (
            <span>
              {searchResults.length} result{searchResults.length === 1 ? "" : "s"} across{" "}
              {Object.keys(groupedResults).length} file
              {Object.keys(groupedResults).length === 1 ? "" : "s"}
            </span>
          ) : (
            <span>Type to search across all project files</span>
          )}
        </div>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {Object.entries(groupedResults).map(([filePath, matches]) => (
          <div key={filePath} className="text-xs">
            <div
              onClick={() => openFile(filePath)}
              className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-zinc-800 cursor-pointer font-medium text-zinc-200 truncate"
            >
              <FileCode size={13} className="text-blue-400 shrink-0" />
              <span className="truncate">{filePath}</span>
              <span className="ml-auto text-[10px] px-1.5 rounded bg-zinc-800 text-zinc-400">
                {matches.length}
              </span>
            </div>
            <div className="pl-4 space-y-0.5 mt-0.5">
              {matches.map((m, idx) => (
                <div
                  key={idx}
                  onClick={() => openFile(filePath)}
                  className="py-0.5 px-1.5 rounded hover:bg-zinc-800/60 cursor-pointer text-zinc-400 hover:text-zinc-200 truncate flex items-center gap-2 font-mono text-[11px]"
                >
                  <span className="text-zinc-600 w-5 text-right">{m.line}:</span>
                  <span className="truncate">{m.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

