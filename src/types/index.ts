export type ElementType = "section" | "heading" | "text" | "button" | "image";

export interface PageElement {
  id: string;
  type: ElementType;
  props: Record<string, any>;
  children?: PageElement[];
}

export interface PageData {
  id: string;
  name: string;
  elements: PageElement[];
}

export interface ControlOption {
  label: string;
  value: string;
}

export interface PropertyControl {
  name: string; // The property key (e.g. 'text', 'fontSize', 'color')
  label: string; // The label shown to the user (e.g. 'Font Size')
  type: "text" | "textarea" | "select" | "color";
  options?: ControlOption[]; // For 'select' type
  defaultValue: any;
}

export interface ComponentRegistryEntry {
  type: ElementType;
  name: string;
  icon: any; // Lucide icon component
  defaultProps: Record<string, any>;
  controls: PropertyControl[];
  component: React.ComponentType<{ element: PageElement; isSelected: boolean }>;
}

export type PreviewMode = "desktop" | "tablet" | "mobile";

export interface BuilderState {
  pageData: PageData;
  selectedElementId: string | null;
  previewMode: PreviewMode;
  history: {
    past: PageData[];
    future: PageData[];
  };
}
