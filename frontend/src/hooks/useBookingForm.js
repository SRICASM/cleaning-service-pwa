import { useState, useCallback, useMemo } from 'react';
import { eachDayOfInterval } from 'date-fns';

/**
 * useBookingForm - Manages all booking state across sections
 * 
 * Features:
 * - Centralized booking state
 * - Validation for each section
 * - Price calculation
 * - Summary generation
 */

// Pricing configuration
const HOUSE_TYPES = [
    { id: 'studio', label: 'Studio', duration: 120, price: 150 },
    { id: '1bhk', label: '1 BHK', duration: 180, price: 225 },
    { id: '2bhk', label: '2 BHK', duration: 240, price: 300 },
    { id: '3bhk', label: '3 BHK', duration: 300, price: 375 },
    { id: '4bhk', label: '4 BHK', duration: 360, price: 450 },
    { id: '5bhk', label: '5 BHK', duration: 420, price: 525 },
    { id: 'villa', label: 'Villa', duration: 480, price: 600 },
];

const HOURLY_OPTIONS = [
    { value: 120, label: '2 Hours', price: 150 },
    { value: 180, label: '3 Hours', price: 225 },
    { value: 240, label: '4 Hours', price: 300 },
    { value: 300, label: '5 Hours', price: 375 },
    { value: 360, label: '6 Hours', price: 450 },
    { value: 420, label: '7 Hours', price: 525 },
    { value: 480, label: '8 Hours', price: 600 },
];

const useBookingForm = (initialValues = {}) => {
    // Booking type: instant or schedule
    const [bookingType, setBookingType] = useState(initialValues.bookingType || 'schedule');

    // Pricing mode: size (by house size) or hourly
    const [pricingMode, setPricingMode] = useState(initialValues.pricingMode || 'size');

    // Selected house type or duration
    const [selectedSize, setSelectedSize] = useState(initialValues.selectedSize || null);
    const [selectedDuration, setSelectedDuration] = useState(initialValues.selectedDuration || 120);

    // Date selection
    const [selectedDate, setSelectedDate] = useState(initialValues.selectedDate || null);
    const [selectedRange, setSelectedRange] = useState(initialValues.selectedRange || null);
    const [selectedDays, setSelectedDays] = useState(initialValues.selectedDays || [1, 2, 3, 4, 5]);
    const [isRecurring, setIsRecurring] = useState(initialValues.isRecurring || false);

    // Time selection
    const [selectedTime, setSelectedTime] = useState(initialValues.selectedTime || null);
    const [selectedPeriod, setSelectedPeriod] = useState(initialValues.selectedPeriod || 'morning');

    // Service and address
    const [serviceId, setServiceId] = useState(initialValues.serviceId || null);
    const [addressId, setAddressId] = useState(initialValues.addressId || null);

    // Add-ons
    const [selectedAddOns, setSelectedAddOns] = useState(initialValues.selectedAddOns || []);
    const [addOnPrices, setAddOnPrices] = useState({});

    // Payment
    const [paymentMode, setPaymentMode] = useState(initialValues.paymentMode || 'now');

    // Calculate final dates
    const finalDates = useMemo(() => {
        if (bookingType === 'instant') {
            return [new Date()];
        }

        if (!isRecurring && selectedDate) {
            return [selectedDate];
        }

        if (isRecurring && selectedRange?.start && selectedRange?.end && selectedDays.length > 0) {
            const allDates = eachDayOfInterval({ start: selectedRange.start, end: selectedRange.end });
            return allDates.filter(date => selectedDays.includes(date.getDay()));
        }

        return [];
    }, [bookingType, selectedDate, selectedRange, selectedDays, isRecurring]);

    // Calculate base price
    const basePrice = useMemo(() => {
        if (pricingMode === 'size' && selectedSize) {
            const houseType = HOUSE_TYPES.find(h => h.id === selectedSize);
            return houseType?.price || 150;
        }
        const hourlyOption = HOURLY_OPTIONS.find(h => h.value === selectedDuration);
        return hourlyOption?.price || 150;
    }, [pricingMode, selectedSize, selectedDuration]);

    // Calculate add-ons total
    const addOnsTotal = useMemo(() => {
        return selectedAddOns.reduce((sum, id) => sum + (addOnPrices[id] || 0), 0);
    }, [selectedAddOns, addOnPrices]);

    // Per visit and total price
    const perVisitPrice = basePrice + addOnsTotal;
    const totalPrice = perVisitPrice * finalDates.length;

    // Validation
    const isSizeValid = pricingMode === 'size' ? !!selectedSize : true;
    const isDurationValid = pricingMode === 'hourly' ? selectedDuration >= 120 : true;
    const isDateValid = bookingType === 'instant' || finalDates.length > 0;
    const isTimeValid = bookingType === 'instant' || !!selectedTime;
    const isServiceValid = !!serviceId;
    const isAddressValid = !!addressId;

    const isComplete = isSizeValid && isDurationValid && isDateValid && isTimeValid && isServiceValid && isAddressValid;

    // Generate summary text
    const getSummary = useCallback((section) => {
        switch (section) {
            case 'size':
                if (pricingMode === 'size' && selectedSize) {
                    const houseType = HOUSE_TYPES.find(h => h.id === selectedSize);
                    return `${houseType?.label} • AED ${houseType?.price}`;
                }
                if (pricingMode === 'hourly') {
                    const hourly = HOURLY_OPTIONS.find(h => h.value === selectedDuration);
                    return `${hourly?.label} • AED ${hourly?.price}`;
                }
                return '';
            case 'datetime':
                if (bookingType === 'instant') return 'Instant booking (ASAP)';
                if (finalDates.length === 1 && selectedTime) {
                    return `${finalDates[0].toLocaleDateString()} at ${selectedTime}`;
                }
                if (finalDates.length > 1) {
                    return `${finalDates.length} visits scheduled`;
                }
                return '';
            default:
                return '';
        }
    }, [pricingMode, selectedSize, selectedDuration, bookingType, finalDates, selectedTime]);

    const reset = useCallback(() => {
        setBookingType('schedule');
        setPricingMode('size');
        setSelectedSize(null);
        setSelectedDuration(120);
        setSelectedDate(null);
        setSelectedRange(null);
        setSelectedDays([1, 2, 3, 4, 5]);
        setIsRecurring(false);
        setSelectedTime(null);
        setSelectedPeriod('morning');
        setSelectedAddOns([]);
        setPaymentMode('now');
    }, []);

    return {
        // State
        bookingType, setBookingType,
        pricingMode, setPricingMode,
        selectedSize, setSelectedSize,
        selectedDuration, setSelectedDuration,
        selectedDate, setSelectedDate,
        selectedRange, setSelectedRange,
        selectedDays, setSelectedDays,
        isRecurring, setIsRecurring,
        selectedTime, setSelectedTime,
        selectedPeriod, setSelectedPeriod,
        serviceId, setServiceId,
        addressId, setAddressId,
        selectedAddOns, setSelectedAddOns,
        addOnPrices, setAddOnPrices,
        paymentMode, setPaymentMode,

        // Computed
        finalDates,
        basePrice,
        addOnsTotal,
        perVisitPrice,
        totalPrice,

        // Validation
        isSizeValid,
        isDurationValid,
        isDateValid,
        isTimeValid,
        isServiceValid,
        isAddressValid,
        isComplete,

        // Helpers
        getSummary,
        reset,

        // Constants
        HOUSE_TYPES,
        HOURLY_OPTIONS,
    };
};

export { useBookingForm, HOUSE_TYPES, HOURLY_OPTIONS };
