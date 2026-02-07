import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import {
  Calendar, Zap, ChevronRight, ChevronDown, Gift, Wallet, User,
  Star, Shield, IdCard, Users, Sparkles, MapPin, Clock, Check,
  Home, Droplets, Shirt, UtensilsCrossed, Package, Moon, X, CheckCircle, Briefcase, Tag
} from 'lucide-react';
import AddressFlowManager from '../components/address/AddressFlowManager';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Check if within service hours (8 AM - 10 PM)
const isWithinServiceHours = () => {
  const hour = new Date().getHours();
  return hour >= 8 && hour < 22;
};

// Typewriter Component
const Typewriter = ({ text }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % text.length;
      const fullText = text[i];

      setCurrentText(isDeleting
        ? fullText.substring(0, currentText.length - 1)
        : fullText.substring(0, currentText.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 150);

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, loopNum, typingSpeed, text]);

  return (
    <span className="relative text-lime-300">
      {currentText}
      <span className="w-0.5 h-[0.9em] bg-current absolute -right-1 top-[0.1em] animate-blink" />
    </span>
  );
};

// Hero Section with dynamic variants
const HeroSection = ({ expertsAvailable }) => {
  const isNightMode = !isWithinServiceHours() || !expertsAvailable;

  return (
    <section className={`relative min-h-[280px] md:min-h-[320px] lg:min-h-[360px] overflow-hidden transition-colors duration-1000 ${isNightMode
      ? 'bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900'
      : 'bg-gradient-to-br from-emerald-600 to-teal-500'
      }`}>
      {/* Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      {/* Stars decoration for night mode */}
      {isNightMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.2 + Math.random() * 0.8
              }}
            />
          ))}
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 px-6 pt-28 pb-32 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight drop-shadow-md">
          {isNightMode ? (
            <>Our Experts are<br />taking a break <Moon className="inline w-8 h-8 ml-2 text-yellow-200" /></>
          ) : (
            <>Sparkling Clean<br />
              <span className="inline-block min-w-[9ch] text-left align-bottom">
                <Typewriter text={['Home', 'Apartment', 'Villa', 'Sanctuary']} />
              </span>
            </>
          )}
        </h1>
        <p className="text-white/95 mt-3 text-base md:text-lg font-medium max-w-md leading-relaxed drop-shadow-sm">
          {isNightMode
            ? 'We are recharging for tomorrow. Schedule your service now for the morning!'
            : 'Professional home cleaning services at your doorstep in 60 minutes.'}
        </p>
      </div>

      {/* Moon/Sun illustration */}
      <div className="absolute right-4 md:right-16 top-20 w-32 h-32 md:w-56 md:h-56 pointer-events-none">
        <div className="relative w-full h-full animate-float">
          {isNightMode ? (
            <>
              {/* Moon */}
              <div className="absolute right-0 top-4 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full shadow-[0_0_40px_rgba(253,224,71,0.3)]" />
              <div className="absolute right-4 top-8 w-6 h-6 md:w-8 md:h-8 bg-black/5 rounded-full" />
              <div className="absolute right-10 top-16 w-3 h-3 md:w-4 md:h-4 bg-black/5 rounded-full" />
              {/* Clouds */}
              <div className="absolute bottom-4 right-12 w-20 h-8 bg-white/10 rounded-full blur-md" />
            </>
          ) : (
            <>
              {/* Sun */}
              <div className="absolute right-2 top-2 w-24 h-24 md:w-36 md:h-36 bg-gradient-to-tr from-yellow-300 to-orange-400 rounded-full shadow-[0_0_60px_rgba(251,191,36,0.5)] animate-pulse-slow">
                {/* Sun Ray / Clean Glow */}
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              </div>

              {/* Cleaning Bubbles */}
              <div className="absolute right-8 top-10 w-4 h-4 bg-white/40 rounded-full animate-float transition-all duration-[3000ms]" style={{ animationDelay: '0.5s' }} />
              <div className="absolute right-24 top-24 w-6 h-6 bg-white/30 rounded-full animate-float transition-all duration-[4000ms]" style={{ animationDelay: '1.2s' }} />
              <div className="absolute right-2 top-32 w-3 h-3 bg-white/50 rounded-full animate-float transition-all duration-[2500ms]" style={{ animationDelay: '2s' }} />
              <div className="absolute right-[140px] top-4 w-8 h-8 bg-blue-100/20 rounded-full animate-float transition-all duration-[5000ms]" style={{ animationDelay: '0.2s' }} />

              {/* Sparkles */}
              <Sparkles className="absolute top-0 right-0 text-white/90 w-10 h-10 animate-spin-slow" style={{ animationDuration: '10s' }} />
              <Sparkles className="absolute bottom-4 right-20 text-yellow-100 w-6 h-6 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
              <Sparkles className="absolute -left-10 top-10 text-white/70 w-8 h-8 animate-pulse" style={{ animationDuration: '2s' }} />
            </>
          )}
        </div>
      </div>

      {/* Bottom wave curve */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1">
        <svg viewBox="0 0 1440 120" className="w-full h-16 md:h-24 fill-white" preserveAspectRatio="none">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L0,120Z" />
        </svg>
      </div>
    </section>
  );
};

// Hero Service Options (2x2 Grid with Office Cleaning)
const HeroServiceOptions = ({ services, onServiceClick }) => {
  // Fallback defaults if services haven't loaded yet
  const defaults = [
    { id: 1, name: 'Standard Cleaning', icon: Home, color: 'bg-emerald-50', iconColor: 'text-emerald-600', description: 'Regular maintenance', popular: true },
    { id: 2, name: 'Deep Cleaning', icon: Sparkles, color: 'bg-teal-50', iconColor: 'text-teal-600', description: 'Thorough refresh' },
    { id: 3, name: 'Move In/Out', icon: Package, color: 'bg-blue-50', iconColor: 'text-blue-600', description: 'Empty home cleaning' },
    { id: 4, name: 'Office Cleaning', icon: Briefcase, color: 'bg-indigo-50', iconColor: 'text-indigo-600', description: 'Workplace sanitation' },
  ];

  // Helper to merge defaults with fetched services
  const displayItems = [...defaults];

  return (
    <div className="relative -mt-24 px-4 z-20 pb-4">
      <div className="max-w-4xl mx-auto">
        {/* Glassmorphism container - Frosted Glass Effect */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-white/40 ring-1 ring-black/5">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {displayItems.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => onServiceClick(service)}
                  className="relative overflow-hidden flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/50 hover:bg-white border border-white/60 hover:border-emerald-100 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98] transition-all duration-200 group text-center backdrop-blur-sm"
                >
                  {service.popular && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className={`w-6 h-6 ${service.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-base group-hover:text-emerald-700 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1 group-hover:text-gray-600 line-clamp-1">
                      {service.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Booking Flexibility Component (Frosted Glass Plate Style)
const BookingFlexibility = ({ onSelectMethod }) => {
  return (
    <section className="relative px-6 pb-12 max-w-7xl mx-auto">
      {/* Background Blobs for Glass Effect */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="text-center mb-4 animate-in slide-in-from-bottom-4 duration-700 fade-in fill-mode-both">
        <h2 className="text-2xl font-bold text-gray-900">Cleaning Your Way</h2>
        <p className="text-gray-500 mt-2">Choose how you want to book your professional cleaner</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-0">
        {/* Frosted Glass Plate Container (Matches Service Grid) */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-white/40 ring-1 ring-black/5">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
            {/* Card 1: By House Size (Glassmorphic Emerald) */}
            <button
              onClick={() => onSelectMethod('size')}
              className="relative overflow-hidden group flex flex-col items-center justify-center gap-2 md:gap-3 p-3 md:p-6 rounded-2xl bg-white/50 hover:bg-white border border-white/60 hover:border-emerald-100 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98] transition-all duration-200 text-center backdrop-blur-sm"
            >
              {/* Popular Badge (Optional, added for consistency/future use) */}
              {/* <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Popular</span> */}

              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <Home className="w-5 h-5 md:w-7 md:h-7 drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm md:text-lg drop-shadow-sm leading-tight group-hover:text-emerald-700 transition-colors">
                  By House<br className="md:hidden" /> Size
                </h3>
                <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-1 leading-tight hidden md:block group-hover:text-gray-600">
                  Flat rates for any home
                </p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5 md:hidden">
                  Flat rates
                </p>
                <p className="text-[10px] text-emerald-600 font-bold mt-1 bg-emerald-50/80 px-2 py-0.5 rounded-full inline-block">
                  From AED 150
                </p>
              </div>
              <ChevronRight className="absolute right-1.5 md:right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
            </button>

            {/* Card 2: By Hourly Rate (Glassmorphic Blue) */}
            <button
              onClick={() => onSelectMethod('hourly')}
              className="relative overflow-hidden group flex flex-col items-center justify-center gap-2 md:gap-3 p-3 md:p-6 rounded-2xl bg-white/50 hover:bg-white border border-white/60 hover:border-blue-100 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 active:scale-[0.98] transition-all duration-200 text-center backdrop-blur-sm"
            >
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <Clock className="w-5 h-5 md:w-7 md:h-7 drop-shadow-sm" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm md:text-lg drop-shadow-sm leading-tight group-hover:text-blue-700 transition-colors">
                  By Hourly<br className="md:hidden" /> Rate
                </h3>
                <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-1 leading-tight hidden md:block group-hover:text-gray-600">
                  Flexible time-based booking
                </p>
                <p className="text-[10px] text-gray-500 font-medium mt-0.5 md:hidden">
                  Flexible time
                </p>
                <p className="text-[10px] text-blue-600 font-bold mt-1 bg-blue-50/80 px-2 py-0.5 rounded-full inline-block">
                  AED 75/hr
                </p>
              </div>
              <ChevronRight className="absolute right-1.5 md:right-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Cashback Banner
const CashbackBanner = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mx-4 mb-8 w-[calc(100%-2rem)] block max-w-md md:mx-auto"
    >
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl px-4 py-4 flex items-center gap-3 hover:from-green-100 hover:to-emerald-200 transition-colors shadow-sm border border-green-100">
        <div className="w-10 h-10 flex-shrink-0">
          <div className="w-full h-full bg-emerald-500 rounded-full flex items-center justify-center relative shadow-sm">
            <Tag className="w-5 h-5 text-white" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
          </div>
        </div>
        <div className="flex-1 text-left">
          <p className="text-emerald-900 font-semibold text-sm">
            Get 100% cashback on your first booking!
          </p>
          <p className="text-emerald-600 text-xs font-medium mt-0.5">Claim Now</p>
        </div>
        <ChevronRight className="w-5 h-5 text-emerald-700" />
      </div>
    </button>
  );
};



// Referral Banner
const ReferralBanner = ({ onReferClick }) => {
  return (
    <section className="mx-6 my-4 max-w-7xl">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col items-start max-w-[70%]">
          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-2">
            Refer & Earn
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight mb-4">
            Give AED 50,<br />Get AED 50
          </h3>
          <button
            onClick={onReferClick}
            className="bg-white text-emerald-600 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors shadow-sm"
          >
            Invite Friends
          </button>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-48 h-full pointer-events-none opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full text-white fill-current">
            <circle cx="150" cy="50" r="80" />
            <circle cx="180" cy="150" r="40" />
          </svg>
        </div>
        {/* Gift icon */}
        <Gift className="absolute bottom-4 right-4 text-white/30 w-24 h-24 rotate-12" />
      </div>
    </section>
  );
};

// Trust Indicators
const TrustIndicators = () => {
  const trustItems = [
    {
      id: 'kyc',
      icon: IdCard,
      title: 'Valid ID\nVerified',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'background',
      icon: Shield,
      title: 'Background\nChecked',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      id: 'training',
      icon: Users,
      title: 'Expertly\nTrained',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-500'
    },
    {
      id: 'rating',
      icon: null,
      isRating: true,
      rating: '4.8',
      title: 'Top Rated\nCleaners',
      bgColor: 'bg-amber-50',
      iconColor: 'text-yellow-400'
    }
  ];

  return (
    <section className="px-6 py-8 pb-32 max-w-7xl mx-auto">
      <div className="grid grid-cols-4 gap-2">
        {trustItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center text-center"
          >
            <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center mb-2`}>
              {item.isRating ? (
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ) : (
                <item.icon className={`w-6 h-6 ${item.iconColor}`} />
              )}
            </div>
            {item.isRating && (
              <p className="text-sm font-bold text-gray-900 -mt-0.5 mb-0.5">{item.rating}</p>
            )}
            <p className="text-xs font-medium text-gray-500 leading-snug whitespace-pre-line">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Center Screen Popup Modal for Starter Pack
const StarterPackModal = ({ onClaim, visible, onClose }) => {
  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-2xl max-w-sm w-full pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Header with Sparkles */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-t-3xl px-6 pt-6 pb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">Welcome Offer!</h3>
              <p className="text-emerald-50 text-sm">Limited time starter pack deal</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Price Badge */}
            <div className="bg-emerald-50 rounded-2xl p-4 mb-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Regular Price</span>
                <span className="text-lg text-gray-400 line-through decoration-red-400">AED 507</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Special Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-semibold text-emerald-600">AED</span>
                  <span className="text-3xl font-bold text-emerald-600">149</span>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="space-y-3 mb-6">
              <h4 className="font-bold text-gray-900">Starter Pack Includes:</h4>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">3 Cleaning Visits</p>
                  <p className="text-xs text-gray-500">60 minutes each session</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Professional Cleaners</p>
                  <p className="text-xs text-gray-500">Vetted & trained staff</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Flexible Scheduling</p>
                  <p className="text-xs text-gray-500">Use within 90 days</p>
                </div>
              </div>
            </div>

            {/* Savings Badge */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-center justify-center gap-2">
              <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
              <span className="text-sm font-bold text-amber-900">Save AED 358 (71% OFF)</span>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                onClaim();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-xl font-bold text-base hover:from-emerald-700 hover:to-emerald-800 active:scale-[0.98] transition-all shadow-lg shadow-emerald-200"
            >
              Claim Starter Pack
            </button>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-400 mt-4">
              🎉 New customers only • Offer expires soon
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

// Main HomePage Component
const HomePage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  // Use cart context to hide promo banner if cart is active
  const { cartCount } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [quickBooking, setQuickBooking] = useState(null);
  const [expertsAvailable, setExpertsAvailable] = useState(true);
  const [addressFlowOpen, setAddressFlowOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null); // Default to false to prevent flash
  const [services, setServices] = useState([]);

  const [userAddress, setUserAddress] = useState('');
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [showStarterPackModal, setShowStarterPackModal] = useState(false);
  const [hasBookings, setHasBookings] = useState(null); // null = loading, true/false = result

  // ... (keeping existing scroll effect)

  useEffect(() => {
    fetchServices();
    // ... (keeping existing availability check)
    checkAvailability();
    const availabilityInterval = setInterval(checkAvailability, 60000);
    return () => clearInterval(availabilityInterval);
  }, []);

  // Check if user has any bookings
  useEffect(() => {
    const checkUserBookings = async () => {
      if (!user || !token) {
        setHasBookings(false);
        return;
      }

      try {
        const response = await fetch(`${API}/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const bookings = await response.json();
          setHasBookings(bookings && bookings.length > 0);
        } else {
          setHasBookings(false);
        }
      } catch (error) {
        console.error('Error checking bookings:', error);
        setHasBookings(false);
      }
    };

    checkUserBookings();
  }, [user, token]);

  // Auto-show starter pack modal after 2 seconds (only for new users without bookings)
  useEffect(() => {
    // Only show if user is logged in and has no bookings
    if (hasBookings === false && user) {
      const timer = setTimeout(() => {
        setShowStarterPackModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasBookings, user]);

  // Fetch user addresses on mount for Navbar
  useEffect(() => {
    const fetchInitialAddress = async () => {
      if (!user || !token) return;
      try {
        const response = await fetch(`${API}/users/me/addresses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const list = Array.isArray(data) ? data : (data.addresses || []);
          if (list.length > 0) {
            // Prefer default, else first
            const defaultAddr = list.find(a => a.is_default) || list[0];
            setSelectedAddress(defaultAddr);
          }
        }
      } catch (error) {
        console.error('Error fetching initial address:', error);
      }
    };
    fetchInitialAddress();
  }, [user, token]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API}/services`);
      if (response.ok) {
        let data = await response.json();
        // STRICT FILTER: Only show Standard, Deep, Move In/Out
        const allowedServices = ['Standard Cleaning', 'Deep Cleaning', 'Move In/Out Cleaning', 'Move In/Out'];
        // Fuzzy match or loose filtering if slugs/names vary
        data = data.filter(s =>
          allowedServices.some(allowed => s.name.includes(allowed) || s.title?.includes(allowed))
        );

        // If we have less than 3, maybe show all (fallback), but user wants specifically these.
        // Let's trust the filter for now.
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const checkAvailability = async () => {
    try {
      const response = await fetch(`${API}/availability/check`);
      if (response.ok) {
        const data = await response.json();
        setExpertsAvailable(data.status === 'available' || data.status === 'limited');
      } else {
        // Fallback to time-based check if API fails
        const hour = new Date().getHours();
        setExpertsAvailable(hour >= 8 && hour < 22);
      }
    } catch (error) {
      // Fallback to time-based check if API unreachable
      const hour = new Date().getHours();
      setExpertsAvailable(hour >= 8 && hour < 22);
    }
  };



  const handleServiceClick = (service) => {
    // Navigate to schedule booking with service pre-selected AND default to instant
    navigate('/schedule-booking-new', {
      state: {
        serviceId: service.id,
        bookingType: 'instant'
      }
    });
  };

  const handleBookingMethodClick = (method) => {
    // Navigate to schedule booking with specific method (size or hourly) AND default to instant
    navigate('/schedule-booking-new', {
      state: {
        bookingMethod: method,
        bookingType: 'instant'
      }
    });
  };

  const handleCashbackClick = () => {
    // Create query param to indicate discount/cashback
    navigate('/booking?promo=FIRST100');
  };

  const handleReferClick = () => {
    navigate('/referrals');
  };

  const handleClaimStarterPack = () => {
    navigate('/subscriptions/checkout/starter-pack');
  };

  // Hide promo banner if cart has items to avoid overlap with Sticky Cart
  const shouldShowPromo = showPromoBanner && cartCount === 0;

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        transparent={!scrolled}
        selectedAddress={selectedAddress}
        onAddressClick={() => setAddressFlowOpen(true)}
      />

      <main>
        <HeroSection expertsAvailable={expertsAvailable} />

        <HeroServiceOptions
          services={services}
          onServiceClick={handleServiceClick}
        />

        <BookingFlexibility onSelectMethod={handleBookingMethodClick} />

        <CashbackBanner onClick={handleCashbackClick} />

        <ReferralBanner onReferClick={handleReferClick} />

        <TrustIndicators />
      </main>

      <StarterPackModal
        onClaim={handleClaimStarterPack}
        visible={showStarterPackModal}
        onClose={() => setShowStarterPackModal(false)}
      />

      {/* Add floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>

      {/* Address Flow Manager */}
      <AddressFlowManager
        open={addressFlowOpen}
        onClose={() => setAddressFlowOpen(false)}
        onAddressSelected={(addr) => {
          setSelectedAddress(addr);
          setAddressFlowOpen(false);
        }}
      />
    </div>
  );
};

export default HomePage;

