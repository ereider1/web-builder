"use client";

import React, { useState } from "react";
import { useBuilder } from "@/store/BuilderContext";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { builtInThemes } from "@/theme/ThemeManager";
import { PageElement, PageSection, Theme } from "@/types";
import {
  Trash2,
  Sliders,
  Palette,
  Type,
  Maximize,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  Check,
  Columns,
  Sparkles,
} from "lucide-react";

// Helper to find a component inside the page's sections
function findElementInSections(
  sections: PageSection[],
  id: string
): PageElement | null {
  for (const sec of sections) {
    for (const el of sec.elements) {
      if (el.id === id) return el;
      if (el.children) {
        // Search inside nested grandchildren if any
        for (const child of el.children) {
          if (child.id === id) return child;
        }
      }
    }
  }
  return null;
}

export const RightInspector: React.FC = () => {
  const {
    state,
    updateElement,
    deleteElement,
    selectElement,
    selectSection,
    deleteSection,
    duplicateSection,
    updateSectionSettings,
    applyTheme,
    updateThemeProperty,
    saveAsCustomTheme,
  } = useBuilder();

  const {
    selectedElementId,
    selectedSectionId,
    activePageId,
    project,
    activeTheme,
    customThemes,
  } = state;

  const [activeBreakpointTab, setActiveBreakpointTab] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  const [customThemeName, setCustomThemeName] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const activePage =
    project.pages.find((p) => p.id === activePageId) || project.pages[0];

  const selectedElement = selectedElementId
    ? findElementInSections(activePage.sections, selectedElementId)
    : null;

  const selectedSection = selectedSectionId
    ? activePage.sections.find((s) => s.id === selectedSectionId)
    : null;

  const registryEntry = selectedElement
    ? componentRegistry[selectedElement.type]
    : null;

  const handlePropChange = (name: string, value: any, isResponsive = false) => {
    if (!selectedElementId || !selectedElement) return;

    if (isResponsive) {
      const currentVal = selectedElement.props[name];
      let nextVal: any;

      if (
        typeof currentVal === "object" &&
        currentVal !== null &&
        ("desktop" in currentVal || "tablet" in currentVal || "mobile" in currentVal)
      ) {
        nextVal = {
          ...currentVal,
          [activeBreakpointTab]: value,
        };
      } else {
        nextVal = {
          desktop: currentVal ?? "",
          tablet: "",
          mobile: "",
          [activeBreakpointTab]: value,
        };
      }
      updateElement(selectedElementId, { [name]: nextVal });
    } else {
      updateElement(selectedElementId, { [name]: value });
    }
  };

  const handleSectionSettingChange = (name: string, value: any, isResponsive = false) => {
    if (!selectedSectionId || !selectedSection) return;

    if (isResponsive) {
      const currentVal = selectedSection.settings[name];
      let nextVal: any;

      if (
        typeof currentVal === "object" &&
        currentVal !== null &&
        ("desktop" in currentVal || "tablet" in currentVal || "mobile" in currentVal)
      ) {
        nextVal = {
          ...currentVal,
          [activeBreakpointTab]: value,
        };
      } else {
        nextVal = {
          desktop: currentVal ?? "",
          tablet: "",
          mobile: "",
          [activeBreakpointTab]: value,
        };
      }
      updateSectionSettings(selectedSectionId, { [name]: nextVal });
    } else {
      updateSectionSettings(selectedSectionId, { [name]: value });
    }
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (customThemeName.trim() === "") return;
    saveAsCustomTheme(customThemeName.trim());
    setCustomThemeName("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleComponentDelete = () => {
    if (selectedElementId && selectedSectionId) {
      deleteElement(selectedElementId, selectedSectionId);
    }
  };

  const handleSectionDelete = () => {
    if (selectedSectionId) {
      deleteSection(selectedSectionId);
    }
  };

  const handleSectionDuplicate = () => {
    if (selectedSectionId) {
      duplicateSection(selectedSectionId);
    }
  };

  return (
    <aside className="w-72 border-l border-zinc-200 bg-white flex flex-col select-none shrink-0 overflow-y-auto">
      {selectedElement && registryEntry ? (
        /* ==================== 1. COMPONENT INSPECTOR ==================== */
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50 shrink-0 flex items-center justify-between">
            <h2 className="text-xs font-bold text-zinc-500 tracking-wider uppercase flex items-center gap-2">
              <Sliders className="h-3.5 w-3.5 text-zinc-400" />
              <span>Properties</span>
            </h2>
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              {selectedElement.type}
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-5">
            {/* Component Name & ID */}
            <div>
              <h3 className="text-sm font-bold text-zinc-800 leading-tight">
                {registryEntry.name} Settings
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5 select-all">
                ID: {selectedElement.id}
              </p>
            </div>

            {/* Breakpoint Selector */}
            <div className="bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 flex">
              <button
                onClick={() => setActiveBreakpointTab("desktop")}
                className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all ${
                  activeBreakpointTab === "desktop"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Monitor className="h-3 w-3" />
                <span>Desk</span>
              </button>
              <button
                onClick={() => setActiveBreakpointTab("tablet")}
                className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all ${
                  activeBreakpointTab === "tablet"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Tablet className="h-3 w-3" />
                <span>Tab</span>
              </button>
              <button
                onClick={() => setActiveBreakpointTab("mobile")}
                className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all ${
                  activeBreakpointTab === "mobile"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Smartphone className="h-3 w-3" />
                <span>Mob</span>
              </button>
            </div>

            {/* Controls List */}
            <div className="flex flex-col gap-4">
              {registryEntry.controls.map((control) => {
                const rawVal = selectedElement.props[control.name];
                let isResponsiveActive = false;
                let value = rawVal ?? control.defaultValue;

                const isPropResponsive =
                  control.isResponsive ||
                  ["fontSize", "paddingX", "paddingY", "gap", "width", "height"].includes(
                    control.name
                  );

                if (isPropResponsive) {
                  isResponsiveActive = true;
                  if (
                    typeof rawVal === "object" &&
                    rawVal !== null &&
                    ("desktop" in rawVal || "tablet" in rawVal || "mobile" in rawVal)
                  ) {
                    value = rawVal[activeBreakpointTab] ?? "";
                  } else {
                    value = activeBreakpointTab === "desktop" ? rawVal ?? control.defaultValue : "";
                  }
                }

                return (
                  <div key={control.name} className="flex flex-col gap-1.5 border-b border-zinc-50 pb-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase flex items-center gap-1">
                        <span>{control.label}</span>
                        {isResponsiveActive && (
                          <span className="text-[9px] bg-zinc-200 text-zinc-600 px-1 rounded-full scale-90">
                            {activeBreakpointTab[0].toUpperCase()}
                          </span>
                        )}
                      </label>
                      {isResponsiveActive && activeBreakpointTab !== "desktop" && value === "" && (
                        <span className="text-[9px] text-zinc-400 font-medium italic">
                          Inherited
                        </span>
                      )}
                    </div>

                    {control.type === "text" && (
                      <input
                        type="text"
                        value={value}
                        placeholder={isResponsiveActive && activeBreakpointTab !== "desktop" ? "Inherited..." : ""}
                        onChange={(e) => handlePropChange(control.name, e.target.value, isResponsiveActive)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-blue-500 text-zinc-800 font-medium bg-white"
                      />
                    )}

                    {control.type === "textarea" && (
                      <textarea
                        rows={4}
                        value={value}
                        placeholder={isResponsiveActive && activeBreakpointTab !== "desktop" ? "Inherited..." : ""}
                        onChange={(e) => handlePropChange(control.name, e.target.value, isResponsiveActive)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-blue-500 text-zinc-800 font-medium min-h-[60px]"
                      />
                    )}

                    {control.type === "select" && (
                      <select
                        value={value}
                        onChange={(e) => handlePropChange(control.name, e.target.value, isResponsiveActive)}
                        className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-blue-500 text-zinc-800 font-semibold bg-white"
                      >
                        {isResponsiveActive && activeBreakpointTab !== "desktop" && (
                          <option value="">Inherit From Larger Screen</option>
                        )}
                        {control.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {control.type === "color" && (
                      <div className="flex items-center gap-2">
                        <div className="relative h-7 w-7 rounded border border-zinc-200 overflow-hidden cursor-pointer shrink-0 shadow-sm bg-white">
                          <input
                            type="color"
                            value={value.startsWith("var") ? "#ffffff" : value}
                            onChange={(e) => handlePropChange(control.name, e.target.value, isResponsiveActive)}
                            className="absolute -inset-1 h-9 w-9 border-0 cursor-pointer p-0 bg-none"
                          />
                        </div>
                        <input
                          type="text"
                          value={value}
                          placeholder={isResponsiveActive && activeBreakpointTab !== "desktop" ? "Inherit..." : "HEX/Token"}
                          onChange={(e) => handlePropChange(control.name, e.target.value, isResponsiveActive)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-blue-500 text-zinc-850 font-mono text-center uppercase"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Deletion & Deselection */}
            <div className="pt-4 border-t border-zinc-200 mt-2 flex flex-col gap-2.5">
              <button
                onClick={handleComponentDelete}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-red-200 hover:border-red-300 bg-red-50/20 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-semibold cursor-pointer transition-all shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Component</span>
              </button>

              <button
                onClick={() => selectElement(null, null)}
                className="w-full py-2 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold cursor-pointer transition-all text-center"
              >
                Deselect Component
              </button>
            </div>
          </div>
        </div>
      ) : selectedSection ? (
        /* ==================== 2. SECTION SETTINGS INSPECTOR ==================== */
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50 shrink-0 flex items-center justify-between">
            <h2 className="text-xs font-bold text-zinc-500 tracking-wider uppercase flex items-center gap-2">
              <Columns className="h-3.5 w-3.5 text-zinc-400" />
              <span>Section Settings</span>
            </h2>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              Container
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-5">
            {/* Header Identity */}
            <div>
              <h3 className="text-sm font-bold text-zinc-800 leading-tight">
                {selectedSection.name} Spacing
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5 select-all">
                ID: {selectedSection.id}
              </p>
            </div>

            {/* Breakpoint Selector */}
            <div className="bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 flex">
              <button
                onClick={() => setActiveBreakpointTab("desktop")}
                className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all ${
                  activeBreakpointTab === "desktop"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Monitor className="h-3 w-3" />
                <span>Desk</span>
              </button>
              <button
                onClick={() => setActiveBreakpointTab("tablet")}
                className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all ${
                  activeBreakpointTab === "tablet"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Tablet className="h-3 w-3" />
                <span>Tab</span>
              </button>
              <button
                onClick={() => setActiveBreakpointTab("mobile")}
                className={`flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold transition-all ${
                  activeBreakpointTab === "mobile"
                    ? "bg-white text-zinc-800 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                <Smartphone className="h-3 w-3" />
                <span>Mob</span>
              </button>
            </div>

            {/* Section Controls List */}
            <div className="flex flex-col gap-4">
              {/* Background Color */}
              <div className="flex flex-col gap-1.5 border-b border-zinc-50 pb-3">
                <label className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative h-7 w-7 rounded border border-zinc-200 overflow-hidden cursor-pointer bg-white shrink-0 shadow-sm">
                    <input
                      type="color"
                      value={
                        (selectedSection.settings.backgroundColor ?? "var(--theme-bg)").startsWith("var")
                          ? "#ffffff"
                          : selectedSection.settings.backgroundColor
                      }
                      onChange={(e) => handleSectionSettingChange("backgroundColor", e.target.value)}
                      className="absolute -inset-1 h-9 w-9 border-0 cursor-pointer p-0 bg-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={selectedSection.settings.backgroundColor ?? "var(--theme-bg)"}
                    onChange={(e) => handleSectionSettingChange("backgroundColor", e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 text-zinc-800 font-mono text-center uppercase"
                  />
                </div>
              </div>

              {/* Responsive Padding Top */}
              {(() => {
                const val = selectedSection.settings.paddingTop ?? "var(--theme-section-spacing)";
                let activeVal = val;
                let isInherited = false;
                if (typeof val === "object" && val !== null) {
                  activeVal = val[activeBreakpointTab] ?? "";
                  isInherited = activeBreakpointTab !== "desktop" && activeVal === "";
                }
                return (
                  <div className="flex flex-col gap-1.5 border-b border-zinc-50 pb-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">
                        Padding Top
                      </label>
                      {isInherited && (
                        <span className="text-[9px] text-zinc-400 font-medium italic">Inherited</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={activeVal}
                      placeholder={isInherited ? "Inherit..." : ""}
                      onChange={(e) => handleSectionSettingChange("paddingTop", e.target.value, true)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 text-zinc-800 font-medium bg-white"
                    />
                  </div>
                );
              })()}

              {/* Responsive Padding Bottom */}
              {(() => {
                const val = selectedSection.settings.paddingBottom ?? "var(--theme-section-spacing)";
                let activeVal = val;
                let isInherited = false;
                if (typeof val === "object" && val !== null) {
                  activeVal = val[activeBreakpointTab] ?? "";
                  isInherited = activeBreakpointTab !== "desktop" && activeVal === "";
                }
                return (
                  <div className="flex flex-col gap-1.5 border-b border-zinc-50 pb-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">
                        Padding Bottom
                      </label>
                      {isInherited && (
                        <span className="text-[9px] text-zinc-400 font-medium italic">Inherited</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={activeVal}
                      placeholder={isInherited ? "Inherit..." : ""}
                      onChange={(e) => handleSectionSettingChange("paddingBottom", e.target.value, true)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 text-zinc-800 font-medium bg-white"
                    />
                  </div>
                );
              })()}

              {/* Container Width */}
              <div className="flex flex-col gap-1.5 border-b border-zinc-50 pb-3">
                <label className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">
                  Container Width
                </label>
                <select
                  value={selectedSection.settings.containerWidth ?? "max-w-5xl"}
                  onChange={(e) => handleSectionSettingChange("containerWidth", e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 bg-white text-zinc-800 font-semibold"
                >
                  <option value="max-w-3xl">Narrow (3xl)</option>
                  <option value="max-w-5xl">Medium (5xl)</option>
                  <option value="max-w-7xl">Wide (7xl)</option>
                  <option value="w-full">Full Width (w-full)</option>
                </select>
              </div>

              {/* Flex Direction */}
              <div className="flex flex-col gap-1.5 border-b border-zinc-50 pb-3">
                <label className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">
                  Direction Flow
                </label>
                <select
                  value={selectedSection.settings.flexDirection ?? "col"}
                  onChange={(e) => handleSectionSettingChange("flexDirection", e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 bg-white text-zinc-800 font-semibold"
                >
                  <option value="col">Vertical Stack (Column)</option>
                  <option value="row">Horizontal Side-by-Side (Row)</option>
                </select>
              </div>

              {/* Gap Spacing */}
              {(() => {
                const val = selectedSection.settings.gap ?? "24px";
                let activeVal = val;
                let isInherited = false;
                if (typeof val === "object" && val !== null) {
                  activeVal = val[activeBreakpointTab] ?? "";
                  isInherited = activeBreakpointTab !== "desktop" && activeVal === "";
                }
                return (
                  <div className="flex flex-col gap-1.5 border-b border-zinc-50 pb-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">
                        Gaps & spacing
                      </label>
                      {isInherited && (
                        <span className="text-[9px] text-zinc-400 font-medium italic">Inherited</span>
                      )}
                    </div>
                    <input
                      type="text"
                      value={activeVal}
                      placeholder={isInherited ? "Inherit..." : ""}
                      onChange={(e) => handleSectionSettingChange("gap", e.target.value, true)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 text-zinc-800 font-medium bg-white"
                    />
                  </div>
                );
              })()}
            </div>

            {/* Actions: Duplicate & Delete */}
            <div className="pt-4 border-t border-zinc-200 mt-2 flex flex-col gap-2.5">
              <button
                onClick={handleSectionDuplicate}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-indigo-700 text-xs font-bold cursor-pointer transition-all shadow-sm"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Duplicate Section</span>
              </button>

              <button
                onClick={handleSectionDelete}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-red-250 hover:border-red-350 bg-red-50/20 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-semibold cursor-pointer transition-all shadow-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Section</span>
              </button>

              <button
                onClick={() => selectSection(null)}
                className="w-full py-2 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold cursor-pointer transition-all text-center"
              >
                Deselect Section
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== 3. GLOBAL THEME EDITOR ==================== */
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-50 shrink-0 flex items-center justify-between">
            <h2 className="text-xs font-bold text-zinc-500 tracking-wider uppercase flex items-center gap-2">
              <Palette className="h-3.5 w-3.5 text-zinc-400" />
              <span>Global Theme</span>
            </h2>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
              System
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-5">
            {/* Theme Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-zinc-500 tracking-wide uppercase">
                Select Active Theme
              </label>
              <select
                value={activeTheme.id}
                onChange={(e) => applyTheme(e.target.value)}
                className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 text-zinc-850 font-bold bg-white cursor-pointer shadow-sm"
              >
                <optgroup label="Built-in System Themes">
                  {builtInThemes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </optgroup>
                {customThemes.length > 0 && (
                  <optgroup label="My Custom Themes">
                    {customThemes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} (Custom)
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Colors Section */}
            <div className="flex flex-col gap-3.5 border-t border-zinc-100 pt-4">
              <h4 className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <span>Theme Colors</span>
              </h4>

              <div className="flex flex-col gap-3">
                {[
                  { name: "background", label: "Page Canvas Background" },
                  { name: "foreground", label: "Body Text Foreground" },
                  { name: "primary", label: "Primary Accent Color" },
                  { name: "secondary", label: "Secondary Accent Color" },
                  { name: "muted", label: "Muted Component Blocks" },
                  { name: "border", label: "Grid Lines & Borders" },
                ].map((color) => {
                  const val = (activeTheme.colors as any)[color.name] || "#ffffff";
                  return (
                    <div key={color.name} className="flex flex-col gap-1">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
                        {color.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="relative h-6 w-6 rounded border border-zinc-200 overflow-hidden cursor-pointer shrink-0 shadow-sm bg-white">
                          <input
                            type="color"
                            value={val}
                            onChange={(e) =>
                              updateThemeProperty("colors", color.name, e.target.value)
                            }
                            className="absolute -inset-1 h-8 w-8 border-0 cursor-pointer p-0 bg-none"
                          />
                        </div>
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            updateThemeProperty("colors", color.name, e.target.value)
                          }
                          className="w-full text-[11px] px-2 py-1 rounded border border-zinc-200 focus:outline-none text-zinc-700 font-mono text-center uppercase"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Typography Section */}
            <div className="flex flex-col gap-3.5 border-t border-zinc-100 pt-4">
              <h4 className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5 text-zinc-400" />
                <span>Typography</span>
              </h4>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
                    Heading Font Family
                  </span>
                  <select
                    value={activeTheme.typography.headingFont}
                    onChange={(e) =>
                      updateThemeProperty("typography", "headingFont", e.target.value)
                    }
                    className="w-full text-xs px-2 py-1.5 rounded border border-zinc-200 bg-white"
                  >
                    <option value="system-ui, -apple-system, sans-serif">System Sans</option>
                    <option value="Georgia, serif">Elegant Georgia Serif</option>
                    <option value="Courier, monospace">Mono Courier</option>
                    <option value="Arial, sans-serif">Standard Arial</option>
                    <option value="Impact, sans-serif">Impact Heavy</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
                    Heading Bold Weight
                  </span>
                  <select
                    value={activeTheme.typography.headingWeight}
                    onChange={(e) =>
                      updateThemeProperty("typography", "headingWeight", e.target.value)
                    }
                    className="w-full text-xs px-2 py-1.5 rounded border border-zinc-200 bg-white"
                  >
                    <option value="300">Light (300)</option>
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi-Bold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra-Bold (800)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Spacing & Shapes Section */}
            <div className="flex flex-col gap-3.5 border-t border-zinc-100 pt-4">
              <h4 className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
                <Maximize className="h-3.5 w-3.5 text-zinc-400" />
                <span>Shapes & Curves</span>
              </h4>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
                    Container Corner Radius (md)
                  </span>
                  <input
                    type="text"
                    value={activeTheme.radius.md}
                    onChange={(e) => updateThemeProperty("radius", "md", e.target.value)}
                    className="w-full text-xs px-2 py-1.5 rounded border border-zinc-200 text-zinc-700"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">
                    Section Vertical Spacing
                  </span>
                  <input
                    type="text"
                    value={activeTheme.spacing.section}
                    onChange={(e) =>
                      updateThemeProperty("spacing", "section", e.target.value)
                    }
                    className="w-full text-xs px-2 py-1.5 rounded border border-zinc-200 text-zinc-700"
                  />
                </div>
              </div>
            </div>

            {/* Save Theme Copy Form */}
            <form
              onSubmit={handleSaveTheme}
              className="mt-2 p-3 bg-indigo-50/30 rounded-xl border border-indigo-100/50 flex flex-col gap-2.5"
            >
              <h5 className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1">
                <Save className="h-3 w-3" />
                <span>Save Theme Copy</span>
              </h5>
              <p className="text-[10px] text-zinc-500">
                Create an editable clone of this theme without modifying original presets.
              </p>
              <div className="flex flex-col gap-1.5 mt-1">
                <input
                  type="text"
                  required
                  placeholder="E.g., Elizabeth Editorial"
                  value={customThemeName}
                  onChange={(e) => setCustomThemeName(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded border border-indigo-200 bg-white text-zinc-800"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Saved Successfully!</span>
                    </>
                  ) : (
                    <span>Save Theme As...</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
export default RightInspector;
