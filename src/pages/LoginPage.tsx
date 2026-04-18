import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShoppingBag, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';
      navigate(redirect);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gradient-to-br from-background to-secondary/30">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl font-extrabold text-foreground">Upmart</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground font-body">Sign in to your B2B account</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="font-display text-sm font-semibold text-foreground block mb-1.5">
                Business Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="font-display text-sm font-semibold text-foreground">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline font-body">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-display font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg hover:shadow-primary/30"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground font-body">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-display font-semibold hover:underline">
                Create new account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground font-body mt-6">
          By signing in, you agree to our{' '}
          <Link to="/about" className="text-primary hover:underline">Terms of Service</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
