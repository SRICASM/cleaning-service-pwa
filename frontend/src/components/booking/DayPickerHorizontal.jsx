import React from 'react';
import { cn } from '../../lib/utils';

/**
 * DayPickerHorizontal - Multi-select weekday pills
 * 
 * Features:
 * - "All" toggle to select/deselect all days
 * - Individual day selection (Mon-Sun)
 * - Multi-select support
 * - Large touch targets (48px+ height)
 * - Premium polish with animations and gradients
 */

const DAYS = [
    { id: 0, label: 'Sun', shortLabel: 'S' },
    { id: 1, label: 'Mon', shortLabel: 'M' },
    { id: 2, label: 'Tue', shortLabel: 'T' },
    { id: 3, label: 'Wed', shortLabel: 'W' },
    { id: 4, label: 'Thu', shortLabel: 'T' },
    { id: 5, label: 'Fri', shortLabel: 'F' },
    { id: 6, label: 'Sat', shortLabel: 'S' },
];

const DayPickerHorizontal = ({
    selectedDays = [],
    onDaysChange,
    className,
}) => {
    const allSelected = selectedDays.length === 7;

    const handleDayToggle = (dayId) => {
        if (selectedDays.includes(dayId)) {
            onDaysChange(selectedDays.filter(d => d !== dayId));
        } else {
            onDaysChange([...selectedDays, dayId].sort((a, b) => a - b));
        }
    };

    const handleAllToggle = () => {
        if (allSelected) {
            onDaysChange([]);
        } else {
            onDaysChange([0, 1, 2, 3, 4, 5, 6]);
        }
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Label */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-800">Quick Select Days</span>
                <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full transition-colors duration-200",
                    selectedDays.length > 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-gray-100 text-gray-400"
                )}>
                    {selectedDays.length === 0
                        ? 'None selected'
                        : selectedDays.length === 7
                            ? 'All days'
                            : `${selectedDays.length} day${selectedDays.length > 1 ? 's' : ''}`}
                </span>
            </div>

            {/* Pills container */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                {/* All button */}
                <button
                    onClick={handleAllToggle}
                    className={cn(
                        "flex-shrink-0 h-12 px-5 rounded-xl font-semibold text-sm",
                        "transition-all duration-200 ease-out",
                        "active:scale-[0.96]",
                        "border-2",
                        allSelected
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                            : "bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:shadow-md"
                    )}
                >
                    All
                </button>

                {/* Divider */}
                <div className="w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent flex-shrink-0 my-2" />

                {/* Individual day buttons */}
                {DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day.id);

                    return (
                        <button
                            key={day.id}
                            onClick={() => handleDayToggle(day.id)}
                            className={cn(
                                "flex-shrink-0 w-12 h-12 rounded-xl font-semibold text-sm",
                                "transition-all duration-200 ease-out",
                                "active:scale-[0.94]",
                                "border-2 flex items-center justify-center",
                                isSelected
                                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-emerald-300 hover:shadow-md"
                            )}
                            title={day.label}
                        >
                            <span className="hidden sm:inline">{day.label}</span>
                            <span className="sm:hidden">{day.shortLabel}</span>
                        </button>
                    );
                })}
            </div>

            {/* Helper text */}
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Select days to auto-highlight recurring dates
            </p>
        </div>
    );
};

export { DayPickerHorizontal, DAYS };
