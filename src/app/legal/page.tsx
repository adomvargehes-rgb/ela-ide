"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Scale,
  FileText,
  Sparkles,
  Lock,
  Package,
  Code2,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { LEGAL_DOCUMENTS, LegalDocument } from "@/lib/legal/documents";

export default function LegalPage() {
  const [activeDocId, setActiveDocId] = useState<string>("proprietary-license");
  const [copied, setCopied] = useState(false);

  const activeDoc = LEGAL_DOCUMENTS.find((d) => d.id === activeDocId) || LEGAL_DOCUMENTS[0];

  const getDocIcon = (category: LegalDocument["category"]) => {
    switch (category) {
      case "license":
        return <Scale size={15} className="text-emerald-400" />;
      case "ip":
        return <Shield size={15} className="text-blue-400" />;
      case "ai":
        return <Sparkles size={15} className="text-purple-400" />;
      case "terms":
        return <FileText size={15} className="text-amber-400" />;
      case "privacy":
        return <Lock size={15} className="text-rose-400" />;
      case "third-party":
        return <Package size={15} className="text-cyan-400" />;
    }
  };

  const handleCopy = () => {
    const fullText = `${activeDoc.title}\nLast Updated: ${activeDoc.lastUpdated}\n\n${activeDoc.sections
      .map((s) => `${s.heading}\n\n${s.content}`)
      .join("\n\n")}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0e0e11] text-zinc-200 font-sans selection:bg-blue-600/30">
      {/* Top Navigation */}
      <header className="h-14 border-b border-zinc-800/80 bg-[#121216]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Code2 size={15} strokeWidth={2.2} />
            </div>
            <span className="font-bold text-sm tracking-wide text-white">ELA IDE</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-xs text-zinc-400 font-medium">Legal Center</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="h-8 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            <span>{copied ? "Copied" : "Copy Policy"}</span>
          </button>
          <Link
            href="/"
            className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <ArrowLeft size={13} />
            <span>Back to IDE</span>
          </Link>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Banner */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 to-purple-950/20 border border-blue-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                ELA IDE Legal & Intellectual Property Center
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-800/80 text-rose-300 font-semibold uppercase tracking-wider">
                Closed Source & Proprietary
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Official proprietary licenses, intellectual property protection policies, reverse engineering restrictions, and third-party open-source attributions for ELA IDE.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[11px] text-zinc-500 block">Copyright & Ownership</span>
            <span className="text-xs font-mono text-zinc-300">© 2026 [OWNER / COMPANY NAME]</span>
          </div>
        </div>

        {/* 2-Column Document Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Document Picker Tabs */}
          <div className="md:col-span-4 space-y-1.5 sticky top-20">
            <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-2 pb-1">
              Policies & Agreements
            </div>
            {LEGAL_DOCUMENTS.map((doc) => {
              const isActive = doc.id === activeDocId;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                    isActive
                      ? "bg-zinc-800 border border-zinc-700 text-white shadow-md"
                      : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getDocIcon(doc.category)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate">{doc.title}</div>
                    <div className="text-[11px] text-zinc-500 truncate mt-0.5">{doc.summary}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Document Body */}
          <div className="md:col-span-8 rounded-2xl bg-[#141418] border border-zinc-800/80 p-6 sm:p-8 space-y-8">
            <div className="border-b border-zinc-800/80 pb-5 space-y-1">
              <div className="flex items-center gap-2">
                {getDocIcon(activeDoc.category)}
                <h2 className="text-xl font-bold text-white tracking-tight">{activeDoc.title}</h2>
              </div>
              <p className="text-xs text-zinc-400">{activeDoc.summary}</p>
              <div className="text-[11px] text-zinc-500 pt-1">
                Version effective: <span className="font-mono text-zinc-300">{activeDoc.lastUpdated}</span>
              </div>
            </div>

            <div className="space-y-6">
              {activeDoc.sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{section.heading}</span>
                  </h3>
                  <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line pl-3.5 border-l border-zinc-800">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200/90 text-xs flex items-start gap-2.5">
              <Scale size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed text-[11px]">
                <span className="font-semibold text-amber-300 block">Notice to Licensees and Developers</span>
                <p>
                  ELA IDE is proprietary software protected under civil and criminal intellectual property laws. Unauthorized reproduction, distribution, reverse engineering, or commercial exploitation is strictly prohibited.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 px-4 sm:px-8 text-center text-xs text-zinc-500 space-y-2">
        <p>© 2026 [OWNER / COMPANY NAME]. All rights reserved. ELA IDE™ is a proprietary product.</p>
        <p className="text-[11px] text-zinc-600">
          Third-party foundation models (Gemini, Llama, Claude, GPT, DeepSeek) are the property of their respective owners.
        </p>
      </footer>
    </div>
  );
}

