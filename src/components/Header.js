/**
 * FactoryPulse V1 - Header Component
 */
import { FACTORY_INFO } from '../data/demoData.js';
import { LOGO_SVG, AVATAR_SVG } from '../assets/assets.js';

export function renderHeader(state = {}) {
  const role = (state.role || '').toUpperCase();
  const user = state.user;
  const userEmail = user?.email || FACTORY_INFO.supervisor;
  const isOwner = role === 'OWNER';
  const roleBadge = role || 'AUTHENTICATED';
  const roleColorText = isOwner ? 'text-primary' : 'text-tertiary';
  const roleColorDot = isOwner ? 'bg-primary' : 'bg-tertiary';

  return `
  <header class="fixed top-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
    <div class="h-20 px-space-md flex items-center justify-between gap-space-sm max-w-7xl mx-auto">
      <div class="flex items-center gap-space-sm min-w-0">
        ${LOGO_SVG}
        <div class="flex flex-col min-w-0 justify-center">
          <div class="flex items-center gap-space-xs">
            <span class="text-body-md font-headline-sm font-bold tracking-tight text-on-surface truncate leading-none">${FACTORY_INFO.appTitle}</span>
            <span class="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider leading-none">${FACTORY_INFO.version}</span>
          </div>
          <span class="text-body-sm font-body-sm text-on-surface-variant truncate leading-tight">${FACTORY_INFO.subtitle}</span>
          <div class="flex items-center gap-space-xs mt-space-2xs">
            <span class="w-1.5 h-1.5 bg-tertiary rounded-none inline-block flex-shrink-0"></span>
            <span class="text-label-caps font-label-caps text-tertiary truncate leading-none">${FACTORY_INFO.name}</span>
            <span class="text-label-caps font-label-caps text-on-surface-variant leading-none">•</span>
            <span class="text-label-caps font-label-caps text-on-surface-variant truncate leading-none">${FACTORY_INFO.demoDate}</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-space-xs sm:gap-space-sm flex-shrink-0">
        <div class="flex flex-col items-end justify-center">
          <div class="flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 ${roleColorDot} rounded-none inline-block"></span>
            <span class="text-label-caps font-label-caps ${roleColorText} font-bold leading-none">${roleBadge}</span>
          </div>
          <span class="text-[10px] font-mono text-on-surface-variant leading-none mt-1 max-w-[110px] sm:max-w-[150px] truncate">${userEmail}</span>
        </div>
        <button
          id="header-logout-btn"
          type="button"
          class="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-surface-container hover:bg-surface-container-high active:bg-surface-bright text-on-surface-variant hover:text-error border border-outline-variant/30 rounded transition-colors"
          title="Sign out of FactoryPulse"
        >
          <span class="material-symbols-outlined text-[18px]">logout</span>
          <span class="text-label-caps font-label-caps uppercase hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  </header>
  `;
}
