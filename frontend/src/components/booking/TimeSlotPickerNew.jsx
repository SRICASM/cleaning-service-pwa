import React from 'react';
import { cn } from '../../lib/utils';

/**
 * TimeSlotPicker - Time period tabs with slot grid
 * 
 * Features:
 * - Morning/Afternoon/Evening period tabs with smooth transitions
 * - 3-column grid of time slots
 * - Available/Selected/Unavailable states
 * - Premium polish with animations
 */

const TIME_PERIODS = [
    { id: 'morning', label: 'Morning', range: '06:00 - 12:00', slots: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'] },
    { id: 'afternoon', label: 'Afternoon', range: '12:00 - 17:00', slots: ['12:00', '13:00', '14:00', '15:00', '16:00'] },
    { id: 'evening', label: 'Evening', range: '17:00 - 21:00', slots: ['17:00', '18:00', '19:00', '20:00'] },
];

const TimeSlotPicker = ({
    selectedPeriod = 'morning',
    selectedTime,
    onPeriodChange,
    onTimeSelect,
    unavailableSlots = [],
    className,
}) => {
    const currentPeriod = TIME_PERIODS.find(p => p.id === selectedPeriod) || TIME_PERIODS[0];

    const formatTime = (time24) => {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        return `${displayHour}:${minutes} ${period}`;
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Period tabs - pill style */}
            <div className="flex gap-2 p-1 bg-gray-100/80 rounded-2xl">
                {TIME_PERIODS.map((period) => {
                    const isActive = selectedPeriod === period.id;
                    return (
                        <button
                            key={period.id}
                            onClick={() => onPeriodChange(period.id)}
                            className={cn(
                                "flex-1 py-3 px-3 rounded-xl text-sm font-semibold",
                                "transition-all duration-200 ease-out",
                                "active:scale-[0.97]",
                                isActive
                                    ? "bg-white text-emerald-700 shadow-md"
                                    : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            <span className="block">{period.label}</span>
                            <span className={cn(
                                "block text-xs font-normal mt-0.5 transition-colors duration-200",
                                isActive ? "text-emerald-500" : "text-gray-400"
                            )}>
                                {period.range}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Time slots grid */}
            <div className="grid grid-cols-3 gap-2.5">
                {currentPeriod.slots.map((slot) => {
                    const isSelected = selectedTime === slot;
                    const isUnavailable = unavailableSlots.includes(slot);

                    return (
                        <button
                            key={slot}
                            onClick={() => !isUnavailable && onTimeSelect(slot)}
                            disabled={isUnavailable}
                            className={cn(
                                "h-12 rounded-xl text-sm font-semibold",
                                "transition-all duration-200 ease-out",
                                "active:scale-[0.95]",
                                isSelected
                                    ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                                    : isUnavailable
                                        ? "bg-gray-50 border border-gray-100 text-gray-300 line-through cursor-not-allowed"
                                        : "bg-white border-2 border-gray-100 text-gray-700 hover:border-emerald-300 hover:shadow-md"
                            )}
                        >
                            {formatTime(slot)}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export { TimeSlotPicker, TIME_PERIODS };
