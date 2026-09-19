import React from "react";
import { PageElement } from "@/types";

interface ButtonComponentProps {
  element: PageElement;
  isSelected: boolean;
}

export const ButtonComponent: React.FC<ButtonComponentProps> = ({ element }) => {
  const {
    text = "Click Me",
    url = "#",
    backgroundColor = "#111111",
    textColor = "#ffffff",
    paddingX = "16px",
    paddingY = "10px",
    borderRadius = "4px",
    fontSize = "14px",
    alignment = "left",
  } = element.props;

  // Since a button is block-like but should align according to standard settings, we can wrap it
  const justifyClass =
    alignment === "center"
      ? "justify-center"
      : alignment === "right"
      ? "justify-end"
      : "justify-start";

  return (
    <div className={`w-full flex ${justifyClass} transition-all duration-200`}>
      <a
        href={url}
        onClick={(e) => e.preventDefault()} // Prevent navigation in builder
        style={{
          backgroundColor,
          color: textColor,
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          borderRadius,
          fontSize,
        }}
        className="inline-flex items-center justify-center font-medium shadow-sm hover:opacity-90 active:scale-95 transition-all duration-150"
      >
        {text}
      </a>
    </div>
  );
};
