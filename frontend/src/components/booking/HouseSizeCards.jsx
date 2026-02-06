import React, { useRef } from 'react';
import { Home, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * HouseSizeCards - Horizontal scrollable cards for house size selection
 * 
 * Features:
 * - Horizontal scroll with snap
 * - Touch-friendly card sizes
 * - Active state with emerald highlight
 * - Price and duration display
 */

const HOUSE_TYPES = [
    { id: 'studio', label: 'Studio', duration: '2 Hours', price: 150 },
    { id: '1bhk', label: '1 BHK', duration: '3 Hours', price: 225 },
    { id: '2bhk', label: '2 BHK', duration: '4 Hours', price: 300 },
    { id: '3bhk', label: '3 BHK', duration: '5 Hours', price: 375 },
    { id: '4bhk', label: '4 BHK', duration: '6 Hours', price: 450 },
    { id: '5bhk', label: '5 BHK', duration: '7 Hours', price: 525 },
    { id: 'villa', label: 'Villa', duration: '8 Hours', price: 600 },
];

const HouseSizeCards = ({
    selectedSize,
    onSelect,
    options = HOUSE_TYPES,
    className,
}) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className={cn("relative group", className)}>
            {/* Left Scroll Button */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-all opacity-0 group-hover:opacity-100 -ml-3"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto pb-2 gap-3 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            >
                {options.map((type) => {
                    const isSelected = selectedSize === type.id;
                    return (
                        <button
                            key={type.id}
                            onClick={() => onSelect(type.id)}
                            className={cn(
                                "flex-shrink-0 w-[100px] snap-start p-4 rounded-xl border-2 text-center transition-all",
                                isSelected
                                    ? "border-emerald-500 bg-emerald-50 shadow-[0_4px_12px_rgba(5,150,105,0.15)]"
                                    : "border-gray-100 bg-white hover:border-emerald-100 hover:bg-gray-50"
                            )}
                        >
                            {/* Icon */}
                            <div className={cn(
                                "w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center",
                                isSelected ? "bg-emerald-100" : "bg-gray-50"
                            )}>
                                <Home className={cn(
                                    "w-4 h-4",
                                    isSelected ? "text-emerald-600" : "text-gray-400"
                                )} />
                            </div>

                            {/* Label */}
                            <p className={cn(
                                "font-semibold text-sm mb-1",
                                isSelected ? "text-emerald-900" : "text-gray-700"
                            )}>
                                {type.label}
                            </p>

                            {/* Duration */}
                            <p className="text-xs text-gray-500 mb-2">{type.duration}</p>

                            {/* Price */}
                            <p className={cn(
                                "text-base font-bold",
                                isSelected ? "text-emerald-600" : "text-gray-900"
                            )}>
                                AED {type.price}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Right Scroll Button */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-all opacity-0 group-hover:opacity-100 -mr-3"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export { HouseSizeCards, HOUSE_TYPES };
