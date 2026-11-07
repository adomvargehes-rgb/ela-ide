"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Plus, Trash2, Play, Sparkles } from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { executeCode } from "@/lib/execution/runner";

interface HistoryEntry {
  command: string;
  output: string;
  isError?: boolean;
}

export default function IntegratedTerminal() {
  const { files, activeFile, sendAIMessage, setBottomPanelTab } = useIDE();
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      command: "welcome",
      output: `Ela Interactive Terminal v1.0.0 (Linux/x86_64 sandbox environment)
Type 'help' to see available shell commands or 'ai <prompt>' to prompt the coding agent.`,
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(null);

    const parts = trimmed.split(" ");
    const binary = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = "";
    let isError = false;

    if (binary === "help") {
      output = `Available Shell Commands:
  help                   Display this help message
  clear                  Clear terminal history
  ls / dir               List files in workspace
  cat <filepath>         Display file contents
  node <filepath>        Execute JavaScript/TypeScript file in sandbox
  python <filepath>      Execute Python file in sandbox
  npm run dev            Start project live preview dev server
  ai <prompt>            Ask Ela AI Agent directly from terminal
  echo <text>            Print text to terminal`;
    } else if (binary === "clear" || binary === "cls") {
      setHistory([]);
      setCurrentInput("");
      return;
    } else if (binary === "ls" || binary === "dir") {
      const listRecursive = (items: typeof files, prefix = ""): string[] => {
        let lines: string[] = [];
        for (const item of items) {
          lines.push(`${prefix}${item.type === "folder" ? "📁" : "📄"} ${item.name}`);
          if (item.children) {
            lines.push(...listRecursive(item.children, prefix + "  "));
          }
        }
        return lines;
      };
      output = listRecursive(files).join("\n");
    } else if (binary === "cat") {
      const target = args[0];
      if (!target) {
        output = "Usage: cat <filename>";
        isError = true;
      } else {
        const findContent = (items: typeof files): string | null => {
          for (const item of items) {
            if (item.name === target || item.path === target || item.path === `/${target}`) {
              return item.content || "(empty)";
            }
            if (item.children) {
              const res = findContent(item.children);
              if (res) return res;
            }
          }
          return null;
        };
        const content = findContent(files);
        if (content !== null) {
          output = content;
        } else {
          output = `cat: ${target}: No such file or directory`;
          isError = true;
        }
      }
    } else if (binary === "node") {
      const target = args[0] || activeFile?.name;
      if (!target) {
        output = "Usage: node <filename>";
        isError = true;
      } else {
        let code = "";
        const findCode = (items: typeof files) => {
          for (const item of items) {
            if (item.name === target || item.path === target) code = item.content || "";
            if (item.children) findCode(item.children);
          }
        };
        findCode(files);

        if (!code) {
          output = `node: cannot find file '${target}'`;
          isError = true;
        } else {
          const res = await executeCode("javascript", code);
          output = res.stderr ? `${res.stdout}\n[Error]: ${res.stderr}` : res.stdout || "Program exited with code 0";
          isError = res.exitCode !== 0;
        }
      }
    } else if (binary === "python" || binary === "python3" || binary === "py") {
      const target = args[0] || "main.py";
      let code = "";
      const findCode = (items: typeof files) => {
        for (const item of items) {
          if (item.name === target || item.path === target) code = item.content || "";
          if (item.children) findCode(item.children);
        }
      };
      findCode(files);

      if (!code) {
        output = `python: cannot open file '${target}': [Errno 2] No such file`;
        isError = true;
      } else {
        const res = await executeCode("python", code);
        output = res.stdout;
      }
    } else if (trimmed.startsWith("npm run dev") || trimmed.startsWith("npm start")) {
      output = `> ela-project@1.0.0 dev
> vite

  VITE v5.4.10  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

[Ela Live Preview server launched. Opening Live Preview Panel...]`;
      setTimeout(() => {
        setBottomPanelTab("preview");
      }, 500);
    } else if (binary === "echo") {
      output = args.join(" ");
    } else if (binary === "ai") {
      const prompt = args.join(" ");
      if (!prompt) {
        output = "Usage: ai <prompt>";
        isError = true;
      } else {
        output = `Dispatched prompt to Ela AI Agent: "${prompt}"... Check the AI Assistant panel for streaming plan!`;
        sendAIMessage(prompt, "agent");
      }
    } else {
      output = `zsh: command not found: ${binary}. Type 'help' for available commands.`;
      isError = true;
    }

    setHistory((prev) => [...prev, { command: cmd, output, isError }]);
    setCurrentInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(currentInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex === null ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setCurrentInput(commandHistory[nextIdx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(null);
        setCurrentInput("");
      } else {
        setHistoryIndex(nextIdx);
        setCurrentInput(commandHistory[nextIdx]);
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="h-full flex flex-col bg-[#121214] text-zinc-300 font-mono text-xs select-text cursor-text"
    >
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="text-emerald-400 font-semibold">ela@browser:~/workspace$</span>
              <span className="text-zinc-100">{entry.command}</span>
            </div>
            {entry.output && (
              <div
                className={`whitespace-pre-wrap pl-2 leading-relaxed ${
                  entry.isError ? "text-rose-400" : "text-zinc-300"
                }`}
              >
                {entry.output}
              </div>
            )}
          </div>
        ))}

        {/* Live input line */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-emerald-400 font-semibold shrink-0">ela@browser:~/workspace$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-xs p-0 m-0"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
