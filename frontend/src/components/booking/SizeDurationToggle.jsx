import React from 'react';
import { Home, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * SizeDurationToggle - Pill-style pricing mode selector with size/duration cards
 * 
 * Follows the same design pattern as BookingTypeToggle:
 * - Pill container with gray background
 * - Equal-width options side by side
 * - Active state: white background, shadow, ring accent
 * - Conditional reveal for size or hourly cards
 */

const HOUSE_SIZES = [
    { id: 'studio', label: 'Studio', hours: 2, price: 150 },
    { id: '1bhk', label: '1 BHK', hours: 3, price: 225 },
    { id: '2bhk', label: '2 BHK', hours: 4, price: 300 },
    { id: '3bhk', label: '3 BHK', hours: 5, price: 375 },
    { id: '4bhk', label: '4 BHK', hours: 6, price: 450 },
    { id: '5bhk', label: '5+ BHK', hours: 8, price: 600 },
];

const HOURLY_OPTIONS = [
    { id: '2hrs', label: '2 Hours', hours: 2, price: 150 },
    { id: '3hrs', label: '3 Hours', hours: 3, price: 225 },
    { id: '4hrs', label: '4 Hours', hours: 4, price: 300 },
    { id: '5hrs', label: '5 Hours', hours: 5, price: 375 },
    { id: '6hrs', label: '6 Hours', hours: 6, price: 450 },
    { id: '8hrs', label: '8 Hours', hours: 8, price: 600 },
];

const SizeDurationToggle = ({
    pricingMode = 'size',
    onPricingModeChange,
    selectedSize,
    onSizeChange,
    selectedHours,
    onHoursChange,
    baseRate = 75,
    className,
}) => {
    const options = pricingMode === 'size' ? HOUSE_SIZES : HOURLY_OPTIONS;
    const selectedValue = pricingMode === 'size' ? selectedSize : selectedHours;
    const onValueChange = pricingMode === 'size' ? onSizeChange : onHoursChange;

    return (
        <div className={cn("space-y-4", className)}>
            {/* Pricing Mode Toggle - Same style as BookingTypeToggle */}
            <div className="flex gap-1.5 p-1.5 bg-gray-100/80 rounded-2xl backdrop-blur-sm">
                <button
                    onClick={() => onPricingModeChange('size')}
                    className={cn(
                        "flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl",
                        "transition-all duration-200 ease-out",
                        "active:scale-[0.98]",
                        pricingMode === 'size'
                            ? "bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-100"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    )}
                >
                    <div className={cn(
                        "p-1 rounded-lg transition-colors duration-200",
                        pricingMode === 'size' ? "bg-emerald-50" : "bg-transparent"
                    )}>
                        <Home className={cn(
                            "w-4 h-4 transition-colors duration-200",
                            pricingMode === 'size' ? "text-emerald-500" : "text-gray-400"
                        )} />
                    </div>
                    <span className={cn(
                        "font-semibold text-sm transition-colors duration-200",
                        pricingMode === 'size' ? "text-gray-900" : "text-gray-600"
                    )}>
                        By Size
                    </span>
                    <span className={cn(
                        "text-xs transition-colors duration-200",
                        pricingMode === 'size' ? "text-emerald-600/80" : "text-gray-400"
                    )}>
                        Select home type
                    </span>
                </button>

                <button
                    onClick={() => onPricingModeChange('hourly')}
                    className={cn(
                        "flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl",
                        "transition-all duration-200 ease-out",
                        "active:scale-[0.98]",
                        pricingMode === 'hourly'
                            ? "bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-100"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    )}
                >
                    <div className={cn(
                        "p-1 rounded-lg transition-colors duration-200",
                        pricingMode === 'hourly' ? "bg-emerald-50" : "bg-transparent"
                    )}>
                        <Clock className={cn(
                            "w-4 h-4 transition-colors duration-200",
                            pricingMode === 'hourly' ? "text-emerald-500" : "text-gray-400"
                        )} />
                    </div>
                    <span className={cn(
                        "font-semibold text-sm transition-colors duration-200",
                        pricingMode === 'hourly' ? "text-gray-900" : "text-gray-600"
                    )}>
                        By Hours
                    </span>
                    <span className={cn(
                        "text-xs transition-colors duration-200",
                        pricingMode === 'hourly' ? "text-emerald-600/80" : "text-gray-400"
                    )}>
                        AED {baseRate}/hr
                    </span>
                </button>
            </div>

            {/* Size/Duration Cards - Horizontal scroll */}
            <div className="overflow-x-auto py-4 -mx-1 px-1 scrollbar-hide">
                <div className="flex gap-3">
                    {options.map((option) => {
                        const isSelected = selectedValue === option.id;

                        return (
                            <button
                                key={option.id}
                                onClick={() => onValueChange(option.id)}
                                className={cn(
                                    "flex-shrink-0 w-24 p-4 rounded-2xl",
                                    "flex flex-col items-center gap-2",
                                    "transition-all duration-200 ease-out",
                                    "active:scale-[0.96]",
                                    isSelected
                                        ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105"
                                        : "bg-white border-2 border-gray-100 text-gray-700 hover:border-emerald-200 hover:shadow-md"
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-bold",
                                    isSelected ? "text-white" : "text-gray-900"
                                )}>
                                    {option.label}
                                </span>
                                <span className={cn(
                                    "text-xs",
                                    isSelected ? "text-emerald-100" : "text-gray-400"
                                )}>
                                    {option.hours} hrs
                                </span>
                                <div className={cn(
                                    "mt-1 px-3 py-1 rounded-full text-xs font-bold",
                                    isSelected
                                        ? "bg-white/20 text-white"
                                        : "bg-emerald-50 text-emerald-600"
                                )}>
                                    AED {option.price}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export { SizeDurationToggle, HOUSE_SIZES, HOURLY_OPTIONS };
