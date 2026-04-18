import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, BadgePercent, Search, ChevronRight, Loader2 } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useStore';
import ProductCard from '@/components/ProductCard';
import { Category } from '@/lib/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CATEGORY_EMOJIS: Record<string, string> = {
  men: '👞',
  women: '👠',
  kids: '👟',
  accessories: '🧦',
  footwear: '👟',
  sports: '⚽',
  formal: '👔',
  casual: '👕',
};

const getCategoryEmoji = (slug: string) => {
  const lower = slug.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '🛍️';
};

const features = [
  { icon: Truck, label: 'Pan India Delivery' },
  { icon: Shield, label: 'Quality Guaranteed' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: BadgePercent, label: 'Wholesale Prices' },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const { categories } = useCategories();

  const { data: featuredData, isLoading: loadingFeatured } = useProducts({ page: 1, per_page: 8, sort: 'newest' });
  const { data: searchData, isLoading: loadingSearch } = useProducts(
    searchQuery ? { search: searchQuery, per_page: 8 } : { page: 1, per_page: 0 }
  );

  const isSearching = !!searchQuery;
  const products = isSearching ? (searchData?.products || []) : (featuredData?.products || []);
  const isLoading = isSearching ? loadingSearch : loadingFeatured;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchInput('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 pointer-events-none" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <p className="text-primary font-display font-bold text-sm uppercase tracking-widest mb-4 animate-fade-in">
              B2B Wholesale Footwear Partner
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Step Into Quality.<br />Walk With Confidence.
            </h1>
            <p className="text-white/70 font-body text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Premium footwear from India's top brands at wholesale prices. Your complete B2B footwear destination.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 font-body focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
                />
              </div>
              <button type="submit" className="bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-display font-semibold hover:opacity-90 transition-opacity shadow-lg">
                Search
              </button>
            </form>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2 mt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {categories.slice(0, 5).map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full font-body transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 justify-center py-2">
                <Icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-display font-semibold text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Search Results ── */}
      {isSearching && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-2xl font-bold">Search Results</h2>
              <p className="text-muted-foreground text-sm font-body mt-1">
                {isLoading ? 'Searching...' : `${searchData?.total || 0} results for "${searchQuery}"`}
              </p>
            </div>
            <button onClick={clearSearch} className="text-sm text-muted-foreground hover:text-foreground font-body flex items-center gap-1 underline">
              Clear search
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-body">No products found for "{searchQuery}"</p>
              <p className="text-sm text-muted-foreground font-body mt-2">Try a different search term or browse categories.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      )}

      {!isSearching && (
        <>
          {/* Categories */}
          <section className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold">Shop By Category</h2>
              <Link to="/products" className="text-primary text-sm font-display font-semibold flex items-center gap-1">
                All Products <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {categories.length === 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl p-6 animate-pulse h-28" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 8).map((cat: Category) => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="bg-card rounded-xl p-6 text-center shadow-soft hover:shadow-card hover:-translate-y-1 transition-all group"
                  >
                    <span className="text-4xl block mb-3">{getCategoryEmoji(cat.slug)}</span>
                    <span className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                    {cat.product_count > 0 && (
                      <p className="text-xs text-muted-foreground font-body mt-1">{cat.product_count} Products</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Featured Products */}
          <section className="container mx-auto px-4 pb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold">Featured Products</h2>
              <Link to="/products" className="text-primary text-sm font-display font-semibold flex items-center gap-1 hover:opacity-80">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loadingFeatured ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl overflow-hidden shadow-soft animate-pulse">
                    <div className="aspect-square bg-secondary" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-secondary rounded w-16" />
                      <div className="h-4 bg-secondary rounded w-full" />
                      <div className="h-5 bg-secondary rounded w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl">
                <p className="text-muted-foreground font-body">No products available yet.</p>
                <p className="text-sm text-muted-foreground font-body mt-2">Check back soon for new arrivals!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Index;
