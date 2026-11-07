"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useIDE } from "@/context/IDEContext";

// Dynamically import Monaco Editor to ensure SSR safety
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-ide-editor text-zinc-500 gap-2">
      <Loader2 size={16} className="animate-spin text-blue-500" />
      <span className="text-xs">Loading Monaco Code Editor...</span>
    </div>
  ),
});

export default function MonacoWrapper({
  filePath,
  content,
  language,
  onChange,
}: {
  filePath: string;
  content: string;
  language: string;
  onChange: (value: string) => void;
}) {
  const { settings } = useIDE();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-ide-editor text-zinc-500">
        <Loader2 size={16} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden bg-ide-editor">
      <Editor
        height="100%"
        path={filePath}
        defaultLanguage={language}
        language={language}
        value={content}
        onChange={(val) => onChange(val || "")}
        theme="vs-dark"
        options={{
          fontSize: settings.fontSize || 14,
          lineHeight: 22,
          tabSize: settings.tabSize || 2,
          wordWrap: settings.wordWrap ? "on" : "off",
          minimap: { enabled: settings.minimap },
          automaticLayout: true,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace",
          fontLigatures: true,
          letterSpacing: 0.2,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "all",
          lineNumbers: "on",
          roundedSelection: false,
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
}

