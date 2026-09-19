"use client";

import React, { useState } from "react";
import { useBuilder, cloneElementsWithNewIds } from "@/store/BuilderContext";
import { builtInThemes } from "@/theme/ThemeManager";
import { templateLibrary } from "@/registry/TemplateLibrary";
import { BusinessInfo, BrandAssets, Project, PageSection } from "@/types";
import { bindProject } from "@/utils/contentBinder";
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

  // Multi-step State
  const [step, setStep] = useState<number>(1);

  // Selections State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("landing-page");
  const [selectedThemeId, setSelectedThemeId] = useState<string>("modern");

  // Form State
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

  const [assets, setAssets] = useState<BrandAssets>({
    logo: "",
    hero: "",
    additionalImages: [],
  });

  // Handle single string inputs
  const handleInfoChange = (key: keyof BusinessInfo, value: string) => {
    setBusinessInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Parse local file upload to Base64
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
      // Additional images
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

  // Submit and Generate
  const handleCreateWebsite = () => {
    const template = templateLibrary.find((t) => t.id === selectedTemplateId);
    if (!template) return;

    // Resolve visual Theme
    const activeTheme =
      [...builtInThemes, ...state.customThemes].find((t) => t.id === selectedThemeId) ||
      builtInThemes[0];

    // Assemble modular Section lists
    const assembledSections: PageSection[] = template.sections.map((sec) => {
      return {
        id: `section-${Math.random().toString(36).substr(2, 9)}`,
        type: sec.id,
        name: sec.name,
        settings: JSON.parse(JSON.stringify(sec.settings)),
        elements: cloneElementsWithNewIds(sec.elements),
      };
    });

    const unBoundProject: Project = {
      id: `project-${Date.now()}`,
      name: businessInfo.name ? `${businessInfo.name} Site` : `${template.name} Site`,
      activeThemeId: activeTheme.id,
      pages: [
        {
          id: "page-1",
          name: "Home",
          slug: "home",
          sections: assembledSections,
        },
      ],
    };

    // Deep-bind the collected business information & photos into the project elements!
    const boundProject = bindProject(unBoundProject, businessInfo, assets);

    // Seed into Context state (resets history)
    loadStarter(boundProject, activeTheme);

    // Call successful triggers
    onSuccess();
  };

  const stepsList = ["Template", "Theme Style", "Company Info", "Brand Assets", "Launch"];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-xl w-full max-w-4xl flex flex-col overflow-hidden h-[85vh] max-h-[750px]">
      {/* Progression Banner */}
      <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5 fill-white/20 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-800">⚡ Client Website Prototyper</h2>
            <p className="text-[10px] text-zinc-400 font-medium">
              Step {step} of 5 — {stepsList[step - 1]}
            </p>
          </div>
        </div>

        {/* Steps progression dots */}
        <div className="flex items-center gap-2.5">
          {stepsList.map((label, idx) => {
            const num = idx + 1;
            const isActive = step === num;
            const isCompleted = step > num;

            return (
              <div key={label} className="flex items-center">
                <div
                  className={`h-6 w-6 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-500/15"
                      : isCompleted
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-zinc-100 text-zinc-400"
                  }`}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : num}
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
        {/* ==================== STEP 1: CHOOSE A TEMPLATE ==================== */}
        {step === 1 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="border-b border-zinc-50 pb-2">
              <h3 className="text-sm font-bold text-zinc-800">What type of website are you creating?</h3>
              <p className="text-[10px] text-zinc-400 font-medium">
                Choose a starter section layout matching your client's industry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  id: "landing-page",
                  name: "One Page Landing",
                  cat: "General",
                  icon: Compass,
                  desc: "Optimized marketing landing containing centered hero, services row, user testimonials quote, and call-to-action blocks.",
                },
                {
                  id: "services-website",
                  name: "Professional Services",
                  cat: "Business",
                  icon: Briefcase,
                  desc: "Standard consulting portfolio featuring split hero layout, philosophical split descriptions, client counters, and quotes.",
                },
                {
                  id: "restaurant-website",
                  name: "Restaurant / Cafe Portal",
                  cat: "Business",
                  icon: Building,
                  desc: "Earthy visual template containing simple brand header navigation, spec menu items, client quote quotes, and address blocks.",
                },
                {
                  id: "corporate-website",
                  name: "Corporate Portal",
                  cat: "Corporate",
                  icon: Users,
                  desc: "Modern corporate showcase complete with statistics grids, split heroes, multi-columns features list, and customer social proof.",
                },
              ].map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                const TplIcon = tpl.icon;

                return (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`flex flex-col justify-between p-4.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/10 shadow-sm"
                        : "border-zinc-200 hover:border-zinc-300 bg-white hover:shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] bg-zinc-100 text-zinc-500 font-bold px-1.5 py-0.5 rounded-full uppercase">
                          {tpl.cat}
                        </span>
                        {isSelected && (
                          <div className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="h-2.5 w-2.5" />
                          </div>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-zinc-800 mt-2.5 flex items-center gap-1.5 group-hover:text-indigo-600">
                        <TplIcon className="h-4 w-4 text-zinc-400 group-hover:text-indigo-600" />
                        <span>{tpl.name}</span>
                      </h4>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-normal mt-1.5">
                        {tpl.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== STEP 2: CHOOSE A STYLE/THEME ==================== */}
        {step === 2 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="border-b border-zinc-50 pb-2">
              <h3 className="text-sm font-bold text-zinc-800">Select a Visual Style (Theme)</h3>
              <p className="text-[10px] text-zinc-400 font-medium">
                This dictates colors, typography, margins, and curves roundness across all sections.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {builtInThemes.map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-28 ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50/10 shadow-sm"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800">{theme.name}</h4>
                      <p className="text-[9px] text-zinc-400 capitalize font-medium font-mono mt-0.5">
                        Font: {theme.typography.headingFont.split(",")[0]}
                      </p>
                    </div>

                    {/* Color swatches previews */}
                    <div className="flex items-center gap-1.5 mt-4 pt-2.5 border-t border-zinc-50">
                      <div
                        style={{ backgroundColor: theme.colors.primary }}
                        className="h-4.5 w-4.5 rounded-full border border-zinc-200/50 shadow-xs"
                        title="Primary Color"
                      />
                      <div
                        style={{ backgroundColor: theme.colors.secondary }}
                        className="h-4.5 w-4.5 rounded-full border border-zinc-200/50 shadow-xs"
                        title="Secondary Color"
                      />
                      <div
                        style={{ backgroundColor: theme.colors.background }}
                        className="h-4.5 w-4.5 rounded-full border border-zinc-200/50 shadow-xs"
                        title="Canvas Background"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== STEP 3: BUSINESS INFORMATION ==================== */}
        {step === 3 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="border-b border-zinc-50 pb-2">
              <h3 className="text-sm font-bold text-zinc-800">Business Information Form</h3>
              <p className="text-[10px] text-zinc-400 font-medium">
                Enter your client's details. These replace text content placeholders on creation automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                {/* Core Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessInfo.name}
                    onChange={(e) => handleInfoChange("name", e.target.value)}
                    placeholder="E.g., Bali Sunset Restaurant"
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>

                {/* Tagline */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                    Slogan / Tagline
                  </label>
                  <input
                    type="text"
                    value={businessInfo.tagline}
                    onChange={(e) => handleInfoChange("tagline", e.target.value)}
                    placeholder="E.g., Authentic Culinary Journeys"
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>

                {/* Business Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={businessInfo.phone}
                    onChange={(e) => handleInfoChange("phone", e.target.value)}
                    placeholder="E.g., +1 (555) 019-2834"
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>

                {/* Business Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                    Client Email
                  </label>
                  <input
                    type="email"
                    value={businessInfo.email}
                    onChange={(e) => handleInfoChange("email", e.target.value)}
                    placeholder="E.g., hello@sunsetcafe.com"
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                    Client Company Description
                  </label>
                  <textarea
                    rows={4}
                    value={businessInfo.description}
                    onChange={(e) => handleInfoChange("description", e.target.value)}
                    placeholder="E.g., We serve authentic regional cuisines using fresh farm ingredients in a rustic clifftop setting."
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 bg-white resize-none min-h-[70px]"
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={businessInfo.address}
                    onChange={(e) => handleInfoChange("address", e.target.value)}
                    placeholder="E.g., 45 Sunset Clifftop Road"
                    className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none focus:border-indigo-500 bg-white"
                  />
                </div>

                {/* City & Country */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">City</label>
                    <input
                      type="text"
                      value={businessInfo.city}
                      onChange={(e) => handleInfoChange("city", e.target.value)}
                      placeholder="Uluwatu"
                      className="w-full text-xs px-2.5 py-2 rounded-md border border-zinc-200 focus:outline-none bg-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
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

        {/* ==================== STEP 4: BRAND ASSETS (UPLOADS) ==================== */}
        {step === 4 && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="border-b border-zinc-50 pb-2">
              <h3 className="text-sm font-bold text-zinc-800">Brand Assets & Gallery</h3>
              <p className="text-[10px] text-zinc-400 font-medium">
                Upload custom client imagery. Files are converted locally inside the browser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Logo & Hero */}
              <div className="flex flex-col gap-4">
                {/* Logo Upload */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Brand Logo (Optional)</span>
                  {assets.logo ? (
                    <div className="relative h-20 w-44 rounded-lg border border-zinc-200 overflow-hidden group/img bg-zinc-50 flex items-center justify-center p-2.5">
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
                    <label className="h-20 w-44 rounded-lg border border-dashed border-zinc-300 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-zinc-50/50">
                      <Upload className="h-4 w-4 text-zinc-400" />
                      <span className="text-[10px] font-semibold text-zinc-500">Upload Logo</span>
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
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Main Hero Image</span>
                  {assets.hero ? (
                    <div className="relative h-28 w-full rounded-lg border border-zinc-200 overflow-hidden group/img bg-zinc-50">
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
                    <label className="h-28 w-full rounded-lg border border-dashed border-zinc-300 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-zinc-50/50">
                      <ImageIcon className="h-5 w-5 text-zinc-400 animate-pulse" />
                      <span className="text-[10px] font-semibold text-zinc-500">Upload Main Hero Photo</span>
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

              {/* Right Column: Additional Gallery Photos */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Additional Photos (up to 3)</span>
                
                <div className="grid grid-cols-3 gap-2">
                  {(assets.additionalImages || []).map((img, idx) => (
                    <div key={idx} className="relative h-20 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50 group/img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`additional img ${idx}`} className="h-full w-full object-cover" />
                      <button
                        onClick={() => removeImage("additional", idx)}
                        className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </div>
                  ))}

                  {/* Add Image slots if less than 3 */}
                  {(assets.additionalImages || []).length < 3 && (
                    <label className="h-20 rounded-lg border border-dashed border-zinc-300 hover:border-indigo-500 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-zinc-50/50">
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
                <p className="text-[10px] text-zinc-400 mt-2.5 leading-normal">
                  These photos populate section cards, background layouts, and about columns respectively. Fallback stock photos will be used if skipped.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== STEP 5: LAUNCH & GENERATE PREVIEW ==================== */}
        {step === 5 && (
          <div className="flex flex-col gap-4 animate-fade-in text-center py-6">
            <div className="flex flex-col items-center justify-center">
              <div className="h-14 w-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center border border-green-150 shadow-inner mb-4 animate-bounce">
                <Sparkles className="h-7 w-7 fill-green-500/10" />
              </div>
              <h3 className="text-base font-bold text-zinc-800">Your Prototype is Ready for Generation!</h3>
              <p className="text-xs text-zinc-400 max-w-md mt-2 leading-relaxed">
                Clicking the launch button will instantiate a complete, first-class editable website project. Everything remains modular and customizable.
              </p>
            </div>

            {/* Structured Specifications Previews */}
            <div className="max-w-md mx-auto w-full mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-150 text-left flex flex-col gap-2.5 text-xs text-zinc-600">
              <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide pb-1.5 border-b border-zinc-200">
                Specifications Checklist
              </h4>
              <div className="flex justify-between">
                <span className="font-medium text-zinc-400">Chosen Template:</span>
                <span className="font-bold text-zinc-800">
                  {templateLibrary.find((t) => t.id === selectedTemplateId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-zinc-400">Selected Styling Style:</span>
                <span className="font-bold text-zinc-800">
                  {builtInThemes.find((t) => t.id === selectedThemeId)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-zinc-400">Company Name:</span>
                <span className="font-bold text-zinc-800">
                  {businessInfo.name || "Your Brand Name"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-zinc-400">Custom Photos Attached:</span>
                <span className="font-bold text-indigo-700">
                  {[assets.logo, assets.hero, ...(assets.additionalImages || [])].filter(Boolean).length} Uploaded
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Actions Footer */}
      <div className="px-6 py-4 border-t border-zinc-100 bg-zinc-50 shrink-0 flex items-center justify-between">
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
