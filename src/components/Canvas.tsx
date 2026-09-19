"use client";

import React, { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBuilder } from "@/store/BuilderContext";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { PageElement } from "@/types";
import { CanvasElementWrapper } from "./CanvasElementWrapper";
import { ArrowUpRight, Box, HelpCircle } from "lucide-react";

// Helper Droppable component for Section children
interface SectionDroppableContainerProps {
  section: PageElement;
  childIds: string[];
}

const SectionDroppableContainer: React.FC<SectionDroppableContainerProps> = ({
  section,
  childIds,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: section.id,
  });

  const {
    backgroundColor = "#ffffff",
    paddingTop = "60px",
    paddingBottom = "60px",
    containerWidth = "max-w-5xl",
    flexDirection = "col",
    gap = "16px",
  } = section.props;

  const widthClass =
    containerWidth === "max-w-3xl"
      ? "max-w-3xl"
      : containerWidth === "max-w-5xl"
      ? "max-w-5xl"
      : containerWidth === "max-w-7xl"
      ? "max-w-7xl"
      : "w-full";

  const flexClass = flexDirection === "row" ? "flex flex-row" : "flex flex-col";

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor,
        paddingTop,
        paddingBottom,
      }}
      className={`w-full transition-all duration-200 border-2 ${
        isOver ? "border-dashed border-blue-500 bg-blue-50/10" : "border-transparent"
      }`}
    >
      <div
        style={{ gap }}
        className={`mx-auto px-6 w-full ${widthClass} ${flexClass} min-h-[100px] relative`}
      >
        {section.children && section.children.length > 0 ? (
          <SortableContext
            items={childIds}
            strategy={verticalListSortingStrategy}
          >
            {section.children.map((child) => (
              <CanvasElementWrapper key={child.id} element={child} />
            ))}
          </SortableContext>
        ) : (
          <div className="flex-1 min-h-[80px] flex items-center justify-center text-center p-4 border border-dashed border-zinc-200 rounded-lg text-zinc-400 bg-zinc-50/30">
            <span className="text-[11px] font-medium">
              Section Container: Drop content elements (Heading, Paragraph, Button, Image) here
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const Canvas: React.FC = () => {
  const { state, selectElement } = useBuilder();
  const { pageData, previewMode } = state;

  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch for dnd-kit dynamic states
  useEffect(() => {
    setMounted(true);
  }, []);

  // Main canvas-level droppable (allows dropping sections or basic content)
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-container",
  });

  if (!mounted) {
    return (
      <div className="flex-1 bg-zinc-100 flex items-center justify-center">
        <span className="text-xs text-zinc-400">Loading editor canvas...</span>
      </div>
    );
  }

  // Map preview modes to simulated width classes
  const widthClasses = {
    desktop: "w-full max-w-[1200px]",
    tablet: "w-[768px]",
    mobile: "w-[390px]",
  };

  const sectionIds = pageData.elements.map((el) => el.id);

  return (
    <div
      onClick={() => selectElement(null)} // Clear selection on canvas background click
      className="flex-1 bg-zinc-100 p-8 overflow-auto flex justify-center items-start select-none"
    >
      <div
        ref={setNodeRef}
        className={`bg-white min-h-[600px] shadow-lg rounded-xl border border-zinc-200/80 transition-all duration-300 overflow-hidden flex flex-col relative ${
          widthClasses[previewMode]
        } ${isOver ? "ring-2 ring-blue-500/50 ring-offset-4" : ""}`}
      >
        {/* Device preview border overlay header (looks like a neat browser bar) */}
        <div className="h-10 bg-zinc-50 border-b border-zinc-200/80 px-4 flex items-center justify-between text-xs text-zinc-400 select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
          </div>
          <div className="bg-zinc-200/60 px-8 py-0.5 rounded text-[10px] text-zinc-500 font-mono flex items-center gap-1">
            <span>local-preview://{pageData.name.toLowerCase().replace(/\s+/g, "-")}.html</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
            <span>{previewMode === "desktop" ? "1200px" : previewMode === "tablet" ? "768px" : "390px"}</span>
          </div>
        </div>

        {/* Live Canvas Content */}
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          {pageData.elements.length === 0 ? (
            <div
              id="canvas-empty"
              className="flex-1 flex flex-col items-center justify-center p-12 text-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-zinc-50 text-zinc-400 flex items-center justify-center border border-zinc-150 mb-4 shadow-inner">
                <Box className="h-6 w-6 stroke-[1.25]" />
              </div>
              <h3 className="text-sm font-bold text-zinc-700">Your Canvas is Empty</h3>
              <p className="text-xs text-zinc-400 max-w-[280px] mt-1.5 leading-relaxed">
                Start by dragging a <strong className="text-zinc-600 font-semibold">Section</strong> container from the palette on the left here to build your page grid.
              </p>
              <div className="mt-4 flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                <span>See component registry tips</span>
                <ArrowUpRight className="h-3 w-3" />
              </div>
            </div>
          ) : (
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex-1 flex flex-col">
                {pageData.elements.map((element) => {
                  if (element.type === "section") {
                    const childIds =
                      element.children?.map((child) => child.id) || [];
                    return (
                      <SectionDroppableContainer
                        key={element.id}
                        section={element}
                        childIds={childIds}
                      />
                    );
                  }
                  // Handle case of orphaned non-section elements on canvas
                  return (
                    <CanvasElementWrapper key={element.id} element={element} />
                  );
                })}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
};
