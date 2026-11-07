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
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  FolderOpen,
  User,
  LogOut,
  Loader2,
  Minus,
  Square,
  X,
  Compass,
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
    cloudProjects,
    saveCurrentProject,
    isSavingProject,
    loadCloudProject,
    createCloudProject,
    openFolderFromDisk,
  } = useIDE();

  const [isProjectsDropdownOpen, setIsProjectsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const projectsDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

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
      if (
        menuBarRef.current &&
        !menuBarRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportZip = () => {
    exportWorkspaceAsZip(files, currentProjectName.toLowerCase().replace(/\s+/g, "-"));
    setIsProjectsDropdownOpen(false);
  };

  const menuItems = ["File", "Edit", "Selection", "View", "Go", "Run", "Terminal", "Help"];

  return (
    <header className="h-[38px] bg-[#181818] border-b border-[#282828] flex items-center justify-between px-2.5 select-none text-[14px] text-[#CCCCCC] z-30 font-sans">
      {/* Left: App Logo, Standard Menus, and Project Selector */}
      <div className="flex items-center gap-2 h-full">
        {/* App Logo */}
        <div className="flex items-center gap-1.5 pr-2">
          <div className="w-5 h-5 rounded bg-[#3B82F6] flex items-center justify-center text-white shadow-sm">
            <Code2 size={13} strokeWidth={2.4} />
          </div>
          <span className="font-semibold text-[14px] tracking-tight text-white hidden sm:inline">Ela</span>
        </div>

        {/* Minimal VS Code / Qoder Top Menus */}
        <div className="hidden lg:flex items-center text-[#CCCCCC]" ref={menuBarRef}>
          {menuItems.map((menu) => (
            <div key={menu} className="relative">
              <button
                onClick={() => {
                  if (menu === "Run") runProject();
                  else if (menu === "Terminal") {
                    setIsBottomOpen(true);
                    setBottomPanelTab("terminal");
                  } else {
                    setActiveMenu(activeMenu === menu ? null : menu);
                  }
                }}
                className={`px-3 py-1 rounded text-[14px] font-medium hover:bg-[#2A2D32] hover:text-white transition-colors ${
                  activeMenu === menu ? "bg-[#2A2D32] text-white" : ""
                }`}
              >
                {menu}
              </button>

              {activeMenu === menu && menu === "File" && (
                <div className="absolute left-0 top-full mt-0.5 w-52 bg-[#1E1E1E] border border-[#333333] rounded shadow-xl py-1 text-[13px] z-50">
                  <div
                    onClick={() => {
                      createCloudProject("React Web App", "react");
                      setActiveMenu(null);
                    }}
                    className="px-3 py-1.5 hover:bg-[#04395E] hover:text-white cursor-pointer flex items-center justify-between text-[13px] font-medium"
                  >
                    <span>New Project</span>
                    <span className="text-[11px] text-[#858585]">Ctrl+N</span>
                  </div>
                  <div
                    onClick={() => {
                      openFolderFromDisk();
                      setActiveMenu(null);
                    }}
                    className="px-3 py-1.5 hover:bg-[#04395E] hover:text-white cursor-pointer flex items-center justify-between text-[13px] font-medium"
                  >
                    <span>Open Folder...</span>
                    <span className="text-[11px] text-[#858585]">Ctrl+O</span>
                  </div>
                  <div
                    onClick={() => {
                      saveCurrentProject();
                      setActiveMenu(null);
                    }}
                    className="px-3 py-1.5 hover:bg-[#04395E] hover:text-white cursor-pointer flex items-center justify-between text-[13px] font-medium"
                  >
                    <span>Save to Cloud</span>
                    <span className="text-[11px] text-[#858585]">Ctrl+S</span>
                  </div>
                  <div
                    onClick={() => {
                      handleExportZip();
                      setActiveMenu(null);
                    }}
                    className="px-3 py-1.5 hover:bg-[#04395E] hover:text-white cursor-pointer flex items-center justify-between text-[13px] font-medium"
                  >
                    <span>Export ZIP</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-[1px] h-4 bg-[#303030] mx-1 hidden sm:block" />

        {/* Project Selector (Workspace title: 15px, font-weight 600) */}
        <div className="flex items-center gap-1" ref={projectsDropdownRef}>
          <button
            onClick={() => setIsProjectsDropdownOpen((v) => !v)}
            className="h-7 px-2.5 rounded hover:bg-[#2A2D32] text-[#E4E4E7] hover:text-white text-[15px] font-semibold flex items-center gap-1.5 transition-colors max-w-[180px] truncate"
          >
            <span className="truncate">{currentProjectName || "Workspace"}</span>
            <ChevronDown size={12} className="text-[#858585] shrink-0" />
          </button>

          <button
            title="Previous project"
            className="p-1.5 text-[#858585] hover:text-[#CCCCCC] hover:bg-[#2A2D32] rounded transition-colors hidden sm:inline-flex"
          >
            <ChevronLeft size={13} />
          </button>
          <button
            title="Next project"
            className="p-1.5 text-[#858585] hover:text-[#CCCCCC] hover:bg-[#2A2D32] rounded transition-colors hidden sm:inline-flex"
          >
            <ChevronRight size={13} />
          </button>

          {isProjectsDropdownOpen && (
            <div className="absolute left-32 top-9 w-60 bg-[#1E1E1E] border border-[#333333] rounded-md shadow-2xl p-1 text-[13px] z-50">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-[#858585] uppercase tracking-wider">
                Workspaces
              </div>
              {cloudProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => {
                    loadCloudProject(proj.id);
                    setIsProjectsDropdownOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-[#04395E] hover:text-white cursor-pointer flex items-center justify-between transition-colors text-[13px]"
                >
                  <span className="truncate font-medium">{proj.name}</span>
                  <span className="text-[11px] text-[#858585]">{proj.updated_at || "saved"}</span>
                </div>
              ))}

              <div className="border-t border-[#303030] my-1" />

              <div
                onClick={() => {
                  openFolderFromDisk();
                  setIsProjectsDropdownOpen(false);
                }}
                className="px-2.5 py-1.5 rounded hover:bg-[#2A2D32] text-[#CCCCCC] cursor-pointer flex items-center gap-2 text-[13px] font-medium"
              >
                <FolderOpen size={13} className="text-amber-400" />
                <span>Open Local Folder...</span>
              </div>
              <div
                onClick={() => {
                  createCloudProject("React Web App", "react");
                  setIsProjectsDropdownOpen(false);
                }}
                className="px-2.5 py-1.5 rounded hover:bg-[#2A2D32] text-[#CCCCCC] cursor-pointer flex items-center gap-2 text-[13px] font-medium"
              >
                <Plus size={13} className="text-[#3B82F6]" />
                <span>New React Project</span>
              </div>
              <div
                onClick={() => {
                  createCloudProject("Python Analytics", "python");
                  setIsProjectsDropdownOpen(false);
                }}
                className="px-2.5 py-1.5 rounded hover:bg-[#2A2D32] text-[#CCCCCC] cursor-pointer flex items-center gap-2 text-[13px] font-medium"
              >
                <Plus size={13} className="text-emerald-400" />
                <span>New Python Project</span>
              </div>
              <div
                onClick={handleExportZip}
                className="px-2.5 py-1.5 rounded hover:bg-[#2A2D32] text-[#CCCCCC] cursor-pointer flex items-center gap-2 text-[13px] font-medium"
              >
                <Download size={13} className="text-purple-400" />
                <span>Download as ZIP</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Command Search Pill */}
      <div className="flex-1 max-w-sm mx-3">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full h-7 bg-[#252526] hover:bg-[#2C2C2D] border border-[#383838] rounded-md flex items-center justify-between px-3 text-[#858585] hover:text-[#CCCCCC] transition-colors shadow-inner"
        >
          <div className="flex items-center gap-2 truncate">
            <Compass size={13} className="text-[#3B82F6] shrink-0" />
            <span className="truncate text-[13px]">
              {activeFile ? `Ela IDE — ${activeFile.name}` : "Open Ela IDE (Ctrl+Shift+P)"}
            </span>
          </div>
          <Search size={13} className="text-[#858585] shrink-0" />
        </button>
      </div>

      {/* Right: Actions, Panel Toggles, Window Controls */}
      <div className="flex items-center gap-2 h-full">
        {/* Run Button: 13px, font-weight 500 */}
        <button
          onClick={runProject}
          disabled={isRunning}
          title="Run Code (F5)"
          className="h-6 px-3 rounded bg-[#10B981] hover:bg-[#059669] text-black font-medium text-[13px] flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
        >
          <Play size={11} strokeWidth={2.4} fill="currentColor" />
          <span>{isRunning ? "Running..." : "Run"}</span>
        </button>

        {/* Cloud Sync */}
        <button
          onClick={saveCurrentProject}
          disabled={isSavingProject}
          title="Save and Sync to Cloud"
          className="h-7 w-7 rounded hover:bg-[#2A2D32] text-[#858585] hover:text-[#CCCCCC] flex items-center justify-center transition-colors"
        >
          {isSavingProject ? (
            <Loader2 size={13} className="animate-spin text-[#3B82F6]" />
          ) : (
            <Cloud size={14} />
          )}
        </button>

        {/* User Account: Buttons 13px, font-weight 500 */}
        {user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen((v) => !v)}
              className="h-7 px-2 rounded hover:bg-[#2A2D32] text-[#CCCCCC] text-[13px] font-medium flex items-center gap-1.5"
            >
              <div className="w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981] font-semibold text-[11px] flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-[80px] hidden md:inline">{user.name}</span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-[#1E1E1E] border border-[#333333] rounded-md shadow-2xl p-1 text-[13px] z-50">
                <div className="px-2.5 py-1 text-[12px] text-[#858585] truncate border-b border-[#303030]">
                  {user.email}
                </div>
                <div
                  onClick={() => {
                    setUser(null);
                    setIsUserMenuOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded hover:bg-rose-950/40 text-rose-300 cursor-pointer flex items-center gap-1.5 text-[13px] font-medium"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="h-6 px-2.5 rounded bg-[#2A2D32] hover:bg-[#33373E] text-[#CCCCCC] hover:text-white text-[13px] font-medium flex items-center gap-1.5 transition-colors"
          >
            <User size={12} />
            <span>Sign In</span>
          </button>
        )}

        <div className="w-[1px] h-3.5 bg-[#303030] mx-0.5" />

        {/* Panel Layout Toggles (Exact icons from Qoder top-right) */}
        <button
          onClick={toggleSidebar}
          title="Toggle Primary Sidebar (Ctrl+B)"
          className={`h-6 w-6 rounded flex items-center justify-center transition-colors ${
            isSidebarOpen ? "text-[#CCCCCC] bg-[#2A2D32]" : "text-[#858585] hover:text-[#CCCCCC] hover:bg-[#2A2D32]"
          }`}
        >
          <PanelLeft size={13} strokeWidth={1.6} />
        </button>

        <button
          onClick={toggleBottomPanel}
          title="Toggle Terminal Panel (Ctrl+`)"
          className={`h-6 w-6 rounded flex items-center justify-center transition-colors ${
            isBottomOpen ? "text-[#CCCCCC] bg-[#2A2D32]" : "text-[#858585] hover:text-[#CCCCCC] hover:bg-[#2A2D32]"
          }`}
        >
          <PanelBottom size={13} strokeWidth={1.6} />
        </button>

        <button
          onClick={toggleAIPanel}
          title="Toggle AI Assistant (Ctrl+Shift+A)"
          className={`h-6 w-6 rounded flex items-center justify-center transition-colors ${
            isAIPanelOpen ? "text-[#3B82F6] bg-[#2A2D32]" : "text-[#858585] hover:text-[#CCCCCC] hover:bg-[#2A2D32]"
          }`}
        >
          <PanelRight size={13} strokeWidth={1.6} />
        </button>

        <div className="w-[1px] h-3.5 bg-[#303030] mx-0.5 hidden sm:block" />

        {/* Window controls styling */}
        <div className="hidden sm:flex items-center gap-1 text-[#858585]">
          <button title="Minimize" className="h-6 w-5 flex items-center justify-center hover:bg-[#2A2D32] hover:text-[#CCCCCC] rounded">
            <Minus size={11} />
          </button>
          <button title="Maximize" className="h-6 w-5 flex items-center justify-center hover:bg-[#2A2D32] hover:text-[#CCCCCC] rounded">
            <Square size={9} />
          </button>
          <button title="Close" className="h-6 w-5 flex items-center justify-center hover:bg-rose-600 hover:text-white rounded">
            <X size={11} />
          </button>
        </div>
      </div>
    </header>
  );
}
