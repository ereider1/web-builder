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
 * Traverses recursively through PageElements, performing explicit semantic content-slot replacements.
 * Under this approach, the Template OWNS 100% of the design, spacing, typography, aspect ratios,
 * and responsive columns. The user data ONLY replaces demo content.
 */
export function bindElementRecursively(
  el: PageElement,
  secType: string,
  profile: {
    name: string;
    tagline: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    country: string;
    fullAddress: string;
    hasTagline: boolean;
    hasDescription: boolean;
    hasPhone: boolean;
    hasEmail: boolean;
    hasAddress: boolean;
  },
  images: {
    logo: string;
    hero: string;
    about: string;
    caseStudy: string;
    hasHero: boolean;
    hasAbout: boolean;
    hasCaseStudy: boolean;
  }
): PageElement {
  const props = { ...el.props };

  // 1. NAVBAR SECTION
  if (secType === "prof-navbar") {
    if (el.id === "prof-nav-brand") {
      props.text = profile.name; // Small typographical logo fallback
    }
    if (el.id === "prof-nav-cta") {
      props.text = "Let's Talk";
      if (profile.hasEmail) {
        props.url = `mailto:${profile.email}`;
      }
    }
  }

  // 2. HERO SECTION (Two-column split)
  if (secType === "prof-hero") {
    // Brand Identifier Header
    if (el.id === "prof-hero-title") {
      props.text = profile.name;
    }
    // Tagline maps strictly to Hero Headline
    if (el.id === "prof-hero-headline" && profile.hasTagline) {
      props.text = profile.tagline;
    }
    // Description maps strictly to Hero Description
    if (el.id === "prof-hero-desc" && profile.hasDescription) {
      props.text = `${profile.name} ${profile.description}`;
    }
    // Button actions
    if (el.id === "prof-hero-btn-primary" && profile.hasEmail) {
      props.url = `mailto:${profile.email}`;
    }
    // Hero image role
    if (el.id === "prof-hero-image" && images.hasHero) {
      props.src = images.hero;
    }
  }

  // 3. ABOUT SECTION (Two-column narrative)
  if (secType === "prof-about") {
    // About image role
    if (el.id === "prof-about-img" && images.hasAbout) {
      props.src = images.about;
    }
    // Heading, text, and buttons remain template defaults (unmodified)
  }

  // 4. CASE STUDY SECTION
  if (secType === "prof-case-study") {
    // Case study image role
    if (el.id === "prof-case-study-img" && images.hasCaseStudy) {
      props.src = images.caseStudy;
    }
    // Heading, description, and buttons remain template defaults (unmodified)
  }

  // 5. CTA SECTION
  if (secType === "prof-cta") {
    if (el.id === "prof-cta-b" && profile.hasEmail) {
      props.url = `mailto:${profile.email}`;
    }
  }

  // 6. FOOTER SECTION
  if (secType === "prof-footer") {
    if (el.id === "prof-foot-cpy") {
      const bAddressText = profile.hasAddress
        ? profile.fullAddress
        : "100 Pine Street, San Francisco, CA, United States";

      props.text = `© 2026 ${profile.name}. All rights reserved. Address: ${bAddressText}`;
    }
    if (el.id === "prof-foot-lnks") {
      const bPhoneText = profile.hasPhone ? profile.phone : "+1 (555) 019-2834";
      const bEmailText = profile.hasEmail ? profile.email : "partner@northstar.co";

      props.text = `Tel: ${bPhoneText}  |  Email: ${bEmailText}`;
    }
  }

  // Recursively process nested child components (e.g. elements inside sub-columns grids/cards)
  const boundChildren = el.children
    ? el.children.map((child) =>
        bindElementRecursively(child, secType, profile, images)
      )
    : undefined;

  return {
    ...el,
    props,
    ...(boundChildren ? { children: boundChildren } : {}),
  };
}

/**
 * Maps Business Profile and Brand Assets into the structured Content Slots of the
 * high-fidelity 'Professional Services' Template. The Template OWNS the layout,
 * typography, aspect ratios, responsive columns, and CTA placements; user data
 * ONLY replaces demo content.
 */
export function bindProfessionalServices(
  sections: PageSection[],
  businessInfo: BusinessInfo,
  assets: BrandAssets
): PageSection[] {
  // Extract inputs and check availability explicitly
  const profile = {
    name: businessInfo.name?.trim() || "Northstar Consulting",
    tagline: businessInfo.tagline?.trim() || "",
    description: businessInfo.description?.trim() || "",
    phone: businessInfo.phone?.trim() || "",
    email: businessInfo.email?.trim() || "",
    address: businessInfo.address?.trim() || "",
    city: businessInfo.city?.trim() || "",
    country: businessInfo.country?.trim() || "",
    fullAddress: [
      businessInfo.address?.trim(),
      businessInfo.city?.trim(),
      businessInfo.country?.trim()
    ]
      .filter(Boolean)
      .join(", "),
    hasTagline: !!businessInfo.tagline?.trim(),
    hasDescription: !!businessInfo.description?.trim(),
    hasPhone: !!businessInfo.phone?.trim(),
    hasEmail: !!businessInfo.email?.trim(),
    hasAddress: !!businessInfo.address?.trim(),
  };

  const images = {
    logo: assets.logo || "",
    hero: assets.hero || "",
    about: assets.additionalImages?.[0] || "",
    caseStudy: assets.additionalImages?.[1] || "",
    hasHero: !!assets.hero,
    hasAbout: !!assets.additionalImages?.[0],
    hasCaseStudy: !!assets.additionalImages?.[1],
  };

  return sections.map((sec) => {
    const settings = { ...sec.settings };

    // Update section container properties
    if (sec.type === "prof-hero" && images.hasHero) {
      settings.backgroundImage = images.hero;
    }

    // Process top-level elements of the section and their child nodes recursively!
    const elements = sec.elements.map((el) => {
      return bindElementRecursively(el, sec.type, profile, images);
    });

    return {
      ...sec,
      settings,
      elements,
    };
  });
}

/**
 * Traverses a complete project tree and binds user assets & info.
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
 * Individual element level property token replacements (for basic elements outside templates).
 */
export function bindElementProps(
  element: PageElement,
  businessInfo: BusinessInfo,
  assets: BrandAssets
): PageElement {
  const clonedChildren = element.children
    ? element.children.map((el) => bindElementProps(el, businessInfo, assets))
    : undefined;

  // Simple string fallback mappings for broad manual additions
  const bName = businessInfo.name || "Northstar Consulting";
  const bTagline = businessInfo.tagline || "Strategy for businesses ready to grow.";

  const props = { ...element.props };
  if (typeof props.text === "string") {
    props.text = props.text
      .replace(/\{\{business\.name\}\}/g, bName)
      .replace(/\{\{business\.tagline\}\}/g, bTagline);
  }

  return {
    ...element,
    props,
    ...(clonedChildren ? { children: clonedChildren } : {}),
  };
}
