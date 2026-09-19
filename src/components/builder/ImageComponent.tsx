import React from "react";
import { PageElement } from "@/types";

interface ImageComponentProps {
  element: PageElement;
  isSelected: boolean;
}

export const ImageComponent: React.FC<ImageComponentProps> = ({ element }) => {
  const {
    src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60",
    alt = "Placeholder beach sunset image",
    width = "100%",
    height = "300px",
    borderRadius = "8px",
    alignment = "center",
  } = element.props;

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
