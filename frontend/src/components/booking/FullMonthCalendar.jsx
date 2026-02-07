import React, { useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameDay,
    isSameMonth,
    isToday,
    isBefore,
    startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * FullMonthCalendar - Always-visible full month calendar
 * 
 * Features:
 * - Full-width calendar with premium UI
 * - Multi-date selection support
 * - Weekday highlighting (shows dot for days matching selected weekdays)
 * - Month navigation with smooth transitions
 * - Today indicator
 * - Past dates disabled
 * - Premium polish with animations
 */

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const FullMonthCalendar = ({
    currentMonth,
    onMonthChange,
    selectedDates = [],
    onDateClick,
    highlightedWeekdays = [],
    minDate = new Date(),
    className,
}) => {
    // Generate calendar days for the current month view
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const calendarStart = startOfWeek(monthStart);
        const calendarEnd = endOfWeek(monthEnd);

        const days = [];
        let day = calendarStart;

        while (day <= calendarEnd) {
            days.push(day);
            day = addDays(day, 1);
        }

        return days;
    }, [currentMonth]);

    const handlePrevMonth = () => {
        onMonthChange(addDays(startOfMonth(currentMonth), -1));
    };

    const handleNextMonth = () => {
        onMonthChange(addDays(endOfMonth(currentMonth), 1));
    };

    const isDateSelected = (date) => {
        return selectedDates.some(d => isSameDay(d, date));
    };

    const isWeekdayHighlighted = (date) => {
        return highlightedWeekdays.includes(date.getDay());
    };

    const isDateDisabled = (date) => {
        return isBefore(startOfDay(date), startOfDay(minDate));
    };

    return (
        <div className={cn(
            "bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden",
            className
        )}>
            {/* Month Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <button
                    onClick={handlePrevMonth}
                    className={cn(
                        "p-2.5 rounded-xl transition-all duration-200",
                        "hover:bg-gray-100 active:scale-95 active:bg-gray-200"
                    )}
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <h3 className="text-base font-bold text-gray-900 tracking-tight">
                    {format(currentMonth, 'MMMM yyyy')}
                </h3>

                <button
                    onClick={handleNextMonth}
                    className={cn(
                        "p-2.5 rounded-xl transition-all duration-200",
                        "hover:bg-gray-100 active:scale-95 active:bg-gray-200"
                    )}
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-3">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-2">
                    {WEEKDAY_LABELS.map((label, index) => (
                        <div
                            key={label}
                            className={cn(
                                "text-center text-xs font-semibold py-2 transition-colors duration-200",
                                highlightedWeekdays.includes(index)
                                    ? "text-emerald-600"
                                    : "text-gray-400"
                            )}
                        >
                            {label}
                        </div>
                    ))}
                </div>

                {/* Date grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = isDateSelected(day);
                        const isHighlighted = isWeekdayHighlighted(day);
                        const isTodayDate = isToday(day);
                        const isDisabled = isDateDisabled(day) || !isCurrentMonth;

                        return (
                            <button
                                key={index}
                                onClick={() => !isDisabled && onDateClick(day)}
                                disabled={isDisabled}
                                className={cn(
                                    "relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium",
                                    "transition-all duration-200 ease-out",
                                    // Base states
                                    isDisabled && "cursor-not-allowed opacity-30",
                                    !isCurrentMonth && "text-gray-300",
                                    // Today indicator
                                    isTodayDate && !isSelected && "ring-2 ring-emerald-500 ring-inset bg-emerald-50/50",
                                    // Selected state - premium look
                                    isSelected && "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105",
                                    // Highlighted weekday (not selected)
                                    !isSelected && isHighlighted && isCurrentMonth && !isDisabled && "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                                    // Normal state
                                    !isSelected && !isHighlighted && isCurrentMonth && !isDisabled && "hover:bg-gray-100 text-gray-700 active:bg-gray-200 active:scale-95"
                                )}
                            >
                                <span className={cn(
                                    "transition-transform duration-200",
                                    isSelected && "font-bold"
                                )}>
                                    {format(day, 'd')}
                                </span>

                                {/* Weekday highlight dot */}
                                {isHighlighted && !isSelected && isCurrentMonth && !isDisabled && (
                                    <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected count footer */}
            {selectedDates.length > 0 && (
                <div className="px-4 py-3.5 bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-t border-emerald-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-sm">
                                {selectedDates.length}
                            </span>
                            <span className="text-sm font-medium text-emerald-800">
                                date{selectedDates.length > 1 ? 's' : ''} selected
                            </span>
                        </div>
                        <button
                            onClick={() => onDateClick(null)}
                            className={cn(
                                "text-sm text-emerald-600 font-semibold px-3 py-1.5 rounded-lg",
                                "transition-all duration-200",
                                "hover:bg-emerald-100 active:scale-95"
                            )}
                        >
                            Clear all
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export { FullMonthCalendar };
