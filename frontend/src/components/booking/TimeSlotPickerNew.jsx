import React, { useState } from 'react';
import { cn } from '../../lib/utils';

/**
 * TimeSlotPicker - Time period tabs with slot grid
 * 
 * Features:
 * - Morning/Afternoon/Evening period tabs
 * - 3-column grid of time slots
 * - Available/Selected/Unavailable states
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
            {/* Period tabs */}
            <div className="flex gap-2">
                {TIME_PERIODS.map((period) => {
                    const isActive = selectedPeriod === period.id;
                    return (
                        <button
                            key={period.id}
                            onClick={() => onPeriodChange(period.id)}
                            className={cn(
                                "flex-1 py-2.5 px-3 rounded-full text-sm font-medium transition-all",
                                isActive
                                    ? "bg-emerald-50 border-2 border-emerald-500 text-emerald-700"
                                    : "bg-gray-50 border border-gray-200 text-gray-600 hover:border-emerald-200"
                            )}
                        >
                            {period.label}
                        </button>
                    );
                })}
            </div>

            {/* Time slots grid */}
            <div className="grid grid-cols-3 gap-2">
                {currentPeriod.slots.map((slot) => {
                    const isSelected = selectedTime === slot;
                    const isUnavailable = unavailableSlots.includes(slot);

                    return (
                        <button
                            key={slot}
                            onClick={() => !isUnavailable && onTimeSelect(slot)}
                            disabled={isUnavailable}
                            className={cn(
                                "h-11 rounded-lg text-sm font-medium transition-all",
                                isSelected
                                    ? "bg-emerald-600 text-white border-2 border-emerald-600"
                                    : isUnavailable
                                        ? "bg-gray-50 border border-gray-100 text-gray-300 line-through cursor-not-allowed"
                                        : "bg-white border border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/50"
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
