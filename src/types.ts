export interface Product {
  id: number;
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
  id: number;
  image: string;
  title: string;
  large?: boolean;
  tall?: boolean;
  wide?: boolean;
}
