import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Sparkles, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-green-900">
          <img
            src="https://images.unsplash.com/photo-1660993431493-0ffd7635f700?w=1200&h=1600&fit=crop"
            alt="Cleaning supplies"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center text-white">
              <h2 className="font-heading text-4xl font-bold mb-4">
                Join CleanUpCrew Today
              </h2>
              <p className="text-white/80 text-lg max-w-md">
                Create an account to book cleanings, track appointments, and enjoy exclusive member benefits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-10 h-10 rounded-xl bg-green-900 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-lime-400" />
            </div>
            <span className="font-heading font-bold text-xl text-green-900">CleanUpCrew</span>
          </Link>

          <h1 className="font-heading text-3xl font-bold text-green-900 mb-2">
            Create your account
          </h1>
          <p className="text-stone-600 mb-8">
            Get started with your first booking in minutes.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-2">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-10"
                  required
                  data-testid="register-name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                  data-testid="register-email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <div className="relative mt-2">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(415) 555-1234"
                  className="pl-10"
                  data-testid="register-phone"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  data-testid="register-password"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  data-testid="register-confirm-password"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-900 hover:bg-green-800 text-white rounded-full h-12"
              data-testid="register-submit"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="mt-8 text-center text-stone-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-900 font-medium hover:underline" data-testid="register-login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
