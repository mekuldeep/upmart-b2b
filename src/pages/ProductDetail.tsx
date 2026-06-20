import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, Check, Package, ArrowLeft, ChevronLeft, ChevronRight,
  Loader2, AlertCircle, Minus, Plus, X, ZoomIn, ZoomOut
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

  const [selectedVariant, setSelectedVariant] = useState<{ id: number; name: string; stock: number; price?: number } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [added, setAdded] = useState(false);

  const availableStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);
  const currentPrice = selectedVariant?.price !== undefined && selectedVariant?.price !== null ? selectedVariant.price : (product?.price || 0);

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
      document.title = `${product.name} - Upmart`;
      
      const imageUrl = product.primary_image?.url ? getImageUrl(product.primary_image.url) : '';
      
      const updateMeta = (property: string, content: string) => {
        let element = document.querySelector(`meta[property="${property}"]`) || 
                      document.querySelector(`meta[name="${property}"]`);
        if (!element) {
          element = document.createElement('meta');
          if (property.startsWith('og:')) {
            element.setAttribute('property', property);
          } else {
            element.setAttribute('name', property);
          }
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      updateMeta('og:title', `${product.name} - Upmart`);
      updateMeta('og:description', product.description || `Buy ${product.name} in bulk on Upmart.`);
      if (imageUrl) {
        updateMeta('og:image', imageUrl);
        updateMeta('twitter:image', imageUrl);
      }
      updateMeta('og:url', window.location.href);
    }
    
    return () => {
      document.title = 'Upmart - B2B Wholesale Store';
      const defaultDesc = 'Buy products in bulk and enjoy wholesale pricing with Upmart.';
      
      const resetMeta = (property: string, content: string) => {
        const element = document.querySelector(`meta[property="${property}"]`) || 
                        document.querySelector(`meta[name="${property}"]`);
        if (element) {
          element.setAttribute('content', content);
        }
      };
      
      resetMeta('og:title', 'Upmart - B2B Wholesale Store');
      resetMeta('og:description', defaultDesc);
      resetMeta('og:image', '/favicon.png');
      resetMeta('twitter:image', '/favicon.png');
    };
  }, [product]);

  useEffect(() => {
    if (product) {
      setQuantity(effectiveMin);
      // Automatically select the first variant if available
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        setSelectedVariant({ 
          id: firstVariant.id, 
          name: firstVariant.name, 
          stock: firstVariant.stock,
          price: firstVariant.price
        });
      }
    }
  }, [product?.id]); // Removed effectiveMin from dep array so it only sets once when product loads

  useEffect(() => {
    setImageZoom(1);
  }, [activeImageIdx, imageViewerOpen]);

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

  // Image logic: show images based on the selected variant only.
  let displayImages = [];
  
  if (selectedVariant) {
    const currentVariant = product.variants.find(v => v.id === selectedVariant.id);
    if (currentVariant && currentVariant.images && currentVariant.images.length > 0) {
      displayImages = currentVariant.images;
    }
  } else {
    displayImages = product.images || [];
  }
  
  // Final fallback to primary image if no images found
  if (displayImages.length === 0 && product.primary_image) {
    displayImages = [product.primary_image];
  }

  const activeImage = displayImages[activeImageIdx] || null;
  const showPreviousImage = () => setActiveImageIdx(i => i > 0 ? i - 1 : displayImages.length - 1);
  const showNextImage = () => setActiveImageIdx(i => i < displayImages.length - 1 ? i + 1 : 0);

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
    <div className="container mx-auto px-4 pt-3 pb-8">
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

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] gap-10 mb-16">
        {/* Images */}
        <div className="w-full max-w-[640px] mx-auto lg:mx-0">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="order-2 sm:order-1 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[540px] pb-2 sm:pb-0 sm:pr-1">
                {displayImages.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIdx(i)}
                    className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all bg-white ${activeImageIdx === i ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <NgrokImage
                      src={getImageUrl(img.url) || ''}
                      alt=""
                      crossOrigin="anonymous"
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main image wrapper */}
            <div className="order-1 sm:order-2 relative flex-1">
              <button
                type="button"
                onClick={() => activeImage && setImageViewerOpen(true)}
                className="relative w-full aspect-square min-h-[320px] sm:min-h-[460px] rounded-2xl overflow-hidden bg-white border border-border flex items-center justify-center cursor-zoom-in"
                aria-label="Open product image viewer"
              >
                {activeImage ? (
                  <NgrokImage
                    src={getImageUrl(activeImage.url) || ''}
                    alt={product.name}
                    crossOrigin="anonymous"
                    className="w-full h-full object-contain p-4 sm:p-8"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-secondary text-muted-foreground">
                    <Package className="w-20 h-20 text-muted-foreground/30 mb-3" />
                    <span className="text-sm">No image for this variant</span>
                  </div>
                )}
                {availableStock <= 0 && (
                  <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                    <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-display font-bold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </button>

              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={showPreviousImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-secondary transition-colors shadow-soft z-10"
                    aria-label="Previous product image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={showNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-secondary transition-colors shadow-soft z-10"
                    aria-label="Next product image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
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
              ₹{currentPrice.toLocaleString('en-IN')}
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
                      setSelectedVariant({ 
                        id: v.id, 
                        name: v.name, 
                        stock: v.stock,
                        price: v.price
                      });
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
                = ₹{(currentPrice * (quantity || 0)).toLocaleString('en-IN')}
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
                { label: 'Stock', value: `${availableStock} units` },
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

      {imageViewerOpen && activeImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="font-display font-semibold truncate">{product.name}</p>
              {selectedVariant && (
                <p className="text-xs text-white/70 truncate">{selectedVariant.name}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setImageZoom((zoom) => Math.max(1, Number((zoom - 0.25).toFixed(2))))}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setImageZoom(1)}
                className="h-9 px-3 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold tabular-nums"
              >
                {Math.round(imageZoom * 100)}%
              </button>
              <button
                onClick={() => setImageZoom((zoom) => Math.min(3, Number((zoom + 0.25).toFixed(2))))}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setImageViewerOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                aria-label="Close image viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-0 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center overflow-auto p-4 sm:p-8">
              <NgrokImage
                src={getImageUrl(activeImage.url) || ''}
                alt={product.name}
                crossOrigin="anonymous"
                className="max-w-full max-h-full object-contain transition-transform duration-150"
                style={{ transform: `scale(${imageZoom})` }}
              />
            </div>

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={showPreviousImage}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                  aria-label="Previous product image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={showNextImage}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                  aria-label="Next product image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {displayImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto px-4 py-3 border-t border-white/10">
              {displayImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIdx(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 bg-white ${activeImageIdx === i ? 'border-primary' : 'border-white/30 hover:border-white'}`}
                  aria-label={`Show image ${i + 1}`}
                >
                  <NgrokImage
                    src={getImageUrl(img.url) || ''}
                    alt=""
                    crossOrigin="anonymous"
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
