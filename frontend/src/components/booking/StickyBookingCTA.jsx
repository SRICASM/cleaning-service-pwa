import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

/**
 * StickyBookingCTA - Slide-up sticky bottom bar for booking confirmation
 */
const StickyBookingCTA = ({
    isVisible = false,
    bookingSummary = '',
    price = 0,
    originalPrice,
    onConfirm,
    isLoading = false,
    isDisabled = false,
    className,
}) => {
    const savings = originalPrice ? originalPrice - price : 0;

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50",
                "bg-white/95 backdrop-blur-xl",
                "border-t border-gray-100",
                "shadow-[0_-8px_30px_rgba(0,0,0,0.12)]",
                "transform transition-all duration-300 ease-out",
                isVisible ? "translate-y-0" : "translate-y-full",
                className
            )}
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div className="max-w-4xl mx-auto px-4 pt-3 pb-5">
                {/* Price + Summary Row */}
                <div className="flex items-center justify-between mb-3">
                    <div>
                        {bookingSummary && (
                            <span className="text-sm font-semibold text-gray-800 truncate block max-w-[200px]">
                                {bookingSummary}
                            </span>
                        )}
                    </div>

                    <div className="text-right">
                        <div className="flex items-center gap-2">
                            {savings > 0 && (
                                <span className="text-sm text-gray-400 line-through font-medium">
                                    AED {originalPrice}
                                </span>
                            )}
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">
                                AED {price}
                            </span>
                        </div>
                        {savings > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Save AED {savings}
                            </span>
                        )}
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onConfirm}
                    disabled={isDisabled || isLoading}
                    className={cn(
                        "w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2",
                        "transition-all duration-200 ease-out",
                        "active:scale-[0.98]",
                        isDisabled || isLoading
                            ? "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-500 via-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40"
                    )}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : isDisabled ? (
                        'Complete all steps'
                    ) : (
                        <>
                            Confirm Booking
                            <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

/**
 * Hook to manage sticky CTA visibility based on scroll position
 */
export const useStickyScroll = (threshold = 0.8) => {
    const [showSticky, setShowSticky] = useState(false);
    const [scrollPercentage, setScrollPercentage] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentScroll = window.scrollY;
            const percentage = scrollHeight > 0 ? currentScroll / scrollHeight : 0;

            setScrollPercentage(percentage);
            setShowSticky(percentage >= threshold);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return { showSticky, scrollPercentage };
};

export { StickyBookingCTA };
