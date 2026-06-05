import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// createClient lève "supabaseUrl is required" si l'URL est vide. On crée donc
// le client uniquement si les variables d'env sont présentes ; sinon `supabase`
// vaut null (mode offline / prerender). Les appelants doivent vérifier `if (supabase)`.
let client = null;
if (supabaseUrl && supabaseAnonKey) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase: initialisation échouée —', e?.message);
  }
} else {
  console.warn('Supabase env vars manquantes — mode offline uniquement');
}

export const supabase = client;
