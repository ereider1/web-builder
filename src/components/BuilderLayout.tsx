"use client";

import React from "react";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useBuilder } from "@/store/BuilderContext";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { ElementType, PageElement } from "@/types";
import { TopToolbar } from "./TopToolbar";
import { LeftSidebar } from "./LeftSidebar";
import { Canvas } from "./Canvas";
import { RightInspector } from "./RightInspector";
import { StatusBar } from "./StatusBar";

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
  const { state, addElement, moveElement } = useBuilder();

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
        // Sections can only be top-level elements
        // Find if dropped over a specific section and get its index
        const targetIndex = state.pageData.elements.findIndex(
          (el) => el.id === overId
        );
        addElement(null, newElement, targetIndex >= 0 ? targetIndex : -1);
      } else {
        // Basic element (Heading, Text, Button, Image)
        // Check if dropped directly over a section container
        const isOverSection = state.pageData.elements.some(
          (el) => el.id === overId && el.type === "section"
        );

        if (isOverSection) {
          // Add inside section at the end
          addElement(overId, newElement);
        } else {
          // Dropped over some child element inside a section
          const parentSection = findParentSection(
            state.pageData.elements,
            overId
          );

          if (parentSection) {
            const siblingIndex =
              parentSection.children?.findIndex((c) => childIdAndMatch(c.id, overId)) ?? -1;
            addElement(parentSection.id, newElement, siblingIndex);
          } else {
            // No parent section found, check if there's any section we can drop it in
            const firstSection = state.pageData.elements.find(
              (el) => el.type === "section"
            );
            if (firstSection) {
              addElement(firstSection.id, newElement);
            } else {
              // Add to top-level if there are no sections
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

      // Are we reordering Sections?
      if (!activeParent && !overParent) {
        // Both are top level (sections)
        const targetIndex = state.pageData.elements.findIndex(
          (el) => el.id === overId
        );
        moveElement(activeId, null, targetIndex);
      } else {
        // Reordering content elements inside section(s)
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

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-100 select-none">
        {/* Top Header Controls */}
        <TopToolbar />

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
    </DndContext>
  );
};
