import React from "react";
import { PageElement } from "@/types";
import { useBuilder } from "@/store/BuilderContext";
import { resolveResponsive } from "@/utils/responsive";

interface SectionComponentProps {
  element: PageElement;
  isSelected: boolean;
  children?: React.ReactNode;
}

export const SectionComponent: React.FC<SectionComponentProps> = ({
  element,
  children,
}) => {
  const { state } = useBuilder();
  const { previewMode } = state;

  const backgroundColor = resolveResponsive(
    element.props.backgroundColor ?? "var(--theme-bg)",
    previewMode
  );
  const paddingTop = resolveResponsive(
    element.props.paddingTop ?? "var(--theme-section-spacing)",
    previewMode
  );
  const paddingBottom = resolveResponsive(
    element.props.paddingBottom ?? "var(--theme-section-spacing)",
    previewMode
  );
  const containerWidth = resolveResponsive(
    element.props.containerWidth ?? "max-w-5xl",
    previewMode
  );
  const flexDirection = resolveResponsive(
    element.props.flexDirection ?? "col",
    previewMode
  );
  const gap = resolveResponsive(element.props.gap ?? "16px", previewMode);

  const widthClass =
    containerWidth === "max-w-3xl"
      ? "max-w-3xl"
      : containerWidth === "max-w-5xl"
      ? "max-w-5xl"
      : containerWidth === "max-w-7xl"
      ? "max-w-7xl"
      : "w-full";

  const flexClass = flexDirection === "row" ? "flex flex-row" : "flex flex-col";

  return (
    <section
      style={{
        backgroundColor,
        paddingTop,
        paddingBottom,
      }}
      className="w-full transition-all duration-200"
    >
      <div
        style={{ gap }}
        className={`mx-auto px-6 w-full ${widthClass} ${flexClass} min-h-[50px]`}
      >
        {children}
      </div>
    </section>
  );
};
export default SectionComponent;
