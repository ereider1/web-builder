"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { useBuilder } from "@/store/BuilderContext";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { ElementType } from "@/types";
import { Plus } from "lucide-react";

interface SidebarItemProps {
  type: ElementType;
  name: string;
  icon: React.ComponentType<any>;
}

const SidebarDraggableItem: React.FC<SidebarItemProps> = ({
  type,
  name,
  icon: Icon,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `palette-${type}`,
      data: {
        type,
        isPaletteItem: true,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
      }
    : undefined;

  const { addElement, state } = useBuilder();

  const handleClick = () => {
    // Generate a unique ID
    const newId = `${type}-${Math.random().toString(36).substr(2, 9)}`;
    const registryEntry = componentRegistry[type];

    const newElement = {
      id: newId,
      type,
      props: { ...registryEntry.defaultProps },
      ...(type === "section" ? { children: [] } : {}),
    };

    // If section, always add at the top level
    if (type === "section") {
      addElement(null, newElement);
      return;
    }

    // If an element is selected and it is a section, add inside it.
    // Otherwise, add to the first section found, or top level.
    const selectedId = state.selectedElementId;
    let targetParentId: string | null = null;

    if (selectedId) {
      const isSelectedSection = state.pageData.elements.some(
        (el) => el.id === selectedId && el.type === "section"
      );
      if (isSelectedSection) {
        targetParentId = selectedId;
      } else {
        // Find parent section of the selected element
        const parentSection = state.pageData.elements.find((el) =>
          el.children?.some((child) => child.id === selectedId)
        );
        if (parentSection) {
          targetParentId = parentSection.id;
        }
      }
    }

    // If we didn't find any target section, find the first section in the elements list
    if (!targetParentId) {
      const firstSection = state.pageData.elements.find(
        (el) => el.type === "section"
      );
      if (firstSection) {
        targetParentId = firstSection.id;
      }
    }

    addElement(targetParentId, newElement);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative flex items-center justify-between p-3 rounded-lg border border-zinc-200 bg-white hover:border-blue-500 hover:shadow-sm transition-all duration-150 cursor-grab select-none active:cursor-grabbing ${
        isDragging ? "opacity-40 border-blue-500 bg-blue-50/10" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded bg-zinc-50 text-zinc-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-150">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-xs font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors duration-150">
          {name}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        title={`Add ${name} to canvas`}
        className="p-1 rounded text-zinc-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-150"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export const LeftSidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-zinc-200 bg-zinc-50 flex flex-col select-none shrink-0">
      <div className="p-4 border-b border-zinc-200 bg-white">
        <h2 className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
          Component Palette
        </h2>
        <p className="text-[10px] text-zinc-400 mt-1">
          Drag elements onto the canvas or click the "+" button to insert.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Layout containers */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
            Layout
          </h3>
          <div className="flex flex-col gap-2">
            <SidebarDraggableItem
              type="section"
              name={componentRegistry.section.name}
              icon={componentRegistry.section.icon}
            />
          </div>
        </div>

        {/* Basic content elements */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
            Content Elements
          </h3>
          <div className="flex flex-col gap-2">
            <SidebarDraggableItem
              type="heading"
              name={componentRegistry.heading.name}
              icon={componentRegistry.heading.icon}
            />
            <SidebarDraggableItem
              type="text"
              name={componentRegistry.text.name}
              icon={componentRegistry.text.icon}
            />
            <SidebarDraggableItem
              type="button"
              name={componentRegistry.button.name}
              icon={componentRegistry.button.icon}
            />
            <SidebarDraggableItem
              type="image"
              name={componentRegistry.image.name}
              icon={componentRegistry.image.icon}
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-200 bg-white text-[10px] text-zinc-400 text-center">
        Tip: Nest paragraphs, buttons and images inside Sections.
      </div>
    </aside>
  );
};
