import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const BookingCancelPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-green-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-stone-600 mb-8">
          Your payment was cancelled. Don't worry, no charges were made to your account.
        </p>
        <div className="flex flex-col gap-3">
          {bookingId && (
            <Link to="/booking">
              <Button className="w-full bg-lime-500 hover:bg-lime-600 text-white rounded-full h-12" data-testid="cancel-retry">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </Link>
          )}
          <Link to="/">
            <Button variant="outline" className="w-full rounded-full h-12" data-testid="cancel-home">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingCancelPage;
