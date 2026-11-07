"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Sparkles,
  Zap,
  Brain,
  Paperclip,
  Mic,
  MicOff,
  Square,
  ArrowUp,
  X,
  ChevronDown,
  RotateCcw,
  FileCode,
  FileText,
  Check,
  Plus,
  Terminal,
  SlidersHorizontal,
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
    description: "Autonomous multi-step task execution, file creation and updates",
    mode: "agent",
  },
  {
    command: "/chat",
    label: "Chat",
    description: "General pair programming, questions, and discussions",
    mode: "chat",
  },
  {
    command: "/fix",
    label: "Fix Bugs",
    description: "Analyze code for errors, race conditions, and generate fixes",
    mode: "bugfix",
  },
  {
    command: "/refactor",
    label: "Refactor",
    description: "Clean up code architecture, modernize patterns, and optimize",
    mode: "edit",
  },
  {
    command: "/explain",
    label: "Explain Code",
    description: "In-depth breakdown of code logic, flow, and architecture",
    mode: "explain",
  },
];

export default function AIAssistantPanel() {
  const {
    isAIPanelOpen,
    setIsAIPanelOpen,
    chatMessages,
    isAILoading,
    sendAIMessage,
    activeFile,
    files,
    providers,
    settings,
    updateSettings,
    updateProviderConfig,
  } = useIDE();

  const [inputPrompt, setInputPrompt] = useState("");
  const [mode, setMode] = useState<AIMode>("agent");
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0);
  const [attachedFiles, setAttachedFiles] = useState<{ path: string; name: string }[]>([]);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAILoading]);

  // Click outside to close model dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modelDropdownRef.current &&
        !modelDropdownRef.current.contains(event.target as Node)
      ) {
        setIsModelDropdownOpen(false);
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

  // Auto-attach active file if none attached
  useEffect(() => {
    if (activeFile && attachedFiles.length === 0) {
      setAttachedFiles([{ path: activeFile.path, name: activeFile.name }]);
    }
  }, [activeFile]);

  if (!isAIPanelOpen) return null;

  const activeProvider = providers[settings.activeProviderId];

  // Flat list of all available models across enabled providers
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

    // Trigger slash commands menu when starts with "/"
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
        const selected = SLASH_COMMANDS[selectedSlashIndex];
        applySlashCommand(selected);
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
    // Remove the trailing '@' if present
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

    // Check for inline slash command execution
    let finalPrompt = promptText;
    let finalMode = mode;

    for (const cmd of SLASH_COMMANDS) {
      if (promptText.startsWith(cmd.command)) {
        finalMode = cmd.mode;
        finalPrompt = promptText.replace(cmd.command, "").trim();
        break;
      }
    }

    // Append context from explicitly attached files
    if (attachedFiles.length > 0) {
      const contextHeaders = attachedFiles.map((f) => `Referenced file: ${f.path}`).join("\n");
      finalPrompt = `${finalPrompt}\n\n[Active Context References:\n${contextHeaders}]`;
    }

    if (isThinkingEnabled) {
      finalPrompt = `[Thinking Mode: Enabled. Please reason step-by-step through first principles before generating code]\n${finalPrompt}`;
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

  // Browser speech recognition toggle
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="w-80 md:w-96 bg-[#121214] border-l border-zinc-800/80 flex flex-col h-full shrink-0 select-none overflow-hidden z-20 font-sans">
      {/* 1. Minimal Top Toolbar (Single-line, zero clutter, no large headers) */}
      <div className="h-9 px-3 border-b border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-800/60 text-zinc-300 text-[11px] font-medium border border-zinc-700/50">
            <Sparkles size={11} className="text-blue-400" />
            <span>Qoder AI</span>
          </div>
          {mode === "agent" && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
              AGENT
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setInputPrompt("");
              setAttachedFiles([]);
            }}
            title="New Conversation"
            className="p-1 hover:text-zinc-200 text-zinc-500 rounded hover:bg-zinc-800 transition-colors"
          >
            <Plus size={13} />
          </button>
          <button
            onClick={() => setIsAIPanelOpen(false)}
            title="Close Assistant"
            className="p-1 hover:text-zinc-200 text-zinc-500 rounded hover:bg-zinc-800 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* 2. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chatMessages.map((msg) => (
          <AIChatMessage key={msg.id} message={msg} />
        ))}

        {isAILoading && (
          <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-xs text-zinc-400 flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <span className="font-medium text-zinc-300">
              {mode === "agent" ? "Autonomous agent reasoning & planning..." : "Generating response..."}
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Slash Commands Popup */}
      {isSlashMenuOpen && (
        <div className="mx-3 mb-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden p-1 space-y-0.5 text-xs z-30">
          <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
            Slash Commands
          </div>
          {SLASH_COMMANDS.map((cmd, idx) => (
            <div
              key={cmd.command}
              onClick={() => applySlashCommand(cmd)}
              onMouseEnter={() => setSelectedSlashIndex(idx)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedSlashIndex === idx ? "bg-blue-600 text-white" : "text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">{cmd.command}</span>
                <span className="text-zinc-400 text-[11px] truncate">{cmd.description}</span>
              </div>
              <span className="text-[10px] uppercase font-mono px-1 rounded bg-zinc-800 text-zinc-400">
                {cmd.mode}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 4. File Mention (@) Context Picker Popup */}
      {isFilePickerOpen && (
        <div className="mx-3 mb-1 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden p-1 max-h-48 overflow-y-auto space-y-0.5 text-xs z-30">
          <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
            Attach Workspace File
          </div>
          {allWorkspaceFiles.map((f) => (
            <div
              key={f.path}
              onClick={() => attachFile(f)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <FileCode size={13} className="text-blue-400 shrink-0" />
              <span className="truncate flex-1 font-mono text-[11px]">{f.path}</span>
            </div>
          ))}
        </div>
      )}

      {/* 5. Unified Qoder-Style Composer Container */}
      <div className="p-3 bg-[#121214]">
        <div className="relative flex flex-col bg-zinc-900/90 border border-zinc-800/90 focus-within:border-zinc-700 rounded-2xl p-2.5 transition-all shadow-lg focus-within:ring-1 focus-within:ring-zinc-700">
          {/* Attached context chips row */}
          {attachedFiles.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pb-1.5 mb-1.5 border-b border-zinc-800/60">
              {attachedFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-[11px] text-zinc-300 font-mono"
                >
                  <FileCode size={11} className="text-blue-400 shrink-0" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button
                    onClick={() => removeAttachedFile(file.path)}
                    className="p-0.5 hover:text-rose-400 text-zinc-500"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Autosizing textarea */}
          <textarea
            ref={textareaRef}
            value={inputPrompt}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Plan and build, @ for context, / for commands"
            rows={2}
            className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none resize-none font-sans leading-relaxed scrollbar-none"
          />

          {/* Bottom Controls Row inside Composer */}
          <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-zinc-800/60">
            {/* Left Controls: Attach, Mode, Thinking, Model Selector */}
            <div className="flex items-center gap-1 flex-wrap">
              {/* Attachment / File context button */}
              <button
                type="button"
                onClick={() => setIsFilePickerOpen((v) => !v)}
                title="Attach file context (@)"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <Paperclip size={13} />
              </button>

              {/* Mode Selector Pill (Agent vs Chat) */}
              <button
                type="button"
                onClick={() => setMode((m) => (m === "agent" ? "chat" : "agent"))}
                title="Toggle Mode"
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors border ${
                  mode === "agent"
                    ? "bg-purple-950/40 text-purple-300 border-purple-800/50"
                    : "bg-zinc-800/60 text-zinc-400 border-zinc-700/40 hover:text-zinc-200"
                }`}
              >
                {mode === "agent" ? <Zap size={11} /> : <Sparkles size={11} />}
                <span className="capitalize">{mode}</span>
              </button>

              {/* Thinking / Reasoning Toggle */}
              <button
                type="button"
                onClick={() => setIsThinkingEnabled((v) => !v)}
                title="Toggle Reasoning / Deep Thinking mode"
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors border ${
                  isThinkingEnabled
                    ? "bg-amber-950/40 text-amber-300 border-amber-800/50"
                    : "bg-zinc-800/60 text-zinc-400 border-zinc-700/40 hover:text-zinc-200"
                }`}
              >
                <Brain size={11} />
                <span>Think</span>
              </button>

              {/* Compact Model Selector */}
              <div className="relative" ref={modelDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen((v) => !v)}
                  className="px-2 py-0.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-[11px] text-zinc-300 border border-zinc-700/50 flex items-center gap-1 transition-colors max-w-[130px] truncate"
                >
                  <span className="truncate font-mono text-[10px]">
                    {activeProvider?.selectedModel}
                  </span>
                  <ChevronDown size={10} className="shrink-0 text-zinc-500" />
                </button>

                {/* Model Dropdown Menu */}
                {isModelDropdownOpen && (
                  <div className="absolute left-0 bottom-full mb-1 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-1.5 max-h-56 overflow-y-auto space-y-0.5 text-xs z-50">
                    <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                      Select Active Model
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
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "text-zinc-300 hover:bg-zinc-800"
                          }`}
                        >
                          <div className="truncate min-w-0 pr-1">
                            <span className="truncate font-mono text-[11px] block">{item.model}</span>
                            <span className="text-[10px] text-zinc-400 block">{item.providerName}</span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {item.isFree && (
                              <span className="text-[9px] font-mono px-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                                FREE
                              </span>
                            )}
                            {isSelected && <Check size={12} strokeWidth={2.5} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Controls: Mic & Send/Cancel */}
            <div className="flex items-center gap-1.5 shrink-0 ml-1">
              {/* Mic / Voice input */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                title={isListening ? "Listening... Click to stop" : "Voice input"}
                className={`p-1.5 rounded-lg transition-colors ${
                  isListening
                    ? "text-rose-400 bg-rose-950/40 animate-pulse"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                {isListening ? <MicOff size={13} /> : <Mic size={13} />}
              </button>

              {/* Send or Stop button */}
              {isAILoading ? (
                <button
                  type="button"
                  title="Cancel generation"
                  className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors shadow"
                >
                  <Square size={10} fill="currentColor" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!inputPrompt.trim()}
                  title="Send (Enter)"
                  className="w-7 h-7 rounded-full bg-white text-black hover:bg-zinc-200 disabled:opacity-30 disabled:hover:bg-white flex items-center justify-center transition-colors shadow"
                >
                  <ArrowUp size={13} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
