"use client";

import React, { useState, useRef } from "react";
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
  FolderTree,
  FolderInput,
  X,
  Sparkles,
} from "lucide-react";
import { useIDE } from "@/context/IDEContext";
import { FileItem } from "@/types/ide";

export default function FileExplorer() {
  const {
    files,
    openFile,
    activeFile,
    createFile,
    deleteFile,
    renameFile,
    currentProjectName,
    openFolderFromDisk,
    loadFolderFiles,
    createCloudProject,
    closeFolder,
  } = useIDE();

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [creatingInPath, setCreatingInPath] = useState<{ path: string; type: "file" | "folder" } | null>(null);
  const [newItemName, setNewItemName] = useState<string>("");
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // HTML Directory Input fallback handler
  const handleDirectorySelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const itemsMap: Record<string, FileItem> = {};
    const rootFolderName = fileList[0].webkitRelativePath?.split("/")[0] || "Opened Folder";

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const relPath = "/" + file.webkitRelativePath.split("/").slice(1).join("/");
      if (!relPath || relPath === "/") continue;

      const parts = relPath.split("/").filter(Boolean);
      let currPath = "";

      for (let j = 0; j < parts.length; j++) {
        const part = parts[j];
        const isFile = j === parts.length - 1;
        const parentPath = currPath;
        currPath = `${currPath}/${part}`;

        if (!itemsMap[currPath]) {
          if (isFile) {
            const content = await file.text().catch(() => "");
            itemsMap[currPath] = {
              id: `file-${currPath}`,
              name: part,
              path: currPath,
              type: "file",
              content,
            };
          } else {
            itemsMap[currPath] = {
              id: `dir-${currPath}`,
              name: part,
              path: currPath,
              type: "folder",
              children: [],
              isOpen: false,
            };
          }

          if (parentPath && itemsMap[parentPath] && itemsMap[parentPath].children) {
            itemsMap[parentPath].children!.push(itemsMap[currPath]);
          }
        }
      }
    }

    const rootItems = Object.values(itemsMap).filter((item) => {
      const parts = item.path.split("/").filter(Boolean);
      return parts.length === 1;
    });

    loadFolderFiles(rootItems, rootFolderName);
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
            style={{ paddingLeft: `${depth * 14 + 10}px` }}
            className={`group h-[26px] flex items-center justify-between pr-2 cursor-pointer text-[14px] font-normal transition-colors ${
              isActive
                ? "bg-[#04395E] text-white font-medium"
                : "text-[#D4D4D4] hover:bg-[#2A2D32]/70 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2 truncate flex-1 min-w-0">
              {isFolder ? (
                <>
                  <span className="text-[#858585] shrink-0">
                    {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </span>
                  {isExpanded ? (
                    <FolderOpen size={15} className="text-amber-400 shrink-0" />
                  ) : (
                    <Folder size={15} className="text-amber-400 shrink-0" />
                  )}
                </>
              ) : (
                <span className="ml-3.5 shrink-0">{getFileIcon(item.name)}</span>
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
                  className="bg-[#252526] text-white px-1.5 py-0.5 rounded border border-[#3B82F6] outline-none text-[14px] font-normal w-full"
                />
              ) : (
                <span className="truncate">{item.name}</span>
              )}
            </div>

            {/* Hover Actions: Add file/folder inside, Rename, Delete */}
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[#858585] shrink-0">
              {isFolder && (
                <>
                  <button
                    onClick={(e) => handleStartCreate(item.path, "file", e)}
                    title="New File Inside"
                    className="p-1 hover:text-white hover:bg-[#333333] rounded"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={(e) => handleStartCreate(item.path, "folder", e)}
                    title="New Folder Inside"
                    className="p-1 hover:text-white hover:bg-[#333333] rounded"
                  >
                    <FolderPlus size={12} />
                  </button>
                </>
              )}
              <button
                onClick={(e) => handleStartRename(item, e)}
                title="Rename"
                className="p-1 hover:text-white hover:bg-[#333333] rounded"
              >
                <Edit2 size={11} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFile(item.path);
                }}
                title="Delete"
                className="p-1 hover:text-rose-400 hover:bg-[#333333] rounded"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>

          {/* New Item inline creation input inside folder */}
          {creatingInPath?.path === item.path && (
            <div style={{ paddingLeft: `${(depth + 1) * 14 + 10}px` }} className="pr-2 py-0.5">
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
                className="bg-[#252526] text-white px-2 py-0.5 rounded border border-[#3B82F6] outline-none text-[14px] font-normal w-full"
              />
            </div>
          )}

          {/* Render children only when expanded */}
          {isFolder && isExpanded && item.children && (
            <div>{renderTree(item.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#181818] select-none text-[14px] font-sans">
      {/* Hidden folder input fallback */}
      <input
        ref={fileInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is supported in Chrome/Edge/Firefox
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleDirectorySelect}
        className="hidden"
      />

      {/* Explorer Header (Sidebar headings: 13px, font-weight 600) */}
      <div className="h-[34px] px-3 flex items-center justify-between text-[13px] font-semibold text-[#858585] uppercase tracking-wider border-b border-[#282828]">
        <span>Explorer</span>
        {files.length > 0 && (
          <div className="flex items-center gap-1 text-[#858585]">
            <button
              onClick={() => handleStartCreate("/", "file")}
              title="New File"
              className="p-1 hover:text-[#CCCCCC] hover:bg-[#2A2D32] rounded transition-colors"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => handleStartCreate("/", "folder")}
              title="New Folder"
              className="p-1 hover:text-[#CCCCCC] hover:bg-[#2A2D32] rounded transition-colors"
            >
              <FolderPlus size={14} />
            </button>
            <button
              onClick={closeFolder}
              title="Close Folder"
              className="p-1 hover:text-[#CCCCCC] hover:bg-[#2A2D32] rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Workspace Area: Shows clean NO FOLDER OPENED if files are empty */}
      {files.length === 0 ? (
        <div className="flex-1 p-4 flex flex-col justify-start space-y-3.5">
          <div className="space-y-1.5">
            <span className="text-[13px] font-semibold text-[#858585] uppercase tracking-wider block">
              No Folder Opened
            </span>
            <p className="text-[13px] text-[#858585] leading-relaxed">
              You have not yet opened a folder. Open any project from your computer or create a new workspace.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            {/* Buttons: 13px, font-weight 500 */}
            <button
              onClick={() => {
                if (typeof window !== "undefined" && "showDirectoryPicker" in window) {
                  openFolderFromDisk();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="w-full py-2 px-3.5 bg-[#0E639C] hover:bg-[#1177BB] text-white rounded text-[13px] font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <FolderInput size={14} />
              <span>Open Folder</span>
            </button>

            <button
              onClick={() => createCloudProject("New React App", "react")}
              className="w-full py-2 px-3.5 bg-[#242428] hover:bg-[#2C2C30] text-[#CCCCCC] hover:text-white rounded text-[13px] font-medium flex items-center justify-center gap-2 transition-colors border border-[#333338]"
            >
              <Sparkles size={13} className="text-[#3B82F6]" />
              <span>Create New Project</span>
            </button>
          </div>
        </div>
      ) : (
        /* Render Folder Tree only when a folder is opened */
        <div className="flex-1 overflow-y-auto">
          {/* Root Project Header (Workspace title: 15px, font-weight 600) */}
          <div className="h-[30px] px-2.5 flex items-center justify-between font-semibold text-[15px] text-[#E4E4E7] tracking-wide cursor-pointer hover:bg-[#2A2D32]/40">
            <div className="flex items-center gap-1.5 truncate">
              <ChevronDown size={13} className="text-[#858585]" />
              <span className="truncate">{currentProjectName || "WORKSPACE"}</span>
            </div>
          </div>

          {/* Root new item input */}
          {creatingInPath?.path === "/" && (
            <div className="px-3 py-1">
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
                className="bg-[#252526] text-white px-2 py-0.5 rounded border border-[#3B82F6] outline-none text-[14px] font-normal w-full"
              />
            </div>
          )}

          {/* File and folder tree (Sidebar items: 14px, font-weight 400) */}
          <div className="py-0.5">{renderTree(files)}</div>
        </div>
      )}
    </div>
  );
}
