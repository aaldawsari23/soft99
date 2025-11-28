import { Product, Category, Brand } from '@/types';
import productsData from '@/../public/data/products.json';

// العلامات التجارية
export const brands: Brand[] = [
  { id: "b13", name: "Motul", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b30", name: "Suzuki Ecstar", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b15", name: "Castrol", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b31", name: "Putoline", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b32", name: "Yamalube", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b33", name: "Amsoil", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b14", name: "Liqui Moly", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b34", name: "Hiflofiltro", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b35", name: "K&N", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b36", name: "Suzuki OEM", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b37", name: "Yamaha OEM", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b38", name: "Honda OEM", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b39", name: "Kawasaki OEM", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b40", name: "NGK", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b41", name: "Cobra", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b42", name: "BS Battery", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b43", name: "Bridgestone", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b18", name: "Michelin", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b44", name: "EBC", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b21", name: "RK Chain", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b20", name: "DID Chain", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b45", name: "JT Sprockets", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b46", name: "Mitsubishi", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b47", name: "Brock's", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b48", name: "Akrapovic", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b49", name: "SC Project", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b50", name: "Yoshimura", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b26", name: "Alpinestars", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b51", name: "Scoyco", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b52", name: "Pro-Biker", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b22", name: "AGV", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b53", name: "Generic", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b54", name: "Pirelli", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "b55", name: "Dunlop", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  // Motorcycle brands
  { id: "honda", name: "Honda", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "suzuki", name: "Suzuki", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "yamaha", name: "Yamaha", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "kawasaki", name: "Kawasaki", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "harley-davidson", name: "Harley-Davidson", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
  { id: "bmw", name: "BMW", logo_url: "", created_at: "2025-01-15T00:00:00Z" },
];

// الفئات
export const categories: Category[] = [
  { id: "c1", name_ar: "زيوت", name_en: "Oils", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c2", name_ar: "فلاتر", name_en: "Filters", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c3", name_ar: "إشعال", name_en: "Ignition", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c4", name_ar: "بطاريات", name_en: "Batteries", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c5", name_ar: "إطارات", name_en: "Tires", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c6", name_ar: "فرامل", name_en: "Brakes", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c7", name_ar: "نقل الحركة", name_en: "Drivetrain", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c8", name_ar: "سوائل", name_en: "Fluids", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c9", name_ar: "عناية", name_en: "Care", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c10", name_ar: "محرك", name_en: "Engine", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c11", name_ar: "كهرباء", name_en: "Electrical", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c12", name_ar: "عوادم", name_en: "Exhaust", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c13", name_ar: "إكسسوارات", name_en: "Accessories", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c14", name_ar: "قطع متفرقة", name_en: "Misc Parts", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "c15", name_ar: "ملابس", name_en: "Gear", type: "gear", created_at: "2025-01-15T00:00:00Z" },
  { id: "c16", name_ar: "عدد", name_en: "Tools", type: "part", created_at: "2025-01-15T00:00:00Z" },
  { id: "motorcycles", name_ar: "دراجات نارية", name_en: "Motorcycles", type: "bike", created_at: "2025-01-15T00:00:00Z" },
];

// المنتجات - من ملف JSON
export const products: Product[] = productsData as unknown as Product[];
