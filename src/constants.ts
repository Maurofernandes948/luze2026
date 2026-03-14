import { Stat, GalleryItem } from './types';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('AOA', 'KZ');
};

export const STATS: Stat[] = [
  { value: '500+', label: 'Clientes satisfeitos' },
  { value: '3+', label: 'Anos de experiência' },
  { value: '100%', label: 'Qualidade garantida' }
];

export const GALLERY: GalleryItem[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    title: 'Tênis Exclusivos',
    tall: true
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
    title: 'Moda Feminina'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    title: 'Malas Premium'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    title: 'Coleção Verão'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80',
    title: 'Estilo & Elegância',
    wide: true
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    title: 'Sneakers Top'
  }
];

export const STORE_NAME = 'Luzes de Charme';
export const STORE_SLOGAN = 'Moda Premium';
export const STORE_DESCRIPTION = 'Tênis exclusivos, roupas sofisticadas e acessórios únicos. Encomende hoje — entrega em Luanda, Angola.';
export const STORE_NOTICE = '✦ Entrega disponível em Luanda, Angola | Pagamento seguro: 50% na encomenda + 50% na entrega ✦';
export const WHATSAPP_NUMBER = '244941540638';
export const WHATSAPP_DISPLAY = '+244 941 540 638';
export const STORE_CITY = 'Luanda, Angola';
export const INSTAGRAM_HANDLE = 'luzneidymanuel1234';
export const EMAIL_ADDRESS = 'luzesdecharme@gmail.com';
