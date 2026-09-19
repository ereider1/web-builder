import { PreviewMode, ResponsiveProperty } from "@/types";

/**
 * Resolves a potentially responsive property based on the active preview mode.
 * Implements inheritance: mobile -> tablet -> desktop.
 */
export function resolveResponsive<T>(
  value: ResponsiveProperty<T>,
  mode: PreviewMode
): T {
  if (value === undefined || value === null) {
    return value as T;
  }

  // Check if value matches the ResponsiveProperty structure: { desktop, tablet?, mobile? }
  if (
    typeof value === "object" &&
    value !== null &&
    "desktop" in value
  ) {
    const responsiveVal = value as { desktop: T; tablet?: T; mobile?: T };

    if (mode === "mobile") {
      if (responsiveVal.mobile !== undefined && responsiveVal.mobile !== null && responsiveVal.mobile !== "") {
        return responsiveVal.mobile;
      }
      if (responsiveVal.tablet !== undefined && responsiveVal.tablet !== null && responsiveVal.tablet !== "") {
        return responsiveVal.tablet;
      }
      return responsiveVal.desktop;
    }

    if (mode === "tablet") {
      if (responsiveVal.tablet !== undefined && responsiveVal.tablet !== null && responsiveVal.tablet !== "") {
        return responsiveVal.tablet;
      }
      return responsiveVal.desktop;
    }

    return responsiveVal.desktop;
  }

  return value as T;
}
