"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Wrench,
  Bug,
  BookOpen,
  Zap,
  X,
  FileCode,
  Loader2,
  Cpu,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { AIMode, AIProviderId } from "@/types/ide";
import AIChatMessage from "./AIChatMessage";

export default function AIAssistantPanel() {
  const {
    isAIPanelOpen,
    setIsAIPanelOpen,
    chatMessages,
    isAILoading,
    sendAIMessage,
    activeFile,
    providers,
    settings,
    updateSettings,
    updateProviderConfig,
  } = useIDE();

  const [inputPrompt, setInputPrompt] = useState("");
  const [mode, setMode] = useState<AIMode>("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAILoading]);

  if (!isAIPanelOpen) return null;

  const activeProvider = providers[settings.activeProviderId];

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputPrompt.trim() || isAILoading) return;
    const p = inputPrompt;
    setInputPrompt("");
    sendAIMessage(p, mode);
  };

  const handleSuggestion = (prompt: string, targetMode: AIMode) => {
    setMode(targetMode);
    sendAIMessage(prompt, targetMode);
  };

  return (
    <div className="w-80 md:w-96 bg-ide-sidebar border-l border-ide-border flex flex-col h-full shrink-0 select-none overflow-hidden z-20">
      {/* AI Panel Header */}
      <div className="h-9 px-3 border-b border-ide-border flex items-center justify-between text-xs bg-ide-activity">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600/30 text-blue-400 flex items-center justify-center">
            <Bot size={13} strokeWidth={2} />
          </div>
          <span className="font-semibold text-zinc-100">AI Coding Assistant</span>
        </div>

        <div className="flex items-center gap-1.5 text-zinc-400">
          {/* Provider selector */}
          <select
            value={settings.activeProviderId}
            onChange={(e) => updateSettings({ activeProviderId: e.target.value as AIProviderId })}
            className="h-6 bg-zinc-900 border border-zinc-700/80 rounded px-1.5 text-[11px] text-zinc-300 outline-none"
          >
            <option value="gemini">Gemini</option>
            <option value="groq">Groq (Free)</option>
            <option value="cerebras">Cerebras (Free)</option>
            <option value="sambanova">SambaNova (Free)</option>
            <option value="nvidia">NVIDIA (Free)</option>
            <option value="deepseek">DeepSeek</option>
            <option value="openrouter">OpenRouter</option>
            <option value="openai">OpenAI</option>
            <option value="ollama">Ollama</option>
          </select>

          <button
            onClick={() => setIsAIPanelOpen(false)}
            title="Close AI Assistant"
            className="p-1 hover:text-white rounded hover:bg-zinc-800"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="px-2 py-1.5 border-b border-ide-border bg-zinc-900/40 flex items-center gap-1 overflow-x-auto text-[11px]">
        <button
          onClick={() => setMode("chat")}
          className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
            mode === "chat"
              ? "bg-blue-600 text-white"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          }`}
        >
          <Sparkles size={11} />
          <span>Chat</span>
        </button>
        <button
          onClick={() => setMode("agent")}
          className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
            mode === "agent"
              ? "bg-purple-600 text-white"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          }`}
        >
          <Zap size={11} />
          <span>Agent</span>
        </button>
        <button
          onClick={() => setMode("edit")}
          className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
            mode === "edit"
              ? "bg-emerald-600 text-white"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          }`}
        >
          <Wrench size={11} />
          <span>Refactor</span>
        </button>
        <button
          onClick={() => setMode("bugfix")}
          className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
            mode === "bugfix"
              ? "bg-rose-600 text-white"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          }`}
        >
          <Bug size={11} />
          <span>Fix Bugs</span>
        </button>
      </div>

      {/* Active File Context banner */}
      {activeFile && (
        <div className="px-3 py-1 bg-zinc-950/70 border-b border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            <FileCode size={11} className="text-blue-400 shrink-0" />
            <span className="truncate">Active Context: {activeFile.path}</span>
          </div>
          <span className="text-zinc-500 font-mono">
            {activeFile.content ? `${Math.round(activeFile.content.length / 4)} tokens` : ""}
          </span>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {chatMessages.map((msg) => (
          <AIChatMessage key={msg.id} message={msg} />
        ))}

        {isAILoading && (
          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-900/40 text-xs text-zinc-400 flex items-center gap-2">
            <Loader2 size={14} className="animate-spin text-blue-400" />
            <span>Thinking and formulating code changes...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Context-aware suggestions */}
      <div className="px-3 py-1.5 border-t border-ide-border/60 bg-zinc-900/30 flex items-center gap-1.5 overflow-x-auto text-[10px] text-zinc-400 scrollbar-none">
        <button
          onClick={() =>
            handleSuggestion(
              `Explain the architecture and logic of ${activeFile?.name || "active file"}.`,
              "explain"
            )
          }
          className="px-2 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 shrink-0"
        >
          Explain active file
        </button>
        <button
          onClick={() =>
            handleSuggestion(
              `Check ${activeFile?.name || "the code"} for edge cases, null reference bugs, and fix them.`,
              "bugfix"
            )
          }
          className="px-2 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 shrink-0"
        >
          Find bugs & fix
        </button>
        <button
          onClick={() =>
            handleSuggestion(
              `Refactor ${activeFile?.name || "this file"} with clean architecture and modern TypeScript patterns.`,
              "edit"
            )
          }
          className="px-2 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 shrink-0"
        >
          Refactor code
        </button>
      </div>

      {/* Chat Input Box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-ide-border bg-ide-activity">
        <div className="relative flex flex-col bg-zinc-900 border border-zinc-700/80 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors shadow-inner">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              mode === "agent"
                ? "Agent instructions (e.g. 'Build a React modal component and write it to /src/Modal.tsx')..."
                : "Ask AI, generate code, or refactor (Enter to send)..."
            }
            rows={2}
            className="w-full bg-transparent p-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none resize-none font-sans"
          />

          <div className="h-7 px-2 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Model: {activeProvider?.selectedModel}</span>
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isAILoading}
              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium flex items-center gap-1 transition-colors"
            >
              <span>Send</span>
              <Send size={10} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

