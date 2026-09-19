import { StarterTemplate } from "@/types";
import { sectionLibrary } from "./SectionLibrary";

export const templateLibrary: StarterTemplate[] = [
  {
    id: "landing-page",
    name: "Landing Page Starter",
    description:
      "A high-converting product landing template including a simple navbar, centered hero, three-cards services list, customer social proof quote, a call-to-action block, and footer.",
    category: "Landing",
    defaultThemeId: "modern",
    sections: [
      sectionLibrary.find((s) => s.id === "simple-navbar")!,
      sectionLibrary.find((s) => s.id === "hero-centered")!,
      sectionLibrary.find((s) => s.id === "services-3-cards")!,
      sectionLibrary.find((s) => s.id === "testimonials")!,
      sectionLibrary.find((s) => s.id === "cta")!,
      sectionLibrary.find((s) => s.id === "simple-footer")!,
    ].filter(Boolean),
  },
  {
    id: "services-website",
    name: "Services Portfolio",
    description:
      "An agency/freelancer style template using a simple navbar, split hero layout, about story split, metrics features list, customer testimonials quotes, and clean footer.",
    category: "Services",
    defaultThemeId: "editorial",
    sections: [
      sectionLibrary.find((s) => s.id === "simple-navbar")!,
      sectionLibrary.find((s) => s.id === "hero-split")!,
      sectionLibrary.find((s) => s.id === "about-split")!,
      sectionLibrary.find((s) => s.id === "features")!,
      sectionLibrary.find((s) => s.id === "testimonials")!,
      sectionLibrary.find((s) => s.id === "simple-footer")!,
    ].filter(Boolean),
  },
  {
    id: "restaurant-website",
    name: "Restaurant / Cafe Portal",
    description:
      "A culinary showcase layout utilizing a centered navbar, centered hero, spec menu card list, testimonials quotes, split map contacts, and footer with warm presets.",
    category: "Culinary",
    defaultThemeId: "warm",
    sections: [
      sectionLibrary.find((s) => s.id === "simple-navbar")!,
      sectionLibrary.find((s) => s.id === "hero-centered")!,
      sectionLibrary.find((s) => s.id === "about-centered")!,
      sectionLibrary.find((s) => s.id === "services-3-cards")!,
      sectionLibrary.find((s) => s.id === "testimonials")!,
      sectionLibrary.find((s) => s.id === "contact")!,
      sectionLibrary.find((s) => s.id === "simple-footer")!,
    ].filter(Boolean),
  },
  {
    id: "corporate-website",
    name: "Corporate / Enterprise Portal",
    description:
      "A corporate-grade structure featuring a clean navbar, split hero, services 4-cards list, statistics counters, testimonials sliders, newsletter cta, and custom footer.",
    category: "Corporate",
    defaultThemeId: "corporate",
    sections: [
      sectionLibrary.find((s) => s.id === "simple-navbar")!,
      sectionLibrary.find((s) => s.id === "hero-split")!,
      sectionLibrary.find((s) => s.id === "services-4-cards")!,
      sectionLibrary.find((s) => s.id === "stats")!,
      sectionLibrary.find((s) => s.id === "testimonials")!,
      sectionLibrary.find((s) => s.id === "cta")!,
      sectionLibrary.find((s) => s.id === "simple-footer")!,
    ].filter(Boolean),
  },
  {
    id: "blank-page",
    name: "Start Blank slate",
    description:
      "An empty clean slate website project. Drag and drop modular sections directly onto the canvas to construct your page grid.",
    category: "Minimal",
    defaultThemeId: "minimal",
    sections: [],
  },
];
export default templateLibrary;
