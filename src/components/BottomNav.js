/**
 * FactoryPulse V1 - Bottom Navigation Bar Component
 */

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'entry', label: 'Entry', icon: 'edit_note' },
  { id: 'history', label: 'History', icon: 'history' },
  { id: 'machines', label: 'Machines', icon: 'precision_manufacturing' },
  { id: 'more', label: 'More', icon: 'more_horiz' },
];

export function renderBottomNav(activeTab, role = null) {
  const normalizedRole = (role || '').toUpperCase();

  let items = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'entry', label: 'Entry', icon: 'edit_note' },
    { id: 'history', label: 'History', icon: 'history' },
    { id: 'machines', label: 'Machines', icon: 'precision_manufacturing' },
    { id: 'more', label: 'Settings', icon: 'settings' },
  ];

  if (normalizedRole === 'OWNER') {
    // Owner has access to Dashboard, History, Machines, Settings (hides Entry form)
    items = items.filter((item) => item.id !== 'entry');
  }

  return `
  <nav class="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-low/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.5)]">
    <div class="flex items-center justify-around h-16 px-space-xs max-w-7xl mx-auto">
      ${items.map((item) => {
        const isActive = activeTab === item.id;
        const colorClass = isActive ? 'text-primary' : 'text-on-surface-variant';
        return `
        <button
          type="button"
          class="nav-tab-btn flex flex-col items-center justify-center w-touch-target-min h-touch-target-min ${colorClass} transition-colors"
          data-tab="${item.id}"
          ${isActive ? 'aria-current="page"' : ''}
        >
          <span class="material-symbols-outlined text-[22px]">${item.icon}</span>
          <span class="text-label-caps font-label-caps uppercase mt-1 leading-none">${item.label}</span>
        </button>
        `;
      }).join('')}
    </div>
  </nav>
  `;
}
