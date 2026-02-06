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
            "flex gap-1 p-1 bg-gray-50 rounded-xl",
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
                            "flex-1 flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-lg transition-all min-h-[48px]",
                            isActive
                                ? "bg-white text-emerald-600 shadow-md"
                                : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <Icon className={cn(
                                "w-4 h-4",
                                isActive && "text-emerald-500"
                            )} />
                            <span className="font-medium text-sm">{option.label}</span>
                        </div>
                        <span className={cn(
                            "text-xs",
                            isActive ? "text-emerald-600/70" : "text-gray-400"
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
