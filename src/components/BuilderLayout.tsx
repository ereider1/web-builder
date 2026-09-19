"use client";

import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useBuilder, cloneElementsWithNewIds, cloneSectionWithNewIds } from "@/store/BuilderContext";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { sectionLibrary } from "@/registry/SectionLibrary";
import { templateLibrary } from "@/registry/TemplateLibrary";
import { builtInThemes } from "@/theme/ThemeManager";
import { ElementType, PageElement, PageSection, Project, Page } from "@/types";
import { TopToolbar } from "./TopToolbar";
import { LeftSidebar } from "./LeftSidebar";
import { Canvas } from "./Canvas";
import { RightInspector } from "./RightInspector";
import { StatusBar } from "./StatusBar";
import { QuickStartWizard } from "./QuickStartWizard";
import { LayoutGrid, ArrowRight, Sparkles, FolderPlus, X, ArrowLeft } from "lucide-react";

export const BuilderLayout: React.FC = () => {
  const {
    state,
    addSection,
    moveSection,
    addElementToSection,
    deleteElement,
    moveElementInSection,
    loadStarter,
  } = useBuilder();

  // Dialog State Triggers
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<"choose" | "quick" | "scratch">("choose");

  // Pointer sensor to allow selection clicks without initiating accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Drag 8px to start dragging, preserving click selections
      },
    })
  );

  const activePage =
    state.project.pages.find((p) => p.id === state.activePageId) || state.project.pages[0];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isPalette = active.data.current?.isPaletteItem;
    const activeType = active.data.current?.type as ElementType;

    const isSectionLibrary = active.data.current?.isSectionLibraryItem;
    const sectionLibraryId = active.data.current?.sectionId;

    // 1. Handle dragging a Section Blueprint from the Library sidebar
    if (isSectionLibrary && sectionLibraryId) {
      const blueprint = sectionLibrary.find((s) => s.id === sectionLibraryId);
      if (blueprint) {
        const cloned = cloneSectionWithNewIds(blueprint as unknown as PageSection);
        
        // Find if dropped over an existing section, get index
        const targetIndex = activePage.sections.findIndex((s) => s.id === overId);
        addSection(cloned, targetIndex >= 0 ? targetIndex : -1);
      }
      return;
    }

    // 2. Handle dragging a Component palette node from the sidebar
    if (isPalette) {
      const newId = `${activeType}-${Math.random().toString(36).substr(2, 9)}`;
      const registryEntry = componentRegistry[activeType];

      const newElement: PageElement = {
        id: newId,
        type: activeType,
        props: { ...registryEntry.defaultProps },
      };

      // Find where we dropped the component
      const targetSectionId = over.data.current?.sectionId as string | undefined;
      const isOverSectionDrop = over.data.current?.isSectionDrop as boolean | undefined;

      if (targetSectionId) {
        // Dropped inside or over elements of a specific section
        const section = activePage.sections.find((s) => s.id === targetSectionId);
        if (section) {
          if (isOverSectionDrop) {
            // Append to the section elements list
            addElementToSection(targetSectionId, newElement);
          } else {
            // Dropped over a specific sibling element in that section, find sibling index
            const siblingIndex = section.elements.findIndex((el) => el.id === overId);
            addElementToSection(targetSectionId, newElement, siblingIndex);
          }
        }
      } else {
        // Fallback: If dropped on root empty canvas, find the first section and append
        if (activePage.sections.length > 0) {
          addElementToSection(activePage.sections[0].id, newElement);
        }
      }
      return;
    }

    // 3. Handle sorting existing items on the Canvas
    if (activeId === overId) return;

    const isSectionDrag = active.data.current?.isSection as boolean | undefined;
    const isComponentDrag = active.data.current?.isComponent as boolean | undefined;

    if (isSectionDrag) {
      // Reordering top-level sections
      const targetIndex = activePage.sections.findIndex((s) => s.id === overId);
      if (targetIndex >= 0) {
        moveSection(activeId, targetIndex);
      }
    } else if (isComponentDrag) {
      // Reordering components inside sections
      const activeSectionId = active.data.current?.sectionId as string;
      const overSectionId = over.data.current?.sectionId as string | undefined;

      if (!activeSectionId || !overSectionId) return;

      if (activeSectionId === overSectionId) {
        // Same section reordering
        const section = activePage.sections.find((s) => s.id === activeSectionId);
        if (section) {
          const targetIndex = section.elements.findIndex((el) => el.id === overId);
          if (targetIndex >= 0) {
            moveElementInSection(activeSectionId, activeId, targetIndex);
          }
        }
      } else {
        // Drag sorting across DIFFERENT sections
        const activeSection = activePage.sections.find((s) => s.id === activeSectionId);
        const overSection = activePage.sections.find((s) => s.id === overSectionId);

        if (activeSection && overSection) {
          const elementToMove = activeSection.elements.find((el) => el.id === activeId);
          if (elementToMove) {
            // Target insertion index
            const targetIndex = overSection.elements.findIndex((el) => el.id === overId);
            
            // Delete from old parent, insert into new parent
            deleteElement(activeId, activeSectionId);
            addElementToSection(overSectionId, elementToMove, targetIndex >= 0 ? targetIndex : -1);
          }
        }
      }
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    const template = templateLibrary.find((t) => t.id === templateId);
    if (!template) return;

    // Load theme
    const theme =
      [...builtInThemes, ...state.customThemes].find(
        (t) => t.id === template.defaultThemeId
      ) || builtInThemes[0];

    // Deep clone and merge sections with recursively fresh unique element IDs
    const assembledSections: PageSection[] = template.sections.map((sec) => {
      return {
        id: `section-${Math.random().toString(36).substr(2, 9)}`,
        type: sec.id,
        name: sec.name,
        settings: JSON.parse(JSON.stringify(sec.settings)),
        elements: cloneElementsWithNewIds(sec.elements),
      };
    });

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: `${template.name} Site`,
      activeThemeId: theme.id,
      pages: [
        {
          id: `page-1`,
          name: "Home",
          slug: "home",
          sections: assembledSections,
        },
      ],
    };

    // Load starter project into store (resets history)
    loadStarter(newProject, theme);
    setIsNewProjectModalOpen(false);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-100 select-none">
        {/* Top Header Controls */}
        <TopToolbar
          onNewProjectClick={() => {
            setCreationMode("choose");
            setIsNewProjectModalOpen(true);
          }}
        />

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

      {/* ==================== PROJECT CREATION MODAL ==================== */}
      {isNewProjectModalOpen && (
        <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center z-[9999] p-6">
          {creationMode === "quick" ? (
            <QuickStartWizard
              onClose={() => setIsNewProjectModalOpen(false)}
              onSuccess={() => setIsNewProjectModalOpen(false)}
            />
          ) : (
            <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-3xl flex flex-col overflow-hidden max-h-[90vh] animate-fade-in">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <FolderPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-zinc-850">Create New Website Project</h2>
                    <p className="text-[10px] text-zinc-400 font-medium">
                      Select how you would like to initiate your web project.
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

              {creationMode === "choose" ? (
                /* Branch Panel selection */
                <div className="p-8 flex flex-col sm:flex-row gap-5 items-stretch justify-center bg-white min-h-[300px]">
                  {/* Quick Start Card */}
                  <div
                    onClick={() => setCreationMode("quick")}
                    className="flex-1 p-6 rounded-xl border-2 border-zinc-200 hover:border-indigo-600 bg-white hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between text-left group"
                  >
                    <div>
                      <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                        <Sparkles className="h-5.5 w-5.5 fill-indigo-500/15 animate-pulse" />
                      </div>
                      <h3 className="text-xs font-black text-zinc-800 tracking-wide">⚡ QUICK START PROTOTYPER</h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mt-2.5 font-normal">
                        Create a fully pre-populated, themed, and personalized website prototype using our guided visual wizard. Enter company data, upload brand logo & imagery, and launch!
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 text-xs text-indigo-600 font-black">
                      <span>Launch Wizard</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  {/* Start Blank Card */}
                  <div
                    onClick={() => setCreationMode("scratch")}
                    className="flex-1 p-6 rounded-xl border-2 border-zinc-200 hover:border-indigo-600 bg-white hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between text-left group"
                  >
                    <div>
                      <div className="h-10 w-10 rounded-lg bg-zinc-50 text-zinc-600 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                        <LayoutGrid className="h-5.5 w-5.5" />
                      </div>
                      <h3 className="text-xs font-black text-zinc-800 tracking-wide">🎨 START FROM SCRATCH</h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mt-2.5 font-normal">
                        Skip the setup details form and immediately load standard empty elements or minimalist mock layout sheets onto your workspace. Customize everything manually inside the editor.
                      </p>
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 text-xs text-indigo-600 font-black">
                      <span>Choose Blank Template</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              ) : (
                /* Scratch Slate Template library chooser */
                <>
                  <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh]">
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
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs font-bold text-zinc-800 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                                {template.name}
                              </h3>
                              <span className="text-[9px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                {template.category}
                              </span>
                            </div>

                            <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed font-normal">
                              {template.description}
                            </p>
                          </div>

                          <div className="mt-5 pt-3.5 border-t border-zinc-50 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Sparkles className="h-3.5 w-3.5 text-yellow-500 fill-yellow-400" />
                              <span>Theme Default: <strong>{themeName}</strong></span>
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

                  <div className="px-6 py-3.5 border-t border-zinc-100 bg-zinc-50 text-[10px] text-zinc-400 flex items-center justify-between shrink-0">
                    <button
                      onClick={() => setCreationMode("choose")}
                      className="text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Choices</span>
                    </button>
                    <span>Create unlimited layouts. Every starting section is fully modular and editable.</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </DndContext>
  );
};
export default BuilderLayout;
