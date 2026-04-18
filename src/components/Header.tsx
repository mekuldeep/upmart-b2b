import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/hooks/useStore';
import { toast } from 'sonner';
import logo from '@/assets/upmart-logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { categories } = useCategories();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Upmart" className="h-10 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`font-display text-sm font-semibold px-3 py-2 rounded-lg transition-all ${isActive('/') ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-secondary'}`}
            >
              Home
            </Link>

            {categories.slice(0, 5).map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`font-display text-sm font-semibold px-3 py-2 rounded-lg transition-all ${location.pathname === `/category/${cat.slug}` ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-secondary'}`}
              >
                {cat.name}
              </Link>
            ))}

            <Link
              to="/products"
              className={`font-display text-sm font-semibold px-3 py-2 rounded-lg transition-all ${isActive('/products') ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-secondary'}`}
            >
              All Products
            </Link>

            <Link
              to="/about"
              className={`font-display text-sm font-semibold px-3 py-2 rounded-lg transition-all ${isActive('/about') ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-secondary'}`}
            >
              About
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              id="header-search-btn"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {searchOpen ? <X className="w-5 h-5 text-foreground" /> : <Search className="w-5 h-5 text-foreground" />}
            </button>

            {/* User menu */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                id="header-user-btn"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-soft">
                  {user ? (
                    <span className="font-display font-bold text-sm text-primary-foreground">
                      {(user.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                {user && (
                  <span className="font-display text-sm font-semibold text-foreground max-w-24 truncate hidden lg:block">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-card rounded-xl shadow-card border border-border min-w-44 py-2 animate-fade-in z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-border">
                        <p className="font-display font-semibold text-sm text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground font-body truncate">{user.email}</p>
                      </div>
                      <Link to="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-body text-foreground hover:bg-secondary transition-colors">
                        <User className="w-4 h-4" /> My Profile
                      </Link>
                      <Link to="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-body text-foreground hover:bg-secondary transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <div className="border-t border-border mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-body text-destructive hover:bg-destructive/10 transition-colors">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm font-display font-semibold text-foreground hover:bg-secondary hover:text-primary transition-colors">
                        Sign In
                      </Link>
                      <Link to="/signup" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm font-display font-semibold text-foreground hover:bg-secondary hover:text-primary transition-colors">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile: user icon */}
            <button
              onClick={() => navigate(user ? '/account' : '/login')}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <User className="w-5 h-5 text-foreground" />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate('/cart')}
              id="header-cart-btn"
              className="p-2 rounded-lg hover:bg-secondary transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-bold animate-bounce-once">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar (expanded) */}
        {searchOpen && (
          <div className="pb-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, categories, SKUs..."
                autoFocus
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-body"
              />
            </form>
          </div>
        )}
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border animate-fade-in">
          <nav className="flex flex-col p-4 gap-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="font-display text-sm font-semibold py-3 px-4 rounded-lg hover:bg-secondary text-foreground transition-colors">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="font-display text-sm font-semibold py-3 px-4 rounded-lg hover:bg-secondary text-foreground transition-colors">
              All Products
            </Link>
            {categories.slice(0, 6).map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="font-body text-sm py-2.5 px-4 ml-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/about" onClick={() => setMobileOpen(false)} className="font-display text-sm font-semibold py-3 px-4 rounded-lg hover:bg-secondary text-foreground transition-colors">
              About Us
            </Link>
            <div className="border-t border-border pt-2 mt-2">
              {user ? (
                <>
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="font-display text-sm font-semibold py-3 px-4 rounded-lg hover:bg-secondary text-foreground transition-colors flex items-center gap-2">
                    <User className="w-4 h-4" /> My Account
                  </Link>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full font-display text-sm font-semibold py-3 px-4 rounded-lg hover:bg-destructive/10 text-destructive transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block font-display text-sm font-semibold py-3 px-4 rounded-lg hover:bg-secondary text-foreground transition-colors">
                    Sign In
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="block font-body text-sm py-2.5 px-4 ml-2 rounded-lg hover:bg-secondary text-foreground transition-colors">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
