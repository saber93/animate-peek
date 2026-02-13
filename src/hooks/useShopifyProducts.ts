import { useState, useEffect } from 'react';
import { storefrontApiRequest, PRODUCTS_QUERY, ShopifyProduct } from '@/lib/shopify';

export function useShopifyProducts(count: number = 20, query?: string) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: count, query: query || null });
        if (!cancelled && data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; };
  }, [count, query]);

  return { products, isLoading, error };
}
