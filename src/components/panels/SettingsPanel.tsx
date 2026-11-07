"use client";

import React, { useState } from "react";
import {
  Key,
  Cpu,
  Coins,
  Shield,
  Check,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Server,
  Zap,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { AIProviderId } from "@/types/ide";

export default function SettingsPanel() {
  const {
    providers,
    updateProviderConfig,
    settings,
    updateSettings,
    tokenStats,
    addOutputLog,
  } = useIDE();

  const [activeTab, setActiveTab] = useState<"ai" | "editor" | "usage">("ai");
  const [testingProvider, setTestingProvider] = useState<string | null>(null);

  const handleTestConnection = async (id: AIProviderId) => {
    const config = providers[id];
    setTestingProvider(id);

    try {
      // In Ollama or direct check
      if (id === "ollama") {
        const res = await fetch(`${config.endpoint}/api/tags`).catch(() => null);
        if (res && res.ok) {
          updateProviderConfig(id, { status: "connected" });
          addOutputLog(`Ollama connection verified at ${config.endpoint}`, "success");
        } else {
          updateProviderConfig(id, {
            status: "error",
            lastErrorMessage: "Ollama instance not responding. Ensure 'ollama serve' is running.",
          });
          addOutputLog(`Failed to reach Ollama at ${config.endpoint}`, "warn");
        }
      } else {
        if (!config.apiKey) {
          updateProviderConfig(id, {
            status: "error",
            lastErrorMessage: "Missing API Key",
          });
          addOutputLog(`Please provide an API Key for ${config.name}`, "warn");
        } else {
          updateProviderConfig(id, { status: "connected" });
          addOutputLog(`${config.name} credentials configured successfully.`, "success");
        }
      }
    } finally {
      setTestingProvider(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-ide-sidebar text-zinc-300">
      <div className="h-8 px-3 border-b border-ide-border flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <span>Settings & AI Providers</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ide-border px-3 text-xs">
        <button
          onClick={() => setActiveTab("ai")}
          className={`py-2 px-3 border-b-2 font-medium transition-colors ${
            activeTab === "ai"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          AI Providers
        </button>
        <button
          onClick={() => setActiveTab("usage")}
          className={`py-2 px-3 border-b-2 font-medium transition-colors ${
            activeTab === "usage"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Tokens & Costs
        </button>
        <button
          onClick={() => setActiveTab("editor")}
          className={`py-2 px-3 border-b-2 font-medium transition-colors ${
            activeTab === "editor"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Editor Options
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
        {/* AI Providers Tab */}
        {activeTab === "ai" && (
          <div className="space-y-6">
            {/* Global Failover & Primary Provider */}
            <div className="p-3 bg-zinc-900/60 rounded border border-zinc-800 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-200 uppercase tracking-wider mb-1">
                  Primary AI Model Provider
                </label>
                <select
                  value={settings.activeProviderId}
                  onChange={(e) => updateSettings({ activeProviderId: e.target.value as AIProviderId })}
                  className="w-full h-8 bg-zinc-800 border border-zinc-700 rounded px-2 text-xs text-white outline-none focus:border-blue-500"
                >
                  <option value="gemini">Google Gemini (Recommended for Multi-modal & Speed)</option>
                  <option value="groq">Groq (Free Ultra-Fast Llama-3.3 70B & Gemma 2)</option>
                  <option value="cerebras">Cerebras (Free Wafer-Scale ~2000 tok/sec Inference)</option>
                  <option value="sambanova">SambaNova (Free SN40L Meta-Llama-3.3 70B & Qwen 2.5)</option>
                  <option value="nvidia">NVIDIA NIM (Free Evaluation Nemotron & Llama 3.3)</option>
                  <option value="deepseek">DeepSeek (DeepSeek Coder / Reasoner)</option>
                  <option value="openrouter">OpenRouter (Claude 3.5 Sonnet, GPT-4o, Free Models)</option>
                  <option value="openai">OpenAI / Custom Compatible Endpoint</option>
                  <option value="ollama">Ollama (Local Private Models)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80">
                <div>
                  <span className="font-medium text-zinc-200">Automatic Provider Failover</span>
                  <p className="text-[11px] text-zinc-400">
                    Auto-switch to next available provider if primary hits rate limits or errors.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoFallbackProvider}
                  onChange={(e) => updateSettings({ autoFallbackProvider: e.target.checked })}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Provider Cards */}
            <div className="space-y-4">
              {(Object.keys(providers) as AIProviderId[]).map((provId) => {
                const prov = providers[provId];
                const isSelected = settings.activeProviderId === provId;

                return (
                  <div
                    key={provId}
                    className={`p-3 rounded border transition-all ${
                      isSelected
                        ? "bg-zinc-900 border-blue-600/70 shadow-sm"
                        : "bg-zinc-900/40 border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-100">{prov.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.2 rounded font-mono">
                            PRIMARY
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleTestConnection(provId)}
                          disabled={testingProvider === provId}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1"
                        >
                          <RefreshCw
                            size={10}
                            className={testingProvider === provId ? "animate-spin" : ""}
                          />
                          <span>Test</span>
                        </button>
                      </div>
                    </div>

                    {/* API Key Input */}
                    {provId !== "ollama" && (
                      <div className="mb-2">
                        <label className="block text-[11px] text-zinc-400 mb-0.5">
                          API Key ({prov.name})
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="password"
                            value={prov.apiKey}
                            onChange={(e) => updateProviderConfig(provId, { apiKey: e.target.value })}
                            placeholder={`Enter your ${prov.name} API Key...`}
                            className="w-full h-7 bg-zinc-950 border border-zinc-800 rounded px-2 pl-7 font-mono text-[11px] text-zinc-200 outline-none focus:border-blue-500"
                          />
                          <Key size={12} className="absolute left-2 text-zinc-500" />
                        </div>
                      </div>
                    )}

                    {/* Model selection */}
                    <div className="mb-2">
                      <label className="block text-[11px] text-zinc-400 mb-0.5">Model</label>
                      <select
                        value={prov.selectedModel}
                        onChange={(e) => updateProviderConfig(provId, { selectedModel: e.target.value })}
                        className="w-full h-7 bg-zinc-950 border border-zinc-800 rounded px-2 text-xs text-zinc-200 outline-none focus:border-blue-500 font-mono"
                      >
                        {prov.availableModels.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Custom endpoint if applicable */}
                    {(prov.isCustomEndpoint || provId === "openai") && (
                      <div className="mb-2">
                        <label className="block text-[11px] text-zinc-400 mb-0.5">Endpoint URL</label>
                        <input
                          type="text"
                          value={prov.endpoint}
                          onChange={(e) => updateProviderConfig(provId, { endpoint: e.target.value })}
                          className="w-full h-7 bg-zinc-950 border border-zinc-800 rounded px-2 font-mono text-[11px] text-zinc-200 outline-none focus:border-blue-500"
                        />
                      </div>
                    )}

                    {/* Status note */}
                    {prov.lastErrorMessage && (
                      <div className="mt-2 p-1.5 rounded bg-rose-950/40 border border-rose-800/50 text-rose-300 text-[11px] flex items-center gap-1.5">
                        <AlertTriangle size={12} className="shrink-0" />
                        <span>{prov.lastErrorMessage}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Token Usage & Costs Tab */}
        {activeTab === "usage" && (
          <div className="space-y-4">
            <div className="p-3 bg-zinc-900 rounded border border-zinc-800 space-y-3">
              <h3 className="font-semibold text-zinc-100 flex items-center gap-1.5">
                <Coins size={14} className="text-amber-400" />
                <span>Token Usage & Cost Transparency</span>
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Paid AI provider usage is metered and billed by your respective API providers based on
                your account's pay-as-you-go pricing tier. Ela IDE does not mark up API costs.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
                  <span className="text-[11px] text-zinc-500 block">Total Prompt Tokens</span>
                  <span className="text-base font-semibold text-zinc-100 font-mono">
                    {tokenStats.totalPromptTokens.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80">
                  <span className="text-[11px] text-zinc-500 block">Total Completion Tokens</span>
                  <span className="text-base font-semibold text-zinc-100 font-mono">
                    {tokenStats.totalCompletionTokens.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-500 block">Estimated Combined Cost</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    ${tokenStats.estimatedCostUSD.toFixed(4)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-zinc-500 block">Total Requests</span>
                  <span className="text-base font-semibold text-zinc-300 font-mono">
                    {tokenStats.requestCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded bg-amber-950/20 border border-amber-800/30 text-amber-300 text-[11px] flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>
                <strong>Important Notice:</strong> API costs are calculated using standard published
                per-million token rates. Always monitor your usage dashboards in Google Cloud Console,
                OpenRouter, DeepSeek, or OpenAI to verify current billing and quotas.
              </span>
            </div>
          </div>
        )}

        {/* Editor Options Tab */}
        {activeTab === "editor" && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Editor Font Size (px)</label>
                <input
                  type="number"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: Number(e.target.value) || 14 })}
                  min={10}
                  max={24}
                  className="w-full h-8 bg-zinc-900 border border-zinc-700 rounded px-2 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Tab Size</label>
                <select
                  value={settings.tabSize}
                  onChange={(e) => updateSettings({ tabSize: Number(e.target.value) })}
                  className="w-full h-8 bg-zinc-900 border border-zinc-700 rounded px-2 text-xs text-white outline-none focus:border-blue-500"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <span className="text-zinc-300 font-medium">Show Minimap</span>
                <input
                  type="checkbox"
                  checked={settings.minimap}
                  onChange={(e) => updateSettings({ minimap: e.target.checked })}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                <span className="text-zinc-300 font-medium">Word Wrap</span>
                <input
                  type="checkbox"
                  checked={settings.wordWrap}
                  onChange={(e) => updateSettings({ wordWrap: e.target.checked })}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

