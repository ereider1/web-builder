import React from "react";
import { PageElement } from "@/types";
import { useBuilder } from "@/store/BuilderContext";
import { resolveResponsive } from "@/utils/responsive";

interface TextComponentProps {
  element: PageElement;
  isSelected: boolean;
}

export const TextComponent: React.FC<TextComponentProps> = ({ element }) => {
  const { state } = useBuilder();
  const { previewMode } = state;

  const text = resolveResponsive(
    element.props.text ?? "This is a paragraph text element. Select it to customize properties.",
    previewMode
  );
  const fontSize = resolveResponsive(element.props.fontSize ?? "16px", previewMode);
  const color = resolveResponsive(
    element.props.color ?? "var(--theme-foreground)",
    previewMode
  );
  const alignment = resolveResponsive(element.props.alignment ?? "left", previewMode);

  return (
    <p
      style={{
        fontSize,
        color,
        textAlign: alignment as any,
        fontFamily: "var(--theme-body-font)",
      }}
      className="w-full leading-relaxed transition-all duration-200 whitespace-pre-wrap"
    >
      {text}
    </p>
  );
};
export default TextComponent;
