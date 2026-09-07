/**
 * FactoryPulse V1 - MoreView Component (Phase 1 Settings Scaffold)
 */
import { FACTORY_INFO } from '../data/demoData.js';

export function renderMoreView(state = {}) {
  const user = state.user;
  const profile = state.profile;
  const role = (state.role || '').toUpperCase();
  const factoryId = state.factoryId || '11111111-1111-1111-1111-111111111111';

  return `
  <div class="flex flex-col w-full space-y-space-md max-w-3xl mx-auto pb-4">
    <!-- Active Session Card -->
    <div class="bg-surface-container-low rounded p-space-md shadow-md border border-outline-variant/30">
      <div class="flex items-center justify-between mb-space-sm">
        <div class="flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[24px] text-primary">account_circle</span>
          <h2 class="text-headline-sm font-headline-sm text-on-surface font-bold">Authenticated User</h2>
        </div>
        <span class="text-label-caps font-label-caps px-2.5 py-1 ${role === 'OWNER' ? 'bg-primary-container/40 text-primary border-primary/40' : 'bg-tertiary-container/40 text-tertiary border-tertiary/40'} border rounded-none font-bold">
          ${role || 'AUTHENTICATED'}
        </span>
      </div>

      <div class="space-y-space-xs bg-surface-container p-space-sm rounded">
        <div class="flex justify-between items-center text-body-sm py-1 border-b border-outline-variant/20">
          <span class="text-on-surface-variant">Email Address:</span>
          <span class="font-mono font-bold text-on-surface">${user?.email || 'N/A'}</span>
        </div>
        <div class="flex justify-between items-center text-body-sm py-1 border-b border-outline-variant/20">
          <span class="text-on-surface-variant">Profile Role:</span>
          <span class="font-mono font-bold ${role === 'OWNER' ? 'text-primary' : 'text-tertiary'}">${role || 'N/A'}</span>
        </div>
        <div class="flex justify-between items-center text-body-sm py-1 border-b border-outline-variant/20">
          <span class="text-on-surface-variant">Assigned Factory ID:</span>
          <span class="font-mono text-xs text-on-surface-variant truncate max-w-[200px]">${factoryId}</span>
        </div>
        <div class="flex justify-between items-center text-body-sm py-1">
          <span class="text-on-surface-variant">Auth Provider:</span>
          <span class="font-mono text-xs text-tertiary font-semibold">Supabase PostgreSQL RLS</span>
        </div>
      </div>

      <div class="mt-space-md pt-space-sm border-t border-outline-variant/20 flex justify-end">
        <button
          id="settings-logout-btn"
          type="button"
          class="flex items-center gap-2 px-4 py-2 bg-error-container hover:bg-red-800 active:bg-red-900 text-on-error-container font-bold text-body-sm rounded transition-colors"
        >
          <span class="material-symbols-outlined text-[18px]">logout</span>
          <span>Sign Out / Disconnect</span>
        </button>
      </div>
    </div>

    <!-- Facility & System Information -->
    <div class="bg-surface-container-low rounded p-space-md shadow-md border border-outline-variant/30">
      <div class="flex items-center gap-space-xs mb-space-sm">
        <span class="material-symbols-outlined text-[24px] text-primary">settings</span>
        <h2 class="text-headline-sm font-headline-sm text-on-surface font-bold">Facility & System Settings</h2>
      </div>

      <div class="space-y-space-sm">
        <div class="bg-surface-container p-space-sm rounded">
          <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Facility Information</span>
          <div class="text-body-md font-bold text-on-surface mt-1">${FACTORY_INFO.name}</div>
          <div class="text-body-sm text-on-surface-variant mt-0.5">Location: Pune Industrial Area, Maharashtra</div>
        </div>

        <div class="bg-surface-container p-space-sm rounded">
          <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">System Architecture</span>
          <div class="text-body-sm text-on-surface-variant mt-1">
            FactoryPulse V1 Mobile-First Production Reporting • Supabase Auth & PostgreSQL Persistent Store • Industrial High-Density UI
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}
