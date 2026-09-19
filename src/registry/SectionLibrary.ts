import { SectionDefinition, PageElement } from "@/types";

export const sectionLibrary: SectionDefinition[] = [
  // ==================== 1. NAVIGATION ====================
  {
    id: "prof-navbar",
    name: "Navbar — Corporate Wordmark",
    category: "NAVIGATION",
    settings: {
      backgroundColor: "var(--theme-bg)",
      paddingTop: "20px",
      paddingBottom: "20px",
      containerWidth: "max-w-7xl",
      flexDirection: "row",
      gap: "16px",
    },
    elements: [
      {
        id: "prof-nav-brand",
        type: "heading",
        props: {
          text: "NORTHSTAR",
          fontSize: "18px",
          fontWeight: "800",
          color: "var(--theme-primary)",
          alignment: "left",
        },
      },
      {
        id: "prof-nav-links",
        type: "text",
        props: {
          text: "About Us     /     Our Services     /     Process     /     Work     /     Contact",
          fontSize: "13px",
          color: "var(--theme-foreground)",
          alignment: "center",
        },
      },
      {
        id: "prof-nav-cta",
        type: "button",
        props: {
          text: "Let's Talk",
          url: "mailto:partner@northstar.co",
          backgroundColor: "var(--theme-primary)",
          textColor: "var(--theme-bg)",
          paddingX: "18px",
          paddingY: "9px",
          borderRadius: "var(--radius-sm)",
          fontSize: "13px",
          alignment: "right",
        },
      },
    ],
  },

  // ==================== 2. HERO (Sophisticated Two-Column Layout) ====================
  {
    id: "prof-hero",
    name: "Hero — Corporate Split",
    category: "HERO",
    settings: {
      backgroundColor: "var(--theme-bg)",
      paddingTop: { desktop: "100px", tablet: "80px", mobile: "50px" },
      paddingBottom: { desktop: "100px", tablet: "80px", mobile: "50px" },
      containerWidth: "max-w-7xl",
      flexDirection: "row",
      gap: "48px",
    },
    elements: [
      {
        id: "prof-hero-eyebrow",
        type: "text",
        props: {
          text: "INDEPENDENT CONSULTING",
          fontSize: "12px",
          fontWeight: "800",
          color: "var(--theme-primary)",
          alignment: "left",
        },
      },
      {
        id: "prof-hero-title",
        type: "heading",
        props: {
          text: "NORTHSTAR CONSULTING",
          fontSize: "16px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-hero-headline",
        type: "heading",
        props: {
          text: "Strategy for businesses ready to grow.",
          fontSize: { desktop: "44px", tablet: "36px", mobile: "30px" },
          fontWeight: "800",
          color: "var(--theme-primary)",
          alignment: "left",
        },
      },
      {
        id: "prof-hero-desc",
        type: "text",
        props: {
          text: "Northstar Consulting helps growing companies simplify operations, sharpen brand strategy, and build visual systems that scale.",
          fontSize: "15px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-hero-btn",
        type: "button",
        props: {
          text: "Consult Our Partners",
          url: "mailto:partner@northstar.co",
          backgroundColor: "var(--theme-primary)",
          textColor: "var(--theme-bg)",
          paddingX: "24px",
          paddingY: "12px",
          borderRadius: "var(--radius-sm)",
          fontSize: "14px",
          alignment: "left",
        },
      },
      {
        id: "prof-hero-image",
        type: "image",
        props: {
          src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
          alt: "Corporate visual representation",
          width: "100%",
          height: "380px",
          borderRadius: "var(--radius-lg)",
          alignment: "center",
        },
      },
    ],
  },

  // ==================== 3. TRUST / INTRO STRIP ====================
  {
    id: "prof-trust",
    name: "Trust — Brand Trust strip",
    category: "SOCIAL",
    settings: {
      backgroundColor: "var(--theme-muted)",
      paddingTop: "24px",
      paddingBottom: "24px",
      containerWidth: "max-w-6xl",
      flexDirection: "row",
      gap: "24px",
    },
    elements: [
      {
        id: "prof-trust-lbl",
        type: "text",
        props: {
          text: "Trusted by ambitious teams globally:",
          fontSize: "13px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-trust-p1",
        type: "heading",
        props: {
          text: "•  APEX",
          fontSize: "14px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "center",
        },
      },
      {
        id: "prof-trust-p2",
        type: "heading",
        props: {
          text: "•  VERTEX",
          fontSize: "14px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "center",
        },
      },
      {
        id: "prof-trust-p3",
        type: "heading",
        props: {
          text: "•  ACME",
          fontSize: "14px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "center",
        },
      },
    ],
  },

  // ==================== 4. SERVICES ====================
  {
    id: "prof-services",
    name: "Services — Structured Cards",
    category: "SERVICES",
    settings: {
      backgroundColor: "var(--theme-bg)",
      paddingTop: { desktop: "90px", tablet: "70px", mobile: "50px" },
      paddingBottom: { desktop: "90px", tablet: "70px", mobile: "50px" },
      containerWidth: "max-w-5xl",
      flexDirection: "col",
      gap: "36px",
    },
    elements: [
      {
        id: "prof-services-h",
        type: "heading",
        props: {
          text: "What We Do",
          fontSize: "32px",
          fontWeight: "800",
          color: "var(--theme-primary)",
          alignment: "center",
        },
      },
      {
        id: "prof-services-t",
        type: "text",
        props: {
          text: "Our core frameworks are engineered for high-performance visual delivery and operational scaling.",
          fontSize: "15px",
          color: "var(--theme-foreground)",
          alignment: "center",
        },
      },
      {
        id: "prof-services-card1-title",
        type: "heading",
        props: {
          text: "01. Brand & Identity Strategy",
          fontSize: "18px",
          fontWeight: "700",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-services-card1-desc",
        type: "text",
        props: {
          text: "We help you clarify your market positioning, define core values tokens, and map a consistent visual brand voice across all touchpoints.",
          fontSize: "14px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-services-card2-title",
        type: "heading",
        props: {
          text: "02. Digital Layout Design",
          fontSize: "18px",
          fontWeight: "700",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-services-card2-desc",
        type: "text",
        props: {
          text: "Engineering high-performance modular Next.js layouts, responsive CSS variables configurations, and strict design token grids.",
          fontSize: "14px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-services-card3-title",
        type: "heading",
        props: {
          text: "03. Systems Consultation",
          fontSize: "18px",
          fontWeight: "700",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-services-card3-desc",
        type: "text",
        props: {
          text: "Aligning company toolsets, structuring database schemas, optimizing rendering pipelines, and deployment strategy.",
          fontSize: "14px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
    ],
  },

  // ==================== 5. ABOUT ====================
  {
    id: "prof-about",
    name: "About — Split Layout",
    category: "ABOUT",
    settings: {
      backgroundColor: "var(--theme-bg)",
      paddingTop: { desktop: "90px", tablet: "70px", mobile: "50px" },
      paddingBottom: { desktop: "90px", tablet: "70px", mobile: "50px" },
      containerWidth: "max-w-5xl",
      flexDirection: "row",
      gap: "48px",
    },
    elements: [
      {
        id: "prof-about-img",
        type: "image",
        props: {
          src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
          alt: "Our consulting space",
          width: "100%",
          height: "320px",
          borderRadius: "var(--radius-md)",
          alignment: "center",
        },
      },
      {
        id: "prof-about-heading",
        type: "heading",
        props: {
          text: "About Our Philosophy",
          fontSize: { desktop: "30px", tablet: "26px", mobile: "22px" },
          fontWeight: "800",
          color: "var(--theme-primary)",
          alignment: "left",
        },
      },
      {
        id: "prof-about-text",
        type: "text",
        props: {
          text: "We are a specialized advisory studio centered around structural web layouts. We help ambitious companies simplify operations, sharpen brand strategy, and build visual systems that scale.",
          fontSize: "15px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-about-btn",
        type: "button",
        props: {
          text: "Read Our Philosophy",
          url: "mailto:partner@northstar.co",
          backgroundColor: "var(--theme-primary)",
          textColor: "var(--theme-bg)",
          paddingX: "18px",
          paddingY: "10px",
          borderRadius: "var(--radius-sm)",
          fontSize: "14px",
          alignment: "left",
        },
      },
    ],
  },

  // ==================== 6. PROCESS ====================
  {
    id: "prof-process",
    name: "Process — 4 Step Pathway",
    category: "CONTENT",
    settings: {
      backgroundColor: "var(--theme-muted)",
      paddingTop: "80px",
      paddingBottom: "80px",
      containerWidth: "max-w-5xl",
      flexDirection: "col",
      gap: "36px",
    },
    elements: [
      {
        id: "prof-process-h",
        type: "heading",
        props: {
          text: "Our Seamless Process",
          fontSize: "30px",
          fontWeight: "800",
          color: "var(--theme-primary)",
          alignment: "center",
        },
      },
      {
        id: "prof-process-s1-title",
        type: "heading",
        props: {
          text: "01 / DISCOVER",
          fontSize: "16px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-process-s1-desc",
        type: "text",
        props: {
          text: "Uncovering your system requirements, mapping existing brand design tokens debt, and documenting structural goals.",
          fontSize: "13px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-process-s2-title",
        type: "heading",
        props: {
          text: "02 / DEFINE",
          fontSize: "16px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-process-s2-desc",
        type: "text",
        props: {
          text: "Clarifying layout and column hierarchies, choosing custom palettes, and establishing robust type scales.",
          fontSize: "13px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-process-s3-title",
        type: "heading",
        props: {
          text: "03 / BUILD",
          fontSize: "16px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-process-s3-desc",
        type: "text",
        props: {
          text: "Compiling type-safe, responsive modular components and wiring them cleanly into active section grids.",
          fontSize: "13px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-process-s4-title",
        type: "heading",
        props: {
          text: "04 / GROW",
          fontSize: "16px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-process-s4-desc",
        type: "text",
        props: {
          text: "Expanding layout capability, optimizing responsive assets, and launching high-performance corporate sites.",
          fontSize: "13px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
    ],
  },

  // ==================== 7. FEATURED CASE STUDY ====================
  {
    id: "prof-case-study",
    name: "Case Study — Editorial Spotlight",
    category: "CONTENT",
    settings: {
      backgroundColor: "var(--theme-bg)",
      paddingTop: { desktop: "90px", tablet: "70px", mobile: "50px" },
      paddingBottom: { desktop: "90px", tablet: "70px", mobile: "50px" },
      containerWidth: "max-w-5xl",
      flexDirection: "row",
      gap: "48px",
    },
    elements: [
      {
        id: "prof-case-study-img",
        type: "image",
        props: {
          src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
          alt: "Featured Case Study visual representation",
          width: "100%",
          height: "320px",
          borderRadius: "var(--radius-lg)",
          alignment: "center",
        },
      },
      {
        id: "prof-case-study-h",
        type: "heading",
        props: {
          text: "Selected Project Case Study",
          fontSize: { desktop: "28px", tablet: "24px", mobile: "20px" },
          fontWeight: "800",
          color: "var(--theme-primary)",
          alignment: "left",
        },
      },
      {
        id: "prof-case-study-d",
        type: "text",
        props: {
          text: "We collaborated closely with the teams to engineer a fully responsive, type-safe design tokens platform from scratch, reducing design debt by over 70% and increasing delivery speeds.",
          fontSize: "15px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-case-study-btn",
        type: "button",
        props: {
          text: "Read Case Study",
          url: "mailto:partner@northstar.co",
          backgroundColor: "var(--theme-primary)",
          textColor: "var(--theme-bg)",
          paddingX: "18px",
          paddingY: "10px",
          borderRadius: "var(--radius-sm)",
          fontSize: "14px",
          alignment: "left",
        },
      },
    ],
  },

  // ==================== 8. TESTIMONIAL ====================
  {
    id: "prof-testimonials",
    name: "Testimonials — Star Quote",
    category: "SOCIAL",
    settings: {
      backgroundColor: "var(--theme-muted)",
      paddingTop: { desktop: "80px", tablet: "60px", mobile: "45px" },
      paddingBottom: { desktop: "80px", tablet: "60px", mobile: "45px" },
      containerWidth: "max-w-3xl",
      flexDirection: "col",
      gap: "24px",
    },
    elements: [
      {
        id: "prof-testi-quote",
        type: "heading",
        props: {
          text: "“The team turned an incredibly complex operational challenge into a clear, beautiful, and modular visual design system that exceeded our goals.”",
          fontSize: { desktop: "24px", tablet: "20px", mobile: "18px" },
          fontWeight: "600",
          color: "var(--theme-primary)",
          alignment: "center",
        },
      },
      {
        id: "prof-testi-author",
        type: "text",
        props: {
          text: "— Lead Product Designer, Apex Systems",
          fontSize: "14px",
          color: "var(--theme-foreground)",
          alignment: "center",
        },
      },
    ],
  },

  // ==================== 9. CTA ====================
  {
    id: "prof-cta",
    name: "CTA — Conversion Block",
    category: "CONVERSION",
    settings: {
      backgroundColor: "var(--theme-primary)",
      paddingTop: "90px",
      paddingBottom: "90px",
      containerWidth: "max-w-5xl",
      flexDirection: "col",
      gap: "24px",
    },
    elements: [
      {
        id: "prof-cta-h",
        type: "heading",
        props: {
          text: "Let's Build Something Better Together",
          fontSize: "36px",
          fontWeight: "800",
          color: "var(--theme-bg)",
          alignment: "center",
        },
      },
      {
        id: "prof-cta-t",
        type: "text",
        props: {
          text: "Explore what a collaborative partnership can do to clarify your systems, strengthen style coherence, and deploy websites.",
          fontSize: "16px",
          color: "var(--theme-bg)",
          alignment: "center",
        },
      },
      {
        id: "prof-cta-b",
        type: "button",
        props: {
          text: "Start Conversation",
          url: "mailto:partner@northstar.co",
          backgroundColor: "var(--theme-bg)",
          textColor: "var(--theme-primary)",
          paddingX: "24px",
          paddingY: "12px",
          borderRadius: "var(--radius-md)",
          fontSize: "16px",
          alignment: "center",
        },
      },
    ],
  },

  // ==================== 10. FOOTER ====================
  {
    id: "prof-footer",
    name: "Footer — Unified Corporate",
    category: "FOOTER",
    settings: {
      backgroundColor: "var(--theme-bg)",
      paddingTop: "40px",
      paddingBottom: "40px",
      containerWidth: "max-w-5xl",
      flexDirection: "row",
      gap: "20px",
    },
    elements: [
      {
        id: "prof-foot-cpy",
        type: "text",
        props: {
          text: "© 2026 Northstar. All rights reserved. Professional Services Layout Visualizer. Address: 100 Pine Street, San Francisco, CA, United States",
          fontSize: "13px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-foot-lnks",
        type: "text",
        props: {
          text: "Tel: +1 (555) 019-2834  |  Email: partner@northstar.co",
          fontSize: "13px",
          color: "var(--theme-foreground)",
          alignment: "right",
        },
      },
    ],
  },
];
export default sectionLibrary;
