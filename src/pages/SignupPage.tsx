import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const InputField = ({
  id, label, type = 'text', value, onChange, placeholder, required = false, autoComplete
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; required?: boolean; autoComplete?: string;
}) => (
  <div>
    <label htmlFor={id} className="font-display text-sm font-semibold text-foreground block mb-1.5">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all"
    />
  </div>
);

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const passwordStrength = (() => {
    const p = formData.password;
    if (!p) return { score: 0, label: '', color: '' };
    const checks = [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)];
    const score = checks.filter(Boolean).length;
    const map = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' },
    ];
    return { score, ...map[score] };
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
      });
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 bg-gradient-to-br from-background to-secondary/30">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <span className="font-display text-2xl font-extrabold text-foreground">Upmart</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground font-body">Join India's trusted B2B marketplace</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField id="name" label="Full Name" value={formData.name} onChange={update('name')} placeholder="John Doe" required autoComplete="name" />
              <InputField id="company" label="Company" value={formData.company} onChange={update('company')} placeholder="Your Business" autoComplete="organization" />
            </div>
            <InputField id="email" label="Business Email" type="email" value={formData.email} onChange={update('email')} placeholder="you@company.com" required autoComplete="username email" />
            <InputField id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={update('phone')} placeholder="+91 98765 43210" autoComplete="tel" />

            {/* Password */}
            <div>
              <label htmlFor="password" className="font-display text-sm font-semibold text-foreground block mb-1.5">
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={update('password')}
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full ${i <= passwordStrength.score ? passwordStrength.color : 'bg-muted'} transition-all`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-1">{passwordStrength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="font-display text-sm font-semibold text-foreground block mb-1.5">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={update('confirmPassword')}
                  placeholder="Repeat your password"
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground font-body focus:outline-none focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all"
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
            </div>

            <button
              type="submit"
              id="signup-submit-btn"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-display font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg mt-2"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
              ) : 'Create B2B Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground font-body">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-display font-semibold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
