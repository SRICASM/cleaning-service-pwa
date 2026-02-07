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
    className,
}) => {
    return (
        <div className={cn("space-y-3", className)}>
            {/* Payment Mode Toggle - Same style as BookingTypeToggle */}
            <div className="flex gap-1.5 p-1.5 bg-gray-100/80 rounded-2xl backdrop-blur-sm">
                <button
                    onClick={() => onPaymentModeChange('now')}
                    className={cn(
                        "flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl",
                        "transition-all duration-200 ease-out",
                        "active:scale-[0.98]",
                        paymentMode === 'now'
                            ? "bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-100"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    )}
                >
                    <div className={cn(
                        "p-1 rounded-lg transition-colors duration-200",
                        paymentMode === 'now' ? "bg-emerald-50" : "bg-transparent"
                    )}>
                        <CreditCard className={cn(
                            "w-4 h-4 transition-colors duration-200",
                            paymentMode === 'now' ? "text-emerald-500" : "text-gray-400"
                        )} />
                    </div>
                    <span className={cn(
                        "font-semibold text-sm transition-colors duration-200",
                        paymentMode === 'now' ? "text-gray-900" : "text-gray-600"
                    )}>
                        Pay Now
                    </span>
                    <span className={cn(
                        "text-xs transition-colors duration-200",
                        paymentMode === 'now' ? "text-emerald-600/80" : "text-gray-400"
                    )}>
                        {discount}% discount
                    </span>
                </button>

                <button
                    onClick={() => onPaymentModeChange('later')}
                    className={cn(
                        "flex-1 flex flex-col items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl",
                        "transition-all duration-200 ease-out",
                        "active:scale-[0.98]",
                        paymentMode === 'later'
                            ? "bg-white text-emerald-600 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-100"
                            : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                    )}
                >
                    <div className={cn(
                        "p-1 rounded-lg transition-colors duration-200",
                        paymentMode === 'later' ? "bg-emerald-50" : "bg-transparent"
                    )}>
                        <Banknote className={cn(
                            "w-4 h-4 transition-colors duration-200",
                            paymentMode === 'later' ? "text-emerald-500" : "text-gray-400"
                        )} />
                    </div>
                    <span className={cn(
                        "font-semibold text-sm transition-colors duration-200",
                        paymentMode === 'later' ? "text-gray-900" : "text-gray-600"
                    )}>
                        Pay Later
                    </span>
                    <span className={cn(
                        "text-xs transition-colors duration-200",
                        paymentMode === 'later' ? "text-emerald-600/80" : "text-gray-400"
                    )}>
                        Cash payment
                    </span>
                </button>
            </div>

            {/* Conditional details reveal */}
            {showDetails && (
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
