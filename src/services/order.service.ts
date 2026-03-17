import { supabase } from '../config/supabase';

export class OrderService {
  static async createOrder(userId: string | number, orderData: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        ...orderData,
        user_id: userId,
        status: 'pendente'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getUserOrders(userId: string | number) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  static async getOrderById(id: string | number) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateOrderStatus(id: string | number, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}
