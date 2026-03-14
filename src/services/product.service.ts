import { supabase } from '../config/supabase';

export class ProductService {
  static async getProducts() {
    const { data, error } = await supabase.from('produtos').select('*');
    if (error) throw error;
    
    return data.map(p => ({
      id: p.id,
      name: p.nome,
      price: p.preco,
      category: p.categoria,
      image: p.imagem,
      badge: p.badge,
      description: p.descricao
    }));
  }

  static async getProductById(id: string | number) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.nome,
      price: data.preco,
      category: data.categoria,
      image: data.imagem,
      badge: data.badge,
      description: data.descricao
    };
  }

  static async createProduct(productData: any) {
    if (!productData.name || typeof productData.price !== 'number' || productData.price <= 0) {
      throw new Error('Dados do produto inválidos: nome e preço positivo são obrigatórios.');
    }

    const { data, error } = await supabase
      .from('produtos')
      .insert([{
        nome: String(productData.name).trim(),
        preco: productData.price,
        categoria: String(productData.category || 'outros'),
        imagem: String(productData.image || ''),
        badge: productData.badge ? String(productData.badge) : null,
        descricao: String(productData.description || '')
      }])
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.nome,
      price: data.preco,
      category: data.categoria,
      image: data.imagem,
      badge: data.badge,
      description: data.descricao
    };
  }

  static async updateProduct(id: string | number, productData: any) {
    const { data, error } = await supabase
      .from('produtos')
      .update({
        nome: productData.name,
        preco: productData.price,
        categoria: productData.category,
        imagem: productData.image,
        badge: productData.badge,
        descricao: productData.description
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.nome,
      price: data.preco,
      category: data.categoria,
      image: data.imagem,
      badge: data.badge,
      description: data.descricao
    };
  }

  static async deleteProduct(id: string | number) {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
