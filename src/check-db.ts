import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

async function checkConnection() {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('MISSING_CONFIG');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data: users, error: usersError } = await supabase.from('users').select('count', { count: 'exact', head: true });
    const { data: produtos, error: produtosError } = await supabase.from('produtos').select('count', { count: 'exact', head: true });
    const { data: pedidos, error: pedidosError } = await supabase.from('pedidos').select('count', { count: 'exact', head: true });

    console.log('CHECK_RESULTS:', {
      users: !usersError ? 'OK' : usersError.message,
      produtos: !produtosError ? 'OK' : produtosError.message,
      pedidos: !pedidosError ? 'OK' : pedidosError.message,
    });
  } catch (err: any) {
    console.log('CHECK_ERROR:', err.message);
  }
}

checkConnection();
