import { supabase } from '../config/supabase';
import { hashPassword, comparePassword } from '../utils/hash';

export class AuthService {
  static async registerUser(email: string, password: string) {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const password_hash = await hashPassword(password);

    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash, role: 'user' }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async loginUser(email: string, password: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  }

  static async getUserById(id: string | number) {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
}
