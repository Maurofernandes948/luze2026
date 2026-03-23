import { supabase } from '../config/supabase';
import { Testimonial } from '../types';

export class TestimonialService {
  static async getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }

    return data || [];
  }

  static async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([testimonial])
      .select();

    if (error) throw error;
    return data[0];
  }

  static async updateTestimonial(id: string | number, testimonial: Partial<Testimonial>) {
    const { error } = await supabase
      .from('testimonials')
      .update(testimonial)
      .eq('id', id);

    if (error) throw error;
  }

  static async deleteTestimonial(id: string | number) {
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
