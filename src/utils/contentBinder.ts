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
 * Traverses and binds element props recursively. Handles deeply nested columns, grids and cards.
 */
export function bindElementRecursively(
  el: PageElement,
  secType: string,
  profile: any,
  images: any,
  fullAddress: string
): PageElement {
  const props = { ...el.props };

  // 1. NAVBAR SECTION
  if (secType === "simple-navbar" || secType === "prof-navbar") {
    if (el.id.includes("brand")) {
      props.text = profile.name;
    }
    if (el.id.includes("cta")) {
      props.text = "Let's Talk";
      props.url = `mailto:${profile.email}`;
    }
  }

  // 2. HERO SECTION
  if (secType === "prof-hero") {
    if (el.id.includes("eyebrow")) {
      props.text = "INDEPENDENT CONSULTING";
    }
    if (el.id.includes("title")) {
      props.text = profile.name;
    }
    if (el.id.includes("headline")) {
      props.text = profile.tagline;
    }
    if (el.id.includes("desc")) {
      props.text = `${profile.name} ${profile.description}`;
    }
    if (el.id.includes("btn-primary")) {
      props.text = "Let's Talk";
      props.url = `mailto:${profile.email}`;
    }
    if (el.id.includes("btn-secondary")) {
      props.text = "Explore Our Work";
    }
    if (el.id.includes("image")) {
      props.src = images.hero;
    }
  }

  // 3. SERVICES SECTION
  if (secType === "prof-services") {
    if (el.id.includes("card1-title")) {
      props.text = "STRATEGY";
    }
    if (el.id.includes("card1-desc")) {
      props.text = "Clarify your direction and build a roadmap for meaningful growth.";
    }
    if (el.id.includes("card2-title")) {
      props.text = "DIGITAL EXPERIENCES";
    }
    if (el.id.includes("card2-desc")) {
      props.text = "Create thoughtful websites and digital products that turn attention into action.";
    }
    if (el.id.includes("card3-title")) {
      props.text = "CREATIVE DIRECTION";
    }
    if (el.id.includes("card3-desc")) {
      props.text = "Bring your brand, content, and customer experience together into one coherent identity.";
    }
  }

  // 4. ABOUT SECTION
  if (secType === "prof-about") {
    if (el.id.includes("img")) {
      props.src = images.about;
    }
    if (el.id.includes("eyebrow")) {
      props.text = "A DIFFERENT WAY TO BUILD";
    }
    if (el.id.includes("heading")) {
      props.text = "We combine strategic thinking, thoughtful design, and modern technology.";
    }
    if (el.id.includes("text")) {
      props.text = `${profile.name} is a specialized advisory studio. We combine strategic thinking, thoughtful design, and modern technology to create digital experiences that are useful, memorable, and built to last.`;
    }
    if (el.id.includes("btn")) {
      props.text = "Our Philosophy";
      props.url = `mailto:${profile.email}`;
    }
  }

  // 5. CASE STUDY SECTION
  if (secType === "prof-case-study") {
    if (el.id.includes("img")) {
      props.src = images.caseStudy;
    }
    if (el.id.includes("eyebrow")) {
      props.text = "FEATURED PROJECT";
    }
    if (el.id.includes("title")) {
      props.text = "Redesigning Global Brand Experiences";
    }
    if (el.id.includes("desc")) {
      props.text = "We collaborated closely with the teams to engineer a fully responsive, type-safe design tokens platform from scratch, reducing design debt by over 70% and increasing delivery speeds.";
    }
    if (el.id.includes("btn")) {
      props.text = "View Project";
      props.url = `mailto:${profile.email}`;
    }
  }

  // 6. TESTIMONIAL SECTION
  if (secType === "testimonials" || secType === "prof-testimonials") {
    if (el.id.includes("quote")) {
      props.text = `“${profile.name} helped us turn a complicated business challenge into a clear, actionable plan.”`;
    }
    if (el.id.includes("author")) {
      props.text = `— Lead Product Designer, Apex Systems`;
    }
  }

  // 7. CTA BANNER SECTION
  if (secType === "cta" || secType === "prof-cta") {
    if (el.id.includes("h")) {
      props.text = "Let's build something better.";
    }
    if (el.id.includes("t")) {
      props.text = "Tell us what you're working on and let's figure out where to go next.";
    }
    if (el.id.includes("b")) {
      props.text = "Let's Talk";
      props.url = `mailto:${profile.email}`;
    }
  }

  // 8. FOOTER SECTION
  if (secType === "simple-footer" || secType === "prof-footer") {
    if (el.id.includes("cpy")) {
      props.text = `© 2026 ${profile.name}. All rights reserved. Address: ${fullAddress}`;
    }
    if (el.id.includes("lnks")) {
      props.text = `Tel: ${profile.phone}  |  Email: ${profile.email}`;
    }
  }

  const boundChildren = el.children
    ? el.children.map((child) => bindElementRecursively(child, secType, profile, images, fullAddress))
    : undefined;

  return {
    ...el,
    props,
    ...(boundChildren ? { children: boundChildren } : {}),
  };
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
    logo: assets.logo || "", // transparent fallback rendered conditionally
    hero: assets.hero || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80",
    about: assets.additionalImages?.[0] || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
    caseStudy: assets.additionalImages?.[1] || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
  };

  const fullAddress = [profile.address, profile.city, profile.country].filter(Boolean).join(", ");

  return sections.map((sec) => {
    const settings = { ...sec.settings };
    
    // Process top-level elements of the section and their child nodes recursively!
    const elements = sec.elements.map((el) => {
      return bindElementRecursively(el, sec.type, profile, images, fullAddress);
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
