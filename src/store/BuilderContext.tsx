"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  Project,
  Page,
  PageSection,
  PageElement,
  BuilderState,
  PreviewMode,
  Theme,
} from "@/types";
import { builtInThemes, getCustomThemes, saveCustomTheme } from "@/theme/ThemeManager";
import { sectionLibrary } from "@/registry/SectionLibrary";
import { bindSection, bindElementProps } from "@/utils/contentBinder";

type BuilderAction =
  | { type: "SELECT_SECTION"; payload: { sectionId: string | null } }
  | { type: "SELECT_ELEMENT"; payload: { elementId: string | null; sectionId: string | null } }
  | { type: "ADD_SECTION"; payload: { section: PageSection; index: number } }
  | { type: "UPDATE_SECTION_SETTINGS"; payload: { sectionId: string; settings: Record<string, any> } }
  | { type: "DELETE_SECTION"; payload: { sectionId: string } }
  | { type: "DUPLICATE_SECTION"; payload: { sectionId: string } }
  | { type: "MOVE_SECTION"; payload: { sectionId: string; index: number } }
  | { type: "ADD_ELEMENT_TO_SECTION"; payload: { sectionId: string; element: PageElement; index: number } }
  | { type: "UPDATE_ELEMENT"; payload: { elementId: string; props: Record<string, any> } }
  | { type: "DELETE_ELEMENT"; payload: { elementId: string; sectionId: string } }
  | { type: "MOVE_ELEMENT_IN_SECTION"; payload: { sectionId: string; elementId: string; index: number } }
  | { type: "SET_PREVIEW_MODE"; payload: { mode: PreviewMode } }
  | { type: "APPLY_THEME"; payload: { themeId: string } }
  | { type: "UPDATE_THEME_PROPERTY"; payload: { category: string; key: string; value: string } }
  | { type: "SAVE_CUSTOM_THEME"; payload: { name: string } }
  | { type: "LOAD_STARTER"; payload: { project: Project; theme: Theme } }
  | { type: "UNDO" }
  | { type: "REDO" };

// Helper to recursively clone elements and assign new unique IDs
export function cloneElementsWithNewIds(elements: PageElement[]): PageElement[] {
  return elements.map((el) => {
    const newId = `${el.type}-${Math.random().toString(36).substr(2, 9)}`;
    const clonedChildren = el.children ? cloneElementsWithNewIds(el.children) : undefined;
    return {
      ...el,
      id: newId,
      props: JSON.parse(JSON.stringify(el.props)),
      ...(clonedChildren ? { children: clonedChildren } : {}),
    };
  });
}

// Deep clone PageSection with fresh unique IDs
export function cloneSectionWithNewIds(sec: PageSection): PageSection {
  return {
    ...sec,
    id: `section-${Math.random().toString(36).substr(2, 9)}`,
    settings: JSON.parse(JSON.stringify(sec.settings)),
    elements: cloneElementsWithNewIds(sec.elements),
  };
}

// Helper: Recursively update component properties in elements list
function updateElementInList(
  elements: PageElement[],
  id: string,
  newProps: Record<string, any>
): PageElement[] {
  return elements.map((el) => {
    if (el.id === id) {
      return { ...el, props: { ...el.props, ...newProps } };
    }
    if (el.children) {
      return {
        ...el,
        children: updateElementInList(el.children, id, newProps),
      };
    }
    return el;
  });
}

// Helper: Recursively remove component from elements list
function removeElementFromList(
  elements: PageElement[],
  id: string
): { updatedElements: PageElement[]; removedElement: PageElement | null } {
  let removedElement: PageElement | null = null;

  const recurse = (list: PageElement[]): PageElement[] => {
    const nextList: PageElement[] = [];
    for (const el of list) {
      if (el.id === id) {
        removedElement = el;
        continue;
      }
      if (el.children && el.children.length > 0) {
        const { updatedElements, removedElement: childRemoved } =
          removeElementFromList(el.children, id);
        if (childRemoved) {
          removedElement = childRemoved;
        }
        nextList.push({ ...el, children: updatedElements });
      } else {
        nextList.push(el);
      }
    }
    return nextList;
  };

  const updatedElements = recurse(elements);
  return { updatedElements, removedElement };
}

const defaultTheme = builtInThemes[0]; // Modern is the default theme

const initialProject: Project = {
  id: "project-1",
  name: "My Professional Project",
  activeThemeId: "modern",
  pages: [
    {
      id: "page-1",
      name: "Home",
      slug: "home",
      sections: [
        {
          id: "sec-nav",
          type: "simple-navbar",
          name: "Simple Navbar",
          settings: {
            backgroundColor: "var(--theme-bg)",
            paddingTop: "20px",
            paddingBottom: "20px",
            containerWidth: "max-w-7xl",
            flexDirection: "row",
            gap: "12px",
          },
          elements: [
            {
              id: "nav-brand-default",
              type: "heading",
              props: {
                text: "VISUAL.BUILDER",
                fontSize: "18px",
                fontWeight: "800",
                color: "var(--theme-primary)",
                alignment: "left",
              },
            },
            {
              id: "nav-links-default",
              type: "text",
              props: {
                text: "Home   |   Services   |   Philosophy   |   Portfolio",
                fontSize: "14px",
                color: "var(--theme-foreground)",
                alignment: "center",
              },
            },
            {
              id: "nav-cta-default",
              type: "button",
              props: {
                text: "Get Started",
                url: "#",
                backgroundColor: "var(--theme-primary)",
                textColor: "var(--theme-bg)",
                paddingX: "14px",
                paddingY: "7px",
                borderRadius: "var(--radius-sm)",
                fontSize: "12px",
                alignment: "right",
              },
            },
          ],
        },
        {
          id: "sec-hero",
          type: "hero-centered",
          name: "Hero Centered",
          settings: {
            backgroundColor: "var(--theme-bg)",
            paddingTop: { desktop: "100px", tablet: "80px", mobile: "60px" },
            paddingBottom: { desktop: "100px", tablet: "80px", mobile: "60px" },
            containerWidth: "max-w-5xl",
            flexDirection: "col",
            gap: "24px",
          },
          elements: [
            {
              id: "hero-centered-h1-default",
              type: "heading",
              props: {
                text: "Design Beautiful Custom Websites Faster",
                fontSize: { desktop: "54px", tablet: "42px", mobile: "36px" },
                fontWeight: "700",
                color: "var(--theme-primary)",
                alignment: "center",
              },
            },
            {
              id: "hero-centered-txt-default",
              type: "text",
              props: {
                text: "A local-first visual editor built for developers and designers who want to launch highly polished, themeable landings and services pages in seconds. Everything is custom, editable, and beautifully responsive.",
                fontSize: { desktop: "18px", tablet: "16px", mobile: "15px" },
                color: "var(--theme-foreground)",
                alignment: "center",
              },
            },
            {
              id: "hero-centered-btn-default",
              type: "button",
              props: {
                text: "Explore Our Features",
                url: "#",
                backgroundColor: "var(--theme-primary)",
                textColor: "var(--theme-bg)",
                paddingX: "28px",
                paddingY: "14px",
                borderRadius: "var(--radius-md)",
                fontSize: "16px",
                alignment: "center",
              },
            },
          ],
        },
        {
          id: "sec-testimonials",
          type: "testimonials",
          name: "Testimonials",
          settings: {
            backgroundColor: "var(--theme-muted)",
            paddingTop: { desktop: "70px", tablet: "55px", mobile: "40px" },
            paddingBottom: { desktop: "70px", tablet: "55px", mobile: "40px" },
            containerWidth: "max-w-3xl",
            flexDirection: "col",
            gap: "20px",
          },
          elements: [
            {
              id: "testi-quote-default",
              type: "heading",
              props: {
                text: "“By compiling web pages from cohesive design token frameworks, we bypass raw style overrides entirely and deliver pixel-perfect visual consistent layouts.”",
                fontSize: { desktop: "24px", tablet: "20px", mobile: "18px" },
                fontWeight: "600",
                color: "var(--theme-primary)",
                alignment: "center",
              },
            },
            {
              id: "testi-author-default",
              type: "text",
              props: {
                text: "— Elizabeth Reider, Lead Visual Architect",
                fontSize: "14px",
                color: "var(--theme-foreground)",
                alignment: "center",
              },
            },
          ],
        },
        {
          id: "sec-foot",
          type: "simple-footer",
          name: "Simple Footer",
          settings: {
            backgroundColor: "var(--theme-bg)",
            paddingTop: "30px",
            paddingBottom: "30px",
            containerWidth: "max-w-5xl",
            flexDirection: "row",
            gap: "20px",
          },
          elements: [
            {
              id: "foot-cpy-default",
              type: "text",
              props: {
                text: "© 2026 Web Builder. All rights reserved. Completely brand-neutral layout visualizer suite.",
                fontSize: "13px",
                color: "var(--theme-foreground)",
                alignment: "left",
              },
            },
            {
              id: "foot-lnks-default",
              type: "text",
              props: {
                text: "Privacy Policy | Terms of Service",
                fontSize: "13px",
                color: "var(--theme-foreground)",
                alignment: "right",
              },
            },
          ],
        },
      ],
    },
  ],
};

const initialState: BuilderState = {
  project: initialProject,
  activePageId: "page-1",
  selectedSectionId: null,
  selectedElementId: null,
  previewMode: "desktop",
  activeTheme: defaultTheme,
  customThemes: [],
  history: {
    past: [],
    future: [],
  },
};

function builderReducer(
  state: BuilderState,
  action: BuilderAction
): BuilderState {
  // Utility helper to save history frames of Project + Theme
  const createHistoryFrame = () => ({
    project: JSON.parse(JSON.stringify(state.project)),
    activeTheme: JSON.parse(JSON.stringify(state.activeTheme)),
  });

  const getActivePage = (project: Project): Page => {
    return project.pages.find((p) => p.id === state.activePageId) || project.pages[0];
  };

  const updateActivePageInProject = (project: Project, updatedPage: Page): Project => {
    return {
      ...project,
      pages: project.pages.map((p) => (p.id === updatedPage.id ? updatedPage : p)),
    };
  };

  switch (action.type) {
    case "SELECT_SECTION": {
      return {
        ...state,
        selectedSectionId: action.payload.sectionId,
        selectedElementId: null, // Clear element selection when section selected
      };
    }

    case "SELECT_ELEMENT": {
      return {
        ...state,
        selectedElementId: action.payload.elementId,
        selectedSectionId: action.payload.sectionId,
      };
    }

    case "ADD_SECTION": {
      const { section, index } = action.payload;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      // Bind tokens on-the-fly if active project has client details
      const boundSection = state.project.businessInfo || state.project.assets
        ? bindSection(
            section,
            state.project.businessInfo || { name: "" },
            state.project.assets || {}
          )
        : section;

      const activePage = getActivePage(state.project);
      const sections = [...activePage.sections];

      if (index < 0 || index >= sections.length) {
        sections.push(boundSection);
      } else {
        sections.splice(index, 0, boundSection);
      }

      const updatedPage = { ...activePage, sections };
      const updatedProject = updateActivePageInProject(state.project, updatedPage);

      return {
        ...state,
        project: updatedProject,
        selectedSectionId: boundSection.id,
        selectedElementId: null,
        history: { past, future },
      };
    }

    case "UPDATE_SECTION_SETTINGS": {
      const { sectionId, settings } = action.payload;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      const activePage = getActivePage(state.project);
      const sections = activePage.sections.map((sec) => {
        if (sec.id === sectionId) {
          return { ...sec, settings: { ...sec.settings, ...settings } };
        }
        return sec;
      });

      const updatedPage = { ...activePage, sections };
      const updatedProject = updateActivePageInProject(state.project, updatedPage);

      return {
        ...state,
        project: updatedProject,
        history: { past, future },
      };
    }

    case "DELETE_SECTION": {
      const { sectionId } = action.payload;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      const activePage = getActivePage(state.project);
      const sections = activePage.sections.filter((sec) => sec.id !== sectionId);

      const updatedPage = { ...activePage, sections };
      const updatedProject = updateActivePageInProject(state.project, updatedPage);

      return {
        ...state,
        project: updatedProject,
        selectedSectionId: state.selectedSectionId === sectionId ? null : state.selectedSectionId,
        selectedElementId: null,
        history: { past, future },
      };
    }

    case "DUPLICATE_SECTION": {
      const { sectionId } = action.payload;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      const activePage = getActivePage(state.project);
      const targetSec = activePage.sections.find((sec) => sec.id === sectionId);

      if (!targetSec) return state;

      const cloned = cloneSectionWithNewIds(targetSec);
      const sections = [...activePage.sections];
      const targetIndex = sections.findIndex((sec) => sec.id === sectionId);

      sections.splice(targetIndex + 1, 0, cloned);

      const updatedPage = { ...activePage, sections };
      const updatedProject = updateActivePageInProject(state.project, updatedPage);

      return {
        ...state,
        project: updatedProject,
        selectedSectionId: cloned.id,
        selectedElementId: null,
        history: { past, future },
      };
    }

    case "MOVE_SECTION": {
      const { sectionId, index } = action.payload;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      const activePage = getActivePage(state.project);
      const sections = [...activePage.sections];
      const targetIndex = sections.findIndex((sec) => sec.id === sectionId);

      if (targetIndex < 0) return state;

      const [removed] = sections.splice(targetIndex, 1);
      
      let nextIndex = index;
      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex > sections.length) nextIndex = sections.length;

      sections.splice(nextIndex, 0, removed);

      const updatedPage = { ...activePage, sections };
      const updatedProject = updateActivePageInProject(state.project, updatedPage);

      return {
        ...state,
        project: updatedProject,
        history: { past, future },
      };
    }

    case "ADD_ELEMENT_TO_SECTION": {
      const { sectionId, element, index } = action.payload;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      // Bind tokens on-the-fly if active project has client details
      const boundElement = state.project.businessInfo || state.project.assets
        ? bindElementProps(
            element,
            state.project.businessInfo || { name: "" },
            state.project.assets || {}
          )
        : element;

      const activePage = getActivePage(state.project);
      const sections = activePage.sections.map((sec) => {
        if (sec.id === sectionId) {
          const elements = [...sec.elements];
          if (index < 0 || index >= elements.length) {
            elements.push(boundElement);
          } else {
            elements.splice(index, 0, boundElement);
          }
          return { ...sec, elements };
        }
        return sec;
      });

      const updatedPage = { ...activePage, sections };
      const updatedProject = updateActivePageInProject(state.project, updatedPage);

      return {
        ...state,
        project: updatedProject,
        selectedElementId: boundElement.id,
        selectedSectionId: sectionId,
        history: { past, future },
      };
    }

    case "UPDATE_ELEMENT": {
      const { elementId, props } = action.payload;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      const activePage = getActivePage(state.project);
      const sections = activePage.sections.map((sec) => {
        const updatedElements = updateElementInList(sec.elements, elementId, props);
        return { ...sec, elements: updatedElements };
      });

      const updatedPage = { ...activePage, sections };
      const updatedProject = updateActivePageInProject(state.project, updatedPage);

      return {
        ...state,
        project: updatedProject,
        history: { past, future },
      };
    }

    case "DELETE_ELEMENT": {
      const { elementId, sectionId } = action.payload;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      const activePage = getActivePage(state.project);
      const sections = activePage.sections.map((sec) => {
        if (sec.id === sectionId) {
          const { updatedElements } = removeElementFromList(sec.elements, elementId);
          return { ...sec, elements: updatedElements };
        }
        return sec;
      });

      const updatedPage = { ...activePage, sections };
      const updatedProject = updateActivePageInProject(state.project, updatedPage);

      return {
        ...state,
        project: updatedProject,
        selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
        history: { past, future },
      };
    }

    case "MOVE_ELEMENT_IN_SECTION": {
      const { sectionId, elementId, index } = action.payload;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      const activePage = getActivePage(state.project);
      const sections = activePage.sections.map((sec) => {
        if (sec.id === sectionId) {
          const elements = [...sec.elements];
          const targetIndex = elements.findIndex((el) => el.id === elementId);

          if (targetIndex >= 0) {
            const [removed] = elements.splice(targetIndex, 1);
            
            let nextIndex = index;
            if (nextIndex < 0) nextIndex = 0;
            if (nextIndex > elements.length) nextIndex = elements.length;

            elements.splice(nextIndex, 0, removed);
          }
          return { ...sec, elements };
        }
        return sec;
      });

      const updatedPage = { ...activePage, sections };
      const updatedProject = updateActivePageInProject(state.project, updatedPage);

      return {
        ...state,
        project: updatedProject,
        history: { past, future },
      };
    }

    case "SET_PREVIEW_MODE": {
      return {
        ...state,
        previewMode: action.payload.mode,
      };
    }

    case "APPLY_THEME": {
      const { themeId } = action.payload;
      const allThemes = [...builtInThemes, ...state.customThemes];
      const targetTheme = allThemes.find((t) => t.id === themeId);

      if (!targetTheme) return state;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      return {
        ...state,
        activeTheme: targetTheme,
        project: {
          ...state.project,
          activeThemeId: targetTheme.id,
        },
        history: { past, future },
      };
    }

    case "UPDATE_THEME_PROPERTY": {
      const { category, key, value } = action.payload;

      const past = [...state.history.past, createHistoryFrame()];
      const future: { project: Project; activeTheme: Theme }[] = [];

      const updatedTheme = {
        ...state.activeTheme,
        [category]: {
          ...((state.activeTheme as any)[category] || {}),
          [key]: value,
        },
      };

      return {
        ...state,
        activeTheme: updatedTheme,
        history: { past, future },
      };
    }

    case "SAVE_CUSTOM_THEME": {
      const { name } = action.payload;
      const newId = `custom-${Date.now()}`;

      const newTheme: Theme = {
        ...state.activeTheme,
        id: newId,
        name,
        isCustom: true,
      };

      const updatedCustomThemes = saveCustomTheme(newTheme);

      return {
        ...state,
        customThemes: updatedCustomThemes,
        activeTheme: newTheme,
        project: {
          ...state.project,
          activeThemeId: newTheme.id,
        },
      };
    }

    case "LOAD_STARTER": {
      const { project, theme } = action.payload;
      return {
        ...state,
        project,
        activeTheme: theme,
        selectedSectionId: null,
        selectedElementId: null,
        history: { past: [], future: [] }, // clear history on loading starter
      };
    }

    case "UNDO": {
      if (state.history.past.length === 0) return state;

      const past = [...state.history.past];
      const previous = past.pop()!;
      const future = [createHistoryFrame(), ...state.history.future];

      return {
        ...state,
        project: previous.project,
        activeTheme: previous.activeTheme,
        history: { past, future },
      };
    }

    case "REDO": {
      if (state.history.future.length === 0) return state;

      const future = [...state.history.future];
      const next = future.shift()!;
      const past = [...state.history.past, createHistoryFrame()];

      return {
        ...state,
        project: next.project,
        activeTheme: next.activeTheme,
        history: { past, future },
      };
    }

    default:
      return state;
  }
}

interface BuilderContextType {
  state: BuilderState;
  selectSection: (sectionId: string | null) => void;
  selectElement: (elementId: string | null, sectionId: string | null) => void;
  addSection: (section: PageSection, index?: number) => void;
  updateSectionSettings: (sectionId: string, settings: Record<string, any>) => void;
  deleteSection: (sectionId: string) => void;
  duplicateSection: (sectionId: string) => void;
  moveSection: (sectionId: string, index: number) => void;
  addElementToSection: (sectionId: string, element: PageElement, index?: number) => void;
  updateElement: (elementId: string, props: Record<string, any>) => void;
  deleteElement: (elementId: string, sectionId: string) => void;
  moveElementInSection: (sectionId: string, elementId: string, index: number) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  applyTheme: (themeId: string) => void;
  updateThemeProperty: (category: string, key: string, value: string) => void;
  saveAsCustomTheme: (name: string) => void;
  loadStarter: (project: Project, theme: Theme) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  const selectSection = (sectionId: string | null) => {
    dispatch({ type: "SELECT_SECTION", payload: { sectionId } });
  };

  const selectElement = (elementId: string | null, sectionId: string | null) => {
    dispatch({ type: "SELECT_ELEMENT", payload: { elementId, sectionId } });
  };

  const addSection = (section: PageSection, index = -1) => {
    dispatch({ type: "ADD_SECTION", payload: { section, index } });
  };

  const updateSectionSettings = (sectionId: string, settings: Record<string, any>) => {
    dispatch({ type: "UPDATE_SECTION_SETTINGS", payload: { sectionId, settings } });
  };

  const deleteSection = (sectionId: string) => {
    dispatch({ type: "DELETE_SECTION", payload: { sectionId } });
  };

  const duplicateSection = (sectionId: string) => {
    dispatch({ type: "DUPLICATE_SECTION", payload: { sectionId } });
  };

  const moveSection = (sectionId: string, index: number) => {
    dispatch({ type: "MOVE_SECTION", payload: { sectionId, index } });
  };

  const addElementToSection = (
    sectionId: string,
    element: PageElement,
    index = -1
  ) => {
    dispatch({
      type: "ADD_ELEMENT_TO_SECTION",
      payload: { sectionId, element, index },
    });
  };

  const updateElement = (elementId: string, props: Record<string, any>) => {
    dispatch({ type: "UPDATE_ELEMENT", payload: { elementId, props } });
  };

  const deleteElement = (elementId: string, sectionId: string) => {
    dispatch({ type: "DELETE_ELEMENT", payload: { elementId, sectionId } });
  };

  const moveElementInSection = (
    sectionId: string,
    elementId: string,
    index: number
  ) => {
    dispatch({
      type: "MOVE_ELEMENT_IN_SECTION",
      payload: { sectionId, elementId, index },
    });
  };

  const setPreviewMode = (mode: PreviewMode) => {
    dispatch({ type: "SET_PREVIEW_MODE", payload: { mode } });
  };

  const applyTheme = (themeId: string) => {
    dispatch({ type: "APPLY_THEME", payload: { themeId } });
  };

  const updateThemeProperty = (category: string, key: string, value: string) => {
    dispatch({
      type: "UPDATE_THEME_PROPERTY",
      payload: { category, key, value },
    });
  };

  const saveAsCustomTheme = (name: string) => {
    dispatch({ type: "SAVE_CUSTOM_THEME", payload: { name } });
  };

  const loadStarter = (project: Project, theme: Theme) => {
    dispatch({ type: "LOAD_STARTER", payload: { project, theme } });
  };

  const undo = () => {
    dispatch({ type: "UNDO" });
  };

  const redo = () => {
    dispatch({ type: "REDO" });
  };

  // Keyboard shortcut listeners for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch({ type: "REDO" });
        } else {
          dispatch({ type: "UNDO" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Initialize custom themes from localStorage on client load
  useEffect(() => {
    const loadedCustomThemes = getCustomThemes();
    if (loadedCustomThemes.length > 0) {
      const savedThemeId = state.project.activeThemeId;
      const savedCustom = loadedCustomThemes.find((t) => t.id === savedThemeId);

      dispatch({
        type: "LOAD_STARTER",
        payload: {
          project: state.project,
          theme: savedCustom || state.activeTheme,
        },
      });

      state.customThemes = loadedCustomThemes;
    }
  }, []);

  const canUndo = state.history.past.length > 0;
  const canRedo = state.history.future.length > 0;

  return (
    <BuilderContext.Provider
      value={{
        state,
        selectSection,
        selectElement,
        addSection,
        updateSectionSettings,
        deleteSection,
        duplicateSection,
        moveSection,
        addElementToSection,
        updateElement,
        deleteElement,
        moveElementInSection,
        setPreviewMode,
        applyTheme,
        updateThemeProperty,
        saveAsCustomTheme,
        loadStarter,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
