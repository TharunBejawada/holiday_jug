"use client";

import { useState, useEffect } from "react";
import {
  FiSettings,
  FiPercent,
  FiDollarSign,
  FiClock,
  FiLayers,
  FiPlus,
  FiTrash2,
  FiSave,
  FiCheck,
} from "react-icons/fi";

interface PricingConfig {
  defaultHotelMargin: number;
  inrToGbpRate: number;
  recordRetentionDays: number;
}

interface HotDealSlide {
  id: string;
  badge: string;
  destination: string;
  subtitle: string;
  fromPriceGbp: number;
  image: string;
  perks: string[];
  searchLink: string;
  isActive: boolean;
  sortOrder: number;
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [pricing, setPricing] = useState<PricingConfig>({
    defaultHotelMargin: 0.13,
    inrToGbpRate: 0.0093,
    recordRetentionDays: 30,
  });
  const [hotDeals, setHotDeals] = useState<HotDealSlide[]>([]);

  // New slide form modal
  const [newSlide, setNewSlide] = useState({
    badge: "HOT DEALS",
    destination: "",
    subtitle: "",
    fromPriceGbp: 499,
    image: "/assets/Homepage_Banner.png",
    perks: "Return Flights, Luxury Hotels, Daily Breakfast",
    searchLink: "/search",
  });
  const [showAddSlide, setShowAddSlide] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/config");
        const data = await res.json();
        if (data.success) {
          if (data.pricing) setPricing(data.pricing);
          if (data.hotDeals) setHotDeals(data.hotDeals);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricing }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error("Failed to save pricing config:", err);
    }
  };

  const handleToggleSlide = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateHotDeal: { id, updates: { isActive: !currentActive } } }),
      });
      const data = await res.json();
      if (data.success && data.hotDeals) {
        setHotDeals(data.hotDeals);
      }
    } catch (err) {
      console.error("Failed to toggle slide:", err);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hot deal slide?")) return;
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteHotDealId: id }),
      });
      const data = await res.json();
      if (data.success && data.hotDeals) {
        setHotDeals(data.hotDeals);
      }
    } catch (err) {
      console.error("Failed to delete slide:", err);
    }
  };

  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addHotDeal: {
            ...newSlide,
            perks: newSlide.perks.split(",").map((s) => s.trim()).filter(Boolean),
            isActive: true,
            sortOrder: hotDeals.length + 1,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.hotDeals) {
        setHotDeals(data.hotDeals);
        setShowAddSlide(false);
        setNewSlide({
          badge: "HOT DEALS",
          destination: "",
          subtitle: "",
          fromPriceGbp: 499,
          image: "/assets/Homepage_Banner.png",
          perks: "Return Flights, Luxury Hotels, Daily Breakfast",
          searchLink: "/search",
        });
      }
    } catch (err) {
      console.error("Failed to add slide:", err);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500 font-semibold">Loading Admin Settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <FiSettings className="text-[#F7941D]" /> Stage 1 Admin Settings &amp; Configuration
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage system margin rules, currency conversion rates, and the homepage Hot Deals banner slides.
        </p>
      </div>

      {/* PRICING & MARGIN SETTINGS (P2, F4, S4) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-[#1D1248] flex items-center gap-2 mb-4">
          <FiPercent className="text-[#F7941D]" /> Pricing Rules &amp; Global Rates (Section 6)
        </h2>

        <form onSubmit={handleSavePricing} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* 1. Default Hotel Margin Rate (P2) */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Hotel Margin Rate (True Margin P1)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="0.5"
                  value={pricing.defaultHotelMargin}
                  onChange={(e) =>
                    setPricing({ ...pricing, defaultHotelMargin: parseFloat(e.target.value) || 0.13 })
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold border border-gray-200 focus:border-[#F7941D] focus:bg-white focus:outline-none"
                />
                <span className="absolute right-3.5 text-xs font-bold text-gray-500">
                  {(pricing.defaultHotelMargin * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Selling price = Cost / (1 - Margin). Default 13% (P2).
              </p>
            </div>

            {/* 2. INR to GBP Exchange Rate (F4) */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                INR to GBP Rate (F4)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  step="0.0001"
                  min="0.001"
                  max="0.05"
                  value={pricing.inrToGbpRate}
                  onChange={(e) =>
                    setPricing({ ...pricing, inrToGbpRate: parseFloat(e.target.value) || 0.0093 })
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold border border-gray-200 focus:border-[#F7941D] focus:bg-white focus:outline-none"
                />
                <FiDollarSign className="absolute right-3.5 text-gray-400 text-xs" />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                1 INR ≈ £{pricing.inrToGbpRate} (1 GBP ≈ {(1 / pricing.inrToGbpRate).toFixed(1)} INR).
              </p>
            </div>

            {/* 3. Search ID Retention Days (S4) */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Search ID Retention (Days) (S4)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={pricing.recordRetentionDays}
                  onChange={(e) =>
                    setPricing({ ...pricing, recordRetentionDays: parseInt(e.target.value, 10) || 30 })
                  }
                  className="w-full rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-semibold border border-gray-200 focus:border-[#F7941D] focus:bg-white focus:outline-none"
                />
                <FiClock className="absolute right-3.5 text-gray-400 text-xs" />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Period to retain caller Search IDs. Default 30 days.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-[#F7941D] hover:bg-[#e08314] active:scale-95 px-6 py-2.5 text-sm font-bold text-white shadow-md flex items-center gap-2 cursor-pointer transition-all"
            >
              {saved ? <FiCheck /> : <FiSave />}
              <span>{saved ? "Settings Saved!" : "Save Pricing Config"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* HOT DEALS BANNER SLIDES MANAGER (H3) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#1D1248] flex items-center gap-2">
              <FiLayers className="text-[#F7941D]" /> Hot Deals Carousel Slides (Section 3 H3)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Slides are managed here so changes appear instantly on the homepage. Suggested max: 6 slides.
            </p>
          </div>

          {hotDeals.length < 6 && (
            <button
              type="button"
              onClick={() => setShowAddSlide(true)}
              className="rounded-xl bg-[#1D1248] hover:bg-[#2B1B6D] text-white px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FiPlus /> Add Slide
            </button>
          )}
        </div>

        {/* SLIDES LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotDeals.map((slide) => (
            <div
              key={slide.id}
              className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                slide.isActive ? "border-gray-200 bg-white" : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#F7941D] bg-amber-50 px-2 py-0.5 rounded-md uppercase">
                    {slide.badge}
                  </span>
                  <h3 className="font-extrabold text-base text-[#1D1248] mt-1">{slide.destination}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{slide.subtitle}</p>
                </div>
                <span className="text-lg font-black text-[#F7941D]">from £{slide.fromPriceGbp}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {slide.perks.map((p, idx) => (
                  <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                    {p}
                  </span>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleToggleSlide(slide.id, slide.isActive)}
                  className={`font-bold cursor-pointer ${slide.isActive ? "text-amber-600" : "text-green-600"}`}
                >
                  {slide.isActive ? "Disable Slide" : "Enable Slide"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSlide(slide.id)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD SLIDE MODAL */}
      {showAddSlide && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-extrabold text-[#1D1248] mb-4">Add Hot Deals Carousel Slide (H3)</h3>

            <form onSubmit={handleAddSlide} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Destination Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tenerife"
                  value={newSlide.destination}
                  onChange={(e) => setNewSlide({ ...newSlide, destination: e.target.value })}
                  className="w-full rounded-xl bg-gray-50 px-3.5 py-2 text-sm border border-gray-200"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Year-round island warmth & ocean sunsets."
                  value={newSlide.subtitle}
                  onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  className="w-full rounded-xl bg-gray-50 px-3.5 py-2 text-sm border border-gray-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">From Price (GBP)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newSlide.fromPriceGbp}
                    onChange={(e) => setNewSlide({ ...newSlide, fromPriceGbp: Number(e.target.value) || 299 })}
                    className="w-full rounded-xl bg-gray-50 px-3.5 py-2 text-sm border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={newSlide.badge}
                    onChange={(e) => setNewSlide({ ...newSlide, badge: e.target.value })}
                    className="w-full rounded-xl bg-gray-50 px-3.5 py-2 text-sm border border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Perks (Comma-separated)</label>
                <input
                  type="text"
                  value={newSlide.perks}
                  onChange={(e) => setNewSlide({ ...newSlide, perks: e.target.value })}
                  className="w-full rounded-xl bg-gray-50 px-3.5 py-2 text-sm border border-gray-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSlide(false)}
                  className="px-4 py-2 font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#F7941D] hover:bg-[#e08314] px-5 py-2 text-white font-bold shadow-md"
                >
                  Add Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
