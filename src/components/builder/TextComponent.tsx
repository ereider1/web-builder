import React from "react";
import { PageElement } from "@/types";

interface TextComponentProps {
  element: PageElement;
  isSelected: boolean;
}

export const TextComponent: React.FC<TextComponentProps> = ({ element }) => {
  const {
    text = "This is a text element. Select it to edit its content and styles in the inspector on the right.",
    fontSize = "16px",
    color = "#374151",
    alignment = "left",
  } = element.props;

  return (
    <p
      style={{
        fontSize,
        color,
        textAlign: alignment as any,
      }}
      className="w-full leading-relaxed transition-all duration-200 whitespace-pre-wrap"
    >
      {text}
    </p>
  );
};
