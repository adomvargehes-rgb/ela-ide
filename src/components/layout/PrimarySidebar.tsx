"use client";

import React from "react";
import { useIDE } from "@/context/IDEContext";
import FileExplorer from "@/components/panels/FileExplorer";
import SearchPanel from "@/components/panels/SearchPanel";
import SourceControlPanel from "@/components/panels/SourceControlPanel";
import ExtensionsPanel from "@/components/panels/ExtensionsPanel";
import SettingsPanel from "@/components/panels/SettingsPanel";

export default function PrimarySidebar() {
  const { isSidebarOpen, activeSidebarTab } = useIDE();

  if (!isSidebarOpen) return null;

  return (
    <div className="w-64 bg-ide-sidebar border-r border-ide-border flex flex-col h-full shrink-0 select-none overflow-hidden transition-all duration-150">
      {activeSidebarTab === "explorer" && <FileExplorer />}
      {activeSidebarTab === "search" && <SearchPanel />}
      {activeSidebarTab === "source-control" && <SourceControlPanel />}
      {activeSidebarTab === "extensions" && <ExtensionsPanel />}
      {activeSidebarTab === "settings" && <SettingsPanel />}
    </div>
  );
}
