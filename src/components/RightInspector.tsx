"use client";

import React from "react";
import { useBuilder } from "@/store/BuilderContext";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { PageElement } from "@/types";
import { Trash2, MousePointerSquareDashed, Layers } from "lucide-react";

// Recursive helper to find the selected element in the tree
function findElementInTree(
  elements: PageElement[],
  id: string
): PageElement | null {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElementInTree(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

export const RightInspector: React.FC = () => {
  const { state, updateElement, deleteElement, selectElement } = useBuilder();
  const { selectedElementId, pageData } = state;

  const selectedElement = selectedElementId
    ? findElementInTree(pageData.elements, selectedElementId)
    : null;

  const registryEntry = selectedElement
    ? componentRegistry[selectedElement.type]
    : null;

  const handlePropChange = (name: string, value: any) => {
    if (selectedElementId) {
      updateElement(selectedElementId, { [name]: value });
    }
  };

  const handleDelete = () => {
    if (selectedElementId) {
      deleteElement(selectedElementId);
    }
  };

  return (
    <aside className="w-72 border-l border-zinc-200 bg-white flex flex-col select-none shrink-0 overflow-y-auto">
      {/* Inspector Header */}
      <div className="p-4 border-b border-zinc-200 bg-zinc-50 shrink-0 flex items-center justify-between">
        <h2 className="text-xs font-bold text-zinc-500 tracking-wider uppercase flex items-center gap-2">
          <Layers className="h-3.5 w-3.5" />
          <span>Properties</span>
        </h2>
        {selectedElement && (
          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            {selectedElement.type}
          </span>
        )}
      </div>

      {/* Main Inspector Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!selectedElement || !registryEntry ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
            <MousePointerSquareDashed className="h-8 w-8 stroke-[1.25] text-zinc-300 mb-2.5 animate-pulse" />
            <p className="text-xs font-semibold text-zinc-500">
              No Element Selected
            </p>
            <p className="text-[10px] text-zinc-400 mt-1 max-w-[180px]">
              Click on any element on the canvas to edit its properties.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Component Name and Details */}
            <div>
              <h3 className="text-sm font-bold text-zinc-800 leading-tight">
                {registryEntry.name} Settings
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5 select-all">
                ID: {selectedElement.id}
              </p>
            </div>

            {/* Dynamic Controls List */}
            <div className="flex flex-col gap-4">
              {registryEntry.controls.map((control) => {
                const value =
                  selectedElement.props[control.name] ?? control.defaultValue;

                return (
                  <div
                    key={control.name}
                    className="flex flex-col gap-1.5 border-b border-zinc-50 pb-3"
                  >
                    <label className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">
                      {control.label}
                    </label>

                    {control.type === "text" && (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handlePropChange(control.name, e.target.value)
                        }
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-800 font-medium transition-all"
                      />
                    )}

                    {control.type === "textarea" && (
                      <textarea
                        rows={4}
                        value={value}
                        onChange={(e) =>
                          handlePropChange(control.name, e.target.value)
                        }
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-800 font-medium resize-y transition-all min-h-[60px]"
                      />
                    )}

                    {control.type === "select" && (
                      <select
                        value={value}
                        onChange={(e) =>
                          handlePropChange(control.name, e.target.value)
                        }
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-800 font-semibold bg-white cursor-pointer transition-all"
                      >
                        {control.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {control.type === "color" && (
                      <div className="flex items-center gap-2">
                        <div className="relative h-7 w-7 rounded-md border border-zinc-200 overflow-hidden cursor-pointer shrink-0 shadow-sm hover:border-zinc-300">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) =>
                              handlePropChange(control.name, e.target.value)
                            }
                            className="absolute -inset-1 h-9 w-9 border-0 cursor-pointer p-0 bg-none"
                          />
                        </div>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handlePropChange(control.name, e.target.value)
                          }
                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-zinc-800 font-mono text-center uppercase"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions Panel */}
            <div className="pt-4 border-t border-zinc-200 mt-2 flex flex-col gap-2.5">
              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-red-200 hover:border-red-300 bg-red-50/20 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-semibold cursor-pointer transition-all duration-150 shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Component</span>
              </button>

              <button
                onClick={() => selectElement(null)}
                className="w-full py-2 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold cursor-pointer transition-all duration-150 text-center"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
