"use client";

import React from "react";
import {
  Files,
  Search,
  GitBranch,
  Blocks,
  Settings2,
  User,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { ActiveSidebarTab } from "@/types/ide";

export default function ActivityBar() {
  const {
    activeSidebarTab,
    setActiveSidebarTab,
    isSidebarOpen,
    setIsSidebarOpen,
    isAIPanelOpen,
    toggleAIPanel,
    setIsAuthModalOpen,
    user,
  } = useIDE();

  const handleTabClick = (tab: ActiveSidebarTab) => {
    if (activeSidebarTab === tab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveSidebarTab(tab);
      setIsSidebarOpen(true);
    }
  };

  const topItems: { id: ActiveSidebarTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "explorer", label: "Explorer (Ctrl+Shift+E)", icon: <Files size={18} strokeWidth={1.5} /> },
    { id: "search", label: "Search (Ctrl+Shift+F)", icon: <Search size={18} strokeWidth={1.5} /> },
    { id: "source-control", label: "Source Control (Ctrl+Shift+G)", icon: <GitBranch size={18} strokeWidth={1.5} /> },
    { id: "extensions", label: "Extensions (Ctrl+Shift+X)", icon: <Blocks size={18} strokeWidth={1.5} /> },
  ];

  return (
    <aside className="w-[42px] bg-[#181818] border-r border-[#282828] flex flex-col justify-between items-center py-1.5 select-none z-20 shrink-0">
      {/* Top action items */}
      <div className="flex flex-col items-center gap-0.5 w-full">
        {topItems.map((item) => {
          const isActive = isSidebarOpen && activeSidebarTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              title={item.label}
              className={`relative w-full h-10 flex items-center justify-center transition-colors group ${
                isActive
                  ? "text-white"
                  : "text-[#858585] hover:text-[#CCCCCC]"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-white rounded-r" />
              )}
              {item.icon}

              {item.badge && (
                <span className="absolute bottom-1.5 right-1.5 min-w-[13px] h-[13px] px-0.5 rounded-full bg-[#10B981] text-black font-bold text-[9px] flex items-center justify-center leading-none">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom utility items */}
      <div className="flex flex-col items-center gap-0.5 w-full">
        {/* User Account */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          title={user ? `Signed in as ${user.name}` : "Sign In"}
          className="w-full h-10 flex items-center justify-center text-[#858585] hover:text-[#CCCCCC] transition-colors"
        >
          {user ? (
            <div className="w-5 h-5 rounded-full bg-[#10B981]/20 text-[#10B981] font-semibold text-[10px] flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <User size={18} strokeWidth={1.5} />
          )}
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => handleTabClick("settings")}
          title="Settings (Ctrl+,)"
          className={`relative w-full h-10 flex items-center justify-center transition-colors ${
            isSidebarOpen && activeSidebarTab === "settings"
              ? "text-white"
              : "text-[#858585] hover:text-[#CCCCCC]"
          }`}
        >
          {isSidebarOpen && activeSidebarTab === "settings" && (
            <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-white rounded-r" />
          )}
          <Settings2 size={18} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
