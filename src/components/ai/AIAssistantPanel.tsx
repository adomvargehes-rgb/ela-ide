"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Infinity as InfinityIcon,
  ChevronDown,
  Sparkles,
  Mic,
  MicOff,
  Square,
  ArrowUp,
  X,
  FileCode,
  Check,
  ArrowUpCircle,
  Gauge,
  Bell,
  Paperclip,
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
    chatMessages,
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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const promptText = inputPrompt.trim();
    if (!promptText || isAILoading) return;

    let finalPrompt = promptText;
    let finalMode = mode;

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
    <div className="w-80 md:w-96 bg-[#121214] border-l border-zinc-800/60 flex flex-col h-full shrink-0 select-none overflow-hidden z-20 font-sans">
      {/* ZERO top bar, ZERO headers — pure, clean Qoder stream */}

      {/* 1. Chat Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <AIChatMessage key={msg.id} message={msg} />
        ))}

        {isAILoading && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Agent is working...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 2. Slash Commands Menu Popup */}
      {isSlashMenuOpen && (
        <div className="mx-4 mb-2 bg-[#1a1a1e] border border-zinc-800 rounded-xl shadow-2xl p-1.5 space-y-0.5 text-xs z-30">
          <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
            Commands
          </div>
          {SLASH_COMMANDS.map((cmd, idx) => (
            <div
              key={cmd.command}
              onClick={() => applySlashCommand(cmd)}
              onMouseEnter={() => setSelectedSlashIndex(idx)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedSlashIndex === idx ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-semibold">{cmd.command}</span>
                <span className="text-zinc-400 text-[11px] truncate">{cmd.description}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. File Context (@) Menu Popup */}
      {isFilePickerOpen && (
        <div className="mx-4 mb-2 bg-[#1a1a1e] border border-zinc-800 rounded-xl shadow-2xl p-1.5 max-h-48 overflow-y-auto space-y-0.5 text-xs z-30">
          <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
            Workspace Files
          </div>
          {allWorkspaceFiles.map((f) => (
            <div
              key={f.path}
              onClick={() => attachFile(f)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-zinc-300 hover:bg-zinc-800 transition-colors font-mono text-[11px]"
            >
              <FileCode size={12} className="text-blue-400 shrink-0" />
              <span className="truncate">{f.path}</span>
            </div>
          ))}
        </div>
      )}

      {/* 4. Qoder Composer Input Container */}
      <div className="px-3 pb-1">
        <div className="bg-[#18181b] rounded-2xl p-3 border border-zinc-800/80 shadow-lg focus-within:border-zinc-700 transition-all">
          {/* Attached Files Chips */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pb-2 mb-2 border-b border-zinc-800/60">
              {attachedFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800/80 text-[11px] text-zinc-300 font-mono"
                >
                  <FileCode size={11} className="text-blue-400 shrink-0" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button
                    onClick={() => removeAttachedFile(file.path)}
                    className="p-0.5 hover:text-white text-zinc-500"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Clean Composer Textarea */}
          <textarea
            ref={textareaRef}
            value={inputPrompt}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask for follow up changes"
            rows={2}
            className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none resize-none font-sans leading-relaxed scrollbar-none"
          />

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-2">
            {/* Left Controls: [ Ꝏ Agent ⌄ ] and [ Auto ⌄ ] */}
            <div className="flex items-center gap-1.5">
              {/* Mode Selector Pill: Ꝏ Agent ⌄ */}
              <div className="relative" ref={modeDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsModeDropdownOpen((v) => !v)}
                  className="h-7 px-2.5 rounded-lg bg-[#27272a]/70 hover:bg-[#27272a] text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-zinc-700/40"
                >
                  <InfinityIcon size={13} className="text-zinc-400" />
                  <span className="capitalize">{mode === "agent" ? "Agent" : "Chat"}</span>
                  <ChevronDown size={11} className="text-zinc-500" />
                </button>

                {isModeDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-36 bg-[#1a1a1e] border border-zinc-800 rounded-xl shadow-2xl p-1 text-xs space-y-0.5 z-40">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("agent");
                        setIsModeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        mode === "agent" ? "bg-zinc-800 text-white font-medium" : "text-zinc-300 hover:bg-zinc-800/60"
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
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                        mode === "chat" ? "bg-zinc-800 text-white font-medium" : "text-zinc-300 hover:bg-zinc-800/60"
                      }`}
                    >
                      <span>Chat</span>
                      {mode === "chat" && <Check size={11} />}
                    </button>
                  </div>
                )}
              </div>

              {/* Model Selector Pill: Auto ⌄ */}
              <div className="relative" ref={modelDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen((v) => !v)}
                  className="h-7 px-2.5 rounded-lg bg-[#27272a]/70 hover:bg-[#27272a] text-zinc-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-zinc-700/40 max-w-[140px] truncate"
                >
                  <span className="truncate">{activeProvider?.selectedModel ? activeProvider.selectedModel.split("/").pop() : "Auto"}</span>
                  <ChevronDown size={11} className="text-zinc-500 shrink-0" />
                </button>

                {isModelDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-64 bg-[#1a1a1e] border border-zinc-800 rounded-xl shadow-2xl p-1.5 max-h-56 overflow-y-auto space-y-0.5 text-xs z-50">
                    <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
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
                            isSelected ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800/60"
                          }`}
                        >
                          <div className="truncate min-w-0 pr-1">
                            <span className="truncate font-mono text-[11px] block">{item.model}</span>
                            <span className="text-[10px] text-zinc-500 block">{item.providerName}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {item.isFree && (
                              <span className="text-[9px] font-mono px-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                                FREE
                              </span>
                            )}
                            {isSelected && <Check size={11} strokeWidth={2.5} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Sparkle, Mic, and Green Square Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFilePickerOpen((v) => !v)}
                title="Attach context (@)"
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
              >
                <Sparkles size={14} />
              </button>

              <button
                type="button"
                onClick={toggleSpeech}
                title={isListening ? "Listening... click to stop" : "Voice input"}
                className={`p-1 transition-colors ${
                  isListening ? "text-rose-400 animate-pulse" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
              </button>

              {/* Exact Qoder Green Action Button */}
              {isAILoading ? (
                <button
                  type="button"
                  title="Stop generating"
                  className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center transition-colors shadow-sm"
                >
                  <Square size={9} className="text-black" fill="currentColor" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!inputPrompt.trim()}
                  title="Submit (Enter)"
                  className="w-7 h-7 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 flex items-center justify-center transition-colors shadow-sm"
                >
                  <Square size={9} className="text-black" fill="currentColor" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Minimal Qoder Bottom Status Bar */}
      <div className="h-6 px-3 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-900 bg-[#121214] select-none">
        <div className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer text-[10px]">
          <span>⇥ NEXT</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => updateSettings({ activeProviderId: "groq" })}
            title="Fast Free Models Active"
            className="flex items-center gap-1 hover:text-zinc-300 transition-colors"
          >
            <ArrowUpCircle size={11} className="text-zinc-400" />
            <span>Free - Upgrade</span>
          </button>

          <div
            title={`Token Usage: ${tokenStats.totalPromptTokens + tokenStats.totalCompletionTokens} tokens`}
            className="flex items-center gap-1 hover:text-zinc-300 cursor-help"
          >
            <Gauge size={11} className="text-zinc-400" />
            <span>Usage</span>
          </div>

          <button title="Notifications" className="hover:text-zinc-300 transition-colors">
            <Bell size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
