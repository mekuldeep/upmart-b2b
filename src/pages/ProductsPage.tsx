import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { SlidersHorizontal, Search, ChevronDown, Loader2, X, Grid3X3, List } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useStore';
import { productsApi, Product, getImageUrl } from '@/lib/api';

import ProductCard from '@/components/ProductCard';
import NgrokImage from '@/components/NgrokImage';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A–Z' },
];

const ProductsPage = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const { categories } = useCategories();
  const activeCategory = slug ? categories.find(c => c.slug === slug) : null;

  const { data, isLoading, error } = useProducts({
    page,
    per_page: 20,
    search: search || undefined,
    category_slug: slug,
    sort,
    min_price: minPrice ? parseFloat(minPrice) : undefined,
    max_price: maxPrice ? parseFloat(maxPrice) : undefined,
  });

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, slug, sort, minPrice, maxPrice]);

  const products = data?.products || [];
  const totalPages = data?.pages || 1;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {activeCategory ? activeCategory.name : 'All Products'}
        </h1>
        {activeCategory?.description && (
          <p className="text-muted-foreground font-body mt-1 text-sm">{activeCategory.description}</p>
        )}
        {data && (
          <p className="text-muted-foreground font-body mt-1 text-sm">
            {data.total} product{data.total !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="bg-card rounded-xl p-5 shadow-soft sticky top-24 space-y-6">
            <div>
              <h3 className="font-display font-semibold text-foreground mb-3">Categories</h3>
              <div className="space-y-1">
                <Link
                  to="/products"
                  className={`block text-sm font-body px-3 py-2 rounded-lg transition-colors ${!slug ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-secondary'}`}
                >
                  All Products
                </Link>
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={`flex items-center justify-between text-sm font-body px-3 py-2 rounded-lg transition-colors ${slug === cat.slug ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground hover:bg-secondary'}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{cat.product_count}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display font-semibold text-foreground mb-3">Price Range</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => { setMinPrice(''); setMaxPrice(''); }}
                  className="text-xs text-muted-foreground hover:text-foreground mt-2 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear price filter
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <form onSubmit={handleSearchSubmit} className="flex-1 min-w-48">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>

            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-card border border-border text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-3 py-2.5 rounded-lg bg-card border border-border text-foreground font-body text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Products */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-destructive font-body">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl">
              <p className="text-muted-foreground font-body">No products found.</p>
              <p className="text-sm text-muted-foreground font-body mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'flex flex-col gap-4'}>
                {products.map(p => (
                  viewMode === 'grid' ? (
                    <ProductCard key={p.id} product={p} />
                  ) : (
                    <ListProductCard key={p.id} product={p} />
                  )
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg bg-card border border-border text-foreground font-body text-sm disabled:opacity-40 hover:bg-secondary transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pNum = i + 1;
                    return (
                      <button
                        key={pNum}
                        onClick={() => setPage(pNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-display font-semibold transition-colors ${page === pNum ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground hover:bg-secondary'}`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="text-muted-foreground">…</span>}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg bg-card border border-border text-foreground font-body text-sm disabled:opacity-40 hover:bg-secondary transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact list view card

const ListProductCard = ({ product }: { product: Product }) => {
  const imageUrl = product.primary_image?.url ? getImageUrl(product.primary_image.url) : null;
  return (
    <Link to={`/product/${product.id}`} className="flex gap-4 bg-card rounded-xl shadow-soft hover:shadow-card transition-all p-4 group">
      <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
        {imageUrl ? (
          <NgrokImage src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground font-body uppercase">{product.category_name}</p>
        <h3 className="font-display font-semibold text-foreground mt-0.5">{product.name}</h3>
        <p className="text-xs text-muted-foreground font-body mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-display font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
          <span className={`text-xs font-body px-2 py-0.5 rounded-full ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-destructive/10 text-destructive'}`}>
            {product.in_stock ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductsPage;
