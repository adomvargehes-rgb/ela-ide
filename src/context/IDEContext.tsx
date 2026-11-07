"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  FileItem,
  EditorTab,
  ActiveSidebarTab,
  BottomPanelTab,
  ProblemMarker,
  OutputLog,
  DiffReview,
  AIProviderId,
  AIProviderConfig,
  IDESettings,
  ChatMessage,
  AgentStep,
  TokenUsageStats,
  AIMode,
} from "@/types/ide";
import { INITIAL_WORKSPACE_FILES } from "@/lib/storage/initialFiles";
import { DEFAULT_AI_PROVIDERS } from "@/lib/ai/providers";
import { routeAIRequest } from "@/lib/ai/router";
import { buildProjectContextPrompt } from "@/lib/ai/prompts";
import { executeCode } from "@/lib/execution/runner";

interface IDEContextType {
  // Files and Editor
  files: FileItem[];
  activeFile: FileItem | null;
  openTabs: EditorTab[];
  activeTabId: string | null;
  openFile: (path: string) => void;
  closeTab: (id: string) => void;
  updateFileContent: (path: string, content: string) => void;
  createFile: (parentPath: string, name: string, type: "file" | "folder") => void;
  deleteFile: (path: string) => void;
  renameFile: (path: string, newName: string) => void;
  getActiveFileContent: () => string;

  // UI Panels
  activeSidebarTab: ActiveSidebarTab;
  setActiveSidebarTab: (tab: ActiveSidebarTab) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  isAIPanelOpen: boolean;
  setIsAIPanelOpen: (open: boolean) => void;
  toggleAIPanel: () => void;

  isBottomOpen: boolean;
  setIsBottomOpen: (open: boolean) => void;
  toggleBottomPanel: () => void;
  bottomPanelTab: BottomPanelTab;
  setBottomPanelTab: (tab: BottomPanelTab) => void;

  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Diff Review
  diffReview: DiffReview | null;
  setDiffReview: (diff: DiffReview | null) => void;
  acceptDiff: () => void;
  rejectDiff: () => void;

  // Problems & Logs
  problems: ProblemMarker[];
  outputLogs: OutputLog[];
  addOutputLog: (message: string, type?: OutputLog["type"]) => void;
  clearOutputLogs: () => void;

  // Execution & Live Preview
  isRunning: boolean;
  runProject: () => Promise<void>;
  previewUrl: string;

  // AI Assistant & Providers
  providers: Record<AIProviderId, AIProviderConfig>;
  updateProviderConfig: (id: AIProviderId, updates: Partial<AIProviderConfig>) => void;
  chatMessages: ChatMessage[];
  isAILoading: boolean;
  sendAIMessage: (prompt: string, mode?: AIMode) => Promise<void>;
  tokenStats: TokenUsageStats;

  // Settings
  settings: IDESettings;
  updateSettings: (updates: Partial<IDESettings>) => void;

  // Helper search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: { path: string; line: number; text: string }[];
}

const DEFAULT_SETTINGS: IDESettings = {
  theme: "dark",
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  autoSave: true,
  autoFallbackProvider: true,
  activeProviderId: "gemini",
  geminiApiKey: "",
  deepseekApiKey: "",
  openrouterApiKey: "",
  ollamaEndpoint: "http://localhost:11434",
  openaiApiKey: "",
  openaiEndpoint: "https://api.openai.com/v1",
};

const IDEContext = createContext<IDEContextType | undefined>(undefined);

export function IDEProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_WORKSPACE_FILES);
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([
    { id: "tab-1", filePath: "/src/App.tsx", name: "App.tsx", language: "typescript" },
  ]);
  const [activeTabId, setActiveTabId] = useState<string | null>("tab-1");
  const [activeFile, setActiveFile] = useState<FileItem | null>(null);

  // Layout panels
  const [activeSidebarTab, setActiveSidebarTab] = useState<ActiveSidebarTab>("explorer");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState<boolean>(true);
  const [isBottomOpen, setIsBottomOpen] = useState<boolean>(true);
  const [bottomPanelTab, setBottomPanelTab] = useState<BottomPanelTab>("terminal");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{ path: string; line: number; text: string }[]>([]);

  // Diff Review
  const [diffReview, setDiffReview] = useState<DiffReview | null>(null);

  // Problems & Logs
  const [problems, setProblems] = useState<ProblemMarker[]>([
    {
      id: "prob-1",
      filePath: "/src/utils.ts",
      line: 7,
      column: 14,
      message: "Type assertion could be narrowed for non-empty arrays",
      severity: "info",
      source: "TypeScript",
    },
  ]);
  const [outputLogs, setOutputLogs] = useState<OutputLog[]>([
    {
      id: "log-1",
      timestamp: new Date().toLocaleTimeString(),
      type: "info",
      message: "Ela IDE v1.0.0 initialized with Multi-Model AI Routing.",
    },
    {
      id: "log-2",
      timestamp: new Date().toLocaleTimeString(),
      type: "success",
      message: "Monaco Editor and Sandboxed Execution engine ready.",
    },
  ]);

  // Execution & Live Preview
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // AI & Providers
  const [providers, setProviders] = useState<Record<AIProviderId, AIProviderConfig>>(DEFAULT_AI_PROVIDERS);
  const [settings, setSettings] = useState<IDESettings>(DEFAULT_SETTINGS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content: `👋 Welcome to **Ela IDE**!

I am your multi-model AI coding partner with full workspace awareness.
- ⚡ **Models Available:** Gemini, DeepSeek, OpenRouter, Ollama, and OpenAI endpoints.
- 🛠️ **Agent Mode:** Can plan multi-step edits and generate side-by-side diffs.
- 🚀 **Live Sandbox:** Run code directly and preview interactive web apps.

Select any file to begin, or type a request below!`,
      timestamp: new Date().toLocaleTimeString(),
      modelUsed: "gemini-1.5-flash",
      providerUsed: "gemini",
    },
  ]);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);
  const [tokenStats, setTokenStats] = useState<TokenUsageStats>({
    totalPromptTokens: 140,
    totalCompletionTokens: 220,
    estimatedCostUSD: 0.0001,
    requestCount: 1,
  });

  // Find file recursively
  const findFileByPath = useCallback((items: FileItem[], path: string): FileItem | null => {
    for (const item of items) {
      if (item.path === path) return item;
      if (item.children) {
        const found = findFileByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  }, []);

  // Sync active file with active tab
  useEffect(() => {
    if (!activeTabId) {
      setActiveFile(null);
      return;
    }
    const tab = openTabs.find((t) => t.id === activeTabId);
    if (tab) {
      const file = findFileByPath(files, tab.filePath);
      setActiveFile(file);
    }
  }, [activeTabId, openTabs, files, findFileByPath]);

  // Open file in editor
  const openFile = useCallback((path: string) => {
    const file = findFileByPath(files, path);
    if (!file || file.type === "folder") return;

    // Check if already open
    const existingTab = openTabs.find((t) => t.filePath === path);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    const newTab: EditorTab = {
      id: `tab-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      filePath: path,
      name: file.name,
      language: file.language || getLanguageFromExt(file.name),
    };

    setOpenTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [files, openTabs, findFileByPath]);

  // Close tab
  const closeTab = useCallback((id: string) => {
    setOpenTabs((prev) => {
      const index = prev.findIndex((t) => t.id === id);
      const nextTabs = prev.filter((t) => t.id !== id);

      if (activeTabId === id && nextTabs.length > 0) {
        const nextActive = nextTabs[Math.max(0, index - 1)];
        setActiveTabId(nextActive.id);
      } else if (nextTabs.length === 0) {
        setActiveTabId(null);
      }
      return nextTabs;
    });
  }, [activeTabId]);

  // Update file content
  const updateFileContent = useCallback((path: string, newContent: string) => {
    const updateRecursive = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.path === path) {
          return { ...item, content: newContent, isModified: true };
        }
        if (item.children) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    setFiles((prev) => updateRecursive(prev));
  }, []);

  // Create file or folder
  const createFile = useCallback((parentPath: string, name: string, type: "file" | "folder") => {
    const normalizedParent = parentPath.endsWith("/") ? parentPath.slice(0, -1) : parentPath;
    const newPath = normalizedParent === "" ? `/${name}` : `${normalizedParent}/${name}`;
    const language = type === "file" ? getLanguageFromExt(name) : undefined;

    const newItem: FileItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      path: newPath,
      type,
      language,
      content: type === "file" ? "" : undefined,
      children: type === "folder" ? [] : undefined,
      isOpen: true,
    };

    const addRecursive = (items: FileItem[]): FileItem[] => {
      if (normalizedParent === "" || normalizedParent === "/") {
        return [...items, newItem];
      }
      return items.map((item) => {
        if (item.path === normalizedParent && item.type === "folder") {
          return {
            ...item,
            children: [...(item.children || []), newItem],
            isOpen: true,
          };
        }
        if (item.children) {
          return { ...item, children: addRecursive(item.children) };
        }
        return item;
      });
    };

    setFiles((prev) => addRecursive(prev));
    if (type === "file") {
      openFile(newPath);
    }
  }, [openFile]);

  // Delete file or folder
  const deleteFile = useCallback((path: string) => {
    const deleteRecursive = (items: FileItem[]): FileItem[] => {
      return items
        .filter((item) => item.path !== path)
        .map((item) => {
          if (item.children) {
            return { ...item, children: deleteRecursive(item.children) };
          }
          return item;
        });
    };

    setFiles((prev) => deleteRecursive(prev));
    // Close tab if open
    setOpenTabs((prev) => prev.filter((t) => t.filePath !== path));
  }, []);

  // Rename file or folder
  const renameFile = useCallback((path: string, newName: string) => {
    const parent = path.substring(0, path.lastIndexOf("/"));
    const newPath = `${parent}/${newName}`;

    const renameRecursive = (items: FileItem[]): FileItem[] => {
      return items.map((item) => {
        if (item.path === path) {
          return {
            ...item,
            name: newName,
            path: newPath,
            language: item.type === "file" ? getLanguageFromExt(newName) : undefined,
          };
        }
        if (item.children) {
          return { ...item, children: renameRecursive(item.children) };
        }
        return item;
      });
    };

    setFiles((prev) => renameRecursive(prev));
    setOpenTabs((prev) =>
      prev.map((t) =>
        t.filePath === path ? { ...t, name: newName, filePath: newPath } : t
      )
    );
  }, []);

  const getActiveFileContent = useCallback((): string => {
    if (!activeFile) return "";
    return activeFile.content || "";
  }, [activeFile]);

  // Panel toggles
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  const toggleAIPanel = () => setIsAIPanelOpen((v) => !v);
  const toggleBottomPanel = () => setIsBottomOpen((v) => !v);

  // Search across files
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results: { path: string; line: number; text: string }[] = [];
    const query = searchQuery.toLowerCase();

    const searchRecursive = (items: FileItem[]) => {
      for (const item of items) {
        if (item.type === "file" && item.content) {
          const lines = item.content.split("\n");
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(query)) {
              results.push({
                path: item.path,
                line: index + 1,
                text: line.trim(),
              });
            }
          });
        }
        if (item.children) {
          searchRecursive(item.children);
        }
      }
    };

    searchRecursive(files);
    setSearchResults(results);
  }, [searchQuery, files]);

  // Accept / Reject Diff
  const acceptDiff = useCallback(() => {
    if (!diffReview) return;
    updateFileContent(diffReview.filePath, diffReview.newContent);
    addOutputLog(`Accepted AI diff changes for ${diffReview.filePath}`, "success");
    setDiffReview(null);
  }, [diffReview, updateFileContent]);

  const rejectDiff = useCallback(() => {
    if (!diffReview) return;
    addOutputLog(`Rejected AI diff changes for ${diffReview.filePath}`, "warn");
    setDiffReview(null);
  }, [diffReview]);

  // Output logs
  const addOutputLog = useCallback((message: string, type: OutputLog["type"] = "info") => {
    setOutputLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
      },
    ]);
  }, []);

  const clearOutputLogs = useCallback(() => {
    setOutputLogs([]);
  }, []);

  // Run Project / Active File
  const runProject = useCallback(async () => {
    setIsRunning(true);
    setIsBottomOpen(true);
    setBottomPanelTab("output");
    addOutputLog("Build & Execution initiated in Ela Sandbox...", "info");

    const currentFile = activeFile;
    const lang = currentFile?.language || "javascript";
    const code = currentFile?.content || "";

    const allFilesMap: Record<string, string> = {};
    const collectFiles = (items: FileItem[]) => {
      for (const item of items) {
        if (item.type === "file" && item.content) {
          allFilesMap[item.path] = item.content;
        }
        if (item.children) collectFiles(item.children);
      }
    };
    collectFiles(files);

    const result = await executeCode(lang, code, allFilesMap);

    if (result.stdout) {
      addOutputLog(result.stdout, "info");
    }
    if (result.stderr) {
      addOutputLog(result.stderr, "error");
    }

    addOutputLog(
      `Execution completed in ${result.durationMs}ms (exit code: ${result.exitCode})`,
      result.exitCode === 0 ? "success" : "error"
    );

    // If HTML or React app is active, switch to preview
    if (allFilesMap["/index.html"] || lang === "html") {
      setBottomPanelTab("preview");
    }

    setIsRunning(false);
  }, [activeFile, files, addOutputLog]);

  // AI Providers & Settings update
  const updateProviderConfig = useCallback((id: AIProviderId, updates: Partial<AIProviderConfig>) => {
    setProviders((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...updates },
    }));
  }, []);

  const updateSettings = useCallback((updates: Partial<IDESettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      // Sync API keys to providers
      if (updates.geminiApiKey !== undefined) {
        setProviders((p) => ({ ...p, gemini: { ...p.gemini, apiKey: updates.geminiApiKey! } }));
      }
      if (updates.deepseekApiKey !== undefined) {
        setProviders((p) => ({ ...p, deepseek: { ...p.deepseek, apiKey: updates.deepseekApiKey! } }));
      }
      if (updates.openrouterApiKey !== undefined) {
        setProviders((p) => ({ ...p, openrouter: { ...p.openrouter, apiKey: updates.openrouterApiKey! } }));
      }
      if (updates.openaiApiKey !== undefined) {
        setProviders((p) => ({ ...p, openai: { ...p.openai, apiKey: updates.openaiApiKey! } }));
      }
      return next;
    });
  }, []);

  // Send AI Message
  const sendAIMessage = useCallback(async (promptText: string, mode: AIMode = "chat") => {
    if (!promptText.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: promptText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsAILoading(true);

    try {
      // Collect workspace files context
      const fileContexts: { path: string; content?: string }[] = [];
      const traverse = (items: FileItem[]) => {
        for (const item of items) {
          if (item.type === "file") {
            fileContexts.push({ path: item.path, content: item.content });
          }
          if (item.children) traverse(item.children);
        }
      };
      traverse(files);

      const projectContext = buildProjectContextPrompt(fileContexts, activeFile?.path);

      const response = await routeAIRequest({
        messages: [
          ...chatMessages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: promptText },
        ],
        mode,
        primaryProviderId: settings.activeProviderId,
        providers,
        autoFallback: settings.autoFallbackProvider,
        projectContext,
      });

      // Parse agent commands or file write requests
      const writeMatch = response.content.match(/<<<FILE_WRITE:(.*?)>>>([\s\S]*?)<<<END_FILE_WRITE>>>/);
      if (writeMatch) {
        const targetPath = writeMatch[1].trim();
        const targetContent = writeMatch[2].trim();

        const existingFile = findFileByPath(files, targetPath);
        if (existingFile && existingFile.content) {
          // Open diff reviewer!
          setDiffReview({
            filePath: targetPath,
            originalContent: existingFile.content,
            newContent: targetContent,
            description: `AI Agent proposed updates for ${targetPath}`,
            isOpen: true,
          });
        } else {
          // Auto create or write file
          const filename = targetPath.split("/").pop() || "GeneratedFile.tsx";
          const parent = targetPath.substring(0, targetPath.lastIndexOf("/")) || "/src";
          createFile(parent, filename, "file");
          setTimeout(() => {
            updateFileContent(targetPath, targetContent);
          }, 100);
        }
      }

      // Track token usage
      setTokenStats((prev) => {
        const promptTok = response.tokensUsed.prompt;
        const compTok = response.tokensUsed.completion;
        const config = providers[response.providerUsed];
        const cost =
          ((promptTok / 1000) * (config?.costPer1kTokensInput || 0.0001)) +
          ((compTok / 1000) * (config?.costPer1kTokensOutput || 0.0002));

        return {
          totalPromptTokens: prev.totalPromptTokens + promptTok,
          totalCompletionTokens: prev.totalCompletionTokens + compTok,
          estimatedCostUSD: prev.estimatedCostUSD + cost,
          requestCount: prev.requestCount + 1,
        };
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.content,
        timestamp: new Date().toLocaleTimeString(),
        modelUsed: response.modelUsed,
        providerUsed: response.providerUsed,
        tokensUsed: response.tokensUsed,
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `⚠️ **AI Execution Notice**: ${err.message}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsAILoading(false);
    }
  }, [
    chatMessages,
    files,
    activeFile,
    settings.activeProviderId,
    settings.autoFallbackProvider,
    providers,
    findFileByPath,
    updateFileContent,
    createFile,
  ]);

  return (
    <IDEContext.Provider
      value={{
        files,
        activeFile,
        openTabs,
        activeTabId,
        openFile,
        closeTab,
        updateFileContent,
        createFile,
        deleteFile,
        renameFile,
        getActiveFileContent,

        activeSidebarTab,
        setActiveSidebarTab,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,

        isAIPanelOpen,
        setIsAIPanelOpen,
        toggleAIPanel,

        isBottomOpen,
        setIsBottomOpen,
        toggleBottomPanel,
        bottomPanelTab,
        setBottomPanelTab,

        isCommandPaletteOpen,
        setIsCommandPaletteOpen,

        diffReview,
        setDiffReview,
        acceptDiff,
        rejectDiff,

        problems,
        outputLogs,
        addOutputLog,
        clearOutputLogs,

        isRunning,
        runProject,
        previewUrl,

        providers,
        updateProviderConfig,
        chatMessages,
        isAILoading,
        sendAIMessage,
        tokenStats,

        settings,
        updateSettings,

        searchQuery,
        setSearchQuery,
        searchResults,
      }}
    >
      {children}
    </IDEContext.Provider>
  );
}

export function useIDE() {
  const context = useContext(IDEContext);
  if (!context) {
    throw new Error("useIDE must be used within an IDEProvider");
  }
  return context;
}

function getLanguageFromExt(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ts":
    case "tsx":
      return "typescript";
    case "js":
    case "jsx":
      return "javascript";
    case "html":
      return "html";
    case "css":
      return "css";
    case "json":
      return "json";
    case "py":
      return "python";
    case "md":
      return "markdown";
    default:
      return "plaintext";
  }
}
