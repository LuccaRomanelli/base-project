import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Local Supabase credentials (fixed for local dev)
const SUPABASE_URL = 'http://127.0.0.1:54321';
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY);

export const dbVerify = {
  async userExists(email: string): Promise<boolean> {
    const { data } = await supabase.from('users').select('id').eq('email', email).single();
    return !!data;
  },

  async getUserByEmail(email: string) {
    const { data } = await supabase.from('users').select('*').eq('email', email).single();
    return data;
  },

  async getItemById(id: string) {
    const { data } = await supabase.from('items').select('*').eq('id', id).single();
    return data;
  },

  async getItemsByUser(userId: string) {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return data ?? [];
  },

  async itemExists(id: string): Promise<boolean> {
    const { data } = await supabase.from('items').select('id').eq('id', id).single();
    return !!data;
  },
};
