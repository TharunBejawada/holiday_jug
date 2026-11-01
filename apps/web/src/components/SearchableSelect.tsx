"use client";

import React, { useState, useRef, useEffect, useMemo, useId } from "react";
import { FaChevronDown, FaTimes, FaCheck, FaSearch } from "react-icons/fa";

export interface SearchableSelectOption {
  value: string;
  label: string;
  subtitle?: string;
  badge?: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
  searchTerms?: string[];
  tags?: string[];
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
  showSubtitleInTrigger = false,
  renderOption,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const instanceId = useId();

  // Find the currently selected option
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  const displayLabel = selectedOption ? selectedOption.label : value ? value : "";
  const [inputValue, setInputValue] = useState(displayLabel);

  // Keep inputValue in sync when selected value prop changes
  useEffect(() => {
    setInputValue(displayLabel);
  }, [displayLabel]);

  // Filter options based on input value in the select area
  const filteredOptions = useMemo(() => {
    const trimmed = inputValue.trim().toLowerCase();
    // If empty or exactly matches the current selected label, show all options
    if (!trimmed || trimmed === displayLabel.toLowerCase()) return options;

    return options.filter((opt) => {
      if (opt.label.toLowerCase().includes(trimmed)) return true;
      if (opt.subtitle && opt.subtitle.toLowerCase().includes(trimmed)) return true;
      if (opt.value.toLowerCase().includes(trimmed)) return true;
      if (opt.searchTerms && opt.searchTerms.some((t) => t.toLowerCase().includes(trimmed))) {
        return true;
      }
      if (opt.tags && opt.tags.some((t) => t.toLowerCase().includes(trimmed))) {
        return true;
      }
      return false;
    });
  }, [options, inputValue, displayLabel]);

  // Reset highlight index when filtered results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions.length, inputValue]);

  // Close and reset input when clicking outside (auto-selecting exact match if typed)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        const trimmed = inputValue.trim().toLowerCase();
        if (trimmed && trimmed !== displayLabel.toLowerCase()) {
          const match = options.find(
            (opt) =>
              opt.label.toLowerCase() === trimmed ||
              opt.value.toLowerCase() === trimmed ||
              (opt.searchTerms && opt.searchTerms.some((t) => t.toLowerCase() === trimmed)) ||
              (opt.tags && opt.tags.some((t) => t.toLowerCase() === trimmed))
          );
          if (match && match.value !== value) {
            onChange(match.value);
            setInputValue(match.label);
            setIsOpen(false);
            return;
          }
        }
        setIsOpen(false);
        setInputValue(displayLabel);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [displayLabel, inputValue, options, value, onChange]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.select(), 10);
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
        setInputValue(displayLabel);
        inputRef.current?.blur();
        break;
      }
      case "Tab": {
        setIsOpen(false);
        setInputValue(displayLabel);
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
    const chosen = options.find((opt) => opt.value === optValue);
    setInputValue(chosen ? chosen.label : optValue);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue("");
    onChange("");
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleTriggerClick = () => {
    if (disabled) return;
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.select(), 10);
    }
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (disabled) return;
    if (!isOpen) {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.select(), 10);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
      setInputValue(displayLabel);
    } else {
      setIsOpen(true);
      inputRef.current?.focus();
      setTimeout(() => inputRef.current?.select(), 10);
    }
  };

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

      {/* TRIGGER & SEARCH INPUT IN THE SELECT AREA ITSELF */}
      <div
        onClick={handleTriggerClick}
        className={`w-full flex items-center justify-between gap-2 rounded-xl bg-gray-50/90 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-left border transition-all font-semibold cursor-text ${
          disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : isOpen
            ? "border-[#F7941D] bg-white ring-2 ring-amber-100"
            : error
            ? "border-red-400 bg-red-50/30 text-gray-800 hover:border-red-500"
            : "border-gray-200 text-gray-800 hover:border-gray-300 focus-within:border-[#F7941D] focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100"
        } ${triggerClassName}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon && <span className="text-gray-400 shrink-0 text-xs sm:text-sm">{icon}</span>}
          <div className="flex flex-col min-w-0 flex-1">
            <input
              ref={inputRef}
              type="text"
              disabled={disabled}
              value={inputValue}
              placeholder={placeholder}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="w-full bg-transparent border-none outline-none p-0 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 placeholder:font-normal truncate cursor-text"
              aria-label={label || placeholder}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            />
            {showSubtitleInTrigger && !isOpen && selectedOption?.subtitle && (
              <span className="truncate text-[11px] text-gray-500 font-normal leading-tight">
                {selectedOption.subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-gray-400">
          {(inputValue || value) && (isClearable || inputValue !== displayLabel) && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
          {trailingIcon ? (
            <span className="text-xs sm:text-sm">{trailingIcon}</span>
          ) : (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleChevronClick}
              className="p-0.5 hover:text-gray-600 transition-colors cursor-pointer"
              aria-label={isOpen ? "Close dropdown" : "Open dropdown"}
            >
              <FaChevronDown
                className={`text-xs transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-[#F7941D]" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* DROPDOWN POPOVER (DIRECT OPTIONS LIST - NO SEPARATE SEARCH BOX) */}
      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } top-full mt-1.5 z-50 w-full min-w-[240px] sm:min-w-[280px] rounded-2xl bg-white shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-top-2 duration-150 ${menuClassName}`}
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
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
                {inputValue && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    No results for &ldquo;{inputValue}&rdquo;
                  </p>
                )}
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue("");
                      inputRef.current?.focus();
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
