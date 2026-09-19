import React from "react";
import { PageElement } from "@/types";

interface SectionComponentProps {
  element: PageElement;
  isSelected: boolean;
  children?: React.ReactNode;
}

export const SectionComponent: React.FC<SectionComponentProps> = ({
  element,
  children,
}) => {
  const {
    backgroundColor = "#ffffff",
    paddingTop = "40px",
    paddingBottom = "40px",
    containerWidth = "max-w-5xl",
    flexDirection = "col",
    gap = "16px",
  } = element.props;

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
        className={`mx-auto px-6 w-full ${widthClass} ${flexClass} min-h-[100px]`}
      >
        {children}
      </div>
    </section>
  );
};
