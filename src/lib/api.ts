/**
 * Centralized API client for the Upmart storefront frontend.
 * All calls go to the FastAPI backend at http://localhost:5000.
 */

const BASE_URL = (import.meta.env.VITE_API_URL || 'https://00d0-2401-4900-a97b-7d77-2c54-8132-9ba2-5b59.ngrok-free.app').replace(/\/api$/, '');

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Required to bypass ngrok's browser warning page which strips CORS headers
    'ngrok-skip-browser-warning': 'true',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (auth) {
    const token = localStorage.getItem('upmart_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Request failed (${response.status})`;
    try {
      const errData = await response.json();
      errorMsg = errData.detail || errData.message || errorMsg;
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMsg);
  }

  // Handle empty responses (e.g., 204 No Content)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  return {} as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  is_admin: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string; company?: string }) =>
    request<AuthResponse>('/api/store/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/api/store/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () =>
    request<{ user: AuthUser }>('/api/store/me', { auth: true }),

  updateProfile: (data: Partial<AuthUser>) =>
    request<{ msg: string; user: AuthUser }>('/api/store/me', {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(data),
    }),

  changePassword: (current_password: string, new_password: string) =>
    request('/api/store/me/change-password', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ current_password, new_password }),
    }),
};

// ─── Categories ───────────────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  product_count: number;
}

export const categoriesApi = {
  list: () => request<{ categories: Category[] }>('/api/store/categories'),
};

// ─── Products ─────────────────────────────────────────────────────────────────

export interface ProductImage {
  id: number;
  url: string;
  is_primary: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  images: ProductImage[];
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  stock: number;
  in_stock: boolean;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  min_order_qty: number;
  is_group_order_enabled: boolean;
  group_size?: number;
  variants: ProductVariant[];
  images: ProductImage[];
  primary_image?: ProductImage;
  created_at: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export const productsApi = {
  list: (params: {
    page?: number;
    per_page?: number;
    search?: string;
    category_id?: number;
    category_slug?: string;
    sort?: string;
    min_price?: number;
    max_price?: number;
  } = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && v !== null) qs.set(k, String(v));
    });
    return request<ProductListResponse>(`/api/store/products?${qs.toString()}`);
  },

  get: (id: number) =>
    request<{ product: Product; related: Product[] }>(`/api/store/products/${id}`),
};

// ─── Coupons ──────────────────────────────────────────────────────────────────

export interface CouponValidation {
  valid: boolean;
  coupon: {
    id: number;
    code: string;
    discount_type: string;
    discount_value: number;
    description?: string;
  };
  discount_amount: number;
  final_total: number;
}

export const couponsApi = {
  validate: (code: string, cart_total: number) =>
    request<CouponValidation>('/api/store/validate-coupon', {
      method: 'POST',
      body: JSON.stringify({ code, cart_total }),
    }),
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  total: number;
  item_count: number;
  created_at: string;
  items: OrderItem[];
  payments?: { id: number; amount: number; payment_method: string; status: string; created_at: string }[];
  history?: { id: number; status: string; notes?: string; created_at: string }[];
}

export interface PlaceOrderRequest {
  items: { product_id: number; quantity: number; variant_name?: string }[];
  coupon_code?: string;
  notes?: string;
  payment_method: string;
  shipping_address?: string;
}

export interface PlaceOrderResponse {
  msg: string;
  order: {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    discount: number;
    total: number;
    payment_method: string;
    created_at: string;
  };
}

export const ordersApi = {
  place: (data: PlaceOrderRequest) =>
    request<PlaceOrderResponse>('/api/store/orders', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data),
    }),

  list: (page = 1) =>
    request<{ orders: Order[]; total: number; page: number; pages: number }>(
      `/api/store/orders?page=${page}`,
      { auth: true }
    ),

  get: (id: number) =>
    request<{ order: Order }>(`/api/store/orders/${id}`, { auth: true }),
};

export default { authApi, categoriesApi, productsApi, couponsApi, ordersApi };
