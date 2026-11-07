"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Code2,
  Search,
  Play,
  Sparkles,
  ExternalLink,
  PanelLeft,
  PanelRight,
  PanelBottom,
  Cloud,
  ChevronDown,
  Plus,
  Download,
  FolderOpen,
  User,
  LogOut,
  Loader2,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { exportWorkspaceAsZip } from "@/lib/storage/exportZip";

export default function TitleBar() {
  const {
    files,
    activeFile,
    providers,
    settings,
    setIsCommandPaletteOpen,
    runProject,
    isRunning,
    toggleSidebar,
    toggleAIPanel,
    toggleBottomPanel,
    isSidebarOpen,
    isAIPanelOpen,
    isBottomOpen,
    setBottomPanelTab,
    setIsBottomOpen,
    user,
    setUser,
    setIsAuthModalOpen,
    currentProjectName,
    setCurrentProjectName,
    cloudProjects,
    saveCurrentProject,
    isSavingProject,
    loadCloudProject,
    createCloudProject,
  } = useIDE();

  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const projectsDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const activeProvider = providers[settings.activeProviderId];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        projectsDropdownRef.current &&
        !projectsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProjectsDropdownOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportZip = () => {
    exportWorkspaceAsZip(files, currentProjectName.toLowerCase().replace(/\s+/g, "-"));
    setIsProjectsDropdownOpen(false);
  };

  return (
    <header className="h-9 bg-ide-header border-b border-ide-border flex items-center justify-between px-3 select-none text-xs text-zinc-300 z-30 font-sans">
      {/* Left: App Brand, Project Selector & Menus */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Code2 size={13} strokeWidth={2.2} />
          </div>
          <span className="font-semibold text-zinc-100 tracking-wide">Ela IDE</span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
            Cloud
          </span>
        </div>

        {/* Project Selector Dropdown */}
        <div className="relative" ref={projectsDropdownRef}>
          <button
            onClick={() => setIsProjectsDropdownOpen((v) => !v)}
            className="h-6 px-2 rounded bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors max-w-[170px] truncate"
          >
            <FolderOpen size={11} className="text-amber-400 shrink-0" />
            <span className="truncate">{currentProjectName}</span>
            <ChevronDown size={10} className="text-zinc-500 shrink-0" />
          </button>

          {isProjectsDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-60 bg-[#141416] border border-zinc-800 rounded-xl shadow-2xl p-1.5 space-y-1 text-xs z-50">
              <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Cloud Projects
              </div>
              {cloudProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    loadCloudProject(proj.id);
                    setIsProjectsDropdownOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-200 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <span className="truncate font-medium">{proj.name}</span>
                  <span className="text-[10px] text-zinc-500">{proj.updated_at || "saved"}</span>
                </div>
              ))}

              <div className="border-t border-zinc-800 my-1" />

              <div
                onClick={() => {
                  createCloudProject("React Web App", "react");
                  setIsProjectsDropdownOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 cursor-pointer flex items-center gap-2 transition-colors"
              >
                <Plus size={12} className="text-blue-400" />
                <span>New React Project</span>
              </div>

              <div
                onClick={() => {
                  createCloudProject("Python Analytics", "python");
                  setIsProjectsDropdownOpen(false);
                }}
                className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 cursor-pointer flex items-center gap-2 transition-colors"
              >
                <Plus size={12} className="text-emerald-400" />
                <span>New Python Project</span>
              </div>

              <div
                onClick={handleExportZip}
                className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 text-zinc-300 cursor-pointer flex items-center gap-2 transition-colors"
              >
                <Download size={12} className="text-purple-400" />
                <span>Export as ZIP Archive</span>
              </div>
            </div>
          )}
        </div>

        {/* Cloud Sync Button */}
        <button
          onClick={saveCurrentProject}
          disabled={isSavingProject}
          title="Sync project to cloud storage (R2/Postgres)"
          className="h-6 px-2 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors text-[11px]"
        >
          {isSavingProject ? (
            <Loader2 size={12} className="animate-spin text-blue-400" />
          ) : (
            <Cloud size={12} className="text-emerald-400" />
          )}
          <span className="hidden sm:inline">{isSavingProject ? "Syncing..." : "Sync Cloud"}</span>
        </button>
      </div>

      {/* Center: Command Palette / File Quick Open */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full h-6 bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-700/60 hover:border-zinc-600 rounded flex items-center justify-between px-3 text-zinc-400 hover:text-zinc-200 transition-colors shadow-inner"
        >
          <div className="flex items-center gap-2 truncate">
            <Search size={12} strokeWidth={1.75} />
            <span className="truncate">
              {activeFile ? `Ela IDE — ${activeFile.name}` : "Search files and commands..."}
            </span>
          </div>
          <kbd className="hidden sm:inline-block text-[10px] font-mono bg-zinc-800 border border-zinc-700 px-1.5 rounded text-zinc-400">
            Ctrl+Shift+P
          </kbd>
        </button>
      </div>

      {/* Right: Actions, AI indicator, and layout toggles */}
      <div className="flex items-center gap-2">
        {/* Active AI Provider pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-950/40 border border-blue-800/40 text-blue-300 text-[11px]">
          <Sparkles size={11} strokeWidth={2} className="text-blue-400" />
          <span className="font-medium">{activeProvider?.name || "AI Ready"}</span>
          <span className="text-zinc-500">•</span>
          <span className="font-mono text-[10px] text-zinc-400">{activeProvider?.selectedModel}</span>
        </div>

        {/* Run button */}
        <button
          onClick={runProject}
          disabled={isRunning}
          className="h-6 px-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-60"
        >
          <Play size={11} strokeWidth={2.2} fill="currentColor" />
          <span>{isRunning ? "Running..." : "Run"}</span>
        </button>

        {/* Live Preview Toggle */}
        <button
          onClick={() => {
            setIsBottomOpen(true);
            setBottomPanelTab("preview");
          }}
          title="Open Live Web Preview"
          className="h-6 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1 transition-colors"
        >
          <ExternalLink size={12} strokeWidth={1.75} />
          <span className="hidden sm:inline">Preview</span>
        </button>

        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

        {/* User Account / Sign In */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen((v) => !v)}
              className="h-6 px-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5 transition-colors"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-[80px]">{user.name}</span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#141416] border border-zinc-800 rounded-xl shadow-2xl p-1 text-xs space-y-1 z-50">
                <div className="px-2.5 py-1 text-[11px] text-zinc-400 truncate border-b border-zinc-800/80">
                  {user.email}
                </div>
                <div
                  onClick={() => {
                    setUser(null);
                    setIsUserMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-300 cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <LogOut size={12} />
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="h-6 px-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1 transition-colors text-[11px]"
          >
            <User size={11} />
            <span>Sign In</span>
          </button>
        )}

        <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

        {/* Layout panel toggle icons */}
        <button
          onClick={toggleSidebar}
          title="Toggle Primary Sidebar"
          className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
            isSidebarOpen ? "text-zinc-200" : "text-zinc-500"
          }`}
        >
          <PanelLeft size={14} strokeWidth={1.5} />
        </button>
        <button
          onClick={toggleBottomPanel}
          title="Toggle Bottom Panel"
          className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
            isBottomOpen ? "text-zinc-200" : "text-zinc-500"
          }`}
        >
          <PanelBottom size={14} strokeWidth={1.5} />
        </button>
        <button
          onClick={toggleAIPanel}
          title="Toggle AI Assistant"
          className={`p-1 rounded hover:bg-zinc-800 transition-colors ${
            isAIPanelOpen ? "text-blue-400" : "text-zinc-500"
          }`}
        >
          <PanelRight size={14} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}

