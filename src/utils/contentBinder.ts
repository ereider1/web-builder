import { PageElement, PageSection, Project, BusinessInfo, BrandAssets } from "@/types";

/**
 * Traverses recursively through props or settings, replacing string placeholders with client data.
 */
export function replaceTokensInValue(
  value: any,
  businessInfo: BusinessInfo,
  assets: BrandAssets
): any {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value === "string") {
    let text = value;

    // Fallback safe values
    const bName = businessInfo.name || "Northstar Consulting";
    const bTagline = businessInfo.tagline || "Strategy for businesses ready to grow.";
    const bDesc = businessInfo.description || "helps growing companies simplify operations, sharpen brand strategy, and build visual systems that scale.";
    const bPhone = businessInfo.phone || "+1 (555) 019-2834";
    const bEmail = businessInfo.email || "partner@northstar.co";
    const bWebsite = businessInfo.website || "www.northstar.co";
    const bAddress = businessInfo.address || "100 Pine Street";
    const bCity = businessInfo.city || "San Francisco";
    const bCountry = businessInfo.country || "United States";

    // Logo & Images Fallbacks
    const assetLogo = assets.logo || "";
    const assetHero = assets.hero || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80";
    const assetImg0 = assets.additionalImages?.[0] || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800";
    const assetImg1 = assets.additionalImages?.[1] || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800";
    const assetImg2 = assets.additionalImages?.[2] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800";

    // Replacements
    text = text.replace(/\{\{business\.name\}\}/g, bName);
    text = text.replace(/\{\{business\.tagline\}\}/g, bTagline);
    text = text.replace(/\{\{business\.description\}\}/g, bDesc);
    text = text.replace(/\{\{business\.phone\}\}/g, bPhone);
    text = text.replace(/\{\{business\.email\}\}/g, bEmail);
    text = text.replace(/\{\{business\.website\}\}/g, bWebsite);
    text = text.replace(/\{\{business\.address\}\}/g, bAddress);
    text = text.replace(/\{\{business\.city\}\}/g, bCity);
    text = text.replace(/\{\{business\.country\}\}/g, bCountry);

    text = text.replace(/\{\{assets\.logo\}\}/g, assetLogo);
    text = text.replace(/\{\{assets\.hero\}\}/g, assetHero);
    text = text.replace(/\{\{assets\.image_0\}\}/g, assetImg0);
    text = text.replace(/\{\{assets\.image_1\}\}/g, assetImg1);
    text = text.replace(/\{\{assets\.image_2\}\}/g, assetImg2);

    return text;
  }

  if (typeof value === "object" && value !== null) {
    const copy: any = Array.isArray(value) ? [] : {};
    for (const k in value) {
      if (Object.prototype.hasOwnProperty.call(value, k)) {
        copy[k] = replaceTokensInValue(value[k], businessInfo, assets);
      }
    }
    return copy;
  }

  return value;
}

/**
 * Maps Business Profile and Brand Assets into the structured Content Slots of the
 * high-fidelity 'Professional Services' Template. The Template OWN the layout, 
 * typography, aspect ratios, responsive columns, and CTA placements; user data
 * ONLY replaces demo content.
 */
export function bindProfessionalServices(
  sections: PageSection[],
  businessInfo: BusinessInfo,
  assets: BrandAssets
): PageSection[] {
  // Pre-determined high-quality professional demo defaults
  const profile = {
    name: businessInfo.name?.trim() || "Northstar Consulting",
    tagline: businessInfo.tagline?.trim() || "Strategy for businesses ready to grow.",
    description: businessInfo.description?.trim() || "helps growing companies simplify operations, sharpen brand strategy, and build visual systems that scale.",
    phone: businessInfo.phone?.trim() || "+1 (555) 019-2834",
    email: businessInfo.email?.trim() || "partner@northstar.co",
    address: businessInfo.address?.trim() || "100 Pine Street",
    city: businessInfo.city?.trim() || "San Francisco",
    country: businessInfo.country?.trim() || "United States",
  };

  const images = {
    logo: assets.logo || "", // transparent or typographical wordmark fallback rendered conditionally
    hero: assets.hero || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    about: assets.additionalImages?.[0] || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
    caseStudy: assets.additionalImages?.[1] || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
  };

  const fullAddress = [profile.address, profile.city, profile.country].filter(Boolean).join(", ");

  return sections.map((sec) => {
    // Clone section settings
    const settings = { ...sec.settings };
    
    // Deep map element props based on predefined layout content slots
    const elements = sec.elements.map((el) => {
      const props = { ...el.props };

      // 1. NAVBAR SECTION
      if (sec.type === "simple-navbar" || sec.type === "prof-navbar") {
        if (el.id.includes("brand")) {
          // Fallback typographical logo wordmark or transparent logo image
          props.text = profile.name;
        }
        if (el.id.includes("cta")) {
          props.text = "Let's Talk";
          props.url = `mailto:${profile.email}`;
        }
      }

      // 2. HERO SECTION (Sophisticated two-column)
      if (sec.type === "prof-hero") {
        if (el.id.includes("eyebrow")) {
          props.text = "INDEPENDENT CONSULTING";
        }
        if (el.id.includes("title")) {
          props.text = profile.name; // Small controlled brand identifier
        }
        if (el.id.includes("headline")) {
          props.text = profile.tagline; // Large editorial headline owned by template
        }
        if (el.id.includes("desc")) {
          props.text = `${profile.name} ${profile.description}`; // Narrative copy
        }
        if (el.id.includes("btn")) {
          props.text = "Consult Our Partners";
          props.url = `mailto:${profile.email}`;
        }
        if (el.id.includes("image")) {
          props.src = images.hero; // Crop/aspect ratio is pre-determined by elements styles
        }
      }

      // 3. SERVICES SECTION (What we do - 3 cards)
      if (sec.type === "prof-services") {
        // Card 1
        if (el.id.includes("card1-title")) {
          props.text = "01. Brand & Identity Strategy";
        }
        if (el.id.includes("card1-desc")) {
          props.text = "We help you clarify your market positioning, define core values tokens, and map a cohesive visual brand voice across all touchpoints.";
        }
        // Card 2
        if (el.id.includes("card2-title")) {
          props.text = "02. Digital Layout Design";
        }
        if (el.id.includes("card2-desc")) {
          props.text = "Engineering high-performance modular Next.js layouts, responsive CSS variables configurations, and strict design token grids.";
        }
        // Card 3
        if (el.id.includes("card3-title")) {
          props.text = "03. Systems Consultation";
        }
        if (el.id.includes("card3-desc")) {
          props.text = "Aligning company toolsets, structuring database schemas, optimizing rendering pipelines, and deployment strategy.";
        }
      }

      // 4. ABOUT SECTION (Two-column split narrative)
      if (sec.type === "prof-about") {
        if (el.id.includes("img")) {
          props.src = images.about;
        }
        if (el.id.includes("heading")) {
          props.text = `About ${profile.name}`;
        }
        if (el.id.includes("text")) {
          props.text = `We are a specialized advisory studio centered around structural web layouts. ${profile.name} helps ambitious companies simplify operations, strengthen brand strategy, and build visual systems that scale. We believe that visual design should not be separate from programmatic code.`;
        }
        if (el.id.includes("btn")) {
          props.text = "Read Our Philosophy";
          props.url = `mailto:${profile.email}`;
        }
      }

      // 5. CASE STUDY SECTION (Featured editorial showcase)
      if (sec.type === "prof-case-study") {
        if (el.id.includes("img")) {
          props.src = images.caseStudy;
        }
        if (el.id.includes("h")) {
          props.text = `Selected Project Case Study`;
        }
        if (el.id.includes("d")) {
          props.text = `We collaborated closely with the teams to engineer a fully responsive, type-safe design tokens platform from scratch, reducing design debt by over 70% and increasing delivery speeds.`;
        }
        if (el.id.includes("btn")) {
          props.text = "Read Full Case Study";
          props.url = `mailto:${profile.email}`;
        }
      }

      // 6. TESTIMONIALS SECTION
      if (sec.type === "testimonials" || sec.type === "prof-testimonials") {
        if (el.id.includes("quote")) {
          props.text = `“The team at ${profile.name} turned an incredibly complex operational challenge into a clear, beautiful, and modular visual design system that exceeded our goals.”`;
        }
        if (el.id.includes("author")) {
          props.text = `— Lead Product Designer, Apex Systems`;
        }
      }

      // 7. CTA BANNER SECTION
      if (sec.type === "cta" || sec.type === "prof-cta") {
        if (el.id.includes("h")) {
          props.text = "Let's Build Something Better Together";
        }
        if (el.id.includes("t")) {
          props.text = `Explore what a collaborative partnership with ${profile.name} can do to clarify your systems, strengthen style coherence, and deploy websites.`;
        }
        if (el.id.includes("b")) {
          props.text = "Start Our Conversation";
          props.url = `mailto:${profile.email}`;
        }
      }

      // 8. FOOTER SECTION
      if (sec.type === "simple-footer" || sec.type === "prof-footer") {
        if (el.id.includes("cpy")) {
          props.text = `© 2026 ${profile.name}. All rights reserved. Address: ${bAddressText(fullAddress)}`;
        }
        if (el.id.includes("lnks")) {
          props.text = `Tel: ${profile.phone}  |  Email: ${profile.email}`;
        }
      }

      return {
        ...el,
        props,
      };
    });

    return {
      ...sec,
      settings,
      elements,
    };
  });
}

function bAddressText(addr: string) {
  return addr || "100 Pine Street, San Francisco, CA, United States";
}

/**
 * Traverses a complete project tree and binds user assets & info.
 * Bypasses generic conversions to guarantee a highly polished template-first layout.
 */
export function bindProject(
  project: Project,
  businessInfo: BusinessInfo,
  assets: BrandAssets
): Project {
  const boundPages = project.pages.map((page) => {
    // Map template-first content slots specifically
    const boundSections = bindProfessionalServices(page.sections, businessInfo, assets);

    return {
      ...page,
      sections: boundSections,
    };
  });

  return {
    ...project,
    businessInfo,
    assets,
    pages: boundPages,
  };
}

/**
 * Individual section level binding. Reuses professional services template binder.
 */
export function bindSection(
  section: PageSection,
  businessInfo: BusinessInfo,
  assets: BrandAssets
): PageSection {
  const result = bindProfessionalServices([section], businessInfo, assets);
  return result[0];
}

/**
 * Individual element level property token replacements.
 */
export function bindElementProps(
  element: PageElement,
  businessInfo: BusinessInfo,
  assets: BrandAssets
): PageElement {
  const clonedChildren = element.children
    ? element.children.map((el) => bindElementProps(el, businessInfo, assets))
    : undefined;

  return {
    ...element,
    props: replaceTokensInValue(element.props, businessInfo, assets),
    ...(clonedChildren ? { children: clonedChildren } : {}),
  };
}
