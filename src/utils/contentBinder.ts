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
    const bName = businessInfo.name || "Your Brand Name";
    const bTagline = businessInfo.tagline || "Discover something extraordinary.";
    const bDesc = businessInfo.description || "A refined, premium visual layout crafted for modern growth and aesthetic excellence.";
    const bPhone = businessInfo.phone || "+1 (555) 019-2834";
    const bEmail = businessInfo.email || "hello@yourbrand.com";
    const bWebsite = businessInfo.website || "www.yourbrand.com";
    
    const fullAddress = [
      businessInfo.address,
      businessInfo.city,
      businessInfo.country
    ].filter(Boolean).join(", ");

    const bAddress = fullAddress || "123 Sunset Boulevard, Beverly Hills, CA";
    const bCity = businessInfo.city || "Beverly Hills";
    const bCountry = businessInfo.country || "United States";

    // Logo & Images Fallbacks
    const assetLogo = assets.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80";
    const assetHero = assets.hero || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80";
    const assetImg0 = assets.additionalImages?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800";
    const assetImg1 = assets.additionalImages?.[1] || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800";
    const assetImg2 = assets.additionalImages?.[2] || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800";

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
 * Deep binds element properties recursively.
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

/**
 * Binds both section settings and inner elements list.
 */
export function bindSection(
  section: PageSection,
  businessInfo: BusinessInfo,
  assets: BrandAssets
): PageSection {
  return {
    ...section,
    settings: replaceTokensInValue(section.settings, businessInfo, assets),
    elements: section.elements.map((el) => bindElementProps(el, businessInfo, assets)),
  };
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
    return {
      ...page,
      sections: page.sections.map((sec) => bindSection(sec, businessInfo, assets)),
    };
  });

  return {
    ...project,
    businessInfo,
    assets,
    pages: boundPages,
  };
}
