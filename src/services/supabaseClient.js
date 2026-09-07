/**
 * FactoryPulse V1 - Supabase Client Module
 * 
 * Provides a dedicated singleton client instance initialized via the
 * @supabase/supabase-js v2 CDN library.
 */
import { SUPABASE_CONFIG, isSupabaseConfigured } from '../config/supabase.js';

let clientInstance = null;

/**
 * Resets the client singleton (useful for testing or reconfiguration).
 */
export function resetSupabaseClient() {
  clientInstance = null;
}

/**
 * Returns the Supabase client instance or null if unconfigured/unavailable.
 */
export function getSupabaseClient() {
  if (clientInstance) {
    return clientInstance;
  }

  if (!isSupabaseConfigured()) {
    console.info(
      '%c[FactoryPulse Supabase]%c Configuration placeholders detected in src/config/supabase.js. Please provide actual SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY to connect to your database.',
      'color: #2563eb; font-weight: bold;',
      'color: inherit;'
    );
    return null;
  }

  // Verify @supabase/supabase-js library presence on window
  const supabaseGlobal = window.supabase;
  if (!supabaseGlobal || typeof supabaseGlobal.createClient !== 'function') {
    console.error(
      '[FactoryPulse Supabase] @supabase/supabase-js v2 CDN script is not loaded or window.supabase is undefined.'
    );
    return null;
  }

  try {
    clientInstance = supabaseGlobal.createClient(
      SUPABASE_CONFIG.SUPABASE_URL,
      SUPABASE_CONFIG.SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
      }
    );
    return clientInstance;
  } catch (error) {
    console.error('[FactoryPulse Supabase] Initialization error:', error);
    return null;
  }
}
