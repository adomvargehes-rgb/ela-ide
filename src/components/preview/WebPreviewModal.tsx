"use client";

import React, { useState, useMemo } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";

export default function WebPreviewModal() {
  const { files, activeFile } = useIDE();
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [reloadKey, setReloadKey] = useState(0);

  // Collect project HTML, CSS, and JS
  const srcDoc = useMemo(() => {
    let htmlContent = "";
    let cssContent = "";
    let jsContent = "";

    const traverse = (items: typeof files) => {
      for (const item of items) {
        if (item.name === "index.html" && item.content) {
          htmlContent = item.content;
        } else if (item.name.endsWith(".css") && item.content) {
          cssContent += `\n/* ${item.name} */\n${item.content}`;
        } else if (item.name === "App.tsx" || item.name === "index.js") {
          // If App.tsx has plain HTML/styles or export default
          if (item.content) {
            jsContent += `\n/* ${item.name} */\n${item.content}`;
          }
        }
        if (item.children) traverse(item.children);
      }
    };
    traverse(files);

    if (!htmlContent) {
      htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      background: #0f172a;
      color: #e2e8f0;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      text-align: center;
    }
  </style>
</head>
<body>
  <h2>Ela IDE Live Sandbox</h2>
  <p>Create an <code>index.html</code> in your project to view live rendering.</p>
</body>
</html>`;
    }

    // Inject styles and secure sandbox console listener into head
    const injectedDoc = htmlContent.replace(
      "</head>",
      `<style>${cssContent}</style>
      <script>
        window.addEventListener('message', (e) => {
          if (e.data?.type === 'EVAL') {
            try { eval(e.data.code); } catch(err) { console.error(err); }
          }
        });
      </script>
      </head>`
    );

    return injectedDoc;
  }, [files]);

  const handleOpenExternal = () => {
    const blob = new Blob([srcDoc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 text-zinc-300">
      {/* Browser address bar & device controls */}
      <div className="h-8 px-3 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            title="Reload Preview"
            className="p-1 hover:text-white rounded hover:bg-zinc-800 text-zinc-400"
          >
            <RotateCw size={13} />
          </button>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400 w-64 truncate">
            <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
            <span className="truncate">https://sandbox.ela-ide.internal/</span>
          </div>
        </div>

        {/* Viewport switchers */}
        <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded border border-zinc-800">
          <button
            onClick={() => setDevice("desktop")}
            title="Desktop View (100%)"
            className={`p-1 rounded ${
              device === "desktop" ? "bg-zinc-800 text-blue-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Monitor size={13} />
          </button>
          <button
            onClick={() => setDevice("tablet")}
            title="Tablet View (768px)"
            className={`p-1 rounded ${
              device === "tablet" ? "bg-zinc-800 text-blue-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Tablet size={13} />
          </button>
          <button
            onClick={() => setDevice("mobile")}
            title="Mobile View (375px)"
            className={`p-1 rounded ${
              device === "mobile" ? "bg-zinc-800 text-blue-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Smartphone size={13} />
          </button>
        </div>

        <button
          onClick={handleOpenExternal}
          title="Open in New Tab"
          className="p-1 hover:text-white rounded hover:bg-zinc-800 text-zinc-400 flex items-center gap-1 text-[11px]"
        >
          <ExternalLink size={12} />
          <span className="hidden sm:inline">Pop out</span>
        </button>
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-zinc-950/80 p-2 flex items-center justify-center overflow-auto">
        <div
          className={`h-full bg-white transition-all duration-200 rounded shadow-2xl overflow-hidden border border-zinc-800 ${
            device === "mobile"
              ? "w-[375px] max-h-[667px]"
              : device === "tablet"
              ? "w-[768px]"
              : "w-full"
          }`}
        >
          <iframe
            key={reloadKey}
            title="Ela Live App Preview"
            srcDoc={srcDoc}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full h-full border-0 bg-slate-900"
          />
        </div>
      </div>
    </div>
  );
}

