/**
 * FactoryPulse V1 - FilterBar Component
 * Renders touch-friendly filter chips carousel and quick search input
 */

export function renderFilterBar(searchQuery = '', totalMachinesCount = 10) {
  const hasQuery = searchQuery.length > 0;
  return `
  <section class="flex flex-col gap-space-sm">
    <!-- Touch-Friendly Filter Chips Carousel -->
    <div class="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-space-2xs -mx-space-md px-space-md">
      <!-- Date Chip -->
      <button class="flex items-center gap-space-xs px-space-sm py-2 bg-surface-container-high active:bg-surface-bright rounded text-on-surface whitespace-nowrap min-h-touch-target-min transition-colors flex-shrink-0" type="button">
        <span class="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
        <span class="text-body-sm font-body-sm font-semibold">Today (05 Sep)</span>
        <span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
      </button>

      <!-- Shift Filter -->
      <button class="flex items-center gap-space-xs px-space-sm py-2 bg-surface-container active:bg-surface-bright rounded text-on-surface whitespace-nowrap min-h-touch-target-min transition-colors flex-shrink-0" type="button">
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Shift:</span>
        <span class="text-body-sm font-body-sm font-semibold text-tertiary">All (A, B, C)</span>
        <span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
      </button>

      <!-- Machine Filter -->
      <button class="flex items-center gap-space-xs px-space-sm py-2 bg-surface-container active:bg-surface-bright rounded text-on-surface whitespace-nowrap min-h-touch-target-min transition-colors flex-shrink-0" type="button">
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Machine:</span>
        <span class="text-body-sm font-body-sm font-semibold">All (${totalMachinesCount})</span>
        <span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
      </button>

      <!-- Status Filter -->
      <button class="flex items-center gap-space-xs px-space-sm py-2 bg-surface-container active:bg-surface-bright rounded text-on-surface whitespace-nowrap min-h-touch-target-min transition-colors flex-shrink-0" type="button">
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Status:</span>
        <span class="text-body-sm font-body-sm font-semibold">All Logs</span>
        <span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
      </button>
    </div>

    <!-- Supervisor Quick Search -->
    <div class="relative w-full">
      <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-on-surface-variant">
        <span class="material-symbols-outlined text-[20px]">search</span>
      </span>
      <input
        class="w-full pl-10 pr-10 py-3 bg-surface-container-low text-on-surface placeholder:text-outline text-body-md font-body-md rounded focus:outline-none focus:bg-surface-container-high transition-colors"
        id="log-search-input"
        placeholder="Search by job # or supervisor..."
        type="text"
        value="${searchQuery}"
      >
      <button
        class="absolute inset-y-0 right-0 ${hasQuery ? 'flex' : 'hidden'} items-center pr-3 text-on-surface-variant hover:text-on-surface"
        id="clear-search-btn"
        type="button"
        aria-label="Clear Search"
      >
        <span class="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  </section>
  `;
}
