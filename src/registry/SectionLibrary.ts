import { SectionDefinition, PageElement } from "@/types";

export const sectionLibrary: SectionDefinition[] = [
  // =========================================================================
  // 1. NAVIGATION
  // =========================================================================
  {
    id: "prof-navbar",
    name: "Navigation — Modern Wordmark",
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
          text: "About    /    Services    /    Process    /    Work    /    Contact",
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

  // =========================================================================
  // 2. HERO (Sophisticated Two-Column Editorial Grid)
  // =========================================================================
  {
    id: "prof-hero",
    name: "Hero — Two-Column Split",
    category: "HERO",
    settings: {
      backgroundColor: "var(--theme-bg)",
      paddingTop: { desktop: "90px", tablet: "70px", mobile: "50px" },
      paddingBottom: { desktop: "90px", tablet: "70px", mobile: "50px" },
      containerWidth: "max-w-7xl",
      flexDirection: "row",
      gap: "48px",
    },
    elements: [
      // Left Column: Text Content & CTAs
      {
        id: "prof-hero-left-col",
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
            id: "prof-hero-headline",
            type: "heading",
            props: {
              text: "Build a business that is ready for what comes next.",
              fontSize: { desktop: "46px", tablet: "38px", mobile: "30px" },
              fontWeight: "800",
              color: "var(--theme-primary)",
              alignment: "left",
            },
          },
          {
            id: "prof-hero-desc",
            type: "text",
            props: {
              text: "We help growing companies clarify their strategy, strengthen their digital presence, and build systems that scale.",
              fontSize: "15px",
              color: "var(--theme-foreground)",
              alignment: "left",
            },
          },
          {
            id: "prof-hero-btn-primary",
            type: "button",
            props: {
              text: "Let's Talk",
              url: "mailto:partner@northstar.co",
              backgroundColor: "var(--theme-primary)",
              textColor: "var(--theme-bg)",
              paddingX: "22px",
              paddingY: "11px",
              borderRadius: "var(--radius-sm)",
              fontSize: "14px",
              alignment: "left",
            },
          },
          {
            id: "prof-hero-btn-secondary",
            type: "button",
            props: {
              text: "Explore Our Work",
              url: "#",
              backgroundColor: "transparent",
              textColor: "var(--theme-primary)",
              paddingX: "22px",
              paddingY: "11px",
              borderRadius: "var(--radius-sm)",
              fontSize: "14px",
              alignment: "left",
              style: "outline",
            },
          },
        ],
      },
      // Right Column: Controlled Aspect Image
      {
        id: "prof-hero-image",
        type: "image",
        props: {
          src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
          alt: "Corporate visual landscape photo",
          width: "100%",
          height: "380px",
          borderRadius: "var(--radius-lg)",
          alignment: "center",
        },
      },
    ],
  },

  // =========================================================================
  // 3. TRUST BAR (Restrained Typography Logos)
  // =========================================================================
  {
    id: "prof-trust",
    name: "Trust — Brand Logos Strip",
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
          text: "Trusted by ambitious teams:",
          fontSize: "13px",
          color: "var(--theme-foreground)",
          alignment: "left",
        },
      },
      {
        id: "prof-trust-logo1",
        type: "heading",
        props: {
          text: "APEX",
          fontSize: "14px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "center",
        },
      },
      {
        id: "prof-trust-logo2",
        type: "heading",
        props: {
          text: "VERTEX",
          fontSize: "14px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "center",
        },
      },
      {
        id: "prof-trust-logo3",
        type: "heading",
        props: {
          text: "ACME",
          fontSize: "14px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "center",
        },
      },
      {
        id: "prof-trust-logo4",
        type: "heading",
        props: {
          text: "NORTHSTAR",
          fontSize: "14px",
          fontWeight: "800",
          color: "var(--theme-foreground)",
          alignment: "center",
        },
      },
    ],
  },

  // =========================================================================
  // 4. SERVICES (3 Card Grid Columns)
  // =========================================================================
  {
    id: "prof-services",
    name: "Services — Structured Column Cards",
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
        id: "prof-services-eyebrow",
        type: "text",
        props: {
          text: "WHAT WE DO",
          fontSize: "12px",
          fontWeight: "800",
          color: "var(--theme-primary)",
          alignment: "center",
        },
      },
      {
        id: "prof-services-h",
        type: "heading",
        props: {
          text: "Strategy, design, and digital experiences that move businesses forward.",
          fontSize: "30px",
          fontWeight: "800",
          color: "var(--theme-primary)",
          alignment: "center",
        },
      },
      // Cards Row Container
      {
        id: "prof-services-cards-grid",
        type: "section",
        props: {
          backgroundColor: "transparent",
          paddingTop: "0px",
          paddingBottom: "0px",
          containerWidth: "w-full",
          flexDirection: "row",
          gap: "24px",
        },
        children: [
          // Card 1
          {
            id: "prof-services-card1",
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
                id: "prof-services-card1-num",
                type: "text",
                props: {
                  text: "01",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "var(--theme-primary)",
                  alignment: "left",
                },
              },
              {
                id: "prof-services-card1-title",
                type: "heading",
                props: {
                  text: "STRATEGY",
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
              {
                id: "prof-services-card1-desc",
                type: "text",
                props: {
                  text: "Clarify your direction and build a roadmap for meaningful growth.",
                  fontSize: "14px",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
            ],
          },
          // Card 2
          {
            id: "prof-services-card2",
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
                id: "prof-services-card2-num",
                type: "text",
                props: {
                  text: "02",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "var(--theme-primary)",
                  alignment: "left",
                },
              },
              {
                id: "prof-services-card2-title",
                type: "heading",
                props: {
                  text: "DIGITAL EXPERIENCES",
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
              {
                id: "prof-services-card2-desc",
                type: "text",
                props: {
                  text: "Create thoughtful websites and digital products that turn attention into action.",
                  fontSize: "14px",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
            ],
          },
          // Card 3
          {
            id: "prof-services-card3",
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
                id: "prof-services-card3-num",
                type: "text",
                props: {
                  text: "03",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "var(--theme-primary)",
                  alignment: "left",
                },
              },
              {
                id: "prof-services-card3-title",
                type: "heading",
                props: {
                  text: "CREATIVE DIRECTION",
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
              {
                id: "prof-services-card3-desc",
                type: "text",
                props: {
                  text: "Bring your brand, content, and customer experience together into one coherent identity.",
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

  // =========================================================================
  // 5. ABOUT (Split Editorial Layout)
  // =========================================================================
  {
    id: "prof-about",
    name: "About — Split Narrative",
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
          alt: "About team workshop photographic cover",
          width: "100%",
          height: "320px",
          borderRadius: "var(--radius-md)",
          alignment: "center",
        },
      },
      // Right Content stack
      {
        id: "prof-about-content",
        type: "section",
        props: {
          backgroundColor: "transparent",
          paddingTop: "0px",
          paddingBottom: "0px",
          containerWidth: "w-full",
          flexDirection: "col",
          gap: "18px",
        },
        children: [
          {
            id: "prof-about-eyebrow",
            type: "text",
            props: {
              text: "A DIFFERENT WAY TO BUILD",
              fontSize: "12px",
              fontWeight: "800",
              color: "var(--theme-primary)",
              alignment: "left",
            },
          },
          {
            id: "prof-about-heading",
            type: "heading",
            props: {
              text: "We combine strategic thinking, thoughtful design, and modern technology.",
              fontSize: "28px",
              fontWeight: "800",
              color: "var(--theme-foreground)",
              alignment: "left",
            },
          },
          {
            id: "prof-about-text",
            type: "text",
            props: {
              text: "We collaborate with clients to design digital experiences that are useful, memorable, and built to last. Our work bypasses raw spacing overrides in favor of pure theme tokens cohesion.",
              fontSize: "15px",
              color: "var(--theme-foreground)",
              alignment: "left",
            },
          },
          {
            id: "prof-about-btn",
            type: "button",
            props: {
              text: "Our Philosophy",
              url: "mailto:partner@northstar.co",
              backgroundColor: "var(--theme-primary)",
              textColor: "var(--theme-bg)",
              paddingX: "18px",
              paddingY: "9px",
              borderRadius: "var(--radius-sm)",
              fontSize: "14px",
              alignment: "left",
            },
          },
        ],
      },
    ],
  },

  // =========================================================================
  // 6. PROCESS (4 Beautiful Pathway Steps)
  // =========================================================================
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
          text: "How we work",
          fontSize: "30px",
          fontWeight: "800",
          color: "var(--theme-primary)",
          alignment: "center",
        },
      },
      // Steps Row Container
      {
        id: "prof-process-steps-row",
        type: "section",
        props: {
          backgroundColor: "transparent",
          paddingTop: "0px",
          paddingBottom: "0px",
          containerWidth: "w-full",
          flexDirection: "row",
          gap: "20px",
        },
        children: [
          // Step 1
          {
            id: "prof-process-step1",
            type: "section",
            props: {
              backgroundColor: "transparent",
              paddingTop: "12px",
              paddingBottom: "12px",
              containerWidth: "w-full",
              flexDirection: "col",
              gap: "8px",
            },
            children: [
              {
                id: "prof-process-s1-num",
                type: "text",
                props: {
                  text: "01",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "var(--theme-primary)",
                  alignment: "left",
                },
              },
              {
                id: "prof-process-s1-title",
                type: "heading",
                props: {
                  text: "DISCOVER",
                  fontSize: "16px",
                  fontWeight: "800",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
            ],
          },
          // Step 2
          {
            id: "prof-process-step2",
            type: "section",
            props: {
              backgroundColor: "transparent",
              paddingTop: "12px",
              paddingBottom: "12px",
              containerWidth: "w-full",
              flexDirection: "col",
              gap: "8px",
            },
            children: [
              {
                id: "prof-process-s2-num",
                type: "text",
                props: {
                  text: "02",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "var(--theme-primary)",
                  alignment: "left",
                },
              },
              {
                id: "prof-process-s2-title",
                type: "heading",
                props: {
                  text: "DEFINE",
                  fontSize: "16px",
                  fontWeight: "800",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
            ],
          },
          // Step 3
          {
            id: "prof-process-step3",
            type: "section",
            props: {
              backgroundColor: "transparent",
              paddingTop: "12px",
              paddingBottom: "12px",
              containerWidth: "w-full",
              flexDirection: "col",
              gap: "8px",
            },
            children: [
              {
                id: "prof-process-s3-num",
                type: "text",
                props: {
                  text: "03",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "var(--theme-primary)",
                  alignment: "left",
                },
              },
              {
                id: "prof-process-s3-title",
                type: "heading",
                props: {
                  text: "CREATE",
                  fontSize: "16px",
                  fontWeight: "800",
                  color: "var(--theme-foreground)",
                  alignment: "left",
                },
              },
            ],
          },
          // Step 4
          {
            id: "prof-process-step4",
            type: "section",
            props: {
              backgroundColor: "transparent",
              paddingTop: "12px",
              paddingBottom: "12px",
              containerWidth: "w-full",
              flexDirection: "col",
              gap: "8px",
            },
            children: [
              {
                id: "prof-process-s4-num",
                type: "text",
                props: {
                  text: "04",
                  fontSize: "14px",
                  fontWeight: "800",
                  color: "var(--theme-primary)",
                  alignment: "left",
                },
              },
              {
                id: "prof-process-s4-title",
                type: "heading",
                props: {
                  text: "REFINE",
                  fontSize: "16px",
                  fontWeight: "800",
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

  // =========================================================================
  // 7. FEATURED WORK (Large Editorial Case-Study Layout)
  // =========================================================================
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
      // Editorial Column details
      {
        id: "prof-case-study-details",
        type: "section",
        props: {
          backgroundColor: "transparent",
          paddingTop: "0px",
          paddingBottom: "0px",
          containerWidth: "w-full",
          flexDirection: "col",
          gap: "18px",
        },
        children: [
          {
            id: "prof-case-study-eyebrow",
            type: "text",
            props: {
              text: "FEATURED PROJECT",
              fontSize: "12px",
              fontWeight: "800",
              color: "var(--theme-primary)",
              alignment: "left",
            },
          },
          {
            id: "prof-case-study-title",
            type: "heading",
            props: {
              text: "Redesigning Global Brand Experiences",
              fontSize: "28px",
              fontWeight: "800",
              color: "var(--theme-foreground)",
              alignment: "left",
            },
          },
          {
            id: "prof-case-study-desc",
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
              text: "View Project",
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
    ],
  },

  // =========================================================================
  // 8. TESTIMONIAL (Large Quotation & Generous Whitespace)
  // =========================================================================
  {
    id: "prof-testimonials",
    name: "Testimonials — Star Quote",
    category: "SOCIAL",
    settings: {
      backgroundColor: "var(--theme-muted)",
      paddingTop: { desktop: "90px", tablet: "75px", mobile: "50px" },
      paddingBottom: { desktop: "90px", tablet: "75px", mobile: "50px" },
      containerWidth: "max-w-3xl",
      flexDirection: "col",
      gap: "24px",
    },
    elements: [
      {
        id: "prof-testi-quote",
        type: "heading",
        props: {
          text: "“Northstar helped us turn a complicated business challenge into a clear, actionable plan.”",
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

  // =========================================================================
  // 9. CTA (Large Visually Distinctive Conversion Banner)
  // =========================================================================
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
          text: "Let's build something better.",
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
          text: "Tell us what you're working on and let's figure out where to go next.",
          fontSize: "16px",
          color: "var(--theme-bg)",
          alignment: "center",
        },
      },
      {
        id: "prof-cta-b",
        type: "button",
        props: {
          text: "Let's Talk",
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

  // =========================================================================
  // 10. FOOTER
  // =========================================================================
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
