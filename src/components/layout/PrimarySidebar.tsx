"use client";

import React from "react";
import { useIDE } from "@/context/IDEContext";
import FileExplorer from "@/components/panels/FileExplorer";
import SearchPanel from "@/components/panels/SearchPanel";
import SourceControlPanel from "@/components/panels/SourceControlPanel";
import ExtensionsPanel from "@/components/panels/ExtensionsPanel";
import SettingsPanel from "@/components/panels/SettingsPanel";

export default function PrimarySidebar({ width = 230 }: { width?: number }) {
  const { isSidebarOpen, activeSidebarTab } = useIDE();

  if (!isSidebarOpen) return null;

  return (
    <div
      style={{ width: `${width}px` }}
      className="bg-[#181818] border-r border-[#282828] flex flex-col h-full shrink-0 select-none overflow-hidden"
    >
      {activeSidebarTab === "explorer" && <FileExplorer />}
      {activeSidebarTab === "search" && <SearchPanel />}
      {activeSidebarTab === "source-control" && <SourceControlPanel />}
      {activeSidebarTab === "extensions" && <ExtensionsPanel />}
      {activeSidebarTab === "settings" && <SettingsPanel />}
    </div>
  );
}
