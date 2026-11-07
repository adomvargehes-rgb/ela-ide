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
  MoreVertical,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { FileItem } from "@/types/ide";

export default function FileExplorer() {
  const { files, openFile, activeFile, createFile, deleteFile, renameFile } = useIDE();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "/src": true,
  });
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

  // Get Lucide file icon based on extension
  const getFileIcon = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "ts":
      case "tsx":
      case "js":
      case "jsx":
      case "py":
        return <FileCode size={14} className="text-blue-400 shrink-0" />;
      case "json":
        return <FileJson size={14} className="text-amber-400 shrink-0" />;
      case "html":
      case "css":
        return <FileCode size={14} className="text-emerald-400 shrink-0" />;
      case "md":
        return <FileText size={14} className="text-purple-400 shrink-0" />;
      default:
        return <File size={14} className="text-zinc-400 shrink-0" />;
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
            style={{ paddingLeft: `${depth * 14 + 10}px` }}
            className={`group flex items-center justify-between py-1 pr-2 cursor-pointer transition-colors text-xs ${
              isActive
                ? "bg-ide-active text-white font-medium"
                : "text-zinc-300 hover:bg-ide-hover hover:text-white"
            }`}
          >
            <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
              {isFolder ? (
                <>
                  <span className="text-zinc-500">
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                  {isExpanded ? (
                    <FolderOpen size={14} className="text-amber-400 shrink-0" />
                  ) : (
                    <Folder size={14} className="text-amber-400 shrink-0" />
                  )}
                </>
              ) : (
                <span className="ml-3.5">{getFileIcon(item.name)}</span>
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
                  className="bg-zinc-800 text-white px-1.5 py-0.5 rounded border border-blue-500 outline-none text-xs w-full"
                />
              ) : (
                <span className="truncate">{item.name}</span>
              )}
            </div>

            {/* Quick Actions (Rename / Delete / Add inside folder) */}
            <div className="hidden group-hover:flex items-center gap-1 text-zinc-400">
              {isFolder && (
                <>
                  <button
                    onClick={(e) => handleStartCreate(item.path, "file", e)}
                    title="New File"
                    className="p-0.5 hover:text-white"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={(e) => handleStartCreate(item.path, "folder", e)}
                    title="New Folder"
                    className="p-0.5 hover:text-white"
                  >
                    <FolderPlus size={12} />
                  </button>
                </>
              )}
              <button
                onClick={(e) => handleStartRename(item, e)}
                title="Rename"
                className="p-0.5 hover:text-white"
              >
                <Edit2 size={11} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete ${item.name}?`)) deleteFile(item.path);
                }}
                title="Delete"
                className="p-0.5 hover:text-rose-400"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>

          {/* Inline creation input inside this folder */}
          {isFolder && isExpanded && creatingInPath?.path === item.path && (
            <div
              style={{ paddingLeft: `${(depth + 1) * 14 + 10}px` }}
              className="flex items-center gap-1.5 py-1 pr-2"
            >
              {creatingInPath.type === "folder" ? (
                <Folder size={14} className="text-amber-400 shrink-0" />
              ) : (
                <FileCode size={14} className="text-blue-400 shrink-0" />
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
                placeholder={creatingInPath.type === "folder" ? "folder_name" : "filename.tsx"}
                autoFocus
                className="bg-zinc-800 text-white px-1.5 py-0.5 rounded border border-blue-500 outline-none text-xs w-full"
              />
            </div>
          )}

          {/* Children */}
          {isFolder && isExpanded && item.children && (
            <div>{renderTree(item.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-ide-sidebar text-zinc-300">
      {/* Explorer Header */}
      <div className="h-8 px-3 border-b border-ide-border flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
        <span>Explorer: Workspace</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleStartCreate("", "file")}
            title="New File at Root"
            className="p-1 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => handleStartCreate("", "folder")}
            title="New Folder at Root"
            className="p-1 hover:text-white hover:bg-zinc-800 rounded transition-colors"
          >
            <FolderPlus size={14} />
          </button>
        </div>
      </div>

      {/* Root creation input */}
      {creatingInPath?.path === "" && (
        <div className="px-3 py-1.5 border-b border-zinc-800 flex items-center gap-2">
          {creatingInPath.type === "folder" ? (
            <Folder size={14} className="text-amber-400 shrink-0" />
          ) : (
            <FileCode size={14} className="text-blue-400 shrink-0" />
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
            placeholder={creatingInPath.type === "folder" ? "folder_name" : "filename.tsx"}
            autoFocus
            className="bg-zinc-800 text-white px-2 py-0.5 rounded border border-blue-500 outline-none text-xs w-full"
          />
        </div>
      )}

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {renderTree(files)}
      </div>
    </div>
  );
}

