import React from 'react';
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * CollapsibleSection - Native app feel accordion section
 * 
 * Features:
 * - Three states: incomplete, expanded, completed
 * - Checkmark animation when completed
 * - Summary text when collapsed after completion
 * - Smooth expand/collapse animation
 */
const CollapsibleSection = ({
    title,
    icon: Icon,
    isOpen,
    onOpenChange,
    isCompleted = false,
    completedSummary = '',
    children,
    className,
    sectionNumber,
}) => {
    return (
        <CollapsiblePrimitive.Root
            open={isOpen}
            onOpenChange={onOpenChange}
            className={cn(
                "bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300",
                isOpen && "border-l-[3px] border-l-emerald-600",
                !isOpen && isCompleted && "border-emerald-200",
                !isOpen && !isCompleted && "border-stone-100",
                className
            )}
        >
            <CollapsiblePrimitive.Trigger className="w-full">
                <div className="flex items-center justify-between p-4 cursor-pointer min-h-[56px] touch-target">
                    <div className="flex items-center gap-3">
                        {/* Icon container */}
                        <div
                            className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                                isCompleted && "bg-emerald-600",
                                isOpen && !isCompleted && "bg-emerald-100",
                                !isOpen && !isCompleted && "bg-gray-100"
                            )}
                        >
                            {isCompleted ? (
                                <Check className="w-4 h-4 text-white animate-checkmark-bounce" />
                            ) : (
                                Icon && <Icon className={cn(
                                    "w-4 h-4",
                                    isOpen ? "text-emerald-600" : "text-gray-500"
                                )} />
                            )}
                        </div>

                        {/* Title and summary */}
                        <div className="text-left">
                            <h3
                                className={cn(
                                    "text-sm font-semibold transition-colors",
                                    isCompleted && "text-emerald-600",
                                    !isCompleted && "text-gray-900"
                                )}
                            >
                                {sectionNumber && <span className="text-gray-400 mr-1">{sectionNumber}.</span>}
                                {title}
                            </h3>
                            {!isOpen && isCompleted && completedSummary && (
                                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[200px]">
                                    {completedSummary}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Chevron */}
                    <ChevronDown
                        className={cn(
                            "w-5 h-5 text-gray-400 transition-transform duration-300",
                            isOpen && "rotate-180"
                        )}
                    />
                </div>
            </CollapsiblePrimitive.Trigger>

            <CollapsiblePrimitive.Content
                className={cn(
                    "overflow-hidden",
                    "data-[state=open]:animate-slide-down",
                    "data-[state=closed]:animate-accordion-up"
                )}
            >
                <div className="px-4 pb-4">
                    {children}
                </div>
            </CollapsiblePrimitive.Content>
        </CollapsiblePrimitive.Root>
    );
};

export { CollapsibleSection };
