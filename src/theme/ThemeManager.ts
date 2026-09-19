import { Theme } from "@/types";

export const builtInThemes: Theme[] = [
  {
    id: "modern",
    name: "Modern",
    colors: {
      background: "#ffffff",
      foreground: "#1f2937",
      primary: "#2563eb",
      secondary: "#4f46e5",
      muted: "#f3f4f6",
      border: "#e5e7eb",
      accent: "#3b82f6",
    },
    typography: {
      headingFont: "system-ui, -apple-system, sans-serif",
      bodyFont: "system-ui, -apple-system, sans-serif",
      headingWeight: "700",
      bodyWeight: "400",
    },
    radius: {
      sm: "4px",
      md: "8px",
      lg: "12px",
    },
    spacing: {
      section: "80px",
      container: "1140px",
    },
    buttons: {
      radius: "6px",
      style: "solid",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    colors: {
      background: "#ffffff",
      foreground: "#000000",
      primary: "#000000",
      secondary: "#4a4a4a",
      muted: "#f8f8f8",
      border: "#e5e5e5",
      accent: "#7a7a7a",
    },
    typography: {
      headingFont: "Courier, monospace",
      bodyFont: "system-ui, sans-serif",
      headingWeight: "600",
      bodyWeight: "300",
    },
    radius: {
      sm: "0px",
      md: "0px",
      lg: "0px",
    },
    spacing: {
      section: "100px",
      container: "1000px",
    },
    buttons: {
      radius: "0px",
      style: "outline",
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    colors: {
      background: "#fdfbf7",
      foreground: "#2c2520",
      primary: "#843d1a",
      secondary: "#5c4f46",
      muted: "#f4ede4",
      border: "#e5dad0",
      accent: "#a0522d",
    },
    typography: {
      headingFont: "Georgia, serif",
      bodyFont: "Georgia, serif",
      headingWeight: "600",
      bodyWeight: "400",
    },
    radius: {
      sm: "3px",
      md: "6px",
      lg: "10px",
    },
    spacing: {
      section: "90px",
      container: "960px",
    },
    buttons: {
      radius: "4px",
      style: "solid",
    },
  },
  {
    id: "bold",
    name: "Bold",
    colors: {
      background: "#ffffff",
      foreground: "#0c0a09",
      primary: "#ea580c",
      secondary: "#f97316",
      muted: "#ffedd5",
      border: "#0c0a09",
      accent: "#06b6d4",
    },
    typography: {
      headingFont: "Impact, Haettenschweiler, sans-serif",
      bodyFont: "system-ui, sans-serif",
      headingWeight: "800",
      bodyWeight: "500",
    },
    radius: {
      sm: "4px",
      md: "10px",
      lg: "20px",
    },
    spacing: {
      section: "120px",
      container: "1200px",
    },
    buttons: {
      radius: "10px",
      style: "solid",
    },
  },
  {
    id: "corporate",
    name: "Corporate",
    colors: {
      background: "#f8fafc",
      foreground: "#0f172a",
      primary: "#0f172a",
      secondary: "#334155",
      muted: "#f1f5f9",
      border: "#cbd5e1",
      accent: "#2563eb",
    },
    typography: {
      headingFont: "Arial, sans-serif",
      bodyFont: "Arial, sans-serif",
      headingWeight: "700",
      bodyWeight: "400",
    },
    radius: {
      sm: "2px",
      md: "4px",
      lg: "8px",
    },
    spacing: {
      section: "70px",
      container: "1200px",
    },
    buttons: {
      radius: "4px",
      style: "solid",
    },
  },
  {
    id: "warm",
    name: "Warm",
    colors: {
      background: "#fffaf5",
      foreground: "#442a1d",
      primary: "#d97706",
      secondary: "#b45309",
      muted: "#fef3c7",
      border: "#f5e1d3",
      accent: "#ec4899",
    },
    typography: {
      headingFont: "system-ui, sans-serif",
      bodyFont: "system-ui, sans-serif",
      headingWeight: "700",
      bodyWeight: "400",
    },
    radius: {
      sm: "6px",
      md: "12px",
      lg: "24px",
    },
    spacing: {
      section: "80px",
      container: "1100px",
    },
    buttons: {
      radius: "12px",
      style: "solid",
    },
  },
];

const LOCAL_STORAGE_KEY = "gemini-builder-custom-themes";

export function getCustomThemes(): Theme[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading custom themes:", e);
    return [];
  }
}

export function saveCustomTheme(theme: Theme): Theme[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getCustomThemes();
    const updated = [...existing.filter((t) => t.id !== theme.id), theme];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Error saving custom theme:", e);
    return getCustomThemes();
  }
}

export function deleteCustomTheme(id: string): Theme[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getCustomThemes();
    const updated = existing.filter((t) => t.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Error deleting custom theme:", e);
    return getCustomThemes();
  }
}
