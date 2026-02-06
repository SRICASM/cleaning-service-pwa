import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * StickyBookingCTA - Slide-up sticky bottom bar for booking confirmation
 * 
 * Features:
 * - Slides up when user scrolls to bottom
 * - Shows booking summary and price
 * - Safe area support for notched devices
 * - Primary CTA with gradient amber background
 */
const StickyBookingCTA = ({
    isVisible = false,
    bookingSummary = '',
    price = 0,
    originalPrice,
    paymentMode = 'now',
    onPaymentModeChange,
    onConfirm,
    isLoading = false,
    isDisabled = false,
    className,
}) => {
    const savings = originalPrice ? originalPrice - price : 0;

    return (
        <div
            className={cn(
                "fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50",
                "transform transition-transform duration-300 ease-out safe-area-bottom",
                isVisible ? "translate-y-0" : "translate-y-full",
                className
            )}
        >
            <div className="max-w-4xl mx-auto px-4 py-4">
                {/* Summary Row */}
                {bookingSummary && (
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">Booking Summary</span>
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {bookingSummary}
                        </span>
                    </div>
                )}

                {/* Price and Payment Row */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <select
                            value={paymentMode}
                            onChange={(e) => onPaymentModeChange?.(e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="now">Pay Now</option>
                            <option value="later">Pay Later (Cash)</option>
                        </select>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center gap-2">
                            {savings > 0 && (
                                <span className="text-sm text-gray-400 line-through">
                                    AED {originalPrice}
                                </span>
                            )}
                            <span className="text-xl font-bold text-gray-900">
                                AED {price}
                            </span>
                        </div>
                        {savings > 0 && (
                            <span className="text-xs text-emerald-600 font-medium">
                                You save AED {savings}
                            </span>
                        )}
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onConfirm}
                    disabled={isDisabled || isLoading}
                    className={cn(
                        "w-full h-[52px] rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-200",
                        "shadow-[0_4px_12px_rgba(245,158,11,0.3)]",
                        isDisabled || isLoading
                            ? "bg-gray-200 text-gray-400 shadow-none cursor-not-allowed"
                            : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 active:scale-[0.98]"
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
                    ) : (
                        <>
                            Confirm Booking
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
        handleScroll(); // Check initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return { showSticky, scrollPercentage };
};

export { StickyBookingCTA };
