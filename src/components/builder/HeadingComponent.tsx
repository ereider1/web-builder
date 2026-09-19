import React from "react";
import { PageElement } from "@/types";

interface HeadingComponentProps {
  element: PageElement;
  isSelected: boolean;
}

export const HeadingComponent: React.FC<HeadingComponentProps> = ({
  element,
}) => {
  const {
    text = "Heading Text",
    fontSize = "36px",
    fontWeight = "700",
    color = "#111111",
    alignment = "left",
  } = element.props;

  return (
    <h2
      style={{
        fontSize,
        fontWeight,
        color,
        textAlign: alignment as any,
      }}
      className="w-full tracking-tight leading-tight transition-all duration-200"
    >
      {text}
    </h2>
  );
};
