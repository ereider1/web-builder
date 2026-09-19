"use client";

import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { useBuilder, cloneElementsWithNewIds } from "@/store/BuilderContext";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { sectionLibrary } from "@/registry/SectionLibrary";
import { ElementType } from "@/types";
import { Plus, HelpCircle, LayoutGrid, Layers, Columns } from "lucide-react";

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
    const newId = `${type}-${Math.random().toString(36).substr(2, 9)}`;
    const registryEntry = componentRegistry[type];

    const newElement = {
      id: newId,
      type,
      props: { ...registryEntry.defaultProps },
      ...(type === "section" ? { children: [] } : {}),
    };

    if (type === "section") {
      addElement(null, newElement);
      return;
    }

    const selectedId = state.selectedElementId;
    let targetParentId: string | null = null;

    if (selectedId) {
      const isSelectedSection = state.pageData.elements.some(
        (el) => el.id === selectedId && el.type === "section"
      );
      if (isSelectedSection) {
        targetParentId = selectedId;
      } else {
        const parentSection = state.pageData.elements.find((el) =>
          el.children?.some((child) => child.id === selectedId)
        );
        if (parentSection) {
          targetParentId = parentSection.id;
        }
      }
    }

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

// Section Library Draggable Item
interface SectionDraggableItemProps {
  id: string;
  name: string;
  category: string;
}

const SectionLibraryDraggableItem: React.FC<SectionDraggableItemProps> = ({
  id,
  name,
  category,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `section-library-${id}`,
      data: {
        sectionId: id,
        isSectionLibraryItem: true,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
      }
    : undefined;

  const { addElement } = useBuilder();

  const handleInsertSection = () => {
    const sectionBlueprint = sectionLibrary.find((s) => s.id === id);
    if (sectionBlueprint && sectionBlueprint.elements.length > 0) {
      // Clones with recursively fresh IDs
      const clonedElements = cloneElementsWithNewIds(sectionBlueprint.elements);
      // Append section to top-level list
      addElement(null, clonedElements[0]);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative flex items-center justify-between p-3.5 rounded-lg border border-zinc-200 bg-white hover:border-indigo-500 hover:shadow-sm transition-all duration-150 cursor-grab select-none active:cursor-grabbing ${
        isDragging ? "opacity-40 border-indigo-500 bg-indigo-50/10" : ""
      }`}
    >
      <div className="flex flex-col gap-1 pr-6">
        <span className="text-xs font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors duration-150">
          {name}
        </span>
        <span className="text-[10px] text-zinc-400 capitalize">
          {category.toLowerCase()} Block
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleInsertSection();
        }}
        title={`Insert ${name} on Page`}
        className="p-1 rounded text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-150"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export const LeftSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"components" | "sections">("components");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Get list of categories dynamically from sectionLibrary
  const categories = ["ALL", "HERO", "ABOUT", "SERVICES", "SOCIAL", "CONVERSION", "FOOTER"];

  const filteredSections =
    categoryFilter === "ALL"
      ? sectionLibrary
      : sectionLibrary.filter((s) => s.category === categoryFilter);

  return (
    <aside className="w-64 border-r border-zinc-200 bg-zinc-50 flex flex-col select-none shrink-0">
      {/* Sub tabs header */}
      <div className="flex border-b border-zinc-200 bg-white p-1">
        <button
          onClick={() => setActiveTab("components")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${
            activeTab === "components"
              ? "bg-zinc-100 text-zinc-800"
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Components</span>
        </button>
        <button
          onClick={() => setActiveTab("sections")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${
            activeTab === "sections"
              ? "bg-zinc-100 text-zinc-800"
              : "text-zinc-400 hover:text-zinc-600"
          }`}
        >
          <Columns className="h-3.5 w-3.5" />
          <span>Section Library</span>
        </button>
      </div>

      {activeTab === "components" ? (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-zinc-200 bg-white">
            <h2 className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
              Core Components
            </h2>
            <p className="text-[10px] text-zinc-400 mt-1">
              Drag elements onto the canvas or click "+" to insert inside active zones.
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
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 border-b border-zinc-200 bg-white">
            <h2 className="text-xs font-bold text-zinc-500 tracking-wider uppercase">
              Pre-designed Sections
            </h2>
            <p className="text-[10px] text-zinc-400 mt-1">
              Complete pre-composed sections. Click "+" to append sections recursively to the canvas.
            </p>

            {/* Category horizontal filters scrolling bar */}
            <div className="mt-3 flex gap-1 overflow-x-auto pb-1 scrollbar-none scrollbar-thin">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 uppercase tracking-wide transition-all ${
                    categoryFilter === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {filteredSections.map((section) => (
              <SectionLibraryDraggableItem
                key={section.id}
                id={section.id}
                name={section.name}
                category={section.category}
              />
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t border-zinc-200 bg-white text-[10px] text-zinc-400 text-center">
        Tip: Themes apply automatically to inserted layout sections!
      </div>
    </aside>
  );
};
export default LeftSidebar;
