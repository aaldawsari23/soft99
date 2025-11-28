/**
 * Product Types
 */
export type ProductType = 'bike' | 'part' | 'gear';
export type StockStatus = 'available' | 'unavailable';
export type ProductStatus = 'published' | 'hidden';

export interface Product {
  id: string;
  sku?: string;
  name?: string; // For compatibility - maps to name_ar
  name_ar?: string;
  name_en?: string;
  category_id: string;
  brand_id?: string;
  type: ProductType;
  price: number;
  currency: string;
  is_new?: boolean;
  is_featured?: boolean;
  is_available?: boolean;
  stock_status?: StockStatus;
  stock_quantity?: number;
  status?: ProductStatus;
  specs?: Record<string, string>; // Legacy - use specifications
  specifications?: Record<string, string>;
  description: string;
  short_description?: string;
  images?: string[];
  image_url?: string; // Primary image - compatibility field
  remoteImageUrl?: string; // For future external storage (S3/Supabase)
  salla_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Category Types
 */
export interface Category {
  id: string;
  name_ar: string;
  name_en?: string;
  type: ProductType;
  icon?: string;
  description?: string;
  created_at: string;
}

/**
 * Brand Types
 */
export interface Brand {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  logo_url?: string;
  description?: string;
  created_at: string;
}

/**
 * Filter Types
 */
export interface ProductFilters {
  category?: string;
  brand?: string;
  type?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: StockStatus;
  isNew?: boolean;
  isFeatured?: boolean;
  search?: string;
  status?: ProductStatus; // For admin filtering
}

/**
 * Sort Types
 */
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

/**
 * User Types - للمستقبل
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'admin' | 'customer';
  created_at: string;
  updated_at: string;
}

/**
 * Order Types - للمستقبل
 */
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Cart Types
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
