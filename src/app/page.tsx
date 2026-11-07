"use client";

import React from "react";
import TitleBar from "@/components/layout/TitleBar";
import ActivityBar from "@/components/layout/ActivityBar";
import PrimarySidebar from "@/components/layout/PrimarySidebar";
import EditorArea from "@/components/editor/EditorArea";
import AIAssistantPanel from "@/components/ai/AIAssistantPanel";
import BottomPanel from "@/components/layout/BottomPanel";
import StatusBar from "@/components/layout/StatusBar";
import CommandPalette from "@/components/command-palette/CommandPalette";
import DiffViewModal from "@/components/editor/DiffViewModal";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-ide-bg text-ide-text select-none">
      {/* 1. VS Code Inspired Window Header */}
      <TitleBar />

      {/* 2. Middle Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Activity Bar (Icon nav) */}
        <ActivityBar />

        {/* Primary Sidebar (Explorer, Search, Git, Extensions, Settings) */}
        <PrimarySidebar />

        {/* Center Editor + Bottom Terminal Layout */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Main Monaco Editor */}
          <EditorArea />

          {/* Integrated Bottom Panel (Terminal / Output / Problems / Preview) */}
          <BottomPanel />
        </div>

        {/* Right AI Assistant Panel */}
        <AIAssistantPanel />
      </div>

      {/* 3. Status Bar */}
      <StatusBar />

      {/* 4. Global Modals */}
      <CommandPalette />
      <DiffViewModal />
    </div>
  );
}
