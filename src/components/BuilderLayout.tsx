"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useBuilder, cloneElementsWithNewIds } from "@/store/BuilderContext";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { sectionLibrary } from "@/registry/SectionLibrary";
import { templateLibrary } from "@/registry/TemplateLibrary";
import { builtInThemes } from "@/theme/ThemeManager";
import { ElementType, PageElement, PageData } from "@/types";
import { TopToolbar } from "./TopToolbar";
import { LeftSidebar } from "./LeftSidebar";
import { Canvas } from "./Canvas";
import { RightInspector } from "./RightInspector";
import { StatusBar } from "./StatusBar";
import { LayoutGrid, ArrowRight, Sparkles, FolderPlus, X } from "lucide-react";

// Helper recursively finding parent of a child element
function findParentSection(
  elements: PageElement[],
  childId: string
): PageElement | null {
  for (const el of elements) {
    if (el.children?.some((child) => child.id === childId)) {
      return el;
    }
  }
  return null;
}

export const BuilderLayout: React.FC = () => {
  const { state, addElement, moveElement, loadStarter } = useBuilder();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Pointer sensor to allow selection clicks without initiating accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag 8px to start dragging, preserving click selections
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isPalette = active.data.current?.isPaletteItem;
    const activeType = active.data.current?.type as ElementType;

    // Handle dropping a pre-made Section Blueprint from the Library
    const isSectionLibrary = active.data.current?.isSectionLibraryItem;
    const sectionLibraryId = active.data.current?.sectionId;

    if (isSectionLibrary && sectionLibraryId) {
      const blueprint = sectionLibrary.find((s) => s.id === sectionLibraryId);
      if (blueprint && blueprint.elements.length > 0) {
        const clonedElements = cloneElementsWithNewIds(blueprint.elements);
        // Sections are always top-level
        // Find if dropped over a specific section and get its index
        const targetIndex = state.pageData.elements.findIndex(
          (el) => el.id === overId
        );
        addElement(null, clonedElements[0], targetIndex >= 0 ? targetIndex : -1);
      }
      return;
    }

    if (isPalette) {
      // 1. Create the new element
      const newId = `${activeType}-${Math.random().toString(36).substr(2, 9)}`;
      const registryEntry = componentRegistry[activeType];

      const newElement: PageElement = {
        id: newId,
        type: activeType,
        props: { ...registryEntry.defaultProps },
        ...(activeType === "section" ? { children: [] } : {}),
      };

      // 2. Determine target placement
      if (activeType === "section") {
        const targetIndex = state.pageData.elements.findIndex(
          (el) => el.id === overId
        );
        addElement(null, newElement, targetIndex >= 0 ? targetIndex : -1);
      } else {
        const isOverSection = state.pageData.elements.some(
          (el) => el.id === overId && el.type === "section"
        );

        if (isOverSection) {
          addElement(overId, newElement);
        } else {
          const parentSection = findParentSection(
            state.pageData.elements,
            overId
          );

          if (parentSection) {
            const siblingIndex =
              parentSection.children?.findIndex((c) => childIdAndMatch(c.id, overId)) ?? -1;
            addElement(parentSection.id, newElement, siblingIndex);
          } else {
            const firstSection = state.pageData.elements.find(
              (el) => el.type === "section"
            );
            if (firstSection) {
              addElement(firstSection.id, newElement);
            } else {
              addElement(null, newElement);
            }
          }
        }
      }
    } else {
      // Reordering existing elements on the canvas
      if (activeId === overId) return;

      const activeParent = findParentSection(state.pageData.elements, activeId);
      const overParent = findParentSection(state.pageData.elements, overId);

      if (!activeParent && !overParent) {
        const targetIndex = state.pageData.elements.findIndex(
          (el) => el.id === overId
        );
        moveElement(activeId, null, targetIndex);
      } else {
        const targetParentId = overParent ? overParent.id : null;
        const siblingList = overParent
          ? overParent.children || []
          : state.pageData.elements;

        const targetIndex = siblingList.findIndex((el) => el.id === overId);
        moveElement(activeId, targetParentId, targetIndex);
      }
    }
  };

  const childIdAndMatch = (id: string, overId: string) => id === overId;

  const handleSelectTemplate = (templateId: string) => {
    const template = templateLibrary.find((t) => t.id === templateId);
    if (!template) return;

    // Load default theme
    const theme =
      [...builtInThemes, ...state.customThemes].find(
        (t) => t.id === template.defaultThemeId
      ) || builtInThemes[0];

    // Deep clone and merge sections with new unique element IDs recursively
    const assembledElements: PageElement[] = [];
    template.sections.forEach((sec) => {
      if (sec.elements.length > 0) {
        const cloned = cloneElementsWithNewIds(sec.elements);
        assembledElements.push(cloned[0]); // append the root Section container
      }
    });

    const newPageData: PageData = {
      id: `page-${Date.now()}`,
      name: `${template.name} Page`,
      themeId: theme.id,
      elements: assembledElements,
    };

    // Load assembled starter elements into global store
    loadStarter(newPageData, theme);
    setIsNewProjectModalOpen(false);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-100 select-none">
        {/* Top Header Controls */}
        <TopToolbar onNewProjectClick={() => setIsNewProjectModalOpen(true)} />

        {/* Workspace core */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left panel palette */}
          <LeftSidebar />

          {/* Center visual canvas preview */}
          <Canvas />

          {/* Right inspector config panel */}
          <RightInspector />
        </div>

        {/* Footer info bar */}
        <StatusBar />
      </div>

      {/* ==================== STARTER TEMPLATE SELECTION MODAL ==================== */}
      {isNewProjectModalOpen && (
        <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center z-[9999] animate-fade-in p-6">
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <FolderPlus className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-850">Create New Website</h2>
                  <p className="text-[10px] text-zinc-400 font-medium">
                    Choose a starter template or begin with a blank slate.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Grid of Templates */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {templateLibrary.map((template) => {
                const isBlank = template.id === "blank-page";
                const themeName =
                  builtInThemes.find((t) => t.id === template.defaultThemeId)?.name ||
                  "Minimal";

                return (
                  <div
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`group relative flex flex-col justify-between p-5 rounded-xl border border-zinc-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all duration-200 bg-white ${
                      isBlank ? "bg-zinc-50/20 border-dashed" : ""
                    }`}
                  >
                    <div>
                      {/* Name / Badge */}
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-zinc-800 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                          {template.name}
                        </h3>
                        <span className="text-[9px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                          {template.category}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed font-normal">
                        {template.description}
                      </p>
                    </div>

                    {/* Metadata specs */}
                    <div className="mt-5 pt-3.5 border-t border-zinc-50 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-yellow-500 fill-yellow-400" />
                        <span>Theme: <strong>{themeName}</strong></span>
                      </span>
                      <span className="flex items-center gap-1 text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Select Starter</span>
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-zinc-100 bg-zinc-50 text-[10px] text-zinc-400 text-center">
              Create unlimited layouts. Every starting section is fully modular, editable, and reorderable.
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
};
export default BuilderLayout;
