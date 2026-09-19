"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useBuilder } from "@/store/BuilderContext";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { PageElement } from "@/types";
import { Trash2, GripVertical } from "lucide-react";

interface CanvasElementWrapperProps {
  element: PageElement;
  children?: React.ReactNode;
}

export const CanvasElementWrapper: React.FC<CanvasElementWrapperProps> = ({
  element,
  children,
}) => {
  const { state, selectElement, deleteElement } = useBuilder();
  const isSelected = state.selectedElementId === element.id;

  // Set up sortable for elements on the canvas
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
    data: {
      id: element.id,
      type: element.type,
      isPaletteItem: false,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubble-up selecting multiple layers
    selectElement(element.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const registryEntry = componentRegistry[element.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleSelect}
      className={`group relative transition-all duration-150 rounded-lg ${
        isSelected
          ? "ring-2 ring-blue-500 ring-offset-2 shadow-sm"
          : "hover:ring-1 hover:ring-zinc-300 hover:ring-offset-1"
      } ${
        element.type === "section"
          ? "my-1"
          : "p-2.5 bg-white/50 border border-zinc-100 rounded-md"
      }`}
    >
      {/* Element Title/Delete Overlay */}
      <div
        className={`absolute -top-3.5 left-2 z-50 flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 transition-opacity duration-150 ${
          isSelected ? "opacity-100" : "group-hover:opacity-75"
        }`}
      >
        {/* Grab Handle for Dragging */}
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing p-0.5 hover:bg-blue-700 rounded transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="h-2.5 w-2.5" />
        </div>
        <span className="capitalize">{registryEntry.name}</span>
        {isSelected && (
          <button
            onClick={handleDelete}
            title="Delete element"
            className="ml-1.5 p-0.5 hover:bg-blue-700 rounded transition-colors cursor-pointer"
          >
            <Trash2 className="h-2.5 w-2.5 text-blue-200 hover:text-white" />
          </button>
        )}
      </div>

      {/* Render Actual Component */}
      <div className="relative">
        {children ? children : React.createElement(registryEntry.component, {
          element,
          isSelected,
        })}
      </div>
    </div>
  );
};
