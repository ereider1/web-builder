"use client";

import React from "react";
import { useBuilder } from "@/store/BuilderContext";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo2,
  Redo2,
  ExternalLink,
  FolderPlus,
} from "lucide-react";

interface TopToolbarProps {
  onNewProjectClick: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ onNewProjectClick }) => {
  const { state, setPreviewMode, undo, redo, canUndo, canRedo } = useBuilder();

  return (
    <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-6 select-none shadow-sm shrink-0 z-40">
      {/* Logo Section */}
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded bg-indigo-600 flex items-center justify-center text-white font-black text-xs tracking-wider">
          WB
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-zinc-900 leading-none">
            Web Builder
          </span>
          <span className="text-[10px] text-zinc-400 font-medium">
            Personal Layout Suite v2.0
          </span>
        </div>
      </div>

      {/* Responsive Preview Selectors */}
      <div className="flex items-center bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
        <button
          onClick={() => setPreviewMode("desktop")}
          title="Desktop (1200px)"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
            state.previewMode === "desktop"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Monitor className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Desktop</span>
        </button>
        <button
          onClick={() => setPreviewMode("tablet")}
          title="Tablet (768px)"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
            state.previewMode === "tablet"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Tablet className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Tablet</span>
        </button>
        <button
          onClick={() => setPreviewMode("mobile")}
          title="Mobile (390px)"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
            state.previewMode === "mobile"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Mobile</span>
        </button>
      </div>

      {/* Action / History Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded-md border transition-all duration-150 ${
              canUndo
                ? "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 cursor-pointer animate-press-feedback"
                : "bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed"
            }`}
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            className={`p-1.5 rounded-md border transition-all duration-150 ${
              canRedo
                ? "bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 cursor-pointer animate-press-feedback"
                : "bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed"
            }`}
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Create New Website trigger */}
        <button
          onClick={onNewProjectClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-indigo-700 text-xs font-bold cursor-pointer transition-all duration-150"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Website</span>
        </button>

        {/* JSON Export */}
        <button
          onClick={() => {
            alert(
              "Page JSON Export:\n\n" +
                JSON.stringify(state.pageData, null, 2)
            );
            console.log(state.pageData);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-white text-xs font-semibold cursor-pointer shadow transition-all duration-150"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Export JSON</span>
        </button>
      </div>
    </header>
  );
};
export default TopToolbar;
