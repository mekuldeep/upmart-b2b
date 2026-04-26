import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Check, Package, ArrowLeft, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Minus, Plus
} from 'lucide-react';
import { useProduct } from '@/hooks/useStore';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';
import { getImageUrl } from '@/lib/api';
import NgrokImage from '@/components/NgrokImage';




const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, related, isLoading, error } = useProduct(id ? parseInt(id) : null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [selectedVariant, setSelectedVariant] = useState<{ id: number; name: string; stock: number } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [added, setAdded] = useState(false);

  const availableStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);

  const minQty = product?.min_order_qty || 1;
  const groupSize = product?.is_group_order_enabled && (product?.group_size || 0) > 0 ? product?.group_size! : 1;
  const effectiveMin = product?.is_group_order_enabled && groupSize > 1
    ? Math.max(Math.ceil(minQty / groupSize) * groupSize, groupSize)
    : minQty;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      setQuantity(effectiveMin);
    }
  }, [product?.id]); // Removed effectiveMin from dep array so it only sets once when product loads

  const increaseQty = () => {
    if (!product) return;
    setQuantity(prev => {
      const step = product.is_group_order_enabled && groupSize > 1 ? groupSize : 1;
      let nextVal = prev;
      
      // If the current value is not a clean multiple of groupSize, snap it to nearest higher multiple
      if (step > 1 && prev % step !== 0) {
        nextVal = Math.ceil(prev / step) * step;
      } else {
        nextVal += step;
      }
      
      return Math.min(nextVal, availableStock);
    });
    setQuantityError(null);
  };

  const decreaseQty = () => {
    if (!product) return;
    setQuantity(prev => {
      const step = product.is_group_order_enabled && groupSize > 1 ? groupSize : 1;
      let nextVal = prev;
      
      // Snap to nearest lower multiple if not aligned
      if (step > 1 && prev % step !== 0) {
        nextVal = Math.floor(prev / step) * step;
      } else {
        nextVal -= step;
      }
      
      return Math.max(effectiveMin, nextVal);
    });
    setQuantityError(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
        <p className="text-muted-foreground font-body mb-6">{error || 'This product could not be found.'}</p>
        <button onClick={() => navigate(-1)} className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-display font-semibold hover:opacity-90 transition-opacity">
          Go Back
        </button>
      </div>
    );
  }

  // Build image list: combine product-level + variant images
  const allVariantImages = product.variants.flatMap(v => v.images || []);
  
  // If a variant is selected, we might want to prioritize its images
  const currentVariantImages = selectedVariant
    ? (product.variants.find(v => v.id === selectedVariant.id)?.images || [])
    : [];

  let displayImages = [];
  if (selectedVariant && currentVariantImages.length > 0) {
    // Show selected variant images first, then others
    const otherImages = [
      ...product.images,
      ...allVariantImages.filter(img => !currentVariantImages.some(cv => cv.id === img.id))
    ];
    displayImages = [...currentVariantImages, ...otherImages];
  } else {
    // Show product images first, then all variant images
    displayImages = [...product.images, ...allVariantImages];
  }

  // Final fallback if absolutely nothing found
  if (displayImages.length === 0 && product.primary_image) {
    displayImages = [product.primary_image];
  }

  const activeImage = displayImages[activeImageIdx] || null;

  const handleAddToCart = () => {
    if (availableStock <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    if (quantity < minQty) {
      toast.error(`Minimum order quantity is ${minQty}`);
      return;
    }
    if (product.is_group_order_enabled && groupSize > 1 && quantity % groupSize !== 0) {
      toast.error(`Quantity must be in multiples of ${groupSize}`);
      return;
    }
    if (quantityError) {
      toast.error(quantityError);
      return;
    }
    addToCart(product, quantity, selectedVariant);
    setAdded(true);
    toast.success('Added to cart!');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-6 flex-wrap">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
        {product.category_name && (
          <>
            <span>/</span>
            <Link to={`/category/${product.category_slug}`} className="hover:text-foreground transition-colors">
              {product.category_name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          {/* Main image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary mb-3">
            {activeImage ? (
              <NgrokImage
                src={getImageUrl(activeImage.url) || ''}
                alt={product.name}
                crossOrigin="anonymous"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-muted-foreground/30" />
              </div>
            )}
            {availableStock <= 0 && (
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-display font-bold">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Nav arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIdx(i => i > 0 ? i - 1 : displayImages.length - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIdx(i => i < displayImages.length - 1 ? i + 1 : 0)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {displayImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImageIdx === i ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}
                >
                  <NgrokImage 
                    src={getImageUrl(img.url) || ''} 
                    alt="" 
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.category_name && (
            <Link
              to={`/category/${product.category_slug}`}
              className="text-xs text-primary uppercase font-display font-bold tracking-widest hover:opacity-80"
            >
              {product.category_name}
            </Link>
          )}
          <h1 className="font-display text-3xl font-extrabold text-foreground mt-2 mb-3">{product.name}</h1>
          <p className="text-xs text-muted-foreground font-body mb-4">SKU: {product.sku}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-4xl font-extrabold text-primary">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="text-sm text-muted-foreground font-body">per unit</span>
          </div>

          {/* Stock status */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-display font-semibold mb-6 ${availableStock > 0 ? 'bg-green-100 text-green-700' : 'bg-destructive/10 text-destructive'}`}>
            <div className={`w-2 h-2 rounded-full ${availableStock > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
            {availableStock > 0 ? `In Stock (${availableStock} units)` : 'Out of Stock'}
          </div>

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mb-6">
              <p className="font-display text-sm font-semibold text-foreground mb-2">Select Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(selectedVariant?.id === v.id ? null : { id: v.id, name: v.name, stock: v.stock });
                      setActiveImageIdx(0);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm font-display font-semibold transition-all ${selectedVariant?.id === v.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground hover:border-primary'}`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="font-display text-sm font-semibold text-foreground mb-2">Available Sizes</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <span
                    key={size}
                    className="px-4 py-2 rounded-lg border border-border bg-secondary/30 text-foreground text-sm font-display font-semibold"
                  >
                    {size}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 font-body">* For informational purposes only</p>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="font-display text-sm font-semibold text-foreground mb-2">
              Quantity
              {product.min_order_qty > 1 && (
                <span className="text-xs text-muted-foreground font-body ml-2">(Min. {product.min_order_qty})</span>
              )}
              {product.is_group_order_enabled && product.group_size && (
                <span className="text-xs text-muted-foreground font-body ml-2">(Multiples of {product.group_size})</span>
              )}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={decreaseQty}
                className="w-10 h-10 rounded-lg bg-secondary text-foreground flex items-center justify-center hover:bg-border transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={e => {
                  const val = e.target.value;
                  if (val === '') {
                    setQuantity(0);
                    setQuantityError(`Quantity is required`);
                    return;
                  }
                  const v = parseInt(val);
                  setQuantity(v);

                  if (isNaN(v) || v < 1) {
                    setQuantityError('Please enter a valid quantity');
                  } else if (v < minQty) {
                    setQuantityError(`Minimum order quantity is ${minQty}`);
                  } else if (v > availableStock) {
                    setQuantityError(`Only ${availableStock} units available in stock`);
                  } else if (product.is_group_order_enabled && groupSize > 1 && v % groupSize !== 0) {
                    setQuantityError(`Must be in multiples of ${groupSize}`);
                  } else {
                    setQuantityError(null);
                  }
                }}
                min={effectiveMin}
                className={`w-20 text-center font-display font-bold text-foreground text-lg bg-secondary rounded-lg h-10 focus:outline-none focus:ring-2 ${quantityError ? 'ring-destructive ring-2' : 'focus:ring-primary'}`}
              />
              <button
                onClick={increaseQty}
                className="w-10 h-10 rounded-lg bg-secondary text-foreground flex items-center justify-center hover:bg-border transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
              <span className="text-sm text-muted-foreground font-body">
                = ₹{((product.price || 0) * (quantity || 0)).toLocaleString('en-IN')}
              </span>
            </div>
            {quantityError && (
              <p className="text-destructive text-xs mt-1 font-body flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {quantityError}
              </p>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={availableStock <= 0}
            className={`w-full py-4 rounded-xl font-display font-bold text-lg flex items-center justify-center gap-3 transition-all ${added
                ? 'bg-green-500 text-white'
                : availableStock <= 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:opacity-90 hover:shadow-lg'
              }`}
          >
            {added ? (
              <><Check className="w-5 h-5" /> Added to Cart!</>
            ) : (
              <><ShoppingCart className="w-5 h-5" /> {availableStock > 0 ? 'Add to Cart' : 'Out of Stock'}</>
            )}
          </button>

          {/* Description */}
          {product.description && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="font-display font-semibold text-foreground mb-3">Product Description</h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Details table */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-display font-semibold text-foreground mb-3">Product Details</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: 'SKU', value: product.sku },
                { label: 'Category', value: product.category_name || '—' },
                { label: 'Base Stock', value: `${product.stock} units` },
                { label: 'Min Order Qty', value: product.min_order_qty },
                ...(product.is_group_order_enabled ? [{ label: 'Group Size', value: product.group_size }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4">
                  <span className="font-display font-semibold text-foreground w-32 flex-shrink-0">{label}</span>
                  <span className="text-muted-foreground font-body">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="border-t border-border pt-12">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
