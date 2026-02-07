import React from 'react';
import { Sparkles, Bath, Package } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * ServiceTypeToggle - Pill-style service type selector
 * 
 * Follows the same design pattern as BookingTypeToggle:
 * - Pill container with gray background
 * - Equal-width options side by side
 * - Active state: white background, shadow, ring accent
 * - Icon + Label + optional subtitle
 * - Conditional reveal for service details
 */

const SERVICE_TYPES = [
    {
        id: 'standard',
        label: 'Standard',
        icon: Sparkles,
        subtitle: 'Regular clean',
        description: 'Surface cleaning, dusting, mopping, and basic bathroom/kitchen cleaning.',
    },
    {
        id: 'deep',
        label: 'Deep',
        icon: Bath,
        subtitle: 'Thorough clean',
        description: 'Includes deep scrubbing, appliance cleaning, sanitization, and hard-to-reach areas.',
    },
    {
        id: 'move',
        label: 'Move In/Out',
        icon: Package,
        subtitle: 'Full service',
        description: 'Comprehensive cleaning for move-in or move-out situations. Empty property recommended.',
    },
];

const ServiceTypeToggle = ({
    selectedType = 'standard',
    onTypeChange,
    showDescription = true,
    className,
}) => {
    const selectedService = SERVICE_TYPES.find(s => s.id === selectedType);

    return (
        <div className={cn("space-y-3", className)}>
            {/* Pill container */}
            <div className="flex gap-1.5 p-1.5 bg-gray-100/80 rounded-2xl backdrop-blur-sm">
                {SERVICE_TYPES.map((service) => {
                    const Icon = service.icon;
                    const isActive = selectedType === service.id;

                    return (
                        <button
                            key={service.id}
                            onClick={() => onTypeChange(service.id)}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl",
                                "transition-all duration-200 ease-out",
                                "active:scale-[0.97]",
                                isActive
                                    ? "bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-100"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                            )}
                        >
                            <div className={cn(
                                "p-1.5 rounded-lg transition-colors duration-200",
                                isActive ? "bg-emerald-50" : "bg-transparent"
                            )}>
                                <Icon className={cn(
                                    "w-5 h-5 transition-colors duration-200",
                                    isActive ? "text-emerald-500" : "text-gray-400"
                                )} />
                            </div>
                            <span className={cn(
                                "font-semibold text-sm transition-colors duration-200",
                                isActive ? "text-gray-900" : "text-gray-600"
                            )}>
                                {service.label}
                            </span>
                            <span className={cn(
                                "text-xs transition-colors duration-200",
                                isActive ? "text-emerald-600/80" : "text-gray-400"
                            )}>
                                {service.subtitle}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Conditional description reveal */}
            {showDescription && selectedService && (
                <div className={cn(
                    "p-4 rounded-xl bg-emerald-50/50 border border-emerald-100",
                    "transition-all duration-300 ease-out"
                )}>
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-emerald-100">
                            <selectedService.icon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-800">
                                {selectedService.label} Cleaning
                            </p>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {selectedService.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { ServiceTypeToggle, SERVICE_TYPES };
