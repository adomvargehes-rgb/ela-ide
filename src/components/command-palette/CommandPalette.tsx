"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  FileCode,
  Play,
  Sparkles,
  Plus,
  Trash2,
  Settings2,
  Terminal,
  Monitor,
  GitBranch,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";

interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    files,
    openFile,
    runProject,
    setIsAIPanelOpen,
    createFile,
    clearOutputLogs,
    setActiveSidebarTab,
    setIsSidebarOpen,
    setIsBottomOpen,
    setBottomPanelTab,
  } = useIDE();

  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keybinding Ctrl+Shift+P / Cmd+Shift+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "P" || e.key === "p")) {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      } else if (e.key === "Escape") {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setIsCommandPaletteOpen]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Collect all project files
  const fileCommands: CommandItem[] = [];
  const collectFiles = (items: typeof files) => {
    for (const item of items) {
      if (item.type === "file") {
        fileCommands.push({
          id: `file-${item.path}`,
          title: `Open: ${item.name} (${item.path})`,
          category: "Files",
          icon: <FileCode size={14} className="text-blue-400" />,
          action: () => {
            openFile(item.path);
            setIsCommandPaletteOpen(false);
          },
        });
      }
      if (item.children) collectFiles(item.children);
    }
  };
  collectFiles(files);

  // General commands
  const defaultCommands: CommandItem[] = [
    {
      id: "run-project",
      title: "Run: Execute Active File / Project",
      category: "Runner",
      icon: <Play size={14} className="text-emerald-400" />,
      action: () => {
        runProject();
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "toggle-ai",
      title: "View: Toggle AI Assistant Panel",
      category: "AI",
      icon: <Sparkles size={14} className="text-blue-400" />,
      action: () => {
        setIsAIPanelOpen(true);
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "new-file",
      title: "File: Create New File in Workspace",
      category: "File",
      icon: <Plus size={14} className="text-amber-400" />,
      action: () => {
        const name = prompt("Enter new filename:", "Component.tsx");
        if (name) createFile("/src", name, "file");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "open-terminal",
      title: "View: Open Integrated Terminal",
      category: "Terminal",
      icon: <Terminal size={14} className="text-purple-400" />,
      action: () => {
        setIsBottomOpen(true);
        setBottomPanelTab("terminal");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "open-preview",
      title: "View: Open Live Web Preview",
      category: "Preview",
      icon: <Monitor size={14} className="text-emerald-400" />,
      action: () => {
        setIsBottomOpen(true);
        setBottomPanelTab("preview");
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "open-settings",
      title: "Preferences: Open AI Provider & Editor Settings",
      category: "Settings",
      icon: <Settings2 size={14} className="text-zinc-400" />,
      action: () => {
        setActiveSidebarTab("settings");
        setIsSidebarOpen(true);
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: "clear-output",
      title: "Console: Clear Output Logs",
      category: "Console",
      icon: <Trash2 size={14} className="text-rose-400" />,
      action: () => {
        clearOutputLogs();
        setIsCommandPaletteOpen(false);
      },
    },
  ];

  const allItems = [...defaultCommands, ...fileCommands];
  const filtered = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <div
      onClick={() => setIsCommandPaletteOpen(false)}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col text-xs"
      >
        {/* Search Input Bar */}
        <div className="p-3 border-b border-zinc-800 flex items-center gap-2.5">
          <Search size={15} className="text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or filename..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          />
          <kbd className="text-[10px] font-mono bg-zinc-800 border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-zinc-500 text-xs">No matching commands or files.</div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-600 text-white" : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    <span className="truncate">{item.title}</span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-blue-700 text-blue-100" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

