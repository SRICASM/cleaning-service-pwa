import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Truck, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * ServiceTypeCards - Horizontal scrollable cards for service selection
 * 
 * Used on the home page to select service type before navigating to booking.
 * Features:
 * - Horizontal scroll with snap
 * - Vibrant card backgrounds matching service type
 * - Touch-friendly (44px+ targets)
 * - Navigates to schedule-booking with service param
 */

const serviceTypes = [
    {
        id: 'standard_cleaning',
        title: 'Standard Cleaning',
        description: 'Regular home cleaning',
        icon: Sparkles,
        startingPrice: 150,
        bgColor: 'bg-emerald-50',
        accentColor: 'text-emerald-600',
        borderColor: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
    },
    {
        id: 'deep_cleaning',
        title: 'Deep Cleaning',
        description: 'Thorough deep clean',
        icon: Star,
        startingPrice: 250,
        bgColor: 'bg-amber-50',
        accentColor: 'text-amber-600',
        borderColor: 'border-amber-200',
        iconBg: 'bg-amber-100',
    },
    {
        id: 'move_in_out',
        title: 'Move In/Out',
        description: 'Pre/post move cleaning',
        icon: Truck,
        startingPrice: 400,
        bgColor: 'bg-indigo-50',
        accentColor: 'text-indigo-600',
        borderColor: 'border-indigo-200',
        iconBg: 'bg-indigo-100',
    },
];

const ServiceTypeCards = ({ className }) => {
    const navigate = useNavigate();

    const handleServiceSelect = (serviceId) => {
        navigate('/schedule-booking-new', { state: { serviceId } });
    };

    return (
        <div className={cn("w-full", className)}>
            {/* Section Header */}
            <div className="px-4 mb-4">
                <h2 className="text-xl font-bold text-gray-900 font-heading">
                    What do you need?
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Choose a service to get started
                </p>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
                <div className="flex gap-4 px-4 pb-4">
                    {serviceTypes.map((service) => {
                        const Icon = service.icon;
                        return (
                            <button
                                key={service.id}
                                onClick={() => handleServiceSelect(service.id)}
                                className={cn(
                                    "flex-shrink-0 w-[280px] h-[160px] rounded-2xl p-5 text-left",
                                    "border transition-all duration-200 snap-start",
                                    "shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
                                    "hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:scale-[1.02]",
                                    "active:scale-[0.98]",
                                    service.bgColor,
                                    service.borderColor
                                )}
                            >
                                {/* Icon */}
                                <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center mb-3",
                                    service.iconBg
                                )}>
                                    <Icon className={cn("w-6 h-6", service.accentColor)} />
                                </div>

                                {/* Title */}
                                <h3 className="text-base font-bold text-gray-900 mb-1">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-2">
                                    {service.description}
                                </p>

                                {/* Price and Arrow */}
                                <div className="flex items-center justify-between mt-auto">
                                    <span className={cn("text-sm font-semibold", service.accentColor)}>
                                        From AED {service.startingPrice}
                                    </span>
                                    <ChevronRight className={cn("w-5 h-5", service.accentColor)} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export { ServiceTypeCards, serviceTypes };
