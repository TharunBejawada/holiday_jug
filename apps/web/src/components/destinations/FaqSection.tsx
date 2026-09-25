"use client";

import { useState } from "react";

interface FaqItem {
    id: number;
    question: string;
    answer: string;
}

const FAQS: FaqItem[] = [
    {
        id: 1,
        question: "How does holidayjug help plan my holiday?",
        answer: "Simply tell us where you'd like to go, your travel dates, preferences and budget. our team will create a personalised holiday plan for you to review and approve.",
    },
    {
        id: 2,
        question: "Can i customise my holiday itinerary?",
        answer: "Yes, every holiday we create is 100% customizable based on your preferences, budget, and desired activities.",
    },
    {
        id: 3,
        question: "How far in advance should i book my holiday?",
        answer: "We recommend booking 2 to 6 months in advance for the best rates and availability, though we can also arrange last-minute getaways.",
    },
    {
        id: 4,
        question: "Can you arrange flights and hotels?",
        answer: "Yes, we arrange full ATOL/ABTA protected packages including flights, accommodations, transfers, and activities.",
    },
    {
        id: 5,
        question: "Can you plan holidays for families or groups?",
        answer: "Yes! We specialize in tailored itineraries for solo travelers, couples, families, and large group holidays.",
    },
    {
        id: 6,
        question: "What happens after i submit my holiday enquiry?",
        answer: "Our travel experts will review your request and contact you within 24 hours with a personalized holiday proposal.",
    },
    {
        id: 7,
        question: "Can i make changes to my itinerary?",
        answer: "Absolutely. You can review your custom itinerary and request any adjustments before finalizing your booking.",
    },
    {
        id: 8,
        question: "Do you provide support during my trip?",
        answer: "Yes! We offer 24/7 customer support while you are on your trip to ensure a seamless and worry-free experience.",
    },
];

const LEFT_FAQS = [FAQS[0], FAQS[2], FAQS[4], FAQS[6]];
const RIGHT_FAQS = [FAQS[1], FAQS[3], FAQS[5], FAQS[7]];

export function FaqSection() {
    // All questions collapsed initially
    const [openIds, setOpenIds] = useState<number[]>([]);

    const toggleFaq = (id: number) => {
        setOpenIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const renderFaqCard = (faq: FaqItem) => {
        const isOpen = openIds.includes(faq.id);

        return (
            <div
                key={faq.id}
                onClick={() => toggleFaq(faq.id)}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-center"
            >
                <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-[#1D1248] text-base sm:text-lg flex-1">
                        {faq.question}
                    </h3>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F7941D] text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-sm flex-shrink-0 transition-transform">
                        {isOpen ? "−" : "+"}
                    </div>
                </div>

                {isOpen && (
                    <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 leading-relaxed font-normal animate-fadeIn">
                        {faq.answer}
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="mt-10 sm:mt-14 lg:mt-16">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                <div className="flex items-center justify-center gap-3 mb-2 sm:mb-3">
                    <div className="w-8 sm:w-10 h-[3.5px] bg-[#F7941D] rounded-full" />
                    <span className="text-xs sm:text-sm font-bold tracking-widest text-[#1D1248] uppercase">
                        FREQUENTLY ASKED QUESTIONS
                    </span>
                    <div className="w-8 sm:w-10 h-[3.5px] bg-[#F7941D] rounded-full" />
                </div>

                <p className="text-sm sm:text-base font-normal text-gray-700">
                    everything you need to know before you start planning.
                </p>
            </div>

            {/* 2 Column FAQ Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
                <div className="space-y-4 sm:space-y-5">
                    {LEFT_FAQS.map(renderFaqCard)}
                </div>
                <div className="space-y-4 sm:space-y-5">
                    {RIGHT_FAQS.map(renderFaqCard)}
                </div>
            </div>
        </section>
    );
}
