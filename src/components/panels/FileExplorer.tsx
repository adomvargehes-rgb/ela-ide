"use client";

import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileText,
  FileJson,
  Plus,
  FolderPlus,
  Trash2,
  Edit2,
  MoreHorizontal,
  RotateCw,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { FileItem } from "@/types/ide";

export default function FileExplorer() {
  const { files, openFile, activeFile, createFile, deleteFile, renameFile, currentProjectName } = useIDE();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "/src": true,
    "/src/components": true,
  });
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [creatingInPath, setCreatingInPath] = useState<{ path: string; type: "file" | "folder" } | null>(null);
  const [newItemName, setNewItemName] = useState<string>("");
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleStartCreate = (path: string, type: "file" | "folder", e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCreatingInPath({ path, type });
    setNewItemName("");
    setExpandedFolders((prev) => ({ ...prev, [path]: true }));
  };

  const handleFinishCreate = () => {
    if (creatingInPath && newItemName.trim()) {
      createFile(creatingInPath.path, newItemName.trim(), creatingInPath.type);
    }
    setCreatingInPath(null);
    setNewItemName("");
  };

  const handleStartRename = (item: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPath(item.path);
    setRenameValue(item.name);
  };

  const handleFinishRename = () => {
    if (editingPath && renameValue.trim()) {
      renameFile(editingPath, renameValue.trim());
    }
    setEditingPath(null);
  };

  // Get file icon based on extension matching VS Code / Qoder style
  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "tsx":
      case "jsx":
        return <FileCode size={13} className="text-[#3B82F6] shrink-0" />;
      case "ts":
      case "js":
        return <FileCode size={13} className="text-[#3B82F6] shrink-0" />;
      case "json":
        return <FileJson size={13} className="text-amber-400 shrink-0" />;
      case "html":
      case "css":
        return <FileCode size={13} className="text-emerald-400 shrink-0" />;
      case "py":
        return <FileCode size={13} className="text-blue-400 shrink-0" />;
      case "md":
        return <FileText size={13} className="text-purple-400 shrink-0" />;
      default:
        return <File size={13} className="text-[#858585] shrink-0" />;
    }
  };

  const renderTree = (items: FileItem[], depth = 0) => {
    return items.map((item) => {
      const isFolder = item.type === "folder";
      const isExpanded = expandedFolders[item.path] ?? false;
      const isActive = activeFile?.path === item.path;
      const isEditing = editingPath === item.path;

      return (
        <div key={item.id} className="select-none">
          <div
            onClick={() => (isFolder ? toggleFolder(item.path) : openFile(item.path))}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            className={`group h-[22px] flex items-center justify-between pr-2 cursor-pointer text-[12px] transition-colors ${
              isActive
                ? "bg-[#04395E] text-white font-medium"
                : "text-[#CCCCCC] hover:bg-[#2A2D32]/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
              {isFolder ? (
                <>
                  <span className="text-[#858585] shrink-0">
                    {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                  </span>
                  {isExpanded ? (
                    <FolderOpen size={13} className="text-amber-400 shrink-0" />
                  ) : (
                    <Folder size={13} className="text-amber-400 shrink-0" />
                  )}
                </>
              ) : (
                <span className="ml-3 shrink-0">{getFileIcon(item.name)}</span>
              )}

              {isEditing ? (
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={handleFinishRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleFinishRename();
                    if (e.key === "Escape") setEditingPath(null);
                  }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#252526] text-white px-1 py-0 rounded border border-[#3B82F6] outline-none text-[11px] w-full"
                />
              ) : (
                <span className="truncate">{item.name}</span>
              )}
            </div>

            {/* Quick Actions (Rename / Delete / Add inside folder) */}
            <div className="hidden group-hover:flex items-center gap-1 text-[#858585]">
              {isFolder && (
                <>
                  <button
                    onClick={(e) => handleStartCreate(item.path, "file", e)}
                    title="New File"
                    className="p-0.5 hover:text-white"
                  >
                    <Plus size={11} />
                  </button>
                  <button
                    onClick={(e) => handleStartCreate(item.path, "folder", e)}
                    title="New Folder"
                    className="p-0.5 hover:text-white"
                  >
                    <FolderPlus size={11} />
                  </button>
                </>
              )}
              <button
                onClick={(e) => handleStartRename(item, e)}
                title="Rename"
                className="p-0.5 hover:text-white"
              >
                <Edit2 size={10} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete ${item.name}?`)) deleteFile(item.path);
                }}
                title="Delete"
                className="p-0.5 hover:text-rose-400"
              >
                <Trash2 size={10} />
              </button>
            </div>
          </div>

          {/* Inline creation input inside this folder */}
          {isFolder && isExpanded && creatingInPath?.path === item.path && (
            <div
              style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
              className="py-0.5 pr-2 flex items-center gap-1.5"
            >
              {creatingInPath.type === "folder" ? (
                <Folder size={13} className="text-amber-400 shrink-0" />
              ) : (
                <File size={13} className="text-[#858585] shrink-0" />
              )}
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onBlur={handleFinishCreate}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleFinishCreate();
                  if (e.key === "Escape") setCreatingInPath(null);
                }}
                autoFocus
                placeholder={`New ${creatingInPath.type}...`}
                className="bg-[#252526] text-white px-1.5 py-0.5 rounded border border-[#3B82F6] outline-none text-[11px] w-full"
              />
            </div>
          )}

          {/* Render children if expanded */}
          {isFolder && isExpanded && item.children && (
            <div>{renderTree(item.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#181818] select-none text-[12px] font-sans">
      {/* Explorer Header */}
      <div className="h-[30px] px-3 flex items-center justify-between text-[11px] font-bold text-[#858585] uppercase tracking-wider border-b border-[#282828]">
        <span>Explorer</span>
        <div className="flex items-center gap-1 text-[#858585]">
          <button
            onClick={() => handleStartCreate("/", "file")}
            title="New File"
            className="p-1 hover:text-[#CCCCCC] hover:bg-[#2A2D32] rounded"
          >
            <Plus size={13} />
          </button>
          <button
            onClick={() => handleStartCreate("/", "folder")}
            title="New Folder"
            className="p-1 hover:text-[#CCCCCC] hover:bg-[#2A2D32] rounded"
          >
            <FolderPlus size={13} />
          </button>
          <button title="More Actions" className="p-1 hover:text-[#CCCCCC] hover:bg-[#2A2D32] rounded">
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      {/* Root Project Accordion (MIC DROPS style from screenshot) */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 py-1 flex items-center gap-1 font-bold text-[11px] text-[#CCCCCC] uppercase tracking-wide cursor-pointer hover:bg-[#2A2D32]/40">
          <ChevronDown size={11} className="text-[#858585]" />
          <span className="truncate">{currentProjectName || "WORKSPACE"}</span>
        </div>

        {/* File tree */}
        <div className="py-0.5">{renderTree(files)}</div>

        {/* Collapsible Outline */}
        <div className="border-t border-[#282828] mt-2">
          <div
            onClick={() => setIsOutlineOpen((v) => !v)}
            className="px-2 py-1 flex items-center gap-1 text-[11px] font-bold text-[#858585] uppercase tracking-wider cursor-pointer hover:bg-[#2A2D32]/40"
          >
            {isOutlineOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            <span>Outline</span>
          </div>
          {isOutlineOpen && (
            <div className="px-4 py-2 text-[11px] text-[#858585] italic">
              Symbol outline ready for {activeFile?.name || "active file"}.
            </div>
          )}
        </div>

        {/* Collapsible Timeline */}
        <div className="border-t border-[#282828]">
          <div
            onClick={() => setIsTimelineOpen((v) => !v)}
            className="px-2 py-1 flex items-center gap-1 text-[11px] font-bold text-[#858585] uppercase tracking-wider cursor-pointer hover:bg-[#2A2D32]/40"
          >
            {isTimelineOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            <span>Timeline</span>
          </div>
          {isTimelineOpen && (
            <div className="px-4 py-2 text-[11px] text-[#858585] italic">
              Local history & git timeline tracked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
