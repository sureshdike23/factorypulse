/**
 * FactoryPulse V1 - Supabase Configuration
 * 
 * Phase 3B-1: Read-Only Connection Setup
 * 
 * Instructions:
 * Replace the placeholder values below with your actual Supabase project credentials.
 * 
 * IMPORTANT SECURITY NOTICE:
 * - Use ONLY the Supabase publishable / anon key (e.g. sb_publishable_... or public anon key).
 * - NEVER use, request, or expose your service_role / secret key.
 */

export const SUPABASE_CONFIG = {
  // Replace with your actual Supabase Project URL (e.g. 'https://xyzcompany.supabase.co')
  SUPABASE_URL: 'https://rfbmwoebvyvbcsvbuxzh.supabase.co',

  // Replace with your actual Supabase Publishable / Anon Key (e.g. 'sb_publishable_...' or anon key)
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_ZRSyty-a5esRMWUWXvcxmQ_M-dN20K0',
};

/**
 * Checks whether the configuration has been populated with real credentials
 * instead of the initial placeholder strings.
 */
export function isSupabaseConfigured() {
  const url = SUPABASE_CONFIG.SUPABASE_URL || '';
  const key = SUPABASE_CONFIG.SUPABASE_PUBLISHABLE_KEY || '';

  const isUrlPlaceholder = !url || url.includes('YOUR_PROJECT_ID') || url === 'https://YOUR_PROJECT_ID.supabase.co';
  const isKeyPlaceholder = !key || key.includes('YOUR_KEY_HERE') || key === 'sb_publishable_YOUR_KEY_HERE';

  return !isUrlPlaceholder && !isKeyPlaceholder;
}
