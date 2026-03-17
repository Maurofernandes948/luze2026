import { supabase } from '../config/supabase';

export class AuthService {
  static async registerUser(email: string, password: string) {
    const isAdminEmail = email === 'mauro.digitalbox@gmail.com' || email.includes('admin');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: isAdminEmail ? 'admin' : 'user'
        }
      }
    });

    if (error) throw error;
    
    // Background: Also insert into users table
    if (data.user) {
      supabase.from('users').upsert([{
        id: data.user.id,
        email: data.user.email,
        role: data.user.user_metadata.role || 'user'
      }]).then(({ error }) => {
        if (error) console.warn('Background registration profile failed:', error);
      });
    }

    return {
      id: data.user?.id || '',
      email: data.user?.email || '',
      role: (data.user?.user_metadata.role || 'user') as 'admin' | 'user'
    };
  }

  static async loginUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
    const user = data.user;
    const role = user?.email === 'mauro.digitalbox@gmail.com' ? 'admin' : (user?.user_metadata?.role || 'user');

    // Background: Upsert user record to ensure it exists and update last login
    // We don't await this to make the login feel instant for the user
    if (user) {
      supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        role: role,
        last_login: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.warn('Background profile update failed:', error);
      });
    }

    return {
      id: user?.id,
      email: user?.email,
      role
    };
  }

  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }

  static async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    if (error) throw error;
  }

  static async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.user_metadata.role || 'user'
    };
  }
}
