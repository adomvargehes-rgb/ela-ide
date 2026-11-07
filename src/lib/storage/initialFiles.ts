import { FileItem } from "@/types/ide";

export const INITIAL_WORKSPACE_FILES: FileItem[] = [
  {
    id: "folder-src",
    name: "src",
    path: "/src",
    type: "folder",
    isOpen: true,
    children: [
      {
        id: "file-app-tsx",
        name: "App.tsx",
        path: "/src/App.tsx",
        type: "file",
        language: "typescript",
        content: `import React, { useState, useEffect } from 'react';

// Ela IDE Demo Component
export default function App() {
  const [count, setCount] = useState<number>(0);
  const [status, setStatus] = useState<string>('Ready');

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
    setStatus('Count updated');
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#3b82f6', margin: 0, fontSize: '1.75rem' }}>Ela IDE Project</h1>
        <p style={{ color: '#888', margin: '0.5rem 0 0' }}>AI-Powered Web Development Environment</p>
      </header>

      <main style={{ background: '#1e1e24', padding: '1.5rem', borderRadius: '8px', border: '1px solid #2e2e38' }}>
        <h2 style={{ fontSize: '1.25rem', marginTop: 0 }}>Interactive Counter</h2>
        <p style={{ color: '#bbb' }}>Current value: <strong style={{ color: '#60a5fa' }}>{count}</strong></p>
        <p style={{ color: '#888', fontSize: '0.875rem' }}>System status: {status}</p>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            onClick={handleIncrement}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Increment (+1)
          </button>
          <button
            onClick={() => { setCount(0); setStatus('Reset'); }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#374151',
              color: '#e5e7eb',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </main>
    </div>
  );
}
`,
      },
      {
        id: "file-utils-ts",
        name: "utils.ts",
        path: "/src/utils.ts",
        type: "file",
        language: "typescript",
        content: `/**
 * Math and helper utilities for Ela IDE
 */

export function calculateMetrics(data: number[]): { sum: number; average: number; max: number } {
  if (data.length === 0) {
    return { sum: 0, average: 0, max: 0 };
  }
  const sum = data.reduce((acc, val) => acc + val, 0);
  const average = sum / data.length;
  const max = Math.max(...data);

  return { sum, average, max };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
`,
      },
      {
        id: "file-style-css",
        name: "styles.css",
        path: "/src/styles.css",
        type: "file",
        language: "css",
        content: `/* Global styles */
:root {
  --bg-color: #0f172a;
  --text-color: #f8fafc;
  --accent-color: #38bdf8;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: 'DM Sans', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.card {
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-color);
}
`,
      },
    ],
  },
  {
    id: "file-index-html",
    name: "index.html",
    path: "/index.html",
    type: "file",
    language: "html",
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ela IDE Live Application</title>
  <style>
    body {
      margin: 0;
      background: #0f172a;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #1e293b;
      color: #38bdf8;
      border: 1px solid #38bdf8;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 2.5rem;
      margin: 0 0 12px;
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      max-width: 480px;
      line-height: 1.6;
      margin: 0 0 24px;
    }
    .btn {
      background: #2563eb;
      color: white;
      border: none;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <div class="badge">LIVE PREVIEW ENGINE</div>
  <h1>Welcome to Ela IDE</h1>
  <p>Experience unified coding, AI multi-model reasoning, and sandboxed execution all in a premium browser environment.</p>
  <button class="btn" onclick="alert('Live Execution Running inside Ela Sandbox!')">Test Application Trigger</button>
</body>
</html>
`,
  },
  {
    id: "file-main-py",
    name: "main.py",
    path: "/main.py",
    type: "file",
    language: "python",
    content: `"""
Ela IDE Python Runtime & Data Analysis Engine
"""

def analyze_dataset():
    data = [12, 45, 68, 23, 90, 110, 42, 88]
    total = sum(data)
    average = total / len(data)
    peak = max(data)
    
    print("=" * 40)
    print("      ELA DATA ANALYSIS REPORT       ")
    print("=" * 40)
    print(f"Total Data Points: {len(data)}")
    print(f"Cumulative Sum:    {total}")
    print(f"Mean Value:        {average:.2f}")
    print(f"Peak Value:        {peak}")
    print("=" * 40)
    print("Execution completed successfully!")

if __name__ == "__main__":
    analyze_dataset()
`,
  },
  {
    id: "file-package-json",
    name: "package.json",
    path: "/package.json",
    type: "file",
    language: "json",
    content: `{
  "name": "ela-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
`,
  },
  {
    id: "file-readme-md",
    name: "README.md",
    path: "/README.md",
    type: "file",
    language: "markdown",
    content: `# Ela IDE Workspace

Welcome to **Ela IDE** — the premium AI-powered development environment inspired by VS Code, Cursor, and Windsurf.

## Features
- **Multi-Model AI Router**: Switch between Gemini, DeepSeek, OpenRouter, Ollama, and OpenAI endpoints.
- **Smart Agent Mode**: Multi-file edits, project-wide reasoning, and automated step execution.
- **Diff Reviewer**: Review, accept, or reject AI-generated modifications before committing them to files.
- **Integrated Terminal**: Execute interactive commands, simulate package installations, and run Node / Python code.
- **Live Device Preview**: Instant responsive web preview with desktop, tablet, and mobile views.

## Quick Tips
- Press **Ctrl+Shift+P** or click the top search bar for the **Command Palette**.
- Click the **AI Assistant** icon in the Activity Bar to start chat or agent task mode.
- Use **Settings** to securely configure your custom API keys.
`,
  },
];

