"use client";

import React from "react";
import { useBuilder } from "@/store/BuilderContext";
import { PageElement, PageSection } from "@/types";
import { Check, Keyboard, Sliders, Box, Columns } from "lucide-react";

// Count total nested components inside elements list
function countElements(elements: PageElement[]): number {
  let count = elements.length;
  for (const el of elements) {
    if (el.children) {
      count += countElements(el.children);
    }
  }
  return count;
}

// Count total visual elements (sections + components) on the active page
function countTotalLayoutNodes(sections: PageSection[]): number {
  let total = sections.length; // Count section containers themselves
  for (const sec of sections) {
    total += countElements(sec.elements); // Add nested component counts
  }
  return total;
}

export const StatusBar: React.FC = () => {
  const { state } = useBuilder();
  const { selectedElementId, selectedSectionId, activePageId, project } = state;

  const activePage =
    project.pages.find((p) => p.id === activePageId) || project.pages[0];

  const totalNodesCount = countTotalLayoutNodes(activePage.sections);

  return (
    <footer className="h-8 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between px-6 text-[11px] text-zinc-500 select-none shrink-0 font-medium z-40">
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>Visual Builder Active</span>
        </div>

        <span className="text-zinc-300">|</span>

        {/* Project & Page Details */}
        <div className="flex items-center gap-1">
          <span className="font-semibold text-zinc-700">Project:</span>
          <span>{project.name}</span>
        </div>

        <span className="text-zinc-300">|</span>

        {/* Total nodes */}
        <div className="flex items-center gap-1">
          <Box className="h-3 w-3 text-zinc-400" />
          <span>
            {totalNodesCount} {totalNodesCount === 1 ? "Node" : "Layout Nodes"}
          </span>
        </div>
      </div>

      {/* Center active selection report */}
      <div>
        {selectedElementId ? (
          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100 font-bold tracking-wide">
            <Sliders className="h-2.5 w-2.5" />
            <span className="uppercase">Selected Component: {selectedElementId}</span>
          </div>
        ) : selectedSectionId ? (
          <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100 font-bold tracking-wide">
            <Columns className="h-2.5 w-2.5" />
            <span className="uppercase">Selected Section: {selectedSectionId}</span>
          </div>
        ) : (
          <span className="text-zinc-400">Global theme mode active</span>
        )}
      </div>

      {/* Right-aligned keyboard shortcuts */}
      <div className="flex items-center gap-3 text-zinc-400 font-normal">
        <div className="flex items-center gap-1.5">
          <Keyboard className="h-3 w-3" />
          <span>Undo: </span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 font-sans text-[10px] font-semibold border border-zinc-300">
            Ctrl
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 font-sans text-[10px] font-semibold border border-zinc-300">
            Z
          </kbd>
        </div>
        <div className="flex items-center gap-1">
          <span>Redo: </span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 font-sans text-[10px] font-semibold border border-zinc-300">
            Shift
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-600 font-sans text-[10px] font-semibold border border-zinc-300">
            Z
          </kbd>
        </div>
      </div>
    </footer>
  );
};
export default StatusBar;
