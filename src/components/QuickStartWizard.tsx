"use client";

import React, { useState } from "react";
import { useBuilder, cloneElementsWithNewIds } from "@/store/BuilderContext";
import { builtInThemes } from "@/theme/ThemeManager";
import { templateLibrary } from "@/registry/TemplateLibrary";
import { componentRegistry } from "@/registry/ComponentRegistry";
import { BusinessInfo, BrandAssets, Project, PageSection } from "@/types";
import { bindProject, bindSection } from "@/utils/contentBinder";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Check,
  Building,
  Briefcase,
  Users,
  Compass,
  X,
  Plus,
  Eye,
} from "lucide-react";

interface QuickStartWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickStartWizard: React.FC<QuickStartWizardProps> = ({
  onClose,
  onSuccess,
}) => {
  const { state, loadStarter } = useBuilder();

  // Multi-step progression (1-5)
  const [step, setStep] = useState<number>(1);

  // Selections
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("services-website");
  const [selectedThemeId, setSelectedThemeId] = useState<string>("modern");

  // Client Business Profile Form
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "",
    tagline: "",
    description: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    country: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    youtube: "",
  });

  // Assets (Logos & imagery Base64 encoded)
  const [assets, setAssets] = useState<BrandAssets>({
    logo: "",
    hero: "",
    additionalImages: [],
  });

  const handleInfoChange = (key: keyof BusinessInfo, value: string) => {
    setBusinessInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFillDemoData = () => {
    setBusinessInfo({
      name: "Aventine Advisory Group",
      tagline: "Strategic operational systems for ambitious brands",
      description: "We help growing companies clarify brand positioning, simplify complicated developer pipelines, and engineer highly consistent, responsive modular visual styles.",
      phone: "+1 (555) 019-2834",
      email: "partner@aventine.co",
      website: "www.aventine.co",
      address: "100 Pine Street",
      city: "San Francisco",
      country: "United States",
      instagram: "https://instagram.com/aventine",
      facebook: "https://facebook.com/aventine",
      linkedin: "https://linkedin.com/company/aventine",
      youtube: "",
    });

    setAssets({
      logo: "", // fallback wordmark is beautiful
      hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80",
      additionalImages: [
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      ],
    });
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    assetKey: "logo" | "hero" | "additional"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (assetKey === "logo" || assetKey === "hero") {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAssets((prev) => ({
          ...prev,
          [assetKey]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      const nextAdditional = [...(assets.additionalImages || [])];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          nextAdditional.push(reader.result as string);
          setAssets((prev) => ({
            ...prev,
            additionalImages: nextAdditional,
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (assetKey: "logo" | "hero" | "additional", index = -1) => {
    if (assetKey === "logo" || assetKey === "hero") {
      setAssets((prev) => ({
        ...prev,
        [assetKey]: "",
      }));
    } else {
      const nextAdditional = (assets.additionalImages || []).filter((_, idx) => idx !== index);
      setAssets((prev) => ({
        ...prev,
        additionalImages: nextAdditional,
      }));
    }
  };

  // Compile active layout sections list
  const getAssembledSections = (templateId: string): PageSection[] => {
    const template = templateLibrary.find((t) => t.id === templateId);
    if (!template) return [];

    return template.sections.map((sec) => {
      return {
        id: `section-${Math.random().toString(36).substr(2, 9)}`,
        type: sec.id,
        name: sec.name,
        settings: JSON.parse(JSON.stringify(sec.settings)),
        elements: cloneElementsWithNewIds(sec.elements),
      };
    });
  };

  // Launch and Generate
  const handleCreateWebsite = () => {
    const template = templateLibrary.find((t) => t.id === selectedTemplateId);
    if (!template) return;

    const theme =
      [...builtInThemes, ...state.customThemes].find((t) => t.id === selectedThemeId) ||
      builtInThemes[0];

    const unBoundProject: Project = {
      id: `project-${Date.now()}`,
      name: businessInfo.name ? `${businessInfo.name} Site` : `${template.name} Site`,
      activeThemeId: theme.id,
      pages: [
        {
          id: "page-1",
          name: "Home",
          slug: "home",
          sections: getAssembledSections(selectedTemplateId),
        },
      ],
    };

    // Deep-bind placeholders in single pass
    const boundProject = bindProject(unBoundProject, businessInfo, assets);

    // Save & Load starter
    loadStarter(boundProject, theme);
    onSuccess();
  };

  const activeTheme =
    [...builtInThemes, ...state.customThemes].find((t) => t.id === selectedThemeId) ||
    builtInThemes[0];

  const stepsList = ["Template", "Style Style", "Profile Form", "Brand Imagery", "Live Preview"];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl w-full max-w-5xl flex flex-col overflow-hidden h-[90vh] max-h-[750px]">
      {/* Progression Banner */}
      <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="h-8.5 w-8.5 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/10">
            <Sparkles className="h-4.5 w-4.5 fill-white/20 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-black text-zinc-800 tracking-wide uppercase">⚡ Prototyper Wizard</h2>
            <p className="text-[10px] text-zinc-400 font-bold">
              Step {step} of 5 — {stepsList[step - 1]}
            </p>
          </div>
        </div>

        {/* Steps dots */}
        <div className="flex items-center gap-2.5">
          {stepsList.map((label, idx) => {
            const num = idx + 1;
            const isActive = step === num;
            const isCompleted = step > num;

            return (
              <div key={label} className="flex items-center">
                <div
                  className={`h-6.5 w-6.5 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-500/15"
                      : isCompleted
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : num}
                </div>
                {idx < stepsList.length - 1 && (
                  <div
                    className={`w-4 h-0.5 ml-2.5 rounded transition-colors ${
                      step > num ? "bg-indigo-200" : "bg-zinc-100"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Stepped Form Panels */}
      <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-white">
        {/* ==================== STEP 1: VISUAL TEMPLATE CARDS ==================== */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="border-b border-zinc-50 pb-2.5">
              <h3 className="text-sm font-black text-zinc-800">What kind of website are you creating?</h3>
              <p className="text-[11px] text-zinc-400 font-medium">
                Our templates define professional, responsive section arrangements tailored specifically to your client's vertical.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: "services-website",
                  name: "Professional Services",
                  icon: Briefcase,
                  desc: "Highly refined, premium corporate layout designed for consultants, strategists, agencies, and professional services firms.",
                },
                {
                  id: "landing-page",
                  name: "Landing Page",
                  icon: Compass,
                  desc: "High-converting layout with a centered hero, three service columns, user quote block, newsletter CTA banner, and a professional footer.",
                },
                {
                  id: "blank-page",
                  name: "Start Blank Slate",
                  icon: Plus,
                  desc: "An empty slate, letting you select, drop, and compile individual layout container blocks manually inside the canvas.",
                },
              ].map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                const TplIcon = tpl.icon;

                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`group/card relative flex flex-col justify-between p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/10 shadow-md scale-[1.01]"
                        : "border-zinc-200 hover:border-zinc-300 bg-white hover:shadow-sm"
                    }`}
                  >
                    <div>
                      {/* Miniature mockup preview of website layout */}
                      <div className="h-16 w-full rounded bg-zinc-50 border border-zinc-150 flex flex-col p-1.5 gap-1 overflow-hidden shrink-0 group-hover/card:bg-zinc-100/50 transition-colors">
                        <div className="h-2 w-12 rounded bg-zinc-300/60" />
                        <div className="flex gap-1 flex-1 mt-1">
                          <div className="flex-1 bg-zinc-200/50 rounded flex flex-col p-1 gap-1">
                            <div className="h-1.5 w-full bg-zinc-300 rounded" />
                            <div className="h-1.5 w-1/2 bg-zinc-300 rounded" />
                          </div>
                          <div className="w-10 bg-zinc-200/80 rounded" />
                        </div>
                      </div>

                      <h4 className="text-xs font-black text-zinc-800 mt-4 flex items-center gap-1.5">
                        <TplIcon className={`h-4 w-4 ${isSelected ? "text-indigo-600 animate-pulse" : "text-zinc-400"}`} />
                        <span>{tpl.name}</span>
                      </h4>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-normal mt-2">
                        {tpl.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-50 flex items-center justify-between">
                      <span className="text-[9px] bg-zinc-100 text-zinc-500 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                        {tpl.id === "blank-page" ? "Minimal" : "Responsive"}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5">
                          <Check className="h-3 w-3 stroke-[3]" /> Selected
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-400 font-bold opacity-0 group-hover/card:opacity-100 transition-opacity">
                          Use Template
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== STEP 2: CHOOSE STYLE (THEME PREVIEW) ==================== */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="border-b border-zinc-50 pb-2.5">
              <h3 className="text-sm font-black text-zinc-800">Choose a Visual Style (Theme)</h3>
              <p className="text-[11px] text-zinc-400 font-medium">
                Styles map colors, typography, margins, and curves roundness across all layout containers automatically.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {builtInThemes.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-32 ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/10 shadow-md scale-[1.01]"
                        : "border-zinc-200 hover:border-zinc-300 bg-white hover:shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-zinc-800">{theme.name}</h4>
                        {isSelected && <div className="h-2 w-2 rounded-full bg-indigo-600" />}
                      </div>
                      <p className="text-[9px] text-zinc-400 capitalize font-medium font-mono mt-1">
                        Font: {theme.typography.headingFont.split(",")[0]}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-zinc-150">
                      <div
                        style={{ backgroundColor: theme.colors.primary }}
                        className="h-5 w-5 rounded-full border border-zinc-200/50 shadow-xs"
                        title="Primary Theme Color"
                      />
                      <div
                        style={{ backgroundColor: theme.colors.secondary }}
                        className="h-5 w-5 rounded-full border border-zinc-200/50 shadow-xs"
                        title="Secondary Color"
                      />
                      <div
                        style={{ backgroundColor: theme.colors.background }}
                        className="h-5 w-5 rounded-full border border-zinc-200/50 shadow-xs"
                        title="Background"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== STEP 3: BUSINESS PROFILE FORM ==================== */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="border-b border-zinc-50 pb-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-black text-zinc-800">Tell us about your business</h3>
                <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                  Provide client credentials. Optional fields can be skipped and will use visually appropriate defaults.
                </p>
              </div>
              <button
                type="button"
                onClick={handleFillDemoData}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer shadow-xs border border-indigo-100/50 shrink-0 self-start sm:self-auto animate-pulse"
                title="Populate wizard form with rich placeholder texts and images instantly"
              >
                <Sparkles className="h-3.5 w-3.5 fill-indigo-500/10" />
                <span>Fill with Placeholder Content</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-1">
                    <span>Company / Business Name</span>
                    <span className="text-red-500 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessInfo.name}
                    onChange={(e) => handleInfoChange("name", e.target.value)}
                    placeholder="E.g., Acapulco Grill"
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 bg-white font-medium text-zinc-800"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Tagline / Slogan</label>
                  <input
                    type="text"
                    value={businessInfo.tagline}
                    onChange={(e) => handleInfoChange("tagline", e.target.value)}
                    placeholder="E.g., Authentic wood-fired coastal grill"
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="text"
                    value={businessInfo.phone}
                    onChange={(e) => handleInfoChange("phone", e.target.value)}
                    placeholder="E.g., +1 (555) 019-2834"
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Contact Email</label>
                  <input
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) => handleInfoChange("email", e.target.value)}
                    placeholder="E.g., dine@acapulco.com"
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Company Summary Description</label>
                  <textarea
                    rows={4}
                    value={businessInfo.description}
                    onChange={(e) => handleInfoChange("description", e.target.value)}
                    placeholder="E.g., We serve authentic charcoal-grilled fresh catches daily, utilizing locally sourced ocean fish, clifftop herbs, and aged spices."
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 bg-white resize-none min-h-[70px] text-zinc-700 leading-relaxed"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Address & Street</label>
                  <input
                    type="text"
                    value={businessInfo.address}
                    onChange={(e) => handleInfoChange("address", e.target.value)}
                    placeholder="E.g., 45 Sunset Clifftop Road"
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">City</label>
                    <input
                      type="text"
                      value={businessInfo.city}
                      onChange={(e) => handleInfoChange("city", e.target.value)}
                      placeholder="Uluwatu"
                      className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Country</label>
                    <input
                      type="text"
                      value={businessInfo.country}
                      onChange={(e) => handleInfoChange("country", e.target.value)}
                      placeholder="Indonesia"
                      className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 4: BRAND IMAGES ==================== */}
        {step === 4 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="border-b border-zinc-50 pb-2.5">
              <h3 className="text-sm font-black text-zinc-800">Add your brand images</h3>
              <p className="text-[11px] text-zinc-400 font-medium">
                Intentional visual slots. Templates crop, format, and structure images beautifully to match grids.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                {/* Logo Upload */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Nav Header Logo (Optional)</span>
                  {assets.logo ? (
                    <div className="relative h-20 w-48 rounded-lg border border-zinc-200 overflow-hidden group/img bg-zinc-50 flex items-center justify-center p-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assets.logo} alt="brand logo" className="max-h-full max-w-full object-contain" />
                      <button
                        onClick={() => removeImage("logo")}
                        className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="h-20 w-48 rounded-lg border border-dashed border-zinc-300 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-zinc-50/40">
                      <Upload className="h-4 w-4 text-zinc-400" />
                      <span className="text-[10px] font-semibold text-zinc-500">Upload Header Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "logo")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Hero Photo Upload */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Primary Hero Image (First-class slot)</span>
                  {assets.hero ? (
                    <div className="relative h-28 w-full rounded-lg border border-zinc-200 overflow-hidden group/img bg-zinc-50 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assets.hero} alt="brand hero" className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeImage("hero")}
                        className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="h-28 w-full rounded-lg border border-dashed border-zinc-300 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-zinc-50/40">
                      <ImageIcon className="h-5 w-5 text-zinc-400" />
                      <span className="text-[10px] font-semibold text-zinc-500">Upload Primary Hero Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "hero")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Gallery uploads */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Gallery Section Photos (Up to 3)</span>
                
                <div className="grid grid-cols-3 gap-2">
                  {(assets.additionalImages || []).map((img, idx) => (
                    <div key={idx} className="relative h-20 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50 group/img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`additional img ${idx}`} className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeImage("additional", idx)}
                        className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  ))}

                  {(assets.additionalImages || []).length < 3 && (
                    <label className="h-20 rounded-lg border border-dashed border-zinc-300 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-zinc-50/40">
                      <Plus className="h-4.5 w-4.5 text-zinc-400" />
                      <span className="text-[9px] font-bold text-zinc-400">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "additional")}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 mt-3 leading-relaxed">
                  Images populate about storytelling slots and services cards respectively. Standard stock photography is used if skipped.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 5: PREVIEW BEFORE CREATE ==================== */}
        {step === 5 && (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="border-b border-zinc-50 pb-2.5 shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-zinc-800 flex items-center gap-1.5">
                  <Eye className="h-4.5 w-4.5 text-indigo-600" />
                  <span>Preview Before Launching</span>
                </h3>
                <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                  This scrollable preview matches your chosen visual Theme style, layout structure, and business information.
                </p>
              </div>
              <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider select-none animate-pulse">
                Live Prototype
              </span>
            </div>

            {/* Live Webpage Scrollable Frame */}
            <div className="flex-1 flex flex-col md:flex-row gap-5 mt-4 min-h-0">
              {/* Left Side: Mock Browser Scroll Container */}
              <div className="flex-1 overflow-y-auto border border-zinc-200 bg-zinc-100 shadow-inner rounded-2xl flex flex-col max-h-[380px] scrollbar-thin">
                {/* Browser bar top mock */}
                <div className="h-7 bg-zinc-50 border-b border-zinc-200 px-3 flex items-center justify-between text-[9px] text-zinc-400 select-none shrink-0 sticky top-0 z-50">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                    <div className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                  </div>
                  <div className="bg-zinc-200/50 px-6 py-0.25 rounded text-[8px]">
                    https://{businessInfo.name ? businessInfo.name.toLowerCase().replace(/\s+/g, "-") : "new-project"}.webbuilder.local
                  </div>
                  <div className="w-4" />
                </div>

                {/* Scoped theme variable injects targeting .quickstart-preview-root */}
                <div className="quickstart-preview-root flex flex-col flex-1 bg-white">
                  <style>{`
                    .quickstart-preview-root {
                      --theme-bg: ${activeTheme.colors.background};
                      --theme-foreground: ${activeTheme.colors.foreground};
                      --theme-primary: ${activeTheme.colors.primary};
                      --theme-secondary: ${activeTheme.colors.secondary};
                      --theme-muted: ${activeTheme.colors.muted};
                      --theme-border: ${activeTheme.colors.border};
                      --theme-accent: ${activeTheme.colors.accent};
                      --theme-heading-font: ${activeTheme.typography.headingFont};
                      --theme-body-font: ${activeTheme.typography.bodyFont};
                      --theme-heading-weight: ${activeTheme.typography.headingWeight};
                      --theme-body-weight: ${activeTheme.typography.bodyWeight};
                      --radius-sm: ${activeTheme.radius.sm};
                      --radius-md: ${activeTheme.radius.md};
                      --radius-lg: ${activeTheme.radius.lg};
                    }
                  `}</style>

                  {selectedTemplateId === "blank-page" ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400 min-h-[150px]">
                      <span className="text-xs font-bold text-zinc-500">Blank Slate Preview</span>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        No sections placed. Launch builder to add custom containers.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col" style={{ backgroundColor: "var(--theme-bg)" }}>
                      {/* Traverses and maps layout render read-only */}
                      {getAssembledSections(selectedTemplateId).map((sec) => {
                        const bound = bindSection(sec, businessInfo, assets);

                        const sBg = bound.settings.backgroundColor ?? "var(--theme-bg)";
                        const sFlex = bound.settings.flexDirection ?? "col";
                        const sGap = bound.settings.gap ?? "12px";

                        const flexClass = sFlex === "row" ? "flex flex-row" : "flex flex-col";

                        return (
                          <div
                            key={sec.id}
                            style={{ backgroundColor: sBg }}
                            className="w-full py-6 px-4 border-b border-zinc-100 last:border-0 text-left shrink-0"
                          >
                            <div
                              style={{ gap: sGap }}
                              className={`mx-auto max-w-xl w-full ${flexClass} relative`}
                            >
                              {bound.elements.map((el) => {
                                const registry = componentRegistry[el.type];
                                if (!registry) return null;

                                return (
                                  <div key={el.id} className="pointer-events-none scale-[0.95] origin-left">
                                    {React.createElement(registry.component, {
                                      element: el,
                                      isSelected: false,
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Details specs */}
              <div className="w-full md:w-64 shrink-0 flex flex-col justify-between">
                <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-150 flex flex-col gap-2.5 text-xs text-zinc-600">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-wider pb-1.5 border-b border-zinc-200">
                    Summary Specifications
                  </h4>
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-400">Template:</span>
                    <span className="font-bold text-zinc-800">
                      {templateLibrary.find((t) => t.id === selectedTemplateId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-400">Styling:</span>
                    <span className="font-bold text-zinc-800">{activeTheme.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-400">Company Name:</span>
                    <span className="font-bold text-zinc-800 truncate max-w-[120px]">
                      {businessInfo.name || "Your Brand Name"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-zinc-400">Images Included:</span>
                    <span className="font-bold text-indigo-700">
                      {[assets.logo, assets.hero, ...(assets.additionalImages || [])].filter(Boolean).length} Files
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-indigo-50/20 rounded-xl border border-indigo-100/40 text-[10px] text-zinc-500 leading-relaxed font-normal">
                  Everything you see here is converted directly to first-class layout elements. Once launched, every single card, margin, and text item remains independently editable!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Actions Footer */}
      <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 shrink-0 flex items-center justify-between select-none">
        <button
          onClick={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              onClose();
            }
          }}
          className="flex items-center gap-1 py-2 px-4 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{step === 1 ? "Cancel" : "Back"}</span>
        </button>

        {step < 5 ? (
          <button
            onClick={() => {
              if (step === 3 && businessInfo.name.trim() === "") {
                alert("Please enter a Business Name before continuing.");
                return;
              }
              setStep(step + 1);
            }}
            className="flex items-center gap-1.5 py-2 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <span>Next Step</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleCreateWebsite}
            className="flex items-center gap-1.5 py-2 px-6 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-green-500/10"
          >
            <Sparkles className="h-4.5 w-4.5 fill-white/10" />
            <span>CREATE WEBSITE</span>
          </button>
        )}
      </div>
    </div>
  );
};
export default QuickStartWizard;
