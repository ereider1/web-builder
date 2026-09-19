import React from "react";
import { PageElement } from "@/types";
import { useBuilder } from "@/store/BuilderContext";
import { resolveResponsive } from "@/utils/responsive";

interface HeadingComponentProps {
  element: PageElement;
  isSelected: boolean;
}

export const HeadingComponent: React.FC<HeadingComponentProps> = ({
  element,
}) => {
  const { state } = useBuilder();
  const { previewMode } = state;

  const text = resolveResponsive(element.props.text ?? "Heading Text", previewMode);
  const fontSize = resolveResponsive(element.props.fontSize ?? "36px", previewMode);
  const fontWeight = resolveResponsive(
    element.props.fontWeight ?? "var(--theme-heading-weight)",
    previewMode
  );
  const color = resolveResponsive(
    element.props.color ?? "var(--theme-primary)",
    previewMode
  );
  const alignment = resolveResponsive(element.props.alignment ?? "left", previewMode);

  return (
    <h2
      style={{
        fontSize,
        fontWeight,
        color,
        textAlign: alignment as any,
        fontFamily: "var(--theme-heading-font)",
      }}
      className="w-full tracking-tight leading-tight transition-all duration-200"
    >
      {text}
    </h2>
  );
};
export default HeadingComponent;
