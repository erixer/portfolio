import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

// Initialize Supabase client if configured
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all CMS sections from table `portfolio_content`
 * Returns an object map: { [key]: value } or null if unavailable
 */
export async function fetchPortfolioFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('portfolio_content')
      .select('key, value');

    if (error) {
      console.warn('[Supabase] Error fetching portfolio_content:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return {};
    }

    const result = {};
    data.forEach((row) => {
      result[row.key] = row.value;
    });
    return result;
  } catch (err) {
    console.warn('[Supabase] Exception fetching data:', err.message);
    return null;
  }
}

/**
 * Upsert a specific CMS section key into `portfolio_content`
 */
export async function saveSectionToSupabase(key, value) {
  if (!supabase) return { success: false, reason: 'not_configured' };
  try {
    const { error } = await supabase
      .from('portfolio_content')
      .upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'key' }
      );

    if (error) {
      console.error(`[Supabase] Error saving section "${key}":`, error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error(`[Supabase] Exception saving section "${key}":`, err.message);
    return { success: false, error: err.message };
  }
}
