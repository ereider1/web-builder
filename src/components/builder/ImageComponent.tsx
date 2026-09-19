import React from "react";
import { PageElement } from "@/types";
import { useBuilder } from "@/store/BuilderContext";
import { resolveResponsive } from "@/utils/responsive";

interface ImageComponentProps {
  element: PageElement;
  isSelected: boolean;
}

export const ImageComponent: React.FC<ImageComponentProps> = ({ element }) => {
  const { state } = useBuilder();
  const { previewMode } = state;

  const src = resolveResponsive(
    element.props.src ?? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60",
    previewMode
  );
  const alt = resolveResponsive(element.props.alt ?? "Placeholder image", previewMode);
  const width = resolveResponsive(element.props.width ?? "100%", previewMode);
  const height = resolveResponsive(element.props.height ?? "350px", previewMode);
  const borderRadius = resolveResponsive(
    element.props.borderRadius ?? "var(--radius-md)",
    previewMode
  );
  const alignment = resolveResponsive(element.props.alignment ?? "center", previewMode);

  const justifyClass =
    alignment === "left"
      ? "justify-start"
      : alignment === "right"
      ? "justify-end"
      : "justify-center";

  return (
    <div className={`w-full flex ${justifyClass} transition-all duration-200`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{
          width: width,
          height: height,
          borderRadius: borderRadius,
          objectFit: "cover",
        }}
        className="shadow-sm max-w-full"
      />
    </div>
  );
};
export default ImageComponent;
