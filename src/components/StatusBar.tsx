"use client";

import React from "react";
import { useBuilder } from "@/store/BuilderContext";
import { PageElement } from "@/types";
import { Check, Keyboard, Sliders, Box } from "lucide-react";

// Count total elements in the page data recursively
function countElements(elements: PageElement[]): number {
  let count = elements.length;
  for (const el of elements) {
    if (el.children) {
      count += countElements(el.children);
    }
  }
  return count;
}

export const StatusBar: React.FC = () => {
  const { state } = useBuilder();
  const { selectedElementId, pageData } = state;

  const totalElementsCount = countElements(pageData.elements);

  return (
    <footer className="h-8 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between px-6 text-[11px] text-zinc-500 select-none shrink-0 font-medium">
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span>Editor Ready</span>
        </div>

        <span className="text-zinc-300">|</span>

        {/* Project & Page Details */}
        <div className="flex items-center gap-1">
          <span className="font-semibold text-zinc-700">Project:</span>
          <span>{pageData.name}</span>
        </div>

        <span className="text-zinc-300">|</span>

        {/* Total nodes */}
        <div className="flex items-center gap-1">
          <Box className="h-3 w-3 text-zinc-400" />
          <span>
            {totalElementsCount} {totalElementsCount === 1 ? "Element" : "Elements"}
          </span>
        </div>
      </div>

      {/* Center helpful selection info */}
      <div>
        {selectedElementId ? (
          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100 font-bold tracking-wide">
            <Sliders className="h-2.5 w-2.5" />
            <span className="uppercase">Selected: {selectedElementId}</span>
          </div>
        ) : (
          <span className="text-zinc-400">No element selected</span>
        )}
      </div>

      {/* Right-aligned keyboard shortcut help */}
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
