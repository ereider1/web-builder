import { StarterTemplate } from "@/types";
import { sectionLibrary } from "./SectionLibrary";

export const templateLibrary: StarterTemplate[] = [
  {
    id: "landing-page",
    name: "Landing Page Starter",
    description:
      "A high-converting product landing template including a centered hero, headline list services, customer social proof quote, newsletter CTA, and clean footer.",
    category: "Landing",
    defaultThemeId: "modern",
    sections: [
      sectionLibrary.find((s) => s.id === "hero-centered")!,
      sectionLibrary.find((s) => s.id === "services-cards")!,
      sectionLibrary.find((s) => s.id === "social-proof")!,
      sectionLibrary.find((s) => s.id === "conversion-cta")!,
      sectionLibrary.find((s) => s.id === "simple-footer")!,
    ].filter(Boolean),
  },
  {
    id: "services-website",
    name: "Services Portfolio",
    description:
      "An agency/freelancer style template using a split hero layout, team about sections, customer quotes, and standard branding elements.",
    category: "Services",
    defaultThemeId: "editorial",
    sections: [
      sectionLibrary.find((s) => s.id === "hero-split")!,
      sectionLibrary.find((s) => s.id === "about-split")!,
      sectionLibrary.find((s) => s.id === "social-proof")!,
      sectionLibrary.find((s) => s.id === "simple-footer")!,
    ].filter(Boolean),
  },
  {
    id: "restaurant-website",
    name: "Restaurant / Cafe",
    description:
      "A culinary showcase layout utilizing a centered hero, menu highlight list, reviews social proof, and a warm earthy theme preset.",
    category: "Culinary",
    defaultThemeId: "warm",
    sections: [
      sectionLibrary.find((s) => s.id === "hero-centered")!,
      sectionLibrary.find((s) => s.id === "services-cards")!,
      sectionLibrary.find((s) => s.id === "social-proof")!,
      sectionLibrary.find((s) => s.id === "simple-footer")!,
    ].filter(Boolean),
  },
  {
    id: "corporate-website",
    name: "Corporate / Enterprise",
    description:
      "A corporate-grade structure featuring a split hero, full-width feature cards, customer metrics testimonials, and bold dark accents.",
    category: "Corporate",
    defaultThemeId: "corporate",
    sections: [
      sectionLibrary.find((s) => s.id === "hero-split")!,
      sectionLibrary.find((s) => s.id === "services-cards")!,
      sectionLibrary.find((s) => s.id === "social-proof")!,
      sectionLibrary.find((s) => s.id === "conversion-cta")!,
      sectionLibrary.find((s) => s.id === "simple-footer")!,
    ].filter(Boolean),
  },
  {
    id: "blank-page",
    name: "Start Blank",
    description:
      "An empty clean slate workspace. Drag and drop sections and elements to compile your design from scratch.",
    category: "Minimal",
    defaultThemeId: "minimal",
    sections: [],
  },
];
