import { createClient } from '@supabase/supabase-js';

// ⚠️ POR ENQUANTO vamos deixar falhar forte se não tiver as variáveis.
// Isso ajuda a não ficar debugando "Failed to fetch" sem saber de onde vem.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL não definida (frontend).');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não definida (frontend).');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
