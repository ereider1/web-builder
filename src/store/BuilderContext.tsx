"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { PageData, PageElement, BuilderState, PreviewMode } from "@/types";

type BuilderAction =
  | {
      type: "ADD_ELEMENT";
      payload: { parentId: string | null; element: PageElement; index: number };
    }
  | { type: "UPDATE_ELEMENT"; payload: { id: string; props: Record<string, any> } }
  | { type: "DELETE_ELEMENT"; payload: { id: string } }
  | { type: "SELECT_ELEMENT"; payload: { id: string | null } }
  | {
      type: "MOVE_ELEMENT";
      payload: { id: string; targetParentId: string | null; index: number };
    }
  | { type: "SET_PREVIEW_MODE"; payload: { mode: PreviewMode } }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "LOAD_PAGE"; payload: { pageData: PageData } };

// Helper: Recursively update element properties in tree
function updateElementInTree(
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
        children: updateElementInTree(el.children, id, newProps),
      };
    }
    return el;
  });
}

// Helper: Recursively remove element from tree
function removeElementFromTree(
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
          removeElementFromTree(el.children, id);
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

// Helper: Recursively insert element into tree
function insertElementIntoTree(
  elements: PageElement[],
  parentId: string | null,
  elementToInsert: PageElement,
  index: number
): PageElement[] {
  if (parentId === null) {
    const copy = [...elements];
    if (index < 0 || index >= copy.length) {
      copy.push(elementToInsert);
    } else {
      copy.splice(index, 0, elementToInsert);
    }
    return copy;
  }

  return elements.map((el) => {
    if (el.id === parentId) {
      const children = el.children ? [...el.children] : [];
      if (index < 0 || index >= children.length) {
        children.push(elementToInsert);
      } else {
        children.splice(index, 0, elementToInsert);
      }
      return { ...el, children };
    }
    if (el.children) {
      return {
        ...el,
        children: insertElementIntoTree(
          el.children,
          parentId,
          elementToInsert,
          index
        ),
      };
    }
    return el;
  });
}

const initialPageData: PageData = {
  id: "page-1",
  name: "My Awesome Website",
  elements: [
    {
      id: "section-1",
      type: "section",
      props: {
        backgroundColor: "#f9fafb",
        paddingTop: "80px",
        paddingBottom: "80px",
        containerWidth: "max-w-5xl",
        flexDirection: "col",
        gap: "24px",
      },
      children: [
        {
          id: "heading-1",
          type: "heading",
          props: {
            text: "Design Your Perfect Website Visualizer",
            fontSize: "48px",
            fontWeight: "800",
            color: "#111827",
            alignment: "center",
          },
        },
        {
          id: "text-1",
          type: "text",
          props: {
            text: "This is a clean, modular visual page editor. Drag components from the sidebar, select them to edit their properties, and watch the canvas update in real-time. Full undo, redo, and responsive support are ready to go!",
            fontSize: "18px",
            color: "#4b5563",
            alignment: "center",
          },
        },
        {
          id: "button-1",
          type: "button",
          props: {
            text: "Get Started Now",
            url: "#",
            backgroundColor: "#2563eb",
            textColor: "#ffffff",
            paddingX: "24px",
            paddingY: "12px",
            borderRadius: "6px",
            fontSize: "16px",
            alignment: "center",
          },
        },
      ],
    },
  ],
};

const initialState: BuilderState = {
  pageData: initialPageData,
  selectedElementId: null,
  previewMode: "desktop",
  history: {
    past: [],
    future: [],
  },
};

function builderReducer(
  state: BuilderState,
  action: BuilderAction
): BuilderState {
  switch (action.type) {
    case "ADD_ELEMENT": {
      const { parentId, element, index } = action.payload;

      // Save history
      const past = [...state.history.past, JSON.parse(JSON.stringify(state.pageData))];
      const future: PageData[] = [];

      const updatedElements = insertElementIntoTree(
        state.pageData.elements,
        parentId,
        element,
        index
      );

      return {
        ...state,
        pageData: {
          ...state.pageData,
          elements: updatedElements,
        },
        selectedElementId: element.id, // Auto-select the newly added element
        history: { past, future },
      };
    }

    case "UPDATE_ELEMENT": {
      const { id, props } = action.payload;

      // Save history
      const past = [...state.history.past, JSON.parse(JSON.stringify(state.pageData))];
      const future: PageData[] = [];

      const updatedElements = updateElementInTree(
        state.pageData.elements,
        id,
        props
      );

      return {
        ...state,
        pageData: {
          ...state.pageData,
          elements: updatedElements,
        },
        history: { past, future },
      };
    }

    case "DELETE_ELEMENT": {
      const { id } = action.payload;

      // Save history
      const past = [...state.history.past, JSON.parse(JSON.stringify(state.pageData))];
      const future: PageData[] = [];

      const { updatedElements } = removeElementFromTree(
        state.pageData.elements,
        id
      );

      return {
        ...state,
        pageData: {
          ...state.pageData,
          elements: updatedElements,
        },
        selectedElementId:
          state.selectedElementId === id ? null : state.selectedElementId,
        history: { past, future },
      };
    }

    case "SELECT_ELEMENT": {
      return {
        ...state,
        selectedElementId: action.payload.id,
      };
    }

    case "MOVE_ELEMENT": {
      const { id, targetParentId, index } = action.payload;

      // Save history
      const past = [...state.history.past, JSON.parse(JSON.stringify(state.pageData))];
      const future: PageData[] = [];

      // 1. Remove from current location
      const { updatedElements: intermediateElements, removedElement } =
        removeElementFromTree(state.pageData.elements, id);

      if (!removedElement) {
        return state;
      }

      // 2. Insert at target parent and index
      const updatedElements = insertElementIntoTree(
        intermediateElements,
        targetParentId,
        removedElement,
        index
      );

      return {
        ...state,
        pageData: {
          ...state.pageData,
          elements: updatedElements,
        },
        history: { past, future },
      };
    }

    case "SET_PREVIEW_MODE": {
      return {
        ...state,
        previewMode: action.payload.mode,
      };
    }

    case "UNDO": {
      if (state.history.past.length === 0) return state;

      const past = [...state.history.past];
      const previous = past.pop()!;
      const future = [
        JSON.parse(JSON.stringify(state.pageData)),
        ...state.history.future,
      ];

      return {
        ...state,
        pageData: previous,
        history: { past, future },
      };
    }

    case "REDO": {
      if (state.history.future.length === 0) return state;

      const future = [...state.history.future];
      const next = future.shift()!;
      const past = [
        ...state.history.past,
        JSON.parse(JSON.stringify(state.pageData)),
      ];

      return {
        ...state,
        pageData: next,
        history: { past, future },
      };
    }

    case "LOAD_PAGE": {
      return {
        ...state,
        pageData: action.payload.pageData,
        history: { past: [], future: [] },
      };
    }

    default:
      return state;
}
}

interface BuilderContextType {
  state: BuilderState;
  addElement: (parentId: string | null, element: PageElement, index?: number) => void;
  updateElement: (id: string, props: Record<string, any>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElement: (id: string, targetParentId: string | null, index: number) => void;
  setPreviewMode: (mode: PreviewMode) => void;
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

  const addElement = (
    parentId: string | null,
    element: PageElement,
    index = -1
  ) => {
    dispatch({ type: "ADD_ELEMENT", payload: { parentId, element, index } });
  };

  const updateElement = (id: string, props: Record<string, any>) => {
    dispatch({ type: "UPDATE_ELEMENT", payload: { id, props } });
  };

  const deleteElement = (id: string) => {
    dispatch({ type: "DELETE_ELEMENT", payload: { id } });
  };

  const selectElement = (id: string | null) => {
    dispatch({ type: "SELECT_ELEMENT", payload: { id } });
  };

  const moveElement = (
    id: string,
    targetParentId: string | null,
    index: number
  ) => {
    dispatch({ type: "MOVE_ELEMENT", payload: { id, targetParentId, index } });
  };

  const setPreviewMode = (mode: PreviewMode) => {
    dispatch({ type: "SET_PREVIEW_MODE", payload: { mode } });
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

  const canUndo = state.history.past.length > 0;
  const canRedo = state.history.future.length > 0;

  return (
    <BuilderContext.Provider
      value={{
        state,
        addElement,
        updateElement,
        deleteElement,
        selectElement,
        moveElement,
        setPreviewMode,
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
