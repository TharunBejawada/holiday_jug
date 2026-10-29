"use client";

import React, { useState, useRef, useEffect, useMemo, useId } from "react";
import { FaSearch, FaChevronDown, FaTimes, FaCheck } from "react-icons/fa";

export interface SearchableSelectOption {
  value: string;
  label: string;
  subtitle?: string;
  badge?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  searchTerms?: string[];
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  isClearable?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  name?: string;
  required?: boolean;
  noOptionsMessage?: string;
  align?: "left" | "right";
  maxHeight?: string;
  autoFocusSearch?: boolean;
  showSubtitleInTrigger?: boolean;
  renderOption?: (option: SearchableSelectOption, isSelected: boolean) => React.ReactNode;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search options...",
  label,
  error,
  disabled = false,
  isClearable = false,
  className = "",
  triggerClassName = "",
  menuClassName = "",
  icon,
  trailingIcon,
  name,
  required = false,
  noOptionsMessage = "No matching options found",
  align = "left",
  maxHeight = "max-h-64",
  autoFocusSearch = true,
  showSubtitleInTrigger = false,
  renderOption,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const instanceId = useId();

  // Find the currently selected option
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return options;

    return options.filter((opt) => {
      if (opt.label.toLowerCase().includes(trimmed)) return true;
      if (opt.subtitle && opt.subtitle.toLowerCase().includes(trimmed)) return true;
      if (opt.value.toLowerCase().includes(trimmed)) return true;
      if (opt.searchTerms && opt.searchTerms.some((t) => t.toLowerCase().includes(trimmed))) {
        return true;
      }
      return false;
    });
  }, [options, searchQuery]);

  // Reset highlight index when filtered results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions.length, searchQuery]);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      if (autoFocusSearch) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, autoFocusSearch]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;
      }
      case "Enter": {
        e.preventDefault();
        const targetOption = filteredOptions[highlightedIndex];
        if (targetOption && !targetOption.disabled) {
          selectOption(targetOption.value);
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        setIsOpen(false);
        break;
      }
      case "Tab": {
        setIsOpen(false);
        break;
      }
    }
  };

  // Ensure highlighted element is scrolled into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeEl = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const selectOption = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const displayLabel = selectedOption ? selectedOption.label : value ? value : "";

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden input for form support */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value}
          required={required && !value}
        />
      )}

      {/* Optional Label */}
      {label && (
        <label className="block text-xs sm:text-sm font-bold text-[#1D1248] mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* TRIGGER BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={instanceId}
        className={`w-full flex items-center justify-between gap-2 rounded-xl bg-gray-50/90 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-left border transition-all font-semibold cursor-pointer ${
          disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : isOpen
            ? "border-[#F7941D] bg-white ring-2 ring-amber-100"
            : error
            ? "border-red-400 bg-red-50/30 text-gray-800 hover:border-red-500"
            : "border-gray-200 text-gray-800 hover:border-gray-300 focus:border-[#F7941D] focus:bg-white focus:outline-none"
        } ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon && <span className="text-gray-400 shrink-0 text-xs sm:text-sm">{icon}</span>}
          {displayLabel ? (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-gray-900 font-semibold leading-tight">
                {displayLabel}
              </span>
              {showSubtitleInTrigger && selectedOption?.subtitle && (
                <span className="truncate text-[11px] text-gray-500 font-normal leading-tight">
                  {selectedOption.subtitle}
                </span>
              )}
            </div>
          ) : (
            <span className="truncate text-gray-400 font-normal">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-gray-400">
          {isClearable && value && !disabled && (
            <span
              onClick={handleClear}
              className="p-1 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
              title="Clear selection"
              aria-label="Clear selection"
            >
              <FaTimes className="text-xs" />
            </span>
          )}
          {trailingIcon ? (
            <span className="text-xs sm:text-sm">{trailingIcon}</span>
          ) : (
            <FaChevronDown
              className={`text-xs transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#F7941D]" : ""
              }`}
            />
          )}
        </div>
      </button>

      {/* DROPDOWN POPOVER */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full mt-1.5 z-50 w-full min-w-[240px] sm:min-w-[280px] rounded-2xl bg-white shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-150 ${menuClassName}`}
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {/* SEARCH INPUT BAR */}
          <div className="relative mb-2 px-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-8 py-2 text-xs sm:text-sm bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-[#F7941D] focus:ring-2 focus:ring-amber-100 focus:outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                title="Clear search"
              >
                <FaTimes className="text-xs" />
              </button>
            )}
          </div>

          {/* OPTIONS LIST */}
          <ul
            ref={listRef}
            role="listbox"
            id={instanceId}
            className={`overflow-y-auto ${maxHeight} divide-y divide-gray-50 focus:outline-none`}
            tabIndex={-1}
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs sm:text-sm text-gray-500">
                <FaSearch className="mx-auto mb-2 text-gray-300 text-lg" />
                <p className="font-semibold text-gray-700">{noOptionsMessage}</p>
                {searchQuery && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    No results for &ldquo;{searchQuery}&rdquo;
                  </p>
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="mt-2 text-xs text-[#F7941D] font-bold hover:underline"
                  >
                    Clear search
                  </button>
                )}
              </li>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const isHighlighted = index === highlightedIndex;

                if (renderOption) {
                  return (
                    <li
                      key={`${opt.value}-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        if (!opt.disabled) selectOption(opt.value);
                      }}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      {renderOption(opt, isSelected)}
                    </li>
                  );
                }

                return (
                  <li
                    key={`${opt.value}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      if (!opt.disabled) selectOption(opt.value);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-xs sm:text-sm ${
                      opt.disabled
                        ? "opacity-40 cursor-not-allowed bg-transparent text-gray-400"
                        : isSelected
                        ? "bg-amber-50/80 text-[#1D1248] font-bold"
                        : isHighlighted
                        ? "bg-gray-100/80 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {opt.icon && (
                        <span className="text-gray-400 group-hover:text-[#F7941D] transition-colors shrink-0">
                          {opt.icon}
                        </span>
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="truncate font-semibold text-gray-800">
                          {opt.label}
                        </span>
                        {opt.subtitle && (
                          <span className="truncate text-[11px] text-gray-500 font-normal">
                            {opt.subtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {opt.badge !== undefined && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && (
                        <FaCheck className="text-[#F7941D] text-xs shrink-0" />
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {/* Optional Error */}
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}
