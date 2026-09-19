import {
  Layout,
  Heading,
  Type,
  Square,
  Image as ImageIcon,
} from "lucide-react";
import { ComponentRegistryEntry, ElementType } from "@/types";
import { SectionComponent } from "@/components/builder/SectionComponent";
import { HeadingComponent } from "@/components/builder/HeadingComponent";
import { TextComponent } from "@/components/builder/TextComponent";
import { ButtonComponent } from "@/components/builder/ButtonComponent";
import { ImageComponent } from "@/components/builder/ImageComponent";

export const componentRegistry: Record<ElementType, ComponentRegistryEntry> = {
  section: {
    type: "section",
    name: "Section",
    icon: Layout,
    defaultProps: {
      backgroundColor: "#ffffff",
      paddingTop: "60px",
      paddingBottom: "60px",
      containerWidth: "max-w-5xl",
      flexDirection: "col",
      gap: "16px",
    },
    controls: [
      {
        name: "backgroundColor",
        label: "Background Color",
        type: "color",
        defaultValue: "#ffffff",
      },
      {
        name: "paddingTop",
        label: "Padding Top",
        type: "text",
        defaultValue: "60px",
      },
      {
        name: "paddingBottom",
        label: "Padding Bottom",
        type: "text",
        defaultValue: "60px",
      },
      {
        name: "containerWidth",
        label: "Container Width",
        type: "select",
        defaultValue: "max-w-5xl",
        options: [
          { label: "Narrow (3xl)", value: "max-w-3xl" },
          { label: "Medium (5xl)", value: "max-w-5xl" },
          { label: "Wide (7xl)", value: "max-w-7xl" },
          { label: "Full Width", value: "w-full" },
        ],
      },
      {
        name: "flexDirection",
        label: "Direction",
        type: "select",
        defaultValue: "col",
        options: [
          { label: "Vertical (Column)", value: "col" },
          { label: "Horizontal (Row)", value: "row" },
        ],
      },
      {
        name: "gap",
        label: "Gap spacing",
        type: "text",
        defaultValue: "16px",
      },
    ],
    component: SectionComponent,
  },
  heading: {
    type: "heading",
    name: "Heading",
    icon: Heading,
    defaultProps: {
      text: "Heading Text",
      fontSize: "36px",
      fontWeight: "700",
      color: "#111111",
      alignment: "left",
    },
    controls: [
      {
        name: "text",
        label: "Content",
        type: "text",
        defaultValue: "Heading Text",
      },
      {
        name: "fontSize",
        label: "Font Size",
        type: "text",
        defaultValue: "36px",
      },
      {
        name: "fontWeight",
        label: "Font Weight",
        type: "select",
        defaultValue: "700",
        options: [
          { label: "Light (300)", value: "300" },
          { label: "Regular (400)", value: "400" },
          { label: "Medium (500)", value: "500" },
          { label: "Semi-Bold (600)", value: "600" },
          { label: "Bold (700)", value: "700" },
          { label: "Extra-Bold (800)", value: "800" },
        ],
      },
      {
        name: "color",
        label: "Color",
        type: "color",
        defaultValue: "#111111",
      },
      {
        name: "alignment",
        label: "Alignment",
        type: "select",
        defaultValue: "left",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
      },
    ],
    component: HeadingComponent,
  },
  text: {
    type: "text",
    name: "Paragraph",
    icon: Type,
    defaultProps: {
      text: "This is a text element. Select it to edit its content and styles in the inspector on the right.",
      fontSize: "16px",
      color: "#374151",
      alignment: "left",
    },
    controls: [
      {
        name: "text",
        label: "Content",
        type: "textarea",
        defaultValue: "This is a text element. Select it to edit its content and styles in the inspector on the right.",
      },
      {
        name: "fontSize",
        label: "Font Size",
        type: "text",
        defaultValue: "16px",
      },
      {
        name: "color",
        label: "Color",
        type: "color",
        defaultValue: "#374151",
      },
      {
        name: "alignment",
        label: "Alignment",
        type: "select",
        defaultValue: "left",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
          { label: "Justify", value: "justify" },
        ],
      },
    ],
    component: TextComponent,
  },
  button: {
    type: "button",
    name: "Button",
    icon: Square,
    defaultProps: {
      text: "Click Me",
      url: "#",
      backgroundColor: "#111111",
      textColor: "#ffffff",
      paddingX: "16px",
      paddingY: "10px",
      borderRadius: "4px",
      fontSize: "14px",
      alignment: "left",
    },
    controls: [
      {
        name: "text",
        label: "Button Text",
        type: "text",
        defaultValue: "Click Me",
      },
      {
        name: "url",
        label: "Link URL",
        type: "text",
        defaultValue: "#",
      },
      {
        name: "backgroundColor",
        label: "Background Color",
        type: "color",
        defaultValue: "#111111",
      },
      {
        name: "textColor",
        label: "Text Color",
        type: "color",
        defaultValue: "#ffffff",
      },
      {
        name: "fontSize",
        label: "Font Size",
        type: "text",
        defaultValue: "14px",
      },
      {
        name: "paddingX",
        label: "Padding X (Horizontal)",
        type: "text",
        defaultValue: "16px",
      },
      {
        name: "paddingY",
        label: "Padding Y (Vertical)",
        type: "text",
        defaultValue: "10px",
      },
      {
        name: "borderRadius",
        label: "Border Radius",
        type: "text",
        defaultValue: "4px",
      },
      {
        name: "alignment",
        label: "Alignment",
        type: "select",
        defaultValue: "left",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
      },
    ],
    component: ButtonComponent,
  },
  image: {
    type: "image",
    name: "Image",
    icon: ImageIcon,
    defaultProps: {
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60",
      alt: "Placeholder image",
      width: "100%",
      height: "300px",
      borderRadius: "8px",
      alignment: "center",
    },
    controls: [
      {
        name: "src",
        label: "Image URL",
        type: "text",
        defaultValue: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60",
      },
      {
        name: "alt",
        label: "Alt Text",
        type: "text",
        defaultValue: "Placeholder image",
      },
      {
        name: "width",
        label: "Width",
        type: "text",
        defaultValue: "100%",
      },
      {
        name: "height",
        label: "Height",
        type: "text",
        defaultValue: "300px",
      },
      {
        name: "borderRadius",
        label: "Border Radius",
        type: "text",
        defaultValue: "8px",
      },
      {
        name: "alignment",
        label: "Alignment",
        type: "select",
        defaultValue: "center",
        options: [
          { label: "Left", value: "left" },
          { label: "Center", value: "center" },
          { label: "Right", value: "right" },
        ],
      },
    ],
    component: ImageComponent,
  },
};
