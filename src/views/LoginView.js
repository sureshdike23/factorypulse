/**
 * FactoryPulse V1 - Login View (Phase 4F)
 * Industrial authentication interface adhering to the FactoryPulse Precision System.
 */
import { LOGO_SVG } from '../assets/assets.js';
import { FACTORY_INFO } from '../data/demoData.js';

export function renderLoginView(state) {
  const authError = state.authError;
  const isSubmitting = state.isLoading;

  return `
  <div class="min-h-screen flex flex-col justify-center items-center px-space-md py-space-xl bg-surface selection:bg-primary-container selection:text-on-primary-container">
    <div class="w-full max-w-md bg-surface-container-low border border-outline-variant/30 shadow-2xl p-6 sm:p-8 rounded">
      <!-- Brand & Facility Identity -->
      <div class="flex flex-col items-center text-center">
        <div class="flex items-center justify-center mb-3">
          ${LOGO_SVG}
        </div>
        <div class="flex items-center gap-space-xs">
          <h1 class="text-headline-sm font-headline-sm font-bold tracking-tight text-on-surface">${FACTORY_INFO.appTitle}</h1>
          <span class="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">${FACTORY_INFO.version}</span>
        </div>
        <p class="text-body-sm font-body-sm text-on-surface-variant mt-0.5">${FACTORY_INFO.subtitle}</p>
        
        <div class="flex items-center gap-space-xs mt-2 px-2.5 py-1 bg-surface-container rounded border border-outline-variant/20">
          <span class="w-2 h-2 bg-tertiary rounded-none"></span>
          <span class="text-label-caps font-label-caps text-tertiary font-bold">${FACTORY_INFO.name}</span>
        </div>
      </div>

      <!-- Access Subheading -->
      <div class="mt-6 mb-4 pb-2 border-b border-outline-variant/20 flex items-center justify-between">
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Enterprise Sign In</span>
        <span class="text-label-caps font-label-caps text-primary font-bold">SUPABASE AUTH</span>
      </div>

      <!-- Error Alert Box -->
      ${
        authError
          ? `
          <div id="login-error-alert" class="mb-4 p-3 bg-error-container/30 border border-error/50 rounded flex items-start gap-2.5 text-on-error-container">
            <span class="material-symbols-outlined text-[20px] text-error flex-shrink-0 mt-0.5">error</span>
            <div class="flex-1 text-body-sm font-medium leading-snug" id="login-error-text">${authError}</div>
          </div>
          `
          : `
          <div id="login-error-alert" class="hidden mb-4 p-3 bg-error-container/30 border border-error/50 rounded items-start gap-2.5 text-on-error-container">
            <span class="material-symbols-outlined text-[20px] text-error flex-shrink-0 mt-0.5">error</span>
            <div class="flex-1 text-body-sm font-medium leading-snug" id="login-error-text"></div>
          </div>
          `
      }

      <!-- Login Form -->
      <form id="login-form" class="space-y-4" novalidate>
        <!-- Email Input -->
        <div>
          <label for="login-email" class="block text-label-caps font-label-caps uppercase text-on-surface-variant mb-1.5">
            Email Address <span class="text-error">*</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-on-surface-variant">
              <span class="material-symbols-outlined text-[20px]">badge</span>
            </span>
            <input
              id="login-email"
              type="email"
              name="email"
              autocomplete="username"
              required
              placeholder="user@factorypulse.demo"
              class="w-full pl-10 pr-3 py-2.5 bg-surface-container text-on-surface placeholder:text-outline border border-outline-variant/30 rounded focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md transition-colors"
            />
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label for="login-password" class="block text-label-caps font-label-caps uppercase text-on-surface-variant mb-1.5">
            Password <span class="text-error">*</span>
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-on-surface-variant">
              <span class="material-symbols-outlined text-[20px]">lock</span>
            </span>
            <input
              id="login-password"
              type="password"
              name="password"
              autocomplete="current-password"
              required
              placeholder="••••••••"
              class="w-full pl-10 pr-10 py-2.5 bg-surface-container text-on-surface placeholder:text-outline border border-outline-variant/30 rounded focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md transition-colors"
            />
            <button
              type="button"
              id="toggle-password-visibility-btn"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-on-surface"
              title="Show/Hide password"
            >
              <span class="material-symbols-outlined text-[18px]" id="password-visibility-icon">visibility</span>
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          id="login-submit-btn"
          type="submit"
          class="w-full h-touch-target-min mt-2 bg-primary-container hover:bg-blue-600 active:bg-blue-800 text-on-primary-container font-bold text-body-md uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
          ${isSubmitting ? 'disabled' : ''}
        >
          ${
            isSubmitting
              ? `<span class="material-symbols-outlined text-[20px] animate-spin">sync</span><span>Signing In...</span>`
              : `<span class="material-symbols-outlined text-[20px]">login</span><span>Sign In to FactoryPulse</span>`
          }
        </button>
      </form>

      <!-- Demo Accounts Quick-Fill Section -->
      <div class="mt-6 pt-4 border-t border-outline-variant/20">
        <div class="flex items-center justify-between mb-2">
          <span class="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Demo User Profiles</span>
          <span class="text-[10px] text-on-surface-variant font-mono">Click to Fill</span>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="btn-demo-quickfill flex flex-col items-start p-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 hover:border-primary/40 rounded transition-colors text-left"
            data-email="owner@factorypulse.demo"
          >
            <div class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-primary rounded-none"></span>
              <span class="text-label-caps font-label-caps text-primary font-bold">OWNER</span>
            </div>
            <span class="text-[11px] font-mono text-on-surface truncate w-full mt-0.5">owner@factorypulse.demo</span>
          </button>

          <button
            type="button"
            class="btn-demo-quickfill flex flex-col items-start p-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 hover:border-tertiary/40 rounded transition-colors text-left"
            data-email="supervisor@factorypulse.demo"
          >
            <div class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-tertiary rounded-none"></span>
              <span class="text-label-caps font-label-caps text-tertiary font-bold">SUPERVISOR</span>
            </div>
            <span class="text-[11px] font-mono text-on-surface truncate w-full mt-0.5">supervisor@factorypulse.demo</span>
          </button>
        </div>
      </div>

      <!-- Security / Footer Note -->
      <div class="mt-6 text-center text-body-sm text-on-surface-variant">
        <span class="text-[11px] font-mono">End-to-End Encrypted Session • Supabase Auth</span>
      </div>
    </div>
  </div>
  `;
}
