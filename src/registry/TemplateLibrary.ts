import { StarterTemplate } from "@/types";
import { sectionLibrary } from "./SectionLibrary";

export const templateLibrary: StarterTemplate[] = [
  {
    id: "services-website",
    name: "Professional Services",
    description: "Highly refined, premium corporate layout designed for consultants, strategists, agencies, and professional services firms.",
    category: "Corporate",
    defaultThemeId: "corporate",
    sections: [
      sectionLibrary.find((s) => s.id === "prof-navbar")!,
      sectionLibrary.find((s) => s.id === "prof-hero")!,
      sectionLibrary.find((s) => s.id === "prof-trust")!,
      sectionLibrary.find((s) => s.id === "prof-services")!,
      sectionLibrary.find((s) => s.id === "prof-about")!,
      sectionLibrary.find((s) => s.id === "prof-process")!,
      sectionLibrary.find((s) => s.id === "prof-case-study")!,
      sectionLibrary.find((s) => s.id === "prof-testimonials")!,
      sectionLibrary.find((s) => s.id === "prof-cta")!,
      sectionLibrary.find((s) => s.id === "prof-footer")!,
    ].filter(Boolean),
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description: "High-converting layout with a centered hero, structured service cards, testimonials quotes, newsletter banners, and a footer.",
    category: "General",
    defaultThemeId: "modern",
    sections: [
      sectionLibrary.find((s) => s.id === "prof-navbar")!,
      sectionLibrary.find((s) => s.id === "prof-hero")!,
      sectionLibrary.find((s) => s.id === "prof-services")!,
      sectionLibrary.find((s) => s.id === "prof-testimonials")!,
      sectionLibrary.find((s) => s.id === "prof-cta")!,
      sectionLibrary.find((s) => s.id === "prof-footer")!,
    ].filter(Boolean),
  },
  {
    id: "blank-page",
    name: "Start Blank Slate",
    description: "An empty clean slate website project. Drag and drop modular sections directly onto the canvas to construct your page grid from scratch.",
    category: "Minimal",
    defaultThemeId: "minimal",
    sections: [],
  },
];
export default templateLibrary;
