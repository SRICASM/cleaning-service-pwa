import React, { useState, useMemo } from 'react';
import { addDays, format, isSameDay, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { cn } from '../../lib/utils';

/**
 * DatePickerHorizontal - 7-day horizontal picker with expandable full calendar
 * 
 * Features:
 * - Shows next 7 days as horizontal pills
 * - "More dates" button expands full calendar
 * - Today highlighted with border
 * - Selected date with emerald fill
 */

const DatePickerHorizontal = ({
    selectedDate,
    onDateSelect,
    minDate = new Date(),
    showCalendarToggle = true,
    className,
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Generate next 7 days
    const next7Days = useMemo(() => {
        const today = startOfDay(new Date());
        return Array.from({ length: 7 }, (_, i) => addDays(today, i));
    }, []);

    const handleDateClick = (date) => {
        onDateSelect(date);
    };

    const toggleCalendar = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* Horizontal 7-day picker */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {next7Days.map((date) => {
                    const isSelected = selectedDate && isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, new Date());
                    const dayName = format(date, 'EEE').toUpperCase();
                    const dayNumber = format(date, 'd');

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => handleDateClick(date)}
                            className={cn(
                                "flex-shrink-0 w-[72px] h-16 rounded-xl flex flex-col items-center justify-center transition-all snap-start",
                                isSelected
                                    ? "bg-emerald-600 text-white border-2 border-emerald-600"
                                    : isToday
                                        ? "bg-gray-50 border-2 border-emerald-500 text-gray-900"
                                        : "bg-gray-50 border border-gray-200 text-gray-700 hover:border-emerald-200"
                            )}
                        >
                            <span className={cn(
                                "text-[11px] font-medium",
                                isSelected ? "text-emerald-100" : "text-gray-500"
                            )}>
                                {dayName}
                            </span>
                            <span className="text-lg font-bold mt-0.5">{dayNumber}</span>
                        </button>
                    );
                })}
            </div>

            {/* Calendar toggle button */}
            {showCalendarToggle && (
                <button
                    onClick={toggleCalendar}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <CalendarIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {isCalendarOpen ? 'Hide calendar' : 'More dates'}
                    </span>
                    {isCalendarOpen ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </button>
            )}

            {/* Expandable full calendar */}
            {isCalendarOpen && (
                <div className="animate-slide-down">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={onDateSelect}
                            disabled={{ before: minDate }}
                            className="rounded-md"
                            classNames={{
                                day_selected: "bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white focus:bg-emerald-600 focus:text-white",
                                day_today: "border-2 border-emerald-500 rounded-full",
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export { DatePickerHorizontal };
