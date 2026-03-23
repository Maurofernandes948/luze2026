export interface Product {
  id: string | number;
  name: string;
  category: 'tenis' | 'roupas' | 'acessorios';
  price: number;
  image: string;
  badge?: string;
  description?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface GalleryItem {
  id: string | number;
  image: string;
  title: string;
  tall?: boolean;
  wide?: boolean;
}

export interface Testimonial {
  id: string | number;
  customer_name: string;
  product_name?: string;
  media_url: string;
  media_type: 'image' | 'video';
  comment?: string;
  created_at?: string;
}
