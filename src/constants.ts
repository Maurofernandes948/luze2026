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

export const GALLERY: GalleryItem[] = [];

export const STORE_NAME = 'Luzes de Charme';
export const STORE_SLOGAN = 'Moda Premium';
export const STORE_DESCRIPTION = 'Tênis exclusivos, roupas sofisticadas e acessórios únicos. Encomende hoje — entrega em Luanda, Angola.';
export const STORE_NOTICE = '✦ Entrega disponível em Luanda, Angola | Pagamento seguro: 50% na encomenda + 50% na entrega ✦';
export const WHATSAPP_NUMBER = '244948987130';
export const WHATSAPP_DISPLAY = '+244 948 987 130';
export const STORE_CITY = 'Luanda, Angola';
export const INSTAGRAM_HANDLE = 'luzneidymanuel1234';
export const EMAIL_ADDRESS = 'luzesdecharme@gmail.com';
