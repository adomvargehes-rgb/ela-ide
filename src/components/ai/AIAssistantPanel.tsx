"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Infinity as InfinityIcon,
  ChevronDown,
  Sparkles,
  Mic,
  MicOff,
  Square,
  X,
  FileCode,
  Check,
  ArrowUpCircle,
  Gauge,
  Bell,
  Code2,
  BookOpen,
  Bug,
  PlusCircle,
  MessageSquare,
  Bot,
  RotateCcw,
  Plus,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { AIMode, AIProviderId, FileItem } from "@/types/ide";
import AIChatMessage from "./AIChatMessage";

interface SlashCommand {
  command: string;
  label: string;
  description: string;
  mode: AIMode;
}

const SLASH_COMMANDS: SlashCommand[] = [
  {
    command: "/agent",
    label: "Agent Mode",
    description: "Autonomous multi-step coding, file creation & terminal execution",
    mode: "agent",
  },
  {
    command: "/chat",
    label: "Chat",
    description: "General pair programming, questions, and explanations",
    mode: "chat",
  },
  {
    command: "/fix",
    label: "Fix Bugs",
    description: "Scan code for errors and generate root-cause fix",
    mode: "bugfix",
  },
  {
    command: "/refactor",
    label: "Refactor",
    description: "Modernize architecture, clean up code, and extract hooks",
    mode: "edit",
  },
  {
    command: "/explain",
    label: "Explain Code",
    description: "Detailed walkthrough of logic and architecture",
    mode: "explain",
  },
];

export default function AIAssistantPanel() {
  const {
    isAIPanelOpen,
    toggleAIPanel,
    chatMessages,
    clearChatMessages,
    isAILoading,
    sendAIMessage,
    activeFile,
    files,
    providers,
    settings,
    updateSettings,
    updateProviderConfig,
    tokenStats,
  } = useIDE();

  const [inputPrompt, setInputPrompt] = useState("");
  const [mode, setMode] = useState<AIMode>("agent");
  const [activeTab, setActiveTab] = useState<"agent" | "chat">("agent");
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0);
  const [attachedFiles, setAttachedFiles] = useState<{ path: string; name: string }[]>([]);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAILoading]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
      }
      if (
        modeDropdownRef.current &&
        !modeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Collect all project files for @ mentions
  const allWorkspaceFiles = useMemo(() => {
    const list: { path: string; name: string }[] = [];
    const traverse = (items: FileItem[]) => {
      for (const item of items) {
        if (item.type === "file") {
          list.push({ path: item.path, name: item.name });
        }
        if (item.children) traverse(item.children);
      }
    };
    traverse(files);
    return list;
  }, [files]);

  if (!isAIPanelOpen) return null;

  const activeProvider = providers[settings.activeProviderId];

  // List of all models
  const allAvailableModels: {
    providerId: AIProviderId;
    providerName: string;
    model: string;
    isFree?: boolean;
  }[] = [];

  (Object.keys(providers) as AIProviderId[]).forEach((pid) => {
    const prov = providers[pid];
    if (prov) {
      prov.availableModels.forEach((m) => {
        allAvailableModels.push({
          providerId: pid,
          providerName: prov.name.split(" ")[0],
          model: m,
          isFree: ["groq", "cerebras", "sambanova", "nvidia", "ollama"].includes(pid),
        });
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputPrompt(value);

    if (value.startsWith("/") && !value.includes(" ")) {
      setIsSlashMenuOpen(true);
      setIsFilePickerOpen(false);
    } else if (value.endsWith("@")) {
      setIsFilePickerOpen(true);
      setIsSlashMenuOpen(false);
    } else {
      setIsSlashMenuOpen(false);
      setIsFilePickerOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isSlashMenuOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSlashIndex((prev) => (prev + 1) % SLASH_COMMANDS.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSlashIndex((prev) => (prev - 1 + SLASH_COMMANDS.length) % SLASH_COMMANDS.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        applySlashCommand(SLASH_COMMANDS[selectedSlashIndex]);
        return;
      }
      if (e.key === "Escape") {
        setIsSlashMenuOpen(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const applySlashCommand = (cmd: SlashCommand) => {
    setMode(cmd.mode);
    setIsSlashMenuOpen(false);
    setInputPrompt("");
    textareaRef.current?.focus();
  };

  const attachFile = (f: { path: string; name: string }) => {
    if (!attachedFiles.some((item) => item.path === f.path)) {
      setAttachedFiles((prev) => [...prev, f]);
    }
    if (inputPrompt.endsWith("@")) {
      setInputPrompt((prev) => prev.slice(0, -1));
    }
    setIsFilePickerOpen(false);
    textareaRef.current?.focus();
  };

  const removeAttachedFile = (path: string) => {
    setAttachedFiles((prev) => prev.filter((item) => item.path !== path));
  };

  const handleSubmit = (customPrompt?: string, targetMode?: AIMode) => {
    const promptText = (customPrompt || inputPrompt).trim();
    if (!promptText || isAILoading) return;

    let finalPrompt = promptText;
    let finalMode = targetMode || mode;

    for (const cmd of SLASH_COMMANDS) {
      if (promptText.startsWith(cmd.command)) {
        finalMode = cmd.mode;
        finalPrompt = promptText.replace(cmd.command, "").trim();
        break;
      }
    }

    if (attachedFiles.length > 0) {
      const contextHeaders = attachedFiles.map((f) => `Context File: ${f.path}`).join("\n");
      finalPrompt = `${finalPrompt}\n\n[Active Workspace References:\n${contextHeaders}]`;
    }

    setInputPrompt("");
    setIsSlashMenuOpen(false);
    setIsFilePickerOpen(false);
    sendAIMessage(finalPrompt, finalMode);
  };

  const handleModelSelect = (providerId: AIProviderId, modelName: string) => {
    updateSettings({ activeProviderId: providerId });
    updateProviderConfig(providerId, { selectedModel: modelName });
    setIsModelDropdownOpen(false);
  };

  const toggleSpeech = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInputPrompt((prev) => (prev ? `${prev} ${text}` : text));
      };
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#141416] border-l border-[#282828] flex flex-col select-none overflow-hidden z-20 font-sans">
      {/* 1. Header with subtle session controls */}
      <div className="h-[28px] px-3 bg-[#181818] border-b border-[#282828] flex items-center justify-end shrink-0">
        <div className="flex items-center gap-1 text-[#858585]">
          <button
            onClick={() => clearChatMessages()}
            title="New Chat Session"
            className="p-1 rounded hover:text-white hover:bg-[#2A2D32] transition-colors"
          >
            <Plus size={13} />
          </button>
          <button
            onClick={toggleAIPanel}
            title="Collapse Assistant (Ctrl+Shift+A)"
            className="p-1 rounded hover:text-white hover:bg-[#2A2D32] transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* 2. Chat Message Stream or Minimal Welcome State */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col justify-end pb-4 space-y-3">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-[#858585] uppercase tracking-wider block">
                Quick Actions
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() =>
                  handleSubmit(
                    `Generate a modern, clean component for ${activeFile?.name || "the project"}`,
                    "agent"
                  )
                }
                className="p-2 rounded-lg bg-[#1E1E22] hover:bg-[#26262B] border border-[#2D2D32] text-left text-[11px] text-[#CCCCCC] hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <Code2 size={13} className="text-[#3B82F6] shrink-0" />
                <span className="truncate">Generate Code</span>
              </button>

              <button
                onClick={() =>
                  handleSubmit(
                    `Explain the architecture and flow of ${activeFile?.name || "this file"} in detail`,
                    "explain"
                  )
                }
                className="p-2 rounded-lg bg-[#1E1E22] hover:bg-[#26262B] border border-[#2D2D32] text-left text-[11px] text-[#CCCCCC] hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <BookOpen size={13} className="text-amber-400 shrink-0" />
                <span className="truncate">Explain File</span>
              </button>

              <button
                onClick={() =>
                  handleSubmit(
                    `Scan ${activeFile?.name || "workspace"} for potential bugs, edge cases, and performance bottlenecks`,
                    "bugfix"
                  )
                }
                className="p-2 rounded-lg bg-[#1E1E22] hover:bg-[#26262B] border border-[#2D2D32] text-left text-[11px] text-[#CCCCCC] hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <Bug size={13} className="text-rose-400 shrink-0" />
                <span className="truncate">Find & Fix Issues</span>
              </button>

              <button
                onClick={() =>
                  handleSubmit(
                    `Add a new feature and tests to ${activeFile?.name || "current project"}`,
                    "agent"
                  )
                }
                className="p-2 rounded-lg bg-[#1E1E22] hover:bg-[#26262B] border border-[#2D2D32] text-left text-[11px] text-[#CCCCCC] hover:text-white transition-colors flex items-center gap-1.5 group"
              >
                <PlusCircle size={13} className="text-emerald-400 shrink-0" />
                <span className="truncate">Add New Feature</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((msg) => (
              <AIChatMessage key={msg.id} message={msg} />
            ))}

            {isAILoading && (
              <div className="flex items-center gap-2 text-xs text-zinc-400 py-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px]">Agent is thinking & writing code...</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Slash Commands Popup */}
      {isSlashMenuOpen && (
        <div className="mx-3 mb-2 bg-[#1C1C20] border border-[#303030] rounded-xl shadow-2xl p-1.5 space-y-0.5 text-xs z-30">
          <div className="px-2 py-0.5 text-[10px] uppercase font-semibold text-[#858585] tracking-wider">
            Commands
          </div>
          {SLASH_COMMANDS.map((cmd, idx) => (
            <div
              key={cmd.command}
              onClick={() => applySlashCommand(cmd)}
              onMouseEnter={() => setSelectedSlashIndex(idx)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedSlashIndex === idx ? "bg-[#2A2D32] text-white" : "text-[#CCCCCC] hover:bg-[#26262B]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-semibold">{cmd.command}</span>
                <span className="text-[#858585] text-[11px] truncate">{cmd.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. File Context (@) Menu Popup */}
      {isFilePickerOpen && (
        <div className="mx-3 mb-2 bg-[#1C1C20] border border-[#303030] rounded-xl shadow-2xl p-1.5 max-h-48 overflow-y-auto space-y-0.5 text-xs z-30">
          <div className="px-2 py-0.5 text-[10px] uppercase font-semibold text-[#858585] tracking-wider">
            Workspace Files
          </div>
          {allWorkspaceFiles.map((f) => (
            <div
              key={f.path}
              onClick={() => attachFile(f)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-[#CCCCCC] hover:bg-[#2A2D32] transition-colors font-mono text-[11px]"
            >
              <FileCode size={12} className="text-[#3B82F6] shrink-0" />
              <span className="truncate">{f.path}</span>
            </div>
          ))}
        </div>
      )}

      {/* 5. Fixed Bottom Composer Container (Exact match to screenshot) */}
      <div className="px-2.5 pb-1">
        <div className="bg-[#18181B] rounded-xl p-2.5 border border-[#2D2D32] shadow-lg focus-within:border-[#3E3E46] transition-all">
          {/* Attached Files Chips */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pb-1.5 mb-1.5 border-b border-[#282828]">
              {attachedFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#252528] text-[10.5px] text-[#CCCCCC] font-mono"
                >
                  <FileCode size={11} className="text-[#3B82F6] shrink-0" />
                  <span className="truncate max-w-[110px]">{file.name}</span>
                  <button
                    onClick={() => removeAttachedFile(file.path)}
                    className="p-0.5 hover:text-white text-[#858585]"
                  >
                    <X size={9} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={inputPrompt}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask for follow up changes"
            rows={2}
            className="w-full bg-transparent text-[12px] text-[#E4E4E7] placeholder-[#66666A] outline-none resize-none font-sans leading-relaxed scrollbar-none"
          />

          {/* Controls Bar inside Composer */}
          <div className="flex items-center justify-between pt-1.5">
            {/* Left: Mode pill and Model pill */}
            <div className="flex items-center gap-1.5">
              {/* [ Ꝏ Agent ⌄ ] */}
              <div className="relative" ref={modeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsModeDropdownOpen((v) => !v)}
                  className="h-6 px-2 rounded-md bg-[#242428] hover:bg-[#2C2C30] text-[#CCCCCC] text-[11px] font-medium flex items-center gap-1 transition-colors border border-[#333338]"
                >
                  <InfinityIcon size={12} className="text-[#858585]" />
                  <span className="capitalize">{mode === "agent" ? "Agent" : "Chat"}</span>
                  <ChevronDown size={10} className="text-[#858585]" />
                </button>

                {isModeDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-32 bg-[#1C1C20] border border-[#303030] rounded-xl shadow-2xl p-1 text-xs space-y-0.5 z-40">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("agent");
                        setIsModeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between ${
                        mode === "agent" ? "bg-[#2A2D32] text-white" : "text-[#CCCCCC] hover:bg-[#26262B]"
                      }`}
                    >
                      <span>Agent</span>
                      {mode === "agent" && <Check size={11} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("chat");
                        setIsModeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between ${
                        mode === "chat" ? "bg-[#2A2D32] text-white" : "text-[#CCCCCC] hover:bg-[#26262B]"
                      }`}
                    >
                      <span>Chat</span>
                      {mode === "chat" && <Check size={11} />}
                    </button>
                  </div>
                )}
              </div>

              {/* [ Auto ⌄ ] */}
              <div className="relative" ref={modelDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen((v) => !v)}
                  className="h-6 px-1.5 rounded-md hover:bg-[#242428] text-[#858585] hover:text-[#CCCCCC] text-[11px] font-medium flex items-center gap-1 transition-colors max-w-[130px] truncate"
                >
                  <span className="truncate">{activeProvider?.selectedModel ? activeProvider.selectedModel.split("/").pop() : "Auto"}</span>
                  <ChevronDown size={10} className="text-[#858585] shrink-0" />
                </button>

                {isModelDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-64 bg-[#1C1C20] border border-[#303030] rounded-xl shadow-2xl p-1.5 max-h-56 overflow-y-auto space-y-0.5 text-xs z-50">
                    <div className="px-2 py-0.5 text-[10px] uppercase font-semibold text-[#858585] tracking-wider">
                      Available Models
                    </div>
                    {allAvailableModels.map((item, idx) => {
                      const isSelected =
                        settings.activeProviderId === item.providerId &&
                        activeProvider?.selectedModel === item.model;

                      return (
                        <div
                          key={`${item.providerId}-${item.model}-${idx}`}
                          onClick={() => handleModelSelect(item.providerId, item.model)}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                            isSelected ? "bg-[#2A2D32] text-white" : "text-[#CCCCCC] hover:bg-[#26262B]"
                          }`}
                        >
                          <div className="truncate min-w-0 pr-1">
                            <span className="truncate font-mono text-[11px] block">{item.model}</span>
                            <span className="text-[10px] text-[#858585] block">{item.providerName}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {item.isFree && (
                              <span className="text-[9px] font-mono px-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                                FREE
                              </span>
                            )}
                            {isSelected && <Check size={11} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Sparkles, Mic, Emerald Action Square */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsFilePickerOpen((v) => !v)}
                title="Attach workspace context (@)"
                className="text-[#858585] hover:text-[#CCCCCC] transition-colors p-1"
              >
                <Sparkles size={13} />
              </button>

              <button
                type="button"
                onClick={toggleSpeech}
                title={isListening ? "Listening... click to stop" : "Voice input"}
                className={`p-1 transition-colors ${
                  isListening ? "text-rose-400 animate-pulse" : "text-[#858585] hover:text-[#CCCCCC]"
                }`}
              >
                {isListening ? <MicOff size={13} /> : <Mic size={13} />}
              </button>

              {/* Exact Green Square Action Button from Screenshot */}
              {isAILoading ? (
                <button
                  type="button"
                  title="Stop generation"
                  className="w-6 h-6 rounded-md bg-[#10B981] hover:bg-emerald-400 flex items-center justify-center transition-colors shadow-sm"
                >
                  <Square size={8} className="text-black" fill="currentColor" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={!inputPrompt.trim()}
                  title="Submit (Enter)"
                  className="w-6 h-6 rounded-md bg-[#10B981] hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-[#10B981] flex items-center justify-center transition-colors shadow-sm"
                >
                  <Square size={8} className="text-black" fill="currentColor" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Status line under composer (Exact match to screenshot) */}
      <div className="h-[22px] px-3 flex items-center justify-between text-[10.5px] text-[#666666] border-t border-[#242426] bg-[#141416] select-none">
        <div className="flex items-center gap-1 hover:text-[#CCCCCC] cursor-pointer">
          <span>⇥ NEXT</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => updateSettings({ activeProviderId: "groq" })}
            title="Free Tier Active"
            className="flex items-center gap-1 hover:text-[#CCCCCC] transition-colors"
          >
            <ArrowUpCircle size={10} className="text-[#666666]" />
            <span>Pro Trial - Upgrade</span>
          </button>

          <div
            title={`Token Usage: ${tokenStats.totalPromptTokens + tokenStats.totalCompletionTokens} tokens`}
            className="flex items-center gap-1 hover:text-[#CCCCCC] cursor-help"
          >
            <Gauge size={10} className="text-[#666666]" />
            <span>Usage - 100%</span>
          </div>

          <button title="Notifications" className="hover:text-[#CCCCCC] transition-colors">
            <Bell size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
