"use client";

import React, { useState } from "react";
import { Blocks, Check, Download, Star, Search, Sparkles } from "lucide-react";

interface Extension {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  installed: boolean;
  rating: number;
}

const EXTENSIONS: Extension[] = [
  {
    id: "ext-typescript",
    name: "TypeScript & JavaScript Language Features",
    description: "Rich language support with IntelliSense, diagnostics, and refactoring.",
    author: "Ela Team",
    version: "5.7.0",
    installed: true,
    rating: 5,
  },
  {
    id: "ext-python",
    name: "Python Language Server & Interactive Debugger",
    description: "IntelliSense, syntax checking, and in-browser Pyodide execution.",
    author: "Ela Team",
    version: "2024.18",
    installed: true,
    rating: 4.9,
  },
  {
    id: "ext-prettier",
    name: "Prettier — Code Formatter",
    description: "Opinionated code formatter for JS, TS, HTML, CSS, JSON, and Markdown.",
    author: "Prettier",
    version: "10.4.0",
    installed: true,
    rating: 4.8,
  },
  {
    id: "ext-tailwind",
    name: "Tailwind CSS IntelliSense",
    description: "Intelligent Tailwind class name auto-completion and preview hover.",
    author: "Tailwind Labs",
    version: "0.12.0",
    installed: true,
    rating: 4.9,
  },
  {
    id: "ext-flutter",
    name: "Flutter & Dart Mobile Tools",
    description: "Tooling for Flutter mobile applications, widgets, and hot reload.",
    author: "Dart Code",
    version: "3.80.0",
    installed: false,
    rating: 4.7,
  },
  {
    id: "ext-react-native",
    name: "React Native & Expo Simulator Bridge",
    description: "Build, run, and preview React Native and Expo applications.",
    author: "Microsoft / Expo",
    version: "1.19.0",
    installed: false,
    rating: 4.8,
  },
];

export default function ExtensionsPanel() {
  const [extensions, setExtensions] = useState<Extension[]>(EXTENSIONS);
  const [filter, setFilter] = useState("");

  const toggleInstall = (id: string) => {
    setExtensions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, installed: !e.installed } : e))
    );
  };

  const filtered = extensions.filter(
    (e) =>
      e.name.toLowerCase().includes(filter.toLowerCase()) ||
      e.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-ide-sidebar text-zinc-300 font-sans">
      <div className="h-[34px] px-3 border-b border-[#282828] flex items-center justify-between text-[13px] font-semibold uppercase tracking-wider text-[#858585]">
        <span>Extensions</span>
      </div>

      <div className="p-3 border-b border-[#282828]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search Extensions in Marketplace..."
            className="w-full h-8 bg-zinc-900 border border-zinc-700/80 rounded px-2.5 pl-8 text-[14px] font-normal text-zinc-200 outline-none focus:border-blue-500"
          />
          <Search size={14} className="absolute left-2.5 text-zinc-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
        {filtered.map((ext) => (
          <div
            key={ext.id}
            className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-[14px] text-zinc-100 truncate">{ext.name}</span>
                </div>
                <p className="text-[13px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                  {ext.description}
                </p>
                <div className="flex items-center gap-2 mt-2 text-[12px] text-zinc-500">
                  <span>{ext.author}</span>
                  <span>•</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star size={11} fill="currentColor" />
                    <span>{ext.rating}</span>
                  </div>
                  <span>•</span>
                  <span>v{ext.version}</span>
                </div>
              </div>

              <button
                onClick={() => toggleInstall(ext.id)}
                className={`px-3 py-1 rounded text-[13px] font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                  ext.installed
                    ? "bg-zinc-800 text-zinc-400 hover:text-rose-400 hover:bg-zinc-700/60"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {ext.installed ? (
                  <>
                    <Check size={12} strokeWidth={2.2} />
                    <span>Installed</span>
                  </>
                ) : (
                  <>
                    <Download size={12} strokeWidth={2.2} />
                    <span>Install</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

