import { supabase } from '../config/supabase';
import { GalleryItem } from '../types';

export class GalleryService {
  static async getGalleryItems(): Promise<GalleryItem[]> {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery:', error);
      return [];
    }

    return data || [];
  }

  static async createGalleryItem(item: Omit<GalleryItem, 'id'>) {
    const { data, error } = await supabase
      .from('gallery')
      .insert([item])
      .select();

    if (error) throw error;
    return data[0];
  }

  static async updateGalleryItem(id: string | number, item: Partial<GalleryItem>) {
    const { error } = await supabase
      .from('gallery')
      .update(item)
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteGalleryItem(id: string | number) {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
