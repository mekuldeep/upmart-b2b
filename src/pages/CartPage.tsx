import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle, Tag, X, Loader2, MapPin, CreditCard } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { couponsApi, ordersApi, getImageUrl } from '@/lib/api';
import NgrokImage from '@/components/NgrokImage';
import { toast } from 'sonner';

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
  { value: 'upi', label: 'UPI / GPay / PhonePe', icon: '📱' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
  { value: 'cheque', label: 'Cheque', icon: '📄' },
];

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, discountAmount, total, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{ order_number: string; total: number; discount: number } | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await couponsApi.validate(couponInput, subtotal);
      applyCoupon({
        code: res.coupon.code,
        discount_type: res.coupon.discount_type,
        discount_value: res.coupon.discount_value,
        description: res.coupon.description,
        discount_amount: res.discount_amount,
      });
      toast.success(`Coupon applied! You save ₹${res.discount_amount.toLocaleString('en-IN')}`);
      setCouponInput('');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }
    if (!shippingAddress.trim() && !user.address) {
      toast.error('Please enter a shipping address');
      return;
    }
    if (items.length === 0) return;

    setOrderLoading(true);
    try {
      const res = await ordersApi.place({
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          variant_name: item.variant?.name,
        })),
        coupon_code: appliedCoupon?.code,
        payment_method: paymentMethod,
        shipping_address: shippingAddress || undefined,
        notes: notes || undefined,
      });
      setPlacedOrder({
        order_number: res.order.order_number,
        total: res.order.total,
        discount: res.order.discount || 0,
      });
      clearCart();
      toast.success('Order placed successfully!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  // Order placed success screen
  if (placedOrder) {
    return (
      <div className="container mx-auto px-4 py-16 text-center animate-fade-in max-w-md">
        <div className="bg-card rounded-2xl p-10 shadow-card">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Order Placed! 🎉</h1>
          <p className="text-muted-foreground font-body mb-2">
            Thank you for your order. We'll contact you shortly!
          </p>
          <div className="bg-secondary rounded-xl p-4 my-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-body">Order Number</span>
              <span className="font-display font-bold text-foreground">{placedOrder.order_number}</span>
            </div>
            {placedOrder.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-body">Discount Applied</span>
                <span className="font-display font-semibold text-green-600">-₹{placedOrder.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm border-t border-border pt-2 mt-2">
              <span className="font-display font-semibold text-foreground">Total</span>
              <span className="font-display font-bold text-primary">₹{placedOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/account/orders" className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-display font-semibold hover:opacity-90 transition-opacity text-center">
              View Orders
            </Link>
            <Link to="/" className="flex-1 bg-secondary text-foreground py-3 rounded-xl font-display font-semibold hover:bg-border transition-colors text-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-sm mx-auto">
          <ShoppingBag className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
          <p className="text-muted-foreground font-body mb-8">Add products to your cart to place an order.</p>
          <Link to="/products" className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-display font-semibold hover:opacity-90 transition-opacity">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 font-body text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </button>

      <h1 className="font-display text-2xl font-bold mb-8">
        Shopping Cart <span className="text-muted-foreground font-body text-lg">({items.length} item{items.length !== 1 ? 's' : ''})</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const imageUrl = item.product.primary_image?.url ? getImageUrl(item.product.primary_image.url) : null;
            return (
              <div key={`${item.product.id}-${item.variant?.id}`} className="bg-card rounded-xl p-4 shadow-soft flex gap-4">
                <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 flex-shrink-0 bg-secondary rounded-lg overflow-hidden relative">
                    {imageUrl ? (
                      <NgrokImage src={imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                    )}
                  </div>
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground font-body uppercase">{item.product.category_name}</p>
                  <Link to={`/product/${item.product.id}`} className="font-display font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {item.product.name}
                  </Link>
                  {item.variant && (
                    <p className="text-xs text-muted-foreground font-body mt-0.5">Variant: {item.variant.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground font-body">SKU: {item.product.sku}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const step = item.product.is_group_order_enabled && (item.product.group_size || 0) > 1 ? item.product.group_size! : 1;
                          const minQty = item.product.min_order_qty || 1;
                          const effectiveMin = item.product.is_group_order_enabled && step > 1
                            ? Math.ceil(minQty / step) * step
                            : minQty;

                          if (item.quantity <= effectiveMin) {
                            // Already at minimum, maybe do nothing or remove? 
                            // Standard behavior: do nothing, use trash to remove.
                            return;
                          }
                          updateQuantity(item.product.id, item.quantity - step, item.variant?.id);
                        }}
                        className="w-8 h-8 rounded-lg bg-secondary text-foreground font-bold text-sm hover:bg-border transition-colors flex items-center justify-center"
                      >-</button>
                      <span className="font-display font-semibold text-sm w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => {
                          const step = item.product.is_group_order_enabled && (item.product.group_size || 0) > 1 ? item.product.group_size! : 1;
                          updateQuantity(item.product.id, item.quantity + step, item.variant?.id);
                        }}
                        className="w-8 h-8 rounded-lg bg-secondary text-foreground font-bold text-sm hover:bg-border transition-colors flex items-center justify-center"
                      >+</button>
                    </div>
                    <span className="font-display font-bold text-foreground">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id, item.variant?.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="bg-card rounded-xl p-5 shadow-soft">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Coupon Code
            </h3>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <div>
                  <p className="font-display font-bold text-green-700 text-sm">{appliedCoupon.code}</p>
                  <p className="text-xs text-green-600 font-body">-₹{appliedCoupon.discount_amount.toLocaleString('en-IN')} saved</p>
                </div>
                <button onClick={removeCoupon} className="text-green-600 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                  className="flex-1 px-3 py-2 rounded-lg bg-secondary text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                />
                <button
                  onClick={handleApplyCoupon}
                  disabled={couponLoading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-display font-semibold text-sm hover:opacity-90 disabled:opacity-60 transition-all"
                >
                  {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </button>
              </div>
            )}
          </div>

          {/* Shipping Address */}
          <div className="bg-card rounded-xl p-5 shadow-soft">
            <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Shipping Address
            </h3>
            <textarea
              value={shippingAddress}
              onChange={e => setShippingAddress(e.target.value)}
              placeholder="Enter your shipping address (optional, defaults to account address)"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Notes */}
          <div className="bg-card rounded-xl p-5 shadow-soft">
            <h3 className="font-display font-semibold text-foreground mb-3">Order Notes</h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any special instructions? (optional)"
              rows={2}
              className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground resize-none"
            />
          </div>

          {/* Price Summary */}
          <div className="bg-card rounded-xl p-5 shadow-soft">
            <h2 className="font-display font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 font-body text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-display font-bold text-xl text-foreground">
                <span>Total</span>
                <span className="text-primary">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={orderLoading}
              className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-display font-bold mt-6 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60 text-lg"
            >
              {orderLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
              ) : (
                <>Place Order · ₹{total.toLocaleString('en-IN')}</>
              )}
            </button>

            {!user && (
              <p className="text-center text-xs text-muted-foreground font-body mt-3">
                <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link> required to place order
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
