import React from 'react';
import { CreditCard, Banknote, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * PaymentModeToggle - Pill-style payment mode selector
 * 
 * Follows the same design pattern as BookingTypeToggle:
 * - Pill container with gray background
 * - Equal-width options side by side
 * - Active state: white background, shadow, ring accent
 * - Conditional reveal for payment details
 */

const PaymentModeToggle = ({
    paymentMode = 'now',
    onPaymentModeChange,
    discount = 5,
    showDetails = true,
    variant = 'default', // 'default' | 'compact'
    className,
}) => {
    const isCompact = variant === 'compact';

    return (
        <div className={cn("space-y-3", className)}>
            {/* Payment Mode Toggle */}
            <div className={cn(
                "flex gap-1.5 bg-gray-100/80 rounded-2xl backdrop-blur-sm",
                isCompact ? "p-1 rounded-xl" : "p-1.5"
            )}>
                <button
                    onClick={() => onPaymentModeChange('now')}
                    className={cn(
                        "flex-1 flex items-center justify-center rounded-xl transition-all duration-200 ease-out active:scale-[0.98]",
                        isCompact ? "flex-row gap-2 py-2 px-3 rounded-lg" : "flex-col gap-1.5 py-3.5 px-4",
                        paymentMode === 'now'
                            ? "bg-white text-emerald-600 shadow-sm shadow-emerald-500/10 ring-1 ring-emerald-100"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    )}
                >
                    <div className={cn(
                        "rounded-lg transition-colors duration-200 flex items-center justify-center",
                        isCompact ? "p-0.5 bg-transparent" : "p-1",
                        !isCompact && paymentMode === 'now' && "bg-emerald-50"
                    )}>
                        <CreditCard className={cn(
                            "transition-colors duration-200",
                            isCompact ? "w-3.5 h-3.5" : "w-4 h-4",
                            paymentMode === 'now' ? "text-emerald-500" : "text-gray-400"
                        )} />
                    </div>
                    <div className={cn("flex flex-col", isCompact && "text-left")}>
                        <span className={cn(
                            "font-semibold transition-colors duration-200",
                            isCompact ? "text-xs" : "text-sm",
                            paymentMode === 'now' ? "text-gray-900" : "text-gray-600"
                        )}>
                            Pay Now
                        </span>
                        {!isCompact && (
                            <span className={cn(
                                "text-xs transition-colors duration-200",
                                paymentMode === 'now' ? "text-emerald-600/80" : "text-gray-400"
                            )}>
                                {discount}% discount
                            </span>
                        )}
                    </div>
                </button>

                <button
                    onClick={() => onPaymentModeChange('later')}
                    className={cn(
                        "flex-1 flex items-center justify-center rounded-xl transition-all duration-200 ease-out active:scale-[0.98]",
                        isCompact ? "flex-row gap-2 py-2 px-3 rounded-lg" : "flex-col gap-1.5 py-3.5 px-4",
                        paymentMode === 'later'
                            ? "bg-white text-emerald-600 shadow-sm shadow-emerald-500/10 ring-1 ring-emerald-100"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    )}
                >
                    <div className={cn(
                        "rounded-lg transition-colors duration-200 flex items-center justify-center",
                        isCompact ? "p-0.5 bg-transparent" : "p-1",
                        !isCompact && paymentMode === 'later' ? "bg-emerald-50" : "bg-transparent"
                    )}>
                        <Banknote className={cn(
                            "transition-colors duration-200",
                            isCompact ? "w-3.5 h-3.5" : "w-4 h-4",
                            paymentMode === 'later' ? "text-emerald-500" : "text-gray-400"
                        )} />
                    </div>
                    <div className={cn("flex flex-col", isCompact && "text-left")}>
                        <span className={cn(
                            "font-semibold transition-colors duration-200",
                            isCompact ? "text-xs" : "text-sm",
                            paymentMode === 'later' ? "text-gray-900" : "text-gray-600"
                        )}>
                            Pay Later
                        </span>
                        {!isCompact && (
                            <span className={cn(
                                "text-xs transition-colors duration-200",
                                paymentMode === 'later' ? "text-emerald-600/80" : "text-gray-400"
                            )}>
                                Cash payment
                            </span>
                        )}
                    </div>
                </button>
            </div>

            {/* Conditional details reveal - Only show if not compact and showDetails is true */}
            {!isCompact && showDetails && (
                <div className={cn(
                    "p-4 rounded-xl border transition-all duration-300 ease-out",
                    paymentMode === 'now'
                        ? "bg-emerald-50/50 border-emerald-100"
                        : "bg-amber-50/50 border-amber-100"
                )}>
                    {paymentMode === 'now' ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-gray-700">{discount}% discount applied</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-gray-700">Secure payment via Stripe</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-gray-700">Instant confirmation</span>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Banknote className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-gray-700">Pay cash after service completion</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Please have exact change ready. Our cleaners do not carry change.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export { PaymentModeToggle };
