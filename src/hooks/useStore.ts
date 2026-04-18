import { useState, useEffect, useCallback } from 'react';
import { productsApi, categoriesApi, Product, Category, ProductListResponse } from '@/lib/api';

// ─── useProducts hook ─────────────────────────────────────────────────────────
interface UseProductsParams {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  category_slug?: string;
  sort?: string;
  min_price?: number;
  max_price?: number;
}

export function useProducts(params: UseProductsParams = {}) {
  const [data, setData] = useState<ProductListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await productsApi.list(params);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(params)]);  // eslint-disable-line

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { data, isLoading, error, refetch: fetchProducts };
}

// ─── useProduct hook ──────────────────────────────────────────────────────────
export function useProduct(id: number | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    productsApi.get(id)
      .then(res => {
        setProduct(res.product);
        setRelated(res.related);
      })
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load product'))
      .finally(() => setIsLoading(false));
  }, [id]);

  return { product, related, isLoading, error };
}

// ─── useCategories hook ───────────────────────────────────────────────────────
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoriesApi.list()
      .then(res => setCategories(res.categories))
      .catch(e => setError(e instanceof Error ? e.message : 'Failed to load categories'))
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading, error };
}
