import React from "react";
import { PageElement } from "@/types";
import { useBuilder } from "@/store/BuilderContext";
import { resolveResponsive } from "@/utils/responsive";

interface ButtonComponentProps {
  element: PageElement;
  isSelected: boolean;
}

export const ButtonComponent: React.FC<ButtonComponentProps> = ({ element }) => {
  const { state } = useBuilder();
  const { previewMode } = state;

  const text = resolveResponsive(element.props.text ?? "Click Me", previewMode);
  const url = resolveResponsive(element.props.url ?? "#", previewMode);
  const backgroundColor = resolveResponsive(
    element.props.backgroundColor ?? "var(--theme-primary)",
    previewMode
  );
  const textColor = resolveResponsive(
    element.props.textColor ?? "var(--theme-bg)",
    previewMode
  );
  const paddingX = resolveResponsive(element.props.paddingX ?? "20px", previewMode);
  const paddingY = resolveResponsive(element.props.paddingY ?? "10px", previewMode);
  const borderRadius = resolveResponsive(
    element.props.borderRadius ?? "var(--radius-md)",
    previewMode
  );
  const fontSize = resolveResponsive(element.props.fontSize ?? "14px", previewMode);
  const alignment = resolveResponsive(element.props.alignment ?? "left", previewMode);

  const justifyClass =
    alignment === "center"
      ? "justify-center"
      : alignment === "right"
      ? "justify-end"
      : "justify-start";

  // Check if button is solid, outline or ghost
  const isOutline = element.props.style === "outline" || (state.activeTheme.buttons.style === "outline" && !element.props.style);
  const isGhost = element.props.style === "ghost" || (state.activeTheme.buttons.style === "ghost" && !element.props.style);

  const buttonStyle: React.CSSProperties = isOutline
    ? {
        border: `2px solid ${backgroundColor}`,
        color: backgroundColor,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        borderRadius,
        fontSize,
        fontFamily: "var(--theme-body-font)",
      }
    : isGhost
    ? {
        color: backgroundColor,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        borderRadius,
        fontSize,
        fontFamily: "var(--theme-body-font)",
      }
    : {
        backgroundColor,
        color: textColor,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        paddingTop: paddingY,
        paddingBottom: paddingY,
        borderRadius,
        fontSize,
        fontFamily: "var(--theme-body-font)",
      };

  return (
    <div className={`w-full flex ${justifyClass} transition-all duration-200`}>
      <a
        href={url}
        onClick={(e) => e.preventDefault()} // Prevent navigation in builder
        style={buttonStyle}
        className="inline-flex items-center justify-center font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all duration-150"
      >
        {text}
      </a>
    </div>
  );
};
export default ButtonComponent;
