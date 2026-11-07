"use client";

import React, { useState, useEffect } from "react";
import TitleBar from "@/components/layout/TitleBar";
import ActivityBar from "@/components/layout/ActivityBar";
import PrimarySidebar from "@/components/layout/PrimarySidebar";
import EditorArea from "@/components/editor/EditorArea";
import AIAssistantPanel from "@/components/ai/AIAssistantPanel";
import BottomPanel from "@/components/layout/BottomPanel";
import StatusBar from "@/components/layout/StatusBar";
import CommandPalette from "@/components/command-palette/CommandPalette";
import DiffViewModal from "@/components/editor/DiffViewModal";
import AuthModal from "@/components/auth/AuthModal";
import LegalModal from "@/components/legal/LegalModal";
import { useIDE } from "@/context/IDEContext";

export default function Home() {
  const {
    isLegalModalOpen,
    setIsLegalModalOpen,
    isSidebarOpen,
    isAIPanelOpen,
    isBottomOpen,
  } = useIDE();

  // Resizable panel dimensions
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [aiPanelWidth, setAiPanelWidth] = useState(380);
  const [bottomHeight, setBottomHeight] = useState(220);

  // Drag states
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false);
  const [isDraggingAiPanel, setIsDraggingAiPanel] = useState(false);
  const [isDraggingBottom, setIsDraggingBottom] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSidebar) {
        // Activity bar is 42px
        const newWidth = Math.max(160, Math.min(500, e.clientX - 42));
        setSidebarWidth(newWidth);
      } else if (isDraggingAiPanel) {
        const newWidth = Math.max(260, Math.min(650, window.innerWidth - e.clientX));
        setAiPanelWidth(newWidth);
      } else if (isDraggingBottom) {
        // Status bar is 22px
        const newHeight = Math.max(100, Math.min(550, window.innerHeight - 22 - e.clientY));
        setBottomHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingSidebar(false);
      setIsDraggingAiPanel(false);
      setIsDraggingBottom(false);
    };

    if (isDraggingSidebar || isDraggingAiPanel || isDraggingBottom) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor =
        isDraggingSidebar || isDraggingAiPanel ? "col-resize" : "row-resize";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDraggingSidebar, isDraggingAiPanel, isDraggingBottom]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-ide-bg text-ide-text select-none">
      {/* 1. VS Code / Qoder Window Header */}
      <TitleBar />

      {/* 2. Middle Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Activity Bar (Icon nav 42px) */}
        <ActivityBar />

        {/* Primary Sidebar (Explorer, Search, Git, Extensions, Settings) */}
        {isSidebarOpen && (
          <>
            <PrimarySidebar width={sidebarWidth} />
            {/* Draggable vertical divider */}
            <div
              onMouseDown={() => setIsDraggingSidebar(true)}
              className="w-1 bg-transparent hover:bg-[#3B82F6]/60 active:bg-[#3B82F6] cursor-col-resize transition-colors -mx-0.5 z-30 shrink-0 select-none"
              title="Drag to resize sidebar"
            />
          </>
        )}

        {/* Center Editor + Bottom Terminal Layout */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Main Monaco Editor */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <EditorArea />
          </div>

          {/* Integrated Bottom Panel (Terminal / Output / Problems / Preview) */}
          {isBottomOpen && (
            <>
              {/* Draggable horizontal divider */}
              <div
                onMouseDown={() => setIsDraggingBottom(true)}
                className="h-1 bg-transparent hover:bg-[#3B82F6]/60 active:bg-[#3B82F6] cursor-row-resize transition-colors -my-0.5 z-30 shrink-0 select-none"
                title="Drag to resize terminal"
              />
              <BottomPanel height={bottomHeight} />
            </>
          )}
        </div>

        {/* Right AI Assistant Panel */}
        {isAIPanelOpen && (
          <>
            {/* Draggable vertical divider */}
            <div
              onMouseDown={() => setIsDraggingAiPanel(true)}
              className="w-1 bg-transparent hover:bg-[#3B82F6]/60 active:bg-[#3B82F6] cursor-col-resize transition-colors -mx-0.5 z-30 shrink-0 select-none"
              title="Drag to resize AI Assistant"
            />
            <div
              style={{ width: `${aiPanelWidth}px` }}
              className="h-full shrink-0 flex overflow-hidden"
            >
              <AIAssistantPanel />
            </div>
          </>
        )}
      </div>

      {/* 3. Status Bar */}
      <StatusBar />

      {/* 4. Global Modals */}
      <CommandPalette />
      <DiffViewModal />
      <AuthModal />
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </div>
  );
}

