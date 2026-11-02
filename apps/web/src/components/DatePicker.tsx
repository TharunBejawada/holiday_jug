"use client";

import { useState, useRef, useEffect } from "react";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

interface DatePickerProps {
    label?: string;
    value: string; // YYYY-MM-DD format
    onChange: (date: string) => void;
    placeholder?: string;
    minDate?: string; // YYYY-MM-DD
    error?: string;
    required?: boolean;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({
    value,
    onChange,
    placeholder = "Select date",
    minDate,
    error,
    required = false,
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse initial selected date or default to current month view
    const selectedDate = value ? new Date(value) : null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [viewYear, setViewYear] = useState(selectedDate ? selectedDate.getFullYear() : today.getFullYear());
    const [viewMonth, setViewMonth] = useState(selectedDate ? selectedDate.getMonth() : today.getMonth());

    // Close popup when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handlePrevMonth = () => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    // Generate calendar grid days
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const handleSelectDay = (dayNum: number) => {
        const monthStr = String(viewMonth + 1).padStart(2, "0");
        const dayStr = String(dayNum).padStart(2, "0");
        const formattedDate = `${viewYear}-${monthStr}-${dayStr}`;
        onChange(formattedDate);
        setIsOpen(false);
    };

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-").map(Number);
        if (!y || !m || !d) return dateStr;
        const dateObj = new Date(y, m - 1, d);
        return dateObj.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Quick preset shortcuts: +1 Day, +2 Days, +3 Days, +7 Days, +14 Days
    const selectShortcut = (daysToAdd: number) => {
        const base = minDate ? new Date(minDate) : new Date();
        const d = new Date(base);
        d.setDate(d.getDate() + daysToAdd);
        const yStr = d.getFullYear();
        const mStr = String(d.getMonth() + 1).padStart(2, "0");
        const dStr = String(d.getDate()).padStart(2, "0");
        onChange(`${yStr}-${mStr}-${dStr}`);
        setViewYear(yStr);
        setViewMonth(d.getMonth());
        setIsOpen(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* TRIGGER BUTTON */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm border transition-all font-semibold cursor-pointer ${
                    error
                        ? "border-red-400 bg-red-50/30 text-gray-800 hover:border-red-500 ring-1 ring-red-300"
                        : isOpen
                        ? "border-[#F7941D] bg-white ring-2 ring-amber-100"
                        : "border-gray-200 bg-gray-50/90 text-gray-800 hover:border-gray-300 focus:border-[#F7941D] focus:bg-white"
                }`}
            >
                <span className={value ? "text-gray-900" : "text-gray-400 font-normal"}>
                    {value ? formatDisplayDate(value) : placeholder}
                </span>
                <div className="flex items-center gap-1.5 text-gray-400">
                    {value && (
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange("");
                            }}
                            className="p-1 hover:text-red-500 transition-colors cursor-pointer"
                            title="Clear date"
                        >
                            <FaTimes className="text-xs" />
                        </span>
                    )}
                    <FaCalendarAlt className="text-xs sm:text-sm" />
                </div>
            </button>

            {/* Error Message */}
            {error && (
                <span className="text-[11px] font-semibold text-red-500 mt-1 block">
                    {error}
                </span>
            )}

            {/* CALENDAR POPOVER */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 rounded-2xl bg-white p-4 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    {/* HEADER: MONTH & YEAR NAV */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-2 text-gray-600 hover:text-[#F7941D] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                            <FaChevronLeft className="text-xs" />
                        </button>
                        <span className="text-sm font-semibold text-[#1D1248]">
                            {MONTH_NAMES[viewMonth]} {viewYear}
                        </span>
                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-2 text-gray-600 hover:text-[#F7941D] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                            <FaChevronRight className="text-xs" />
                        </button>
                    </div>

                    {/* QUICK SHORTCUT PRESETS (+1 Day, +2 Days, +3 Days, +7 Days, +14 Days) */}
                    <div className="flex items-center gap-1.5 my-2.5 overflow-x-auto pb-1 text-xs">
                        <button
                            type="button"
                            onClick={() => selectShortcut(1)}
                            className="rounded-lg bg-gray-100 px-2 py-1 text-gray-700 hover:bg-[#F7941D] hover:text-white transition-colors font-medium whitespace-nowrap cursor-pointer text-[11px]"
                        >
                            +1 Day
                        </button>
                        <button
                            type="button"
                            onClick={() => selectShortcut(2)}
                            className="rounded-lg bg-gray-100 px-2 py-1 text-gray-700 hover:bg-[#F7941D] hover:text-white transition-colors font-medium whitespace-nowrap cursor-pointer text-[11px]"
                        >
                            +2 Days
                        </button>
                        <button
                            type="button"
                            onClick={() => selectShortcut(3)}
                            className="rounded-lg bg-gray-100 px-2 py-1 text-gray-700 hover:bg-[#F7941D] hover:text-white transition-colors font-medium whitespace-nowrap cursor-pointer text-[11px]"
                        >
                            +3 Days
                        </button>
                        <button
                            type="button"
                            onClick={() => selectShortcut(7)}
                            className="rounded-lg bg-gray-100 px-2 py-1 text-gray-700 hover:bg-[#F7941D] hover:text-white transition-colors font-medium whitespace-nowrap cursor-pointer text-[11px]"
                        >
                            +7 Days
                        </button>
                        <button
                            type="button"
                            onClick={() => selectShortcut(14)}
                            className="rounded-lg bg-gray-100 px-2 py-1 text-gray-700 hover:bg-[#F7941D] hover:text-white transition-colors font-medium whitespace-nowrap cursor-pointer text-[11px]"
                        >
                            +14 Days
                        </button>
                    </div>

                    {/* DAYS OF WEEK HEADER */}
                    <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 my-1">
                        {DAYS_OF_WEEK.map((d) => (
                            <span key={d} className="py-1">
                                {d}
                            </span>
                        ))}
                    </div>

                    {/* DAYS GRID */}
                    <div className="grid grid-cols-7 text-center gap-1 text-sm font-semibold">
                        {/* Empty slots before day 1 */}
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {/* Day slots */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const monthStr = String(viewMonth + 1).padStart(2, "0");
                            const dayStr = String(dayNum).padStart(2, "0");
                            const dateIso = `${viewYear}-${monthStr}-${dayStr}`;

                            const isSelected = value === dateIso;

                            const cellDate = new Date(viewYear, viewMonth, dayNum);
                            cellDate.setHours(0, 0, 0, 0);
                            const minDateTime = minDate ? new Date(minDate).setHours(0, 0, 0, 0) : today.getTime();
                            const isPast = cellDate.getTime() < minDateTime;

                            return (
                                <button
                                    key={dayNum}
                                    type="button"
                                    disabled={isPast}
                                    onClick={() => handleSelectDay(dayNum)}
                                    className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                        isSelected
                                            ? "bg-[#F7941D] text-white shadow-md font-semibold scale-105"
                                            : isPast
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-gray-700 hover:bg-amber-50 hover:text-[#F7941D]"
                                    }`}
                                >
                                    {dayNum}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
