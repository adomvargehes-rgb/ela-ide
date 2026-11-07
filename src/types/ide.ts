export type FileType = "file" | "folder";

export interface FileItem {
  id: string;
  name: string;
  path: string;
  type: FileType;
  content?: string;
  children?: FileItem[];
  language?: string;
  isOpen?: boolean;
  isModified?: boolean;
}

export interface EditorTab {
  id: string;
  filePath: string;
  name: string;
  language: string;
  isDirty?: boolean;
}

export type ActiveSidebarTab = 
  | "explorer" 
  | "search" 
  | "source-control" 
  | "extensions" 
  | "settings" 
  | "ai";

export type BottomPanelTab = "terminal" | "problems" | "output" | "preview";

export interface ProblemMarker {
  id: string;
  filePath: string;
  line: number;
  column: number;
  message: string;
  severity: "error" | "warning" | "info";
  source: string;
}

export interface OutputLog {
  id: string;
  timestamp: string;
  type: "info" | "success" | "warn" | "error" | "ai";
  message: string;
}

export interface DiffReview {
  filePath: string;
  originalContent: string;
  newContent: string;
  description: string;
  isOpen: boolean;
}

// AI Provider Types
export type AIProviderId = 
  | "gemini" 
  | "deepseek" 
  | "openrouter" 
  | "ollama" 
  | "openai"
  | "groq"
  | "cerebras"
  | "sambanova"
  | "nvidia";

export interface AIProviderConfig {
  id: AIProviderId;
  name: string;
  endpoint: string;
  apiKey: string;
  selectedModel: string;
  availableModels: string[];
  isEnabled: boolean;
  isCustomEndpoint: boolean;
  costPer1kTokensInput: number; // in USD
  costPer1kTokensOutput: number; // in USD
  status: "idle" | "connected" | "rate_limited" | "error";
  lastErrorMessage?: string;
}

export type AIMode = "chat" | "edit" | "agent" | "explain" | "bugfix";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  modelUsed?: string;
  providerUsed?: AIProviderId;
  tokensUsed?: {
    prompt: number;
    completion: number;
    total: number;
  };
  agentSteps?: AgentStep[];
  codeSnippets?: {
    language: string;
    code: string;
    filePath?: string;
  }[];
}

export interface AgentStep {
  id: string;
  title: string;
  status: "pending" | "running" | "completed" | "failed";
  actionType: "read_file" | "write_file" | "run_command" | "analyze" | "refactor";
  details?: string;
  output?: string;
}

export interface TokenUsageStats {
  totalPromptTokens: number;
  totalCompletionTokens: number;
  estimatedCostUSD: number;
  requestCount: number;
}

export interface IDESettings {
  theme: "dark" | "black";
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autoSave: boolean;
  autoFallbackProvider: boolean;
  activeProviderId: AIProviderId;
  geminiApiKey: string;
  deepseekApiKey: string;
  openrouterApiKey: string;
  ollamaEndpoint: string;
  openaiApiKey: string;
  openaiEndpoint: string;
  groqApiKey: string;
  cerebrasApiKey: string;
  sambanovaApiKey: string;
  nvidiaApiKey: string;
}

