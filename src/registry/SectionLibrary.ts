import { SectionDefinition } from "@/types";

export const sectionLibrary: SectionDefinition[] = [
  {
    id: "hero-centered",
    name: "Hero — Centered",
    category: "HERO",
    elements: [
      {
        id: "placeholder-id-1",
        type: "section",
        props: {
          backgroundColor: "var(--theme-bg)",
          paddingTop: { desktop: "100px", tablet: "80px", mobile: "60px" },
          paddingBottom: { desktop: "100px", tablet: "80px", mobile: "60px" },
          containerWidth: "max-w-5xl",
          flexDirection: "col",
          gap: "24px",
        },
        children: [
          {
            id: "placeholder-id-2",
            type: "heading",
            props: {
              text: "Design Beautiful Custom Websites Faster",
              fontSize: { desktop: "54px", tablet: "42px", mobile: "36px" },
              fontWeight: "700",
              color: "var(--theme-primary)",
              alignment: "center",
            },
          },
          {
            id: "placeholder-id-3",
            type: "text",
            props: {
              text: "A local-first visual editor built for developers and designers who want to launch highly polished, themeable landings and services pages in seconds. Everything is custom, editable, and beautifully responsive.",
              fontSize: { desktop: "18px", tablet: "16px", mobile: "15px" },
              color: "var(--theme-foreground)",
              alignment: "center",
            },
          },
          {
            id: "placeholder-id-4",
            type: "button",
            props: {
              text: "Explore Our Features",
              url: "#",
              backgroundColor: "var(--theme-primary)",
              textColor: "var(--theme-bg)",
              paddingX: "28px",
              paddingY: "14px",
              borderRadius: "var(--radius-md)",
              fontSize: "16px",
              alignment: "center",
            },
          },
        ],
      },
    ],
  },
  {
    id: "hero-split",
    name: "Hero — Split",
    category: "HERO",
    elements: [
      {
        id: "placeholder-id-5",
        type: "section",
        props: {
          backgroundColor: "var(--theme-muted)",
          paddingTop: { desktop: "90px", tablet: "70px", mobile: "50px" },
          paddingBottom: { desktop: "90px", tablet: "70px", mobile: "50px" },
          containerWidth: "max-w-7xl",
          flexDirection: "row",
          gap: "40px",
        },
        children: [
          {
            id: "placeholder-id-6",
            type: "section",
            props: {
              backgroundColor: "transparent",
              paddingTop: "0px",
              paddingBottom: "0px",
              containerWidth: "w-full",
              flexDirection: "col",
              gap: "20px",
            },
            children: [
              {
                id: "placeholder-id-7",
                type: "heading",
                props: {
                  text: "Refined Aesthetics Meet Modern Code",
                  fontSize: { desktop: "44px", tablet: "36px", mobile: "32px" },
                  fontWeight: "700",
                  color: "var(--theme-primary)",
                  alignment: "left",
                },
              },
              {
                id: "placeholder-id-8",
                type: "text",
                props: {
                  text: "Craft cohesive online presences using built-in design tokens, customized responsive properties, and hand-tailored templates.",
                  fontSize: "16px",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
              {
                id: "placeholder-id-9",
                type: "button",
                props: {
                  text: "Get Started Free",
                  url: "#",
                  backgroundColor: "var(--theme-primary)",
                  textColor: "var(--theme-bg)",
                  paddingX: "22px",
                  paddingY: "11px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "15px",
                  alignment: "left",
                },
              },
            ],
          },
          {
            id: "placeholder-id-10",
            type: "image",
            props: {
              src: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
              alt: "Modern workspace visualization",
              width: "100%",
              height: "350px",
              borderRadius: "var(--radius-lg)",
              alignment: "center",
            },
          },
        ],
      },
    ],
  },
  {
    id: "about-split",
    name: "About — Story",
    category: "ABOUT",
    elements: [
      {
        id: "placeholder-id-11",
        type: "section",
        props: {
          backgroundColor: "var(--theme-bg)",
          paddingTop: { desktop: "80px", tablet: "60px", mobile: "40px" },
          paddingBottom: { desktop: "80px", tablet: "60px", mobile: "40px" },
          containerWidth: "max-w-5xl",
          flexDirection: "row",
          gap: "48px",
        },
        children: [
          {
            id: "placeholder-id-12",
            type: "image",
            props: {
              src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
              alt: "Our team sharing concepts",
              width: "100%",
              height: "320px",
              borderRadius: "var(--radius-md)",
              alignment: "center",
            },
          },
          {
            id: "placeholder-id-13",
            type: "section",
            props: {
              backgroundColor: "transparent",
              paddingTop: "0px",
              paddingBottom: "0px",
              containerWidth: "w-full",
              flexDirection: "col",
              gap: "16px",
            },
            children: [
              {
                id: "placeholder-id-14",
                type: "heading",
                props: {
                  text: "Our Philosophy & Story",
                  fontSize: { desktop: "32px", tablet: "28px", mobile: "24px" },
                  fontWeight: "700",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
              {
                id: "placeholder-id-15",
                type: "text",
                props: {
                  text: "We believe that visual design should not be separate from programmatic structures. By compiling pages from pure theme-token definitions, we ensure absolute consistency, lightning-fast rendering speeds, and highly maintainable systems.",
                  fontSize: "15px",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
              {
                id: "placeholder-id-16",
                type: "text",
                props: {
                  text: "Launched as a lightweight personal tool, we have expanded this structure to serve as a fast production builder for modern developers.",
                  fontSize: "15px",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "services-cards",
    name: "Services — Headline List",
    category: "SERVICES",
    elements: [
      {
        id: "placeholder-id-17",
        type: "section",
        props: {
          backgroundColor: "var(--theme-bg)",
          paddingTop: { desktop: "80px", tablet: "60px", mobile: "40px" },
          paddingBottom: { desktop: "80px", tablet: "60px", mobile: "40px" },
          containerWidth: "max-w-5xl",
          flexDirection: "col",
          gap: "36px",
        },
        children: [
          {
            id: "placeholder-id-18",
            type: "heading",
            props: {
              text: "Our Tailored Core Services",
              fontSize: { desktop: "36px", tablet: "30px", mobile: "26px" },
              fontWeight: "700",
              color: "var(--theme-primary)",
              alignment: "center",
            },
          },
          {
            id: "placeholder-id-19",
            type: "text",
            props: {
              text: "High fidelity implementations designed to take businesses to the next level of growth, design elegance, and functional capacity.",
              fontSize: "16px",
              color: "var(--theme-foreground)",
              alignment: "center",
            },
          },
          {
            id: "placeholder-id-20",
            type: "section",
            props: {
              backgroundColor: "var(--theme-muted)",
              paddingTop: "24px",
              paddingBottom: "24px",
              containerWidth: "w-full",
              flexDirection: "col",
              gap: "12px",
            },
            children: [
              {
                id: "placeholder-id-21",
                type: "heading",
                props: {
                  text: "01. Full-Stack Engineering & Craftsmanship",
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "var(--theme-primary)",
                  alignment: "left",
                },
              },
              {
                id: "placeholder-id-22",
                type: "text",
                props: {
                  text: "Robust React and Next.js applications engineered with extreme type safety and clean modularity.",
                  fontSize: "14px",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
            ],
          },
          {
            id: "placeholder-id-23",
            type: "section",
            props: {
              backgroundColor: "var(--theme-muted)",
              paddingTop: "24px",
              paddingBottom: "24px",
              containerWidth: "w-full",
              flexDirection: "col",
              gap: "12px",
            },
            children: [
              {
                id: "placeholder-id-24",
                type: "heading",
                props: {
                  text: "02. Brand Consulting & Visual Systems",
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "var(--theme-primary)",
                  alignment: "left",
                },
              },
              {
                id: "placeholder-id-25",
                type: "text",
                props: {
                  text: "Custom identity layout, token design systems, responsive styles, and consistent digital branding.",
                  fontSize: "14px",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "social-proof",
    name: "Social — Testimonials",
    category: "SOCIAL",
    elements: [
      {
        id: "placeholder-id-26",
        type: "section",
        props: {
          backgroundColor: "var(--theme-muted)",
          paddingTop: { desktop: "70px", tablet: "55px", mobile: "40px" },
          paddingBottom: { desktop: "70px", tablet: "55px", mobile: "40px" },
          containerWidth: "max-w-3xl",
          flexDirection: "col",
          gap: "24px",
        },
        children: [
          {
            id: "placeholder-id-27",
            type: "heading",
            props: {
              text: "“This builder has simplified my landing page deployments immensely. I can choose a built-in theme, edit properties, and export production-ready JSON in under a minute.”",
              fontSize: { desktop: "24px", tablet: "20px", mobile: "18px" },
              fontWeight: "600",
              color: "var(--theme-primary)",
              alignment: "center",
            },
          },
          {
            id: "placeholder-id-28",
            type: "text",
            props: {
              text: "— Elizabeth Reider, Lead Front-End Engineer",
              fontSize: "14px",
              color: "var(--theme-foreground)",
              alignment: "center",
            },
          },
        ],
      },
    ],
  },
  {
    id: "conversion-cta",
    name: "Conversion — Newsletter CTA",
    category: "CONVERSION",
    elements: [
      {
        id: "placeholder-id-29",
        type: "section",
        props: {
          backgroundColor: "var(--theme-primary)",
          paddingTop: { desktop: "60px", tablet: "50px", mobile: "40px" },
          paddingBottom: { desktop: "60px", tablet: "50px", mobile: "40px" },
          containerWidth: "max-w-5xl",
          flexDirection: "col",
          gap: "20px",
        },
        children: [
          {
            id: "placeholder-id-30",
            type: "heading",
            props: {
              text: "Stay Updated with Dynamic Web Design Trends",
              fontSize: { desktop: "32px", tablet: "26px", mobile: "22px" },
              fontWeight: "700",
              color: "var(--theme-bg)",
              alignment: "center",
            },
          },
          {
            id: "placeholder-id-31",
            type: "text",
            props: {
              text: "Subscribe to receive monthly tips on layouts, CSS variables configurations, and responsive best practices.",
              fontSize: "15px",
              color: "var(--theme-bg)",
              alignment: "center",
            },
          },
          {
            id: "placeholder-id-32",
            type: "button",
            props: {
              text: "Subscribe to Newsletter",
              url: "#",
              backgroundColor: "var(--theme-bg)",
              textColor: "var(--theme-primary)",
              paddingX: "24px",
              paddingY: "12px",
              borderRadius: "var(--radius-md)",
              fontSize: "15px",
              alignment: "center",
            },
          },
        ],
      },
    ],
  },
  {
    id: "simple-footer",
    name: "Footer — Simple",
    category: "FOOTER",
    elements: [
      {
        id: "placeholder-id-33",
        type: "section",
        props: {
          backgroundColor: "var(--theme-bg)",
          paddingTop: "30px",
          paddingBottom: "30px",
          containerWidth: "max-w-5xl",
          flexDirection: "row",
          gap: "20px",
        },
        children: [
          {
            id: "placeholder-id-34",
            type: "text",
            props: {
              text: "© 2026 Web Builder Inc. All rights reserved. Local first prototype.",
              fontSize: "13px",
              color: "var(--theme-foreground)",
              alignment: "left",
            },
          },
          {
            id: "placeholder-id-35",
            type: "text",
            props: {
              text: "Privacy Policy | Terms of Service",
              fontSize: "13px",
              color: "var(--theme-foreground)",
              alignment: "right",
            },
          },
        ],
      },
    ],
  },
];
