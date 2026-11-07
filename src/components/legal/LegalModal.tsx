"use client";

import React, { useState } from "react";
import {
  X,
  Shield,
  Scale,
  FileText,
  Sparkles,
  Lock,
  Package,
  Copy,
  Check,
  Printer,
  ExternalLink,
} from "lucide-react";
import { LEGAL_DOCUMENTS, LegalDocument } from "@/lib/legal/documents";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocId?: string;
}

export default function LegalModal({ isOpen, onClose, initialDocId }: LegalModalProps) {
  const [activeDocId, setActiveDocId] = useState<string>(initialDocId || "proprietary-license");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeDoc = LEGAL_DOCUMENTS.find((d) => d.id === activeDocId) || LEGAL_DOCUMENTS[0];

  const getDocIcon = (category: LegalDocument["category"]) => {
    switch (category) {
      case "license":
        return <Scale size={14} className="text-emerald-400" />;
      case "ip":
        return <Shield size={14} className="text-blue-400" />;
      case "ai":
        return <Sparkles size={14} className="text-purple-400" />;
      case "terms":
        return <FileText size={14} className="text-amber-400" />;
      case "privacy":
        return <Lock size={14} className="text-rose-400" />;
      case "third-party":
        return <Package size={14} className="text-cyan-400" />;
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 font-sans select-none">
      <div className="relative w-full max-w-4xl h-[85vh] max-h-[780px] rounded-2xl bg-[#121215] border border-zinc-800 shadow-2xl flex flex-col overflow-hidden text-zinc-200">
        {/* Top Header */}
        <div className="h-14 px-5 border-b border-zinc-800/80 bg-[#16161a] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">ELA IDE Legal & Intellectual Property</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/60 text-rose-300 font-semibold uppercase tracking-wider">
                  Closed Source & Proprietary
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Official terms, intellectual property protections & licensing policies
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              title="Copy policy to clipboard"
              className="h-8 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1.5 transition-colors border border-zinc-700/60"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={handlePrint}
              title="Print document"
              className="h-8 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1.5 transition-colors border border-zinc-700/60"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-zinc-700/60 ml-1"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body Layout: Sidebar Navigation + Content Viewer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document Tabs Sidebar */}
          <div className="w-64 sm:w-72 border-r border-zinc-800/80 bg-[#141418] p-3 overflow-y-auto space-y-1 shrink-0">
            <div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              Legal Documents
            </div>
            {LEGAL_DOCUMENTS.map((doc) => {
              const isActive = doc.id === activeDocId;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocId(doc.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                    isActive
                      ? "bg-zinc-800 text-white font-medium border border-zinc-700 shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getDocIcon(doc.category)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{doc.title}</div>
                    <div className="text-[10px] text-zinc-500 truncate mt-0.5">{doc.summary}</div>
                  </div>
                </button>
              );
            })}

            <div className="pt-4 px-2">
              <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
                <span className="font-semibold text-zinc-300 block">Copyright Notice</span>
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  © 2026 [OWNER / COMPANY NAME]. All rights reserved. ELA IDE is a proprietary software product.
                </p>
              </div>
            </div>
          </div>

          {/* Active Policy Content Reader */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-300 bg-[#121215] leading-relaxed">
            <div className="border-b border-zinc-800/80 pb-4 space-y-1">
              <div className="flex items-center gap-2">
                {getDocIcon(activeDoc.category)}
                <h1 className="text-xl font-bold text-white tracking-tight">{activeDoc.title}</h1>
              </div>
              <p className="text-xs text-zinc-400">{activeDoc.summary}</p>
              <div className="text-[11px] text-zinc-500 pt-1">
                Last updated: <span className="text-zinc-300 font-mono">{activeDoc.lastUpdated}</span> • Status: <span className="text-emerald-400 font-semibold">Active Policy</span>
              </div>
            </div>

            <div className="space-y-6">
              {activeDoc.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h2 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{sec.heading}</span>
                  </h2>
                  <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line pl-3.5 border-l border-zinc-800">
                    {sec.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Legal Advisory Notice */}
            <div className="mt-8 p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200/90 text-xs flex items-start gap-2.5">
              <Scale size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 leading-relaxed text-[11px]">
                <span className="font-semibold text-amber-300 block">Legal Notice & Disclaimer</span>
                <p>
                  These policies are prepared for [OWNER / COMPANY NAME]. Prior to commercial public launch, review with legal counsel in your primary operating jurisdiction to adapt to applicable local laws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

