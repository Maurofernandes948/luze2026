import { supabase } from '../config/supabase';

export class OrderService {
  static async createOrder(userId: string | number, orderData: any) {
    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new Error('O pedido deve conter pelo menos um item.');
    }

    if (typeof orderData.total !== 'number' || orderData.total <= 0) {
      throw new Error('Total do pedido inválido.');
    }

    const { data, error } = await supabase
      .from('pedidos')
      .insert([{
        user_id: userId,
        total: orderData.total,
        items: orderData.items,
        status: 'pendente'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAllOrders() {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, users(email)');

    if (error) throw error;
    
    return data.map(o => ({
      ...o,
      email: (o.users as any)?.email
    }));
  }

  static async getUserOrders(userId: string | number) {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  static async getOrderById(id: string | number) {
    const { data, error } = await supabase
      .from('pedidos')
      .select('*, users(email)')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return {
      ...data,
      email: (data.users as any)?.email
    };
  }
}
