import { Link } from 'react-router-dom';
import { ShoppingCart, Package } from 'lucide-react';
import { Product, getImageUrl } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const imageUrl = product.primary_image?.url
    ? getImageUrl(product.primary_image.url)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.in_stock) {
      toast.error('This product is out of stock');
      return;
    }

    const minQty = product.min_order_qty || 1;
    const groupSize = product.is_group_order_enabled && (product.group_size || 0) > 0 ? product.group_size! : 1;
    const quantity = product.is_group_order_enabled && groupSize > 1
      ? Math.ceil(minQty / groupSize) * groupSize
      : minQty;

    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 relative flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-secondary overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <Package className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}

        {/* Out of stock badge */}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground text-xs font-display font-bold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Add to cart button */}
        {product.in_stock && (
          <button
            onClick={handleAddToCart}
            id={`add-to-cart-${product.id}`}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-200 shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {product.category_name && (
          <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
            {product.category_name}
          </p>
        )}
        <h3 className="font-display font-semibold text-foreground text-sm leading-snug mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="font-display font-bold text-primary text-base">
            ₹{product.price.toLocaleString('en-IN')}
          </p>
          {product.min_order_qty > 1 && (
            <span className="text-xs text-muted-foreground font-body">
              Min {product.min_order_qty}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
