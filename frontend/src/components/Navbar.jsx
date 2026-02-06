import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Menu, X, User, LogOut, LayoutDashboard, Calendar, Sparkles, Settings, Wallet, Gift, ChevronDown, ChevronRight, MapPin, HelpCircle } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Navbar = ({ transparent = false, selectedAddress, onAddressClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userAddress, setUserAddress] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch user address if logged in
  useEffect(() => {
    const fetchUserAddress = async () => {
      if (!user || !token) return;
      try {
        const response = await axios.get(`${API}/users/me/addresses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const addresses = response.data;
        const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
        if (defaultAddr) {
          const parts = [defaultAddr.building_name, defaultAddr.area].filter(Boolean);
          setUserAddress(parts.join(', ') || defaultAddr.street || 'Address set');
        } else {
          setUserAddress('Add Address');
        }
      } catch (error) {
        // Silent fail or default
        setUserAddress('Select Address');
      }
    };
    fetchUserAddress();
  }, [user, token]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [];

  const isActive = (href) => location.pathname === href;

  // Determine if we should show white background or transparent
  // If transparent prop is true: transparent at top, white on scroll.
  // If transparent prop is false: always white.
  const isTransparent = transparent && !scrolled && !mobileMenuOpen;

  const textColorClass = isTransparent ? 'text-white' : 'text-stone-900';
  const subTextColorClass = isTransparent ? 'text-white/80' : 'text-stone-500';
  const bgColorClass = isTransparent ? 'bg-transparent border-transparent' : 'bg-white/95 backdrop-blur-xl border-stone-200/50 shadow-sm';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${bgColorClass}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LEFT: Address Header (triggers address flow) or Logo if not logged in */}
          {user ? (
            <button
              onClick={onAddressClick}
              className="flex items-center gap-2 group text-left"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isTransparent ? 'bg-white/20' : 'bg-emerald-50'}`}>
                <MapPin className={`w-4 h-4 ${isTransparent ? 'text-white' : 'text-emerald-600'}`} />
              </div>
              <div>
                <div className={`flex items-center gap-1 font-semibold text-sm md:text-base ${textColorClass}`}>
                  <span>{selectedAddress?.label || 'Home'}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <p className={`text-xs truncate max-w-[150px] md:max-w-[250px] ${subTextColorClass}`}>
                  {selectedAddress?.address || 'Select your location'}
                </p>
              </div>
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
              <div className="w-10 h-10 rounded-xl bg-green-900 flex items-center justify-center shadow-lg shadow-green-900/20">
                <Sparkles className="w-5 h-5 text-lime-400" />
              </div>
              <span className={`font-heading font-bold text-xl hidden md:inline-block ${isTransparent ? 'text-white' : 'text-green-900'}`}>
                CleanUpCrew
              </span>
            </Link>
          )}

          {/* CENTER: Desktop Nav Links (Hidden if Logo is taking space? No, usually fine) */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium hover:opacity-100 transition-opacity ${isActive(link.href) ? 'opacity-100' : 'opacity-70'} ${textColorClass}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/wallet')}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${isTransparent ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white shadow-sm border border-stone-100 text-pink-500 hover:shadow-md'}`}
                  title="Wallet"
                >
                  <Wallet className="w-5 h-5" />
                </button>

                <button
                  onClick={() => navigate('/referrals')}
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${isTransparent ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white shadow-sm border border-stone-100 text-green-500 hover:shadow-md'}`}
                  title="Referrals"
                >
                  <Gift className="w-5 h-5" />
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                    $50
                  </span>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`rounded-full gap-2 px-2 ml-2 ${isTransparent ? 'hover:bg-white/20 text-white' : 'hover:bg-stone-100'}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                        {user.name.charAt(0)}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-stone-100">
                    <div className="px-2 py-2 mb-2 bg-stone-50 rounded-xl">
                      <p className="font-bold text-stone-900">{user.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-lg cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-lg cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-lg cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className={`font-medium ${isTransparent ? 'text-white hover:bg-white/20' : ''}`}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/booking">
                  <Button
                    className={`rounded-full px-6 shadow-lg shadow-green-900/20 ${isTransparent ? 'bg-white text-green-900 hover:bg-green-50' : 'bg-green-900 hover:bg-green-800 text-white'}`}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Floating Icons (Wallet, Referral, Profile/Menu) */}
          <div className="md:hidden flex items-center gap-2">
            {/* Wallet Button */}
            <button
              onClick={() => user ? navigate('/wallet') : navigate('/login')}
              className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 hover:bg-pink-100 transition-colors shadow-sm border border-pink-100"
            >
              <Wallet className="w-5 h-5" />
            </button>

            {/* Referral Button */}
            <button
              onClick={() => user ? navigate('/referrals') : navigate('/login')}
              className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors shadow-sm border border-emerald-100"
            >
              <Gift className="w-5 h-5" />
            </button>

            {/* Profile/Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors shadow-sm overflow-hidden border border-stone-200"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : user ? (
                <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 animate-fadeIn h-screen absolute top-16 left-0 right-0 p-4 overflow-y-auto">
          {user && (
            <>
              {/* Large Avatar Header - Clickable */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-xl font-bold text-stone-900">
                    {user.name}
                  </h2>
                  <ChevronDown className="w-5 h-5 text-stone-400" />
                </div>
                <p className="text-sm text-stone-500 mt-1">{user.email}</p>
                {user.phone && (
                  <p className="text-sm text-stone-500">{user.phone}</p>
                )}
              </div>

              {/* Referral Banner */}
              <Link
                to="/referrals"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200 hover:shadow-md transition-all mb-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-stone-900">Earn AED 50</h3>
                    <p className="text-sm text-stone-600">Refer your friends and earn now</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-stone-400 flex-shrink-0" />
                </div>
              </Link>

              {/* Quick Access Grid - 2x3 (Bookings, Wallet, Support) */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* My Bookings */}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative bg-white rounded-2xl p-4 border border-stone-200 hover:shadow-md hover:border-stone-300 transition-all active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center mb-3">
                    <Calendar className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-1">My Bookings</h3>
                  <p className="text-xs text-stone-500">View all bookings</p>
                  <ChevronRight className="w-4 h-4 text-stone-400 absolute top-4 right-4" />
                </Link>

                {/* My Wallet */}
                <Link
                  to="/wallet"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative bg-white rounded-2xl p-4 border border-stone-200 hover:shadow-md hover:border-stone-300 transition-all active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                    <Wallet className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-1">My Wallet</h3>
                  <p className="text-xs text-stone-500">Check balance</p>
                  <ChevronRight className="w-4 h-4 text-stone-400 absolute top-4 right-4" />
                </Link>

                {/* Help & Support */}
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="relative bg-white rounded-2xl p-4 border border-stone-200 hover:shadow-md hover:border-stone-300 transition-all active:scale-[0.98] col-span-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-900">Help & Support</h3>
                      <p className="text-xs text-stone-500">Get quick help</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  </div>
                </Link>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 h-12 hover:bg-red-50"
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </Button>
            </>
          )}

          {/* Not Logged In State */}
          {!user && (
            <div className="space-y-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full h-12 text-base">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-green-900 hover:bg-green-800 h-12 text-base">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
