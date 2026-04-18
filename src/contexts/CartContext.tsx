import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/api';

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: { id: number; name: string } | null;
}

export interface AppliedCoupon {
  code: string;
  discount_type: string;
  discount_value: number;
  description?: string;
  discount_amount: number;
}

interface CartContextType {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  addToCart: (product: Product, quantity?: number, variant?: { id: number; name: string } | null) => void;
  removeFromCart: (productId: number, variantId?: number | null) => void;
  updateQuantity: (productId: number, quantity: number, variantId?: number | null) => void;
  clearCart: () => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'upmart_cart';

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  // Persist cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, variant?: { id: number; name: string } | null) => {
    setItems(prev => {
      const existing = prev.find(i =>
        i.product.id === product.id && (i.variant?.id ?? null) === (variant?.id ?? null)
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && (i.variant?.id ?? null) === (variant?.id ?? null)
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity, variant: variant || null }];
    });
  };

  const removeFromCart = (productId: number, variantId?: number | null) => {
    setItems(prev => prev.filter(i =>
      !(i.product.id === productId && (i.variant?.id ?? null) === (variantId ?? null))
    ));
  };

  const updateQuantity = (productId: number, quantity: number, variantId?: number | null) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setItems(prev => prev.map(i =>
      i.product.id === productId && (i.variant?.id ?? null) === (variantId ?? null)
        ? { ...i, quantity }
        : i
    ));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const applyCoupon = (coupon: AppliedCoupon) => setAppliedCoupon(coupon);
  const removeCoupon = () => setAppliedCoupon(null);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discount_type === 'percentage' 
        ? subtotal * (appliedCoupon.discount_value / 100) 
        : Math.min(subtotal, appliedCoupon.discount_value))
    : 0;

  const total = Math.max(0, subtotal - discountAmount);

  return (
    <CartContext.Provider value={{
      items,
      appliedCoupon,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      totalItems,
      subtotal,
      discountAmount,
      total,
    }}>
      {children}
    </CartContext.Provider>
  );
};
