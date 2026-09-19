"use client";

import React, { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBuilder } from "@/store/BuilderContext";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { PageSection, PageElement } from "@/types";
import { CanvasElementWrapper } from "./CanvasElementWrapper";
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Box,
  GripVertical,
  Layers,
} from "lucide-react";

// ==================== INDIVIDUAL FIRST-CLASS SECTION WRAPPER ====================
interface CanvasSectionWrapperProps {
  section: PageSection;
  index: number;
  totalSections: number;
}

const CanvasSectionWrapper: React.FC<CanvasSectionWrapperProps> = ({
  section,
  index,
  totalSections,
}) => {
  const {
    state,
    selectSection,
    deleteSection,
    duplicateSection,
    moveSection,
  } = useBuilder();

  const isSelected = state.selectedSectionId === section.id && state.selectedElementId === null;
  const isAnyChildSelected = state.selectedSectionId === section.id && state.selectedElementId !== null;

  // Set up sortable for first-class sections
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      sectionId: section.id,
      isSection: true,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const handleSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop bubble so we don't clear selections
    selectSection(section.id);
  };

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      moveSection(section.id, index - 1);
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index < totalSections - 1) {
      moveSection(section.id, index + 1);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateSection(section.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSection(section.id);
  };

  // Section styling settings (background, padding, gaps, margins)
  const backgroundColor = section.settings.backgroundColor ?? "var(--theme-bg)";
  const paddingTop = section.settings.paddingTop ?? "var(--theme-section-spacing)";
  const paddingBottom = section.settings.paddingBottom ?? "var(--theme-section-spacing)";
  const containerWidth = section.settings.containerWidth ?? "max-w-5xl";
  const flexDirection = section.settings.flexDirection ?? "col";
  const gap = section.settings.gap ?? "16px";

  const widthClass =
    containerWidth === "max-w-3xl"
      ? "max-w-3xl"
      : containerWidth === "max-w-5xl"
      ? "max-w-5xl"
      : containerWidth === "max-w-7xl"
      ? "max-w-7xl"
      : "w-full";

  const flexClass = flexDirection === "row" ? "flex flex-row" : "flex flex-col";

  // Droppable hook for adding components to this specific section
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: section.id,
    data: {
      sectionId: section.id,
      isSectionDrop: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleSectionClick}
      className={`group relative border-2 transition-all duration-200 ${
        isSelected
          ? "border-indigo-600 ring-2 ring-indigo-500/10"
          : isAnyChildSelected
          ? "border-zinc-200"
          : "border-transparent hover:border-indigo-300"
      } ${isOver ? "bg-indigo-50/10 border-dashed border-indigo-500" : ""}`}
    >
      {/* Section Hover Overlay Controls */}
      <div
        className={`absolute -top-4.5 left-4 z-40 flex items-center gap-1.5 bg-indigo-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-150 select-none ${
          isSelected ? "opacity-100" : ""
        }`}
      >
        {/* Grip handle */}
        <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-indigo-800 rounded">
          <GripVertical className="h-3 w-3" />
        </div>
        <span className="capitalize text-[9px] tracking-wide">Section: {section.name}</span>

        <span className="text-indigo-400 mx-0.5">|</span>

        {/* Move up */}
        <button
          onClick={handleMoveUp}
          disabled={index === 0}
          className={`p-0.5 rounded transition-colors ${
            index === 0 ? "text-indigo-500/50 cursor-not-allowed" : "hover:bg-indigo-800 text-indigo-100 cursor-pointer"
          }`}
          title="Move Section Up"
        >
          <ArrowUp className="h-3 w-3" />
        </button>

        {/* Move down */}
        <button
          onClick={handleMoveDown}
          disabled={index === totalSections - 1}
          className={`p-0.5 rounded transition-colors ${
            index === totalSections - 1
              ? "text-indigo-500/50 cursor-not-allowed"
              : "hover:bg-indigo-800 text-indigo-100 cursor-pointer"
          }`}
          title="Move Section Down"
        >
          <ArrowDown className="h-3 w-3" />
        </button>

        {/* Duplicate */}
        <button
          onClick={handleDuplicate}
          className="p-0.5 hover:bg-indigo-800 text-indigo-100 rounded transition-colors cursor-pointer"
          title="Duplicate Section"
        >
          <Copy className="h-3 w-3" />
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="p-0.5 hover:bg-indigo-800 text-indigo-100 hover:text-red-300 rounded transition-colors cursor-pointer"
          title="Delete Section"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

      {/* Actual Render Container */}
      <div
        ref={setDropRef}
        style={{
          backgroundColor,
          paddingTop,
          paddingBottom,
        }}
        className="w-full"
      >
        <div
          style={{ gap }}
          className={`mx-auto px-6 w-full ${widthClass} ${flexClass} min-h-[90px] relative`}
        >
          {section.elements && section.elements.length > 0 ? (
            <SortableContext
              items={section.elements.map((el) => el.id)}
              strategy={verticalListSortingStrategy}
            >
              {section.elements.map((child) => (
                <CanvasElementWrapper
                  key={child.id}
                  element={child}
                  sectionId={section.id}
                />
              ))}
            </SortableContext>
          ) : (
            <div className="flex-1 min-h-[70px] flex items-center justify-center text-center p-4 border border-dashed border-zinc-200 rounded-xl text-zinc-400 bg-zinc-50/20">
              <span className="text-[11px] font-medium">
                Empty Section. Drag & Drop components (Heading, Text, Button, Image) from the Sidebar palette here.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== THE MAIN CANVAS AREA ====================
export const Canvas: React.FC = () => {
  const { state, selectSection, selectElement } = useBuilder();
  const { project, activePageId, previewMode, activeTheme } = state;

  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Root canvas-level droppable for adding sections
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-container",
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Clear selections when clicking canvas background
    selectSection(null);
    selectElement(null, null);
  };

  if (!mounted) {
    return (
      <div className="flex-1 bg-zinc-100 flex items-center justify-center">
        <span className="text-xs text-zinc-400">Loading website preview...</span>
      </div>
    );
  }

  const activePage =
    project.pages.find((p) => p.id === activePageId) || project.pages[0];

  const sectionIds = activePage.sections.map((s) => s.id);

  // Map simulated width classes
  const widthClasses = {
    desktop: "w-full max-w-[1200px]",
    tablet: "w-[768px]",
    mobile: "w-[390px]",
  };

  return (
    <div
      onClick={handleCanvasClick}
      className="flex-1 bg-zinc-100 p-8 overflow-auto flex justify-center items-start select-none"
    >
      {/* Inject theme design tokens scoped to #canvas-root */}
      <style>{`
        #canvas-root {
          --theme-bg: ${activeTheme.colors.background};
          --theme-foreground: ${activeTheme.colors.foreground};
          --theme-primary: ${activeTheme.colors.primary};
          --theme-secondary: ${activeTheme.colors.secondary};
          --theme-muted: ${activeTheme.colors.muted};
          --theme-border: ${activeTheme.colors.border};
          --theme-accent: ${activeTheme.colors.accent};
          --theme-heading-font: ${activeTheme.typography.headingFont};
          --theme-body-font: ${activeTheme.typography.bodyFont};
          --theme-heading-weight: ${activeTheme.typography.headingWeight};
          --theme-body-weight: ${activeTheme.typography.bodyWeight};
          --radius-sm: ${activeTheme.radius.sm};
          --radius-md: ${activeTheme.radius.md};
          --radius-lg: ${activeTheme.radius.lg};
          --theme-section-spacing: ${activeTheme.spacing.section};
        }
      `}</style>

      <div
        ref={setNodeRef}
        className={`bg-white min-h-[650px] shadow-lg rounded-2xl border border-zinc-200/85 transition-all duration-300 overflow-hidden flex flex-col relative ${
          widthClasses[previewMode]
        } ${isOver ? "ring-2 ring-indigo-500/40 ring-offset-4" : ""}`}
      >
        {/* Simulated Browser Heading Bar */}
        <div className="h-10 bg-zinc-50 border-b border-zinc-200/85 px-4 flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
          </div>
          <div className="bg-zinc-200/50 px-8 py-0.5 rounded text-[10px] text-zinc-500 font-mono flex items-center gap-1">
            <span>local-preview://{activePage.name.toLowerCase().replace(/\s+/g, "-")}.html</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
            <span>{previewMode === "desktop" ? "1200px" : previewMode === "tablet" ? "768px" : "390px"}</span>
          </div>
        </div>

        {/* Live Rendering Canvas */}
        <div
          id="canvas-root"
          className="flex-1 flex flex-col min-h-0 bg-white transition-colors duration-300"
          style={{ backgroundColor: "var(--theme-bg)" }}
        >
          {activePage.sections.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center my-auto">
              <div className="h-12 w-12 rounded-2xl bg-zinc-50 text-zinc-400 flex items-center justify-center border border-zinc-150 mb-4 shadow-inner">
                <Box className="h-6 w-6 stroke-[1.25]" />
              </div>
              <h3 className="text-sm font-bold text-zinc-700">Your Canvas is Empty Slates</h3>
              <p className="text-xs text-zinc-400 max-w-[280px] mt-1.5 leading-relaxed">
                Click on the <strong>Section Library</strong> tab in the sidebar to add layout containers, or choose a Starter Template from the <strong>New Website</strong> menu.
              </p>
            </div>
          ) : (
            <SortableContext
              items={sectionIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex-1 flex flex-col">
                {activePage.sections.map((section, idx) => (
                  <CanvasSectionWrapper
                    key={section.id}
                    section={section}
                    index={idx}
                    totalSections={activePage.sections.length}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </div>
    </div>
  );
};
export default Canvas;
