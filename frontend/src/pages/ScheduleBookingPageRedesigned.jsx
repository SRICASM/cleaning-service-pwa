import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { CollapsibleSection } from '../components/ui/CollapsibleSection';
import { BookingTypeToggle } from '../components/booking/BookingTypeToggle';
import { ServiceTypeToggle } from '../components/booking/ServiceTypeToggle';
import { SizeDurationToggle } from '../components/booking/SizeDurationToggle';
import { PaymentModeToggle } from '../components/booking/PaymentModeToggle';
// HouseSizeCards is now inline with multiplier support
import { DayPickerHorizontal } from '../components/booking/DayPickerHorizontal';
import { FullMonthCalendar } from '../components/booking/FullMonthCalendar';
import { TimeSlotPicker } from '../components/booking/TimeSlotPickerNew';
import { StickyBookingCTA, useStickyScroll } from '../components/booking/StickyBookingCTA';
import { useCollapsibleSections } from '../hooks/useCollapsibleSections';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import {
    ChevronLeft,
    ChevronRight,
    CalendarClock,
    Home,
    Clock,
    Calendar,
    Zap,
    MapPin,
    Sparkles,
    Package,
    CheckCircle,
    Check,
} from 'lucide-react';
import { format, isSameDay, startOfMonth, endOfMonth, addDays, addMonths, getDay } from 'date-fns';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Section IDs for collapsible flow
const SECTIONS = ['size', 'datetime'];

// House type configuration
const HOUSE_TYPES = [
    { id: 'studio', label: 'Studio', duration: '2 Hours', price: 150 },
    { id: '1bhk', label: '1 BHK', duration: '3 Hours', price: 225 },
    { id: '2bhk', label: '2 BHK', duration: '4 Hours', price: 300 },
    { id: '3bhk', label: '3 BHK', duration: '5 Hours', price: 375 },
    { id: '4bhk', label: '4 BHK', duration: '6 Hours', price: 450 },
    { id: '5bhk', label: '5 BHK', duration: '7 Hours', price: 525 },
    { id: 'villa', label: 'Villa', duration: '8 Hours', price: 600 },
];

// Hourly rate configuration
const BASE_HOURLY_RATE = 75; // AED per hour for standard cleaning

const HOUR_OPTIONS = [
    { id: '2hrs', hours: 2, label: '2 Hours' },
    { id: '3hrs', hours: 3, label: '3 Hours' },
    { id: '4hrs', hours: 4, label: '4 Hours' },
    { id: '5hrs', hours: 5, label: '5 Hours' },
    { id: '6hrs', hours: 6, label: '6 Hours' },
    { id: '7hrs', hours: 7, label: '7 Hours' },
    { id: '8hrs', hours: 8, label: '8 Hours' },
];

// Service multipliers: Standard = 1x, Deep = 2x, Move In/Out = 2.5x
const SERVICE_MULTIPLIERS = {
    'Standard Cleaning': 1,
    'Deep Cleaning': 2,
    'Move In/Out': 2.5,
};

const getServiceMultiplier = (serviceName) => {
    if (!serviceName) return 1;
    const matchedKey = Object.keys(SERVICE_MULTIPLIERS).find(key =>
        serviceName.toLowerCase().includes(key.toLowerCase())
    );
    return matchedKey ? SERVICE_MULTIPLIERS[matchedKey] : 1;
};

// Service selector component
const ServiceSelector = ({ services, selectedServiceId, onSelect }) => {
    const serviceConfig = {
        'Standard Cleaning': { icon: Sparkles, color: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        'Deep Cleaning': { icon: Sparkles, color: 'bg-amber-50', iconColor: 'text-amber-600' },
        'Move In/Out': { icon: Package, color: 'bg-indigo-50', iconColor: 'text-indigo-600' },
        'default': { icon: Home, color: 'bg-gray-50', iconColor: 'text-gray-600' }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {services.map((service) => {
                const configKey = Object.keys(serviceConfig).find(key => service.name.includes(key)) || 'default';
                const config = serviceConfig[configKey];
                const Icon = config.icon;
                const isSelected = selectedServiceId === service.id;

                return (
                    <button
                        key={service.id}
                        onClick={() => onSelect(service.id)}
                        className={`
              relative flex items-center gap-3 p-3 rounded-xl border transition-all text-left
              ${isSelected
                                ? 'bg-emerald-50/50 border-emerald-500 ring-1 ring-emerald-500'
                                : 'bg-white border-gray-200 hover:border-emerald-200'
                            }
            `}
                    >
                        <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${config.iconColor}`} />
                        </div>
                        <p className={`text-sm font-semibold ${isSelected ? 'text-emerald-900' : 'text-gray-700'}`}>
                            {service.name}
                        </p>
                        {isSelected && (
                            <CheckCircle className="w-4 h-4 text-emerald-500 absolute top-2 right-2" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

// Pricing mode toggle
const PricingModeToggle = ({ mode, onModeChange }) => (
    <div className="grid grid-cols-2 gap-3 mb-4">
        <button
            onClick={() => onModeChange('size')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${mode === 'size'
                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-gray-200 bg-white hover:border-emerald-200'
                }`}
        >
            <div className={`p-2 rounded-lg ${mode === 'size' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                <Home className={`w-5 h-5 ${mode === 'size' ? 'text-emerald-600' : 'text-gray-500'}`} />
            </div>
            <span className={`font-semibold text-sm ${mode === 'size' ? 'text-emerald-900' : 'text-gray-600'}`}>
                By House Size
            </span>
        </button>
        <button
            onClick={() => onModeChange('hourly')}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${mode === 'hourly'
                ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                : 'border-gray-200 bg-white hover:border-emerald-200'
                }`}
        >
            <div className={`p-2 rounded-lg ${mode === 'hourly' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                <Clock className={`w-5 h-5 ${mode === 'hourly' ? 'text-emerald-600' : 'text-gray-500'}`} />
            </div>
            <span className={`font-semibold text-sm ${mode === 'hourly' ? 'text-emerald-900' : 'text-gray-600'}`}>
                By Hourly Rate
            </span>
        </button>
    </div>
);

// Hourly rate cards component
const HourlyRateCards = ({ selectedHours, onSelect, serviceName, scrollRef }) => {
    const multiplier = getServiceMultiplier(serviceName);
    const hourlyRate = BASE_HOURLY_RATE * multiplier;

    const scroll = (direction) => {
        if (scrollRef?.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const getMultiplierLabel = () => {
        if (multiplier === 1) return null;
        return `${multiplier}x rate`;
    };

    return (
        <div className="relative group">
            {/* Rate info banner */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Hourly rate:</span>
                    <span className="text-sm font-semibold text-emerald-600">
                        AED {hourlyRate}/hr
                    </span>
                </div>
                {multiplier > 1 && (
                    <span className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                        {getMultiplierLabel()}
                    </span>
                )}
            </div>

            {/* Left Scroll Button */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 mt-3 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-all opacity-0 group-hover:opacity-100 -ml-3"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto pb-2 gap-3 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            >
                {HOUR_OPTIONS.map((option) => {
                    const isSelected = selectedHours === option.id;
                    const totalPrice = option.hours * hourlyRate;

                    const basePrice = option.hours * BASE_HOURLY_RATE;
                    const savings = multiplier > 1 ? totalPrice - basePrice : 0;

                    return (
                        <button
                            key={option.id}
                            onClick={() => onSelect(option.id, option.hours, totalPrice)}
                            className={`relative flex-shrink-0 w-[110px] snap-start p-4 rounded-2xl transition-all duration-300 ${isSelected
                                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 shadow-lg shadow-emerald-100 -translate-y-1'
                                : 'bg-white border-2 border-gray-200 hover:border-emerald-200 hover:-translate-y-0.5 hover:shadow-md'
                                }`}
                        >
                            {/* Checkmark Badge */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}

                            {/* Icon with hover effect */}
                            <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center transition-transform group-hover:scale-110 ${isSelected ? 'bg-emerald-100' : 'bg-gray-50'
                                }`}>
                                <Clock className={`w-5 h-5 ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                            </div>

                            {/* Label */}
                            <p className={`font-bold text-sm mb-1 ${isSelected ? 'text-emerald-900' : 'text-gray-700'}`}>
                                {option.label}
                            </p>

                            {/* Hourly breakdown */}
                            <div className="flex items-center justify-center gap-1 mb-2">
                                <p className="text-xs text-gray-500">
                                    {option.hours} × {hourlyRate}
                                </p>
                            </div>

                            {/* Price with hierarchy */}
                            <div className="space-y-0.5">
                                {multiplier > 1 && (
                                    <p className="text-xs text-gray-400 line-through">AED {basePrice}</p>
                                )}
                                <p className={`text-xl font-black ${isSelected ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    <span className="text-xs align-super font-semibold">AED</span> {totalPrice}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Right Scroll Button */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 mt-3 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-all opacity-0 group-hover:opacity-100 -mr-3"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

// House size cards with service multiplier
const HouseSizeCards = ({ selectedSize, onSelect, serviceName, scrollRef }) => {
    const multiplier = getServiceMultiplier(serviceName);

    const scroll = (direction) => {
        if (scrollRef?.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const getMultiplierLabel = () => {
        if (multiplier === 1) return null;
        return `${multiplier}x rate`;
    };

    return (
        <div className="relative group">
            {/* Rate info banner */}
            {multiplier > 1 && (
                <div className="flex items-center justify-end mb-3 px-1">
                    <span className="text-xs font-medium px-2 py-1 bg-amber-50 text-amber-700 rounded-full">
                        {getMultiplierLabel()}
                    </span>
                </div>
            )}

            {/* Left Scroll Button */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-all opacity-0 group-hover:opacity-100 -ml-3"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto pb-2 gap-3 snap-x snap-mandatory scrollbar-hide scroll-smooth"
            >
                {HOUSE_TYPES.map((type) => {
                    const isSelected = selectedSize === type.id;
                    const basePrice = type.price;
                    const totalPrice = Math.round(basePrice * multiplier);

                    return (
                        <button
                            key={type.id}
                            onClick={() => onSelect(type.id, totalPrice)}
                            className={`relative flex-shrink-0 w-[110px] snap-start p-4 rounded-2xl transition-all duration-300 ${isSelected
                                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-400 shadow-lg shadow-emerald-100 -translate-y-1'
                                : 'bg-white border-2 border-gray-200 hover:border-emerald-200 hover:-translate-y-0.5 hover:shadow-md'
                                }`}
                        >
                            {/* Checkmark Badge */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}

                            {/* Icon with hover effect */}
                            <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center transition-transform group-hover:scale-110 ${isSelected ? 'bg-emerald-100' : 'bg-gray-50'
                                }`}>
                                <Home className={`w-5 h-5 ${isSelected ? 'text-emerald-600' : 'text-gray-400'}`} />
                            </div>

                            {/* Label */}
                            <p className={`font-bold text-sm mb-1 ${isSelected ? 'text-emerald-900' : 'text-gray-700'}`}>
                                {type.label}
                            </p>

                            {/* Duration with icon */}
                            <div className="flex items-center justify-center gap-1 mb-2">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <p className="text-xs text-gray-500">{type.duration}</p>
                            </div>

                            {/* Price with hierarchy */}
                            <div className="space-y-0.5">
                                {multiplier > 1 && (
                                    <p className="text-xs text-gray-400 line-through">AED {basePrice}</p>
                                )}
                                <p className={`text-xl font-black ${isSelected ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    <span className="text-xs align-super font-semibold">AED</span> {totalPrice}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Right Scroll Button */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg text-gray-600 hover:text-emerald-600 hover:border-emerald-200 transition-all opacity-0 group-hover:opacity-100 -mr-3"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

const ScheduleBookingPageRedesigned = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, getAuthHeaders } = useAuth();

    // Collapsible sections
    const sections = useCollapsibleSections(SECTIONS);

    // Sticky CTA visibility
    const { showSticky } = useStickyScroll(0.5);

    // Booking state
    const [bookingType, setBookingType] = useState('instant');
    const [pricingMode, setPricingMode] = useState('size');
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizePrice, setSizePrice] = useState(0);
    const [selectedHours, setSelectedHours] = useState(null);
    const [hourlyPrice, setHourlyPrice] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]); // Multi-date selection
    const [selectedWeekdays, setSelectedWeekdays] = useState([]); // Recurring weekdays
    const [currentMonth, setCurrentMonth] = useState(new Date()); // Calendar month
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('morning');
    const [paymentMode, setPaymentMode] = useState('now');
    const [loading, setLoading] = useState(false);

    // Services and address
    const [services, setServices] = useState([]);
    const [serviceId, setServiceId] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Refs
    const hourlyScrollRef = useRef(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!user) {
            toast.info('Please login to book a cleaning');
            navigate('/login', { state: { from: '/schedule-booking-new' } });
        }
    }, [user, navigate]);

    // Set state from navigation (pricing mode & booking type)
    useEffect(() => {
        if (location.state?.bookingMethod) {
            setPricingMode(location.state.bookingMethod);
        }

        if (location.state?.bookingType === 'instant') {
            setBookingType('instant');
            setSelectedTime('ASAP');
            setSelectedDate(new Date());
        }
    }, [location.state]);

    // Fetch services and preselect from navigation state
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`${API}/services`);
                if (response.data) {
                    const allowedServices = ['Standard Cleaning', 'Deep Cleaning', 'Move In/Out'];
                    const filtered = response.data.filter(s =>
                        allowedServices.some(a => s.name.includes(a))
                    );
                    setServices(filtered);

                    // Preselect service from navigation state if provided
                    const stateServiceId = location.state?.serviceId;
                    if (stateServiceId && filtered.some(s => s.id === stateServiceId)) {
                        const selectedService = filtered.find(s => s.id === stateServiceId);
                        setServiceId(stateServiceId);
                        // Show toast for pre-selected service
                        setTimeout(() => {
                            toast.success(`${selectedService.name} selected`, {
                                description: 'You can change this anytime',
                                duration: 3000,
                            });
                        }, 500);
                    } else if (filtered.length > 0) {
                        setServiceId(filtered[0].id);
                    }
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, [location.state]);

    // Fetch default address
    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;
            try {
                const response = await axios.get(`${API}/users/me/addresses`, {
                    headers: getAuthHeaders()
                });
                if (response.data?.length > 0) {
                    const defaultAddr = response.data.find(a => a.is_default) || response.data[0];
                    setSelectedAddress(defaultAddr);
                }
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };
        fetchAddresses();
    }, [user, getAuthHeaders]);

    // Handle size selection and auto-advance
    const handleSizeSelect = (sizeId, price) => {
        setSelectedSize(sizeId);
        setSizePrice(price); // Store the multiplied price
        setSelectedHours(null); // Reset hourly selection
        setHourlyPrice(0);
        // Auto-advance to next section
        sections.markComplete('size', true);
    };

    // Handle hourly selection
    const handleHourlySelect = (hoursId, hours, totalPrice) => {
        setSelectedHours(hoursId);
        setHourlyPrice(totalPrice);
        setSelectedSize(null); // Reset size selection
        // Auto-advance to next section
        sections.markComplete('size', true);
    };

    // Handle time selection
    const handleTimeSelect = (time) => {
        setSelectedTime(time);
        if (selectedDates.length > 0 || selectedDate) {
            sections.markComplete('datetime', true);
        }
    };

    // Handle single date selection (for instant or legacy)
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        if (selectedTime) {
            sections.markComplete('datetime', true);
        }
    };

    // Handle weekday selection - auto-expand to all matching dates in current month
    const handleWeekdaysChange = (weekdays) => {
        setSelectedWeekdays(weekdays);

        if (weekdays.length === 0) {
            // Clear all auto-selected dates
            setSelectedDates([]);
            return;
        }

        // Calculate all dates in current month matching selected weekdays
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const today = new Date();
        const newDates = [];

        let day = monthStart;
        while (day <= monthEnd) {
            if (weekdays.includes(getDay(day)) && day >= today) {
                newDates.push(new Date(day));
            }
            day = addDays(day, 1);
        }

        setSelectedDates(newDates);
        if (newDates.length > 0) {
            setSelectedDate(newDates[0]); // Set first date as primary
        }
    };

    // Handle calendar date click - toggle individual date
    const handleCalendarDateClick = (date) => {
        if (date === null) {
            // Clear all
            setSelectedDates([]);
            setSelectedWeekdays([]);
            setSelectedDate(null);
            return;
        }

        const isSelected = selectedDates.some(d => isSameDay(d, date));

        if (isSelected) {
            // Remove date
            const newDates = selectedDates.filter(d => !isSameDay(d, date));
            setSelectedDates(newDates);
            if (selectedDate && isSameDay(selectedDate, date)) {
                setSelectedDate(newDates.length > 0 ? newDates[0] : null);
            }
        } else {
            // Add date
            const newDates = [...selectedDates, date].sort((a, b) => a - b);
            setSelectedDates(newDates);
            if (!selectedDate) {
                setSelectedDate(date);
            }
        }
    };

    // Handle month change - re-calculate recurring dates
    const handleMonthChange = (newMonth) => {
        setCurrentMonth(newMonth);

        if (selectedWeekdays.length > 0) {
            // Re-calculate dates for new month
            const monthStart = startOfMonth(newMonth);
            const monthEnd = endOfMonth(newMonth);
            const today = new Date();
            const newDates = [];

            let day = monthStart;
            while (day <= monthEnd) {
                if (selectedWeekdays.includes(getDay(day)) && day >= today) {
                    newDates.push(new Date(day));
                }
                day = addDays(day, 1);
            }

            // Merge with existing dates from other months
            const existingFromOtherMonths = selectedDates.filter(d =>
                d < monthStart || d > monthEnd
            );
            setSelectedDates([...existingFromOtherMonths, ...newDates].sort((a, b) => a - b));
        }
    };

    // Get selected service name for multiplier calculation
    const selectedService = services.find(s => s.id === serviceId);
    const selectedServiceName = selectedService?.name || 'Standard Cleaning';

    // Calculate price based on pricing mode
    const selectedHouseType = HOUSE_TYPES.find(h => h.id === selectedSize);
    const selectedHourOption = HOUR_OPTIONS.find(h => h.id === selectedHours);

    const totalPrice = pricingMode === 'size'
        ? sizePrice
        : hourlyPrice;

    // Generate booking summary
    const getSummary = () => {
        const parts = [];
        if (pricingMode === 'size' && selectedHouseType) {
            parts.push(selectedHouseType.label);
        } else if (pricingMode === 'hourly' && selectedHourOption) {
            parts.push(selectedHourOption.label);
        }
        if (selectedDate) parts.push(format(selectedDate, 'MMM d'));
        if (selectedTime) parts.push(selectedTime);
        return parts.join(' • ');
    };

    // Get completed summary for collapsible section
    const getSizeCompletedSummary = () => {
        if (pricingMode === 'size' && selectedHouseType) {
            return `${selectedHouseType.label} • AED ${sizePrice}`;
        } else if (pricingMode === 'hourly' && selectedHourOption) {
            return `${selectedHourOption.label} • AED ${hourlyPrice}`;
        }
        return '';
    };

    // Validation - either size or hours must be selected based on mode
    const hasDurationSelection = pricingMode === 'size' ? selectedSize : selectedHours;
    const isValid = hasDurationSelection && selectedDate && selectedTime && selectedAddress && serviceId;

    // Handle booking
    const handleConfirm = async () => {
        if (!isValid) {
            toast.error('Please complete all selections');
            return;
        }

        setLoading(true);
        try {
            const [hours, minutes] = selectedTime.split(':');
            const scheduledDateTime = new Date(selectedDate);
            scheduledDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            // Calculate duration based on pricing mode
            let durationMinutes = 120; // default 2 hours
            if (pricingMode === 'size' && selectedHouseType?.duration) {
                durationMinutes = parseInt(selectedHouseType.duration) * 60;
            } else if (pricingMode === 'hourly' && selectedHourOption?.hours) {
                durationMinutes = selectedHourOption.hours * 60;
            }

            const bookingData = {
                service_id: serviceId,
                booking_type: bookingType === 'instant' ? 'instant' : 'single',
                scheduled_date: scheduledDateTime.toISOString(),
                duration_minutes: durationMinutes,
                address_id: selectedAddress.id,
                add_on_ids: [],
                customer_notes: '',
                property_size_sqft: 1000,
                bedrooms: 0,
                bathrooms: 1,
                payment_method: paymentMode === 'now' ? 'card' : 'cash'
            };

            await axios.post(`${API}/bookings/`, bookingData, {
                headers: getAuthHeaders()
            });

            toast.success('Booking confirmed!');
            navigate('/booking/success', { state: { bookingCount: 1, isScheduled: true } });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.detail || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 pt-[calc(env(safe-area-inset-top)+2rem)] pb-8 transition-all">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <CalendarClock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white leading-tight">Schedule Cleaning</h1>
                            {selectedAddress && (
                                <p className="text-emerald-50 text-xs md:text-sm flex items-center gap-1.5 mt-0.5 opacity-90">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate max-w-[200px]">
                                        {selectedAddress.label || selectedAddress.address_line_1}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Type Toggle - Always visible */}
            <div className="max-w-2xl mx-auto px-4 -mt-4 mb-6">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <BookingTypeToggle
                        bookingType={bookingType}
                        onBookingTypeChange={(type) => {
                            setBookingType(type);
                            if (type === 'instant') {
                                setSelectedTime('ASAP');
                                setSelectedDate(new Date());
                                // Keep size section open for instant booking
                                sections.expandSection('size');
                            } else {
                                setSelectedTime(null);
                                setSelectedDate(null);
                            }
                        }}
                    />

                    {/* Date & Time Selection - Only for Schedule */}
                    {bookingType === 'schedule' && (
                        <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                            <div className="space-y-5">
                                {/* 1. Quick Day Selection (DayPickerHorizontal) */}
                                <DayPickerHorizontal
                                    selectedDays={selectedWeekdays}
                                    onDaysChange={handleWeekdaysChange}
                                />

                                {/* 2. Full Month Calendar */}
                                <FullMonthCalendar
                                    currentMonth={currentMonth}
                                    onMonthChange={handleMonthChange}
                                    selectedDates={selectedDates}
                                    onDateClick={handleCalendarDateClick}
                                    highlightedWeekdays={selectedWeekdays}
                                    minDate={new Date()}
                                />

                                {/* 3. Select Time - Show when at least one date is selected */}
                                {selectedDates.length > 0 && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <label className="text-sm font-medium text-gray-700 mb-3 block">
                                            Select Time Slot
                                            <span className="text-xs text-gray-400 font-normal ml-2">
                                                (applies to all selected dates)
                                            </span>
                                        </label>
                                        <TimeSlotPicker
                                            selectedPeriod={selectedPeriod}
                                            selectedTime={selectedTime}
                                            onPeriodChange={setSelectedPeriod}
                                            onTimeSelect={handleTimeSelect}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 pb-48 space-y-4">
                {/* Service Selection - Unified pill-style */}
                {services.length > 0 && (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-emerald-600" />
                            <label className="font-semibold text-gray-900">Select Service</label>
                        </div>
                        <ServiceTypeToggle
                            selectedType={
                                services.find(s => s.id === serviceId)?.name?.toLowerCase().includes('deep') ? 'deep' :
                                    services.find(s => s.id === serviceId)?.name?.toLowerCase().includes('move') ? 'move' : 'standard'
                            }
                            onTypeChange={(type) => {
                                // Map service type to actual service ID
                                const typeMap = {
                                    'standard': 'Standard Cleaning',
                                    'deep': 'Deep Cleaning',
                                    'move': 'Move In/Out'
                                };
                                const matchingService = services.find(s =>
                                    s.name.toLowerCase().includes(typeMap[type].toLowerCase())
                                );
                                if (matchingService) {
                                    setServiceId(matchingService.id);
                                    toast.success(`${matchingService.name} selected`, {
                                        description: 'Service updated successfully',
                                        duration: 2000,
                                    });
                                }
                            }}
                            showDescription={true}
                        />
                    </div>
                )}

                {/* Size & Duration - Unified pill-style */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        {pricingMode === 'hourly' ? (
                            <Clock className="w-5 h-5 text-emerald-600" />
                        ) : (
                            <Home className="w-5 h-5 text-emerald-600" />
                        )}
                        <label className="font-semibold text-gray-900">Size & Duration</label>
                    </div>
                    <SizeDurationToggle
                        pricingMode={pricingMode}
                        onPricingModeChange={(mode) => {
                            setPricingMode(mode);
                            if (mode === 'size') {
                                setSelectedHours(null);
                                setHourlyPrice(0);
                            } else {
                                setSelectedSize(null);
                                setSizePrice(0);
                            }
                        }}
                        selectedSize={selectedSize}
                        onSizeChange={(size) => {
                            handleSizeSelect(size);
                        }}
                        selectedHours={selectedHours?.replace('hrs', '') + 'hrs'}
                        onHoursChange={(hours) => {
                            handleHourlySelect(hours);
                        }}
                        baseRate={BASE_HOURLY_RATE * getServiceMultiplier(services.find(s => s.id === serviceId)?.name)}
                    />
                </div>

                {/* Payment Mode - Unified pill-style */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                        <label className="font-semibold text-gray-900">Payment</label>
                    </div>
                    <PaymentModeToggle
                        paymentMode={paymentMode}
                        onPaymentModeChange={setPaymentMode}
                        discount={5}
                        showDetails={true}
                    />
                </div>

                {/* Instant booking info */}
                {bookingType === 'instant' && (
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                            <Zap className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-emerald-900">Priority Dispatch</h4>
                            <p className="text-sm text-emerald-700">
                                A cleaner will be assigned immediately and arrive within 90 minutes.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Bottom CTA */}
            <StickyBookingCTA
                isVisible={showSticky || sections.allCompleted || bookingType === 'instant'}
                bookingSummary={getSummary()}
                price={totalPrice}
                paymentMode={paymentMode}
                onPaymentModeChange={setPaymentMode}
                onConfirm={handleConfirm}
                isLoading={loading}
                isDisabled={!isValid}
            />
        </div>
    );
};

export default ScheduleBookingPageRedesigned;
