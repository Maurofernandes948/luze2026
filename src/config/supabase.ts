import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
      throw new Error(
        'SUPABASE_URL is missing or invalid. Please set it in the AI Studio Settings > Secrets menu. ' +
        'It should be a valid URL starting with https://'
      );
    }
    if (!supabaseServiceKey) {
      throw new Error(
        'SUPABASE_SERVICE_KEY is missing. Please set it in the AI Studio Settings > Secrets menu.'
      );
    }
    supabaseInstance = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseInstance;
};

// For backward compatibility if needed, but we should migrate to getSupabase()
// However, to fix the immediate error without changing every file yet, 
// we can use a Proxy or just export the instance if keys are present.
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http') && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : new Proxy({} as SupabaseClient, {
      get: () => {
        throw new Error('Supabase client accessed before configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in Settings > Secrets.');
      }
    });
