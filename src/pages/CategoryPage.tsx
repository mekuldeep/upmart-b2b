import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getProductsByCategory, products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const categoryMeta: Record<string, { title: string; desc: string }> = {
  men: { title: "Men's Footwear", desc: 'Formal, Casual, Sports & Sandals' },
  women: { title: "Women's Footwear", desc: 'Heels, Flats & Sports Shoes' },
  kids: { title: "Kids' Footwear", desc: 'School, Sports & Party Shoes' },
  accessories: { title: 'Accessories', desc: 'Shoe Care, Socks & Insoles' },
};

const brands = ['All', 'Rimco', 'Kodson', 'Supremelite', 'Paris', 'Decent', 'StonX', 'Aishwarya', 'Top-Gear', 'AXL'];

const CategoryPage = () => {
  const location = useLocation();
  const category = location.pathname.replace('/', '');
  const [brandFilter, setBrandFilter] = useState('All');
  const [sortBy, setSortBy] = useState('default');

  const meta = categoryMeta[category || ''] || { title: 'Products', desc: '' };
  const categoryProducts = useMemo(() => {
    let filtered = category ? getProductsByCategory(category) : products;
    if (brandFilter !== 'All') filtered = filtered.filter(p => p.brand === brandFilter);
    if (sortBy === 'price-low') filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') filtered = [...filtered].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [category, brandFilter, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">{meta.title}</h1>
        <p className="text-muted-foreground font-body mt-1">{meta.desc}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {brands.map(b => (
            <button
              key={b}
              onClick={() => setBrandFilter(b)}
              className={`px-3 py-1.5 rounded-full text-xs font-display font-semibold transition-colors ${brandFilter === b ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-primary/10'}`}
            >
              {b}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="ml-auto px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="default">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {categoryProducts.length === 0 ? (
        <p className="text-center text-muted-foreground py-16 font-body">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
