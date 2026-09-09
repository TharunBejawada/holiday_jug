"use client";

import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";

export function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7941D] text-white shadow-xl hover:bg-[#e08316] active:scale-95 transition-all duration-300 transform ${visible
                    ? "opacity-100 scale-100 translate-y-0 cursor-pointer pointer-events-auto"
                    : "opacity-0 scale-75 translate-y-4 pointer-events-none"
                }`}
        >
            <FaChevronUp className="text-base" />
        </button>
    );
}
