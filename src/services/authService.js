/**
 * FactoryPulse V1 - Authentication Service (Phase 4F)
 * Handles email/password sign-in, profile resolution, role retrieval, and session management.
 */
import { getSupabaseClient } from './supabaseClient.js';

/**
 * Formats raw Supabase auth error into user-friendly message.
 */
function formatAuthError(error) {
  if (!error) return 'An unknown authentication error occurred.';
  const msg = error.message || error.msg || '';
  const code = error.code || error.error_code || '';
  if (
    msg.toLowerCase().includes('invalid login credentials') ||
    code === 'invalid_credentials' ||
    code === 400
  ) {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }
  if (msg.toLowerCase().includes('email not confirmed')) {
    return 'Your email address is not yet confirmed. Please verify your email before logging in.';
  }
  if (msg.toLowerCase().includes('rate limit')) {
    return 'Too many login attempts. Please wait a moment and try again.';
  }
  return msg || 'Failed to sign in. Please try again.';
}

/**
 * Attempts sign-in using email and password via Supabase Auth.
 * On success, retrieves and validates profile from public.profiles.
 * 
 * @param {Object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{ success: boolean, session?: Object, user?: Object, profile?: Object, role?: string, factoryId?: string, error?: string }>}
 */
export async function signIn({ email, password }) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase client is not configured or unavailable.',
    };
  }

  const cleanEmail = (email || '').trim();
  if (!cleanEmail || !password) {
    return {
      success: false,
      error: 'Please provide both email and password.',
    };
  }

  try {
    console.group('%c[FactoryPulse Auth] Signing In%c', 'color: #2563eb; font-weight: bold;', 'color: inherit;');
    console.log('Target Email:', cleanEmail);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (error) {
      console.warn('❌ Sign-in failed:', error.message);
      console.groupEnd();
      return {
        success: false,
        error: formatAuthError(error),
      };
    }

    if (!data || !data.session || !data.user) {
      console.warn('❌ No session or user returned after successful response');
      console.groupEnd();
      return {
        success: false,
        error: 'Authentication failed to establish an active session.',
      };
    }

    const user = data.user;
    console.log('✅ Supabase Auth succeeded for User ID:', user.id);

    // Load profile from public.profiles
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileErr) {
      console.error('❌ Error reading public.profiles:', profileErr);
      await supabase.auth.signOut();
      console.groupEnd();
      return {
        success: false,
        error: `Database error querying user profile: ${profileErr.message}`,
      };
    }

    if (!profile) {
      console.warn('❌ Missing profile in public.profiles for user ID:', user.id);
      // Immediately sign out to prevent unauthorized access
      await supabase.auth.signOut();
      console.groupEnd();
      return {
        success: false,
        error: 'Login succeeded, but no matching profile was found in public.profiles. Access denied.',
      };
    }

    const role = (profile.role || '').trim().toUpperCase();
    const factoryId = profile.factory_id || profile.factoryId || null;

    console.log(`✅ Profile loaded. Role: "${role}", Factory ID: "${factoryId}"`);
    console.groupEnd();

    return {
      success: true,
      session: data.session,
      user: user,
      profile: profile,
      role: role,
      factoryId: factoryId,
    };
  } catch (err) {
    console.error('❌ Exception during signIn:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during sign-in.',
    };
  }
}

/**
 * Signs out the current Supabase session.
 */
export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) return { success: true };

  try {
    console.log('[FactoryPulse Auth] Signing out...');
    await supabase.auth.signOut();
    return { success: true };
  } catch (err) {
    console.warn('[FactoryPulse Auth] Error during signOut:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Checks if a persisted session already exists and rehydrates profile.
 * 
 * @returns {Promise<{ session: Object, user: Object, profile: Object, role: string, factoryId: string } | null>}
 */
export async function getExistingSession() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data || !data.session || !data.session.user) {
      return null;
    }

    const session = data.session;
    const user = session.user;

    // Fetch profile for the active session
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileErr || !profile) {
      console.warn('[FactoryPulse Auth] Existing session found, but profile could not be loaded:', profileErr);
      await supabase.auth.signOut();
      return null;
    }

    const role = (profile.role || '').trim().toUpperCase();
    const factoryId = profile.factory_id || profile.factoryId || null;

    return {
      session,
      user,
      profile,
      role,
      factoryId,
    };
  } catch (err) {
    console.warn('[FactoryPulse Auth] Error retrieving existing session:', err);
    return null;
  }
}
