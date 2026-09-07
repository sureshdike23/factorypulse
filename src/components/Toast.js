/**
 * FactoryPulse V1 - Toast Notification Component
 */

export function renderToast(toast) {
  const isVisible = toast && toast.visible;
  return `
  <div
    class="fixed bottom-20 left-4 right-4 z-50 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'} transition-all duration-300 flex items-center justify-between p-space-md bg-surface-bright text-on-surface rounded shadow-xl max-w-lg mx-auto"
    id="toast-banner"
  >
    <div class="flex items-center gap-space-sm">
      <span class="material-symbols-outlined text-tertiary text-[24px]">task_alt</span>
      <div class="flex flex-col">
        <span class="text-body-sm font-body-sm font-bold" id="toast-title">${toast?.title || ''}</span>
        <span class="text-label-caps font-label-caps text-on-surface-variant" id="toast-desc">${toast?.desc || ''}</span>
      </div>
    </div>
    <button id="close-toast-btn" type="button" class="text-on-surface-variant hover:text-on-surface" aria-label="Close Notification">
      <span class="material-symbols-outlined text-[18px]">close</span>
    </button>
  </div>
  `;
}
