import React from 'react';
import { Zap, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * BookingTypeToggle - Toggle between Instant and Schedule booking
 * 
 * Features:
 * - Large touch targets (48px+)
 * - Clear visual distinction between modes
 * - Subtle descriptions for each mode
 * - Premium polish with animations and gradients
 */

const BookingTypeToggle = ({
    bookingType,
    onBookingTypeChange,
    className,
}) => {
    const options = [
        {
            id: 'instant',
            label: 'Instant',
            icon: Zap,
            subtitle: 'Get help now',
        },
        {
            id: 'schedule',
            label: 'Schedule',
            icon: Calendar,
            subtitle: 'Pick a date & time',
        },
    ];

    return (
        <div className={cn(
            "flex gap-1.5 p-1.5 bg-gray-100/80 rounded-2xl backdrop-blur-sm",
            className
        )}>
            {options.map((option) => {
                const Icon = option.icon;
                const isActive = bookingType === option.id;

                return (
                    <button
                        key={option.id}
                        onClick={() => onBookingTypeChange(option.id)}
                        className={cn(
                            "flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl",
                            "transition-all duration-200 ease-out min-h-[56px]",
                            "active:scale-[0.98]",
                            isActive
                                ? "bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-100"
                                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "p-1 rounded-lg transition-colors duration-200",
                                isActive ? "bg-emerald-50" : "bg-transparent"
                            )}>
                                <Icon className={cn(
                                    "w-4 h-4 transition-colors duration-200",
                                    isActive ? "text-emerald-500" : "text-gray-400"
                                )} />
                            </div>
                            <span className={cn(
                                "font-semibold text-sm transition-colors duration-200",
                                isActive ? "text-gray-900" : "text-gray-600"
                            )}>
                                {option.label}
                            </span>
                        </div>
                        <span className={cn(
                            "text-xs transition-colors duration-200",
                            isActive ? "text-emerald-600/80" : "text-gray-400"
                        )}>
                            {option.subtitle}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export { BookingTypeToggle };
