import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Plus
} from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DashboardPage = () => {
  const { user, getAuthHeaders } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API}/bookings`, {
        headers: getAuthHeaders()
      });
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await axios.put(`${API}/bookings/${bookingId}/cancel`, {}, {
        headers: getAuthHeaders()
      });
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to cancel booking');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'confirmed':
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
    }
  };

  const upcomingBookings = bookings.filter(b => 
    ['pending', 'confirmed', 'in_progress'].includes(b.status)
  );
  const pastBookings = bookings.filter(b => 
    ['completed', 'cancelled'].includes(b.status)
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-green-900">
                Welcome back, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-stone-600 mt-1">
                Manage your bookings and account here.
              </p>
            </div>
            <Link to="/booking">
              <Button className="bg-lime-500 hover:bg-lime-600 text-white rounded-full" data-testid="dashboard-new-booking">
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="stats-card">
              <p className="text-stone-500 text-sm mb-1">Total Bookings</p>
              <p className="font-heading text-3xl font-bold text-green-900">{bookings.length}</p>
            </div>
            <div className="stats-card">
              <p className="text-stone-500 text-sm mb-1">Upcoming</p>
              <p className="font-heading text-3xl font-bold text-blue-600">{upcomingBookings.length}</p>
            </div>
            <div className="stats-card">
              <p className="text-stone-500 text-sm mb-1">Completed</p>
              <p className="font-heading text-3xl font-bold text-lime-600">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
            <div className="stats-card">
              <p className="text-stone-500 text-sm mb-1">Total Spent</p>
              <p className="font-heading text-3xl font-bold text-green-900">
                ${bookings.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + b.total_price, 0).toFixed(0)}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-green-900" />
              <p className="text-stone-600 mt-2">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
              <Calendar className="w-16 h-16 mx-auto text-stone-300 mb-4" />
              <h3 className="font-heading text-xl font-semibold text-green-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-stone-600 mb-6">
                Book your first cleaning and experience the BrightHome difference.
              </p>
              <Link to="/booking">
                <Button className="bg-green-900 hover:bg-green-800 text-white rounded-full" data-testid="dashboard-first-booking">
                  Book Your First Clean
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Upcoming Bookings */}
              {upcomingBookings.length > 0 && (
                <section className="mb-10">
                  <h2 className="font-heading text-xl font-semibold text-green-900 mb-4">
                    Upcoming Bookings
                  </h2>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="bg-white rounded-2xl border border-stone-200 p-6 hover:shadow-md transition-shadow"
                        data-testid={`booking-${booking.id}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-heading text-lg font-semibold text-green-900">
                                {booking.service_name}
                              </h3>
                              <span className={`badge badge-${booking.status}`}>
                                {booking.status.replace('_', ' ')}
                              </span>
                              {booking.payment_status === 'paid' && (
                                <span className="badge badge-paid">Paid</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {booking.scheduled_date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.scheduled_time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {booking.address}, {booking.city}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-heading text-2xl font-bold text-lime-600">
                              ${booking.total_price.toFixed(2)}
                            </p>
                            {booking.status === 'pending' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => cancelBooking(booking.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                data-testid={`cancel-${booking.id}`}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Past Bookings */}
              {pastBookings.length > 0 && (
                <section>
                  <h2 className="font-heading text-xl font-semibold text-green-900 mb-4">
                    Past Bookings
                  </h2>
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <div 
                        key={booking.id} 
                        className="bg-white rounded-2xl border border-stone-200 p-6 opacity-75"
                        data-testid={`past-booking-${booking.id}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              {getStatusIcon(booking.status)}
                              <h3 className="font-heading text-lg font-semibold text-green-900">
                                {booking.service_name}
                              </h3>
                              <span className={`badge badge-${booking.status}`}>
                                {booking.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {booking.scheduled_date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {booking.address}, {booking.city}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-heading text-xl font-bold text-stone-500">
                              ${booking.total_price.toFixed(2)}
                            </p>
                            {booking.status === 'completed' && (
                              <Link to="/booking">
                                <Button variant="outline" size="sm" data-testid={`rebook-${booking.id}`}>
                                  Book Again
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
