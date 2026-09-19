export type ElementType = "section" | "heading" | "text" | "button" | "image";

// Responsive property supporting desktop, optional tablet/mobile overrides, or fallback to inheritance.
export type ResponsiveProperty<T> = T | {
  desktop: T;
  tablet?: T;
  mobile?: T;
};

export interface PageElement {
  id: string;
  type: ElementType;
  props: Record<string, any>;
  children?: PageElement[];
}

export interface PageData {
  id: string;
  name: string;
  themeId: string; // The active theme associated with this page
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
  isResponsive?: boolean; // If true, can have desktop, tablet, and mobile overrides
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

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  muted: string;
  border: string;
  accent: string;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  headingWeight: string;
  bodyWeight: string;
}

export interface ThemeRadius {
  sm: string;
  md: string;
  lg: string;
}

export interface ThemeSpacing {
  section: string;
  container: string;
}

export interface ThemeButtons {
  radius: string;
  style: "solid" | "outline" | "ghost";
}

export interface Theme {
  id: string;
  name: string;
  isCustom?: boolean; // True if created by the user and saved to localStorage
  colors: ThemeColors;
  typography: ThemeTypography;
  radius: ThemeRadius;
  spacing: ThemeSpacing;
  buttons: ThemeButtons;
}

export interface SectionDefinition {
  id: string;
  name: string;
  category: "HERO" | "ABOUT" | "SERVICES" | "SOCIAL" | "CONVERSION" | "INFORMATION" | "FOOTER";
  thumbnail?: string; // Optional SVG thumbnail markup or description
  elements: PageElement[];
}

export interface StarterTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: SectionDefinition[];
  defaultThemeId: string;
}

export type PreviewMode = "desktop" | "tablet" | "mobile";

export interface BuilderState {
  pageData: PageData;
  selectedElementId: string | null;
  previewMode: PreviewMode;
  activeTheme: Theme;
  customThemes: Theme[];
  history: {
    past: { pageData: PageData; activeTheme: Theme }[];
    future: { pageData: PageData; activeTheme: Theme }[];
  };
}
