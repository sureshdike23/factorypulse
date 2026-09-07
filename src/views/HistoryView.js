/**
 * FactoryPulse V1 - HistoryView Component (Phase 3B-3)
 * Complete implementation of the Stitch-approved Shift History screen,
 * fed dynamically by live public.production_entries from Supabase.
 */
import { renderFilterBar } from '../components/FilterBar.js';
import { renderAggregateStrip } from '../components/AggregateStrip.js';
import { renderProductionCard } from '../components/ProductionCard.js';

export function renderHistoryView(state) {
  const { searchQuery, records, isLoading, loadError } = state;

  if (isLoading) {
    return `
    <div class="flex flex-col items-center justify-center p-space-2xl text-center bg-surface min-h-[60vh] max-w-3xl mx-auto">
      <span class="material-symbols-outlined text-[48px] text-primary animate-spin mb-space-sm">sync</span>
      <div class="text-headline-sm font-headline-sm text-on-surface font-bold">Loading Shift History...</div>
      <p class="text-body-sm font-body-sm text-on-surface-variant mt-1">Retrieving production logs from Supabase database</p>
    </div>
    `;
  }

  if (loadError) {
    return `
    <div class="flex flex-col items-center justify-center p-space-2xl text-center bg-surface-container-low rounded border border-error/40 max-w-3xl mx-auto">
      <span class="material-symbols-outlined text-[48px] text-error mb-space-sm">error</span>
      <div class="text-headline-sm font-headline-sm text-on-surface font-bold">Database Read Error</div>
      <p class="text-body-sm font-body-sm text-error mt-1">${loadError}</p>
      <button onclick="window.reloadLiveSupabaseData && window.reloadLiveSupabaseData()" class="mt-space-md px-space-md py-2 bg-primary-container text-on-primary-container font-bold rounded">
        Retry Live Sync
      </button>
    </div>
    `;
  }

  const normalizedQuery = (searchQuery || '').toLowerCase().trim();

  const filteredRecords = normalizedQuery
    ? records.filter((r) => r.searchKeywords && r.searchKeywords.toLowerCase().includes(normalizedQuery))
    : records;

  return `
  <div class="flex flex-col w-full space-y-space-md max-w-3xl mx-auto">
    <!-- Interactive Mobile Filter Section -->
    ${renderFilterBar(searchQuery, new Set(records.map(r => r.machineId)).size || 10)}

    <!-- Shift Telemetry Aggregate Strip (Dynamically calculated from live records) -->
    ${renderAggregateStrip(records)}

    <!-- Production Record Cards List -->
    <section class="flex flex-col space-y-space-sm" id="log-cards-container">
      ${
        filteredRecords.length > 0
          ? filteredRecords.map((record) => renderProductionCard(record)).join('')
          : `
          <!-- Empty State Container -->
          <div class="flex flex-col items-center justify-center p-space-xl text-center bg-surface-container-low rounded" id="no-results-state">
            <span class="material-symbols-outlined text-[40px] text-on-surface-variant mb-space-xs">manage_search</span>
            <div class="text-headline-sm font-headline-sm text-on-surface font-semibold">No Production Logs Found</div>
            <p class="text-body-sm font-body-sm text-on-surface-variant mt-1">Try adjusting the filter criteria or clear the search query.</p>
          </div>
          `
      }
    </section>

    <!-- Export & Shift Sign-off Footer Actions -->
    <section class="flex flex-col gap-space-sm pt-space-sm">
      <!-- Download CSV / Excel Report -->
      <button
        class="w-full flex items-center justify-center gap-space-sm py-3 px-space-md bg-surface-container active:bg-surface-bright text-on-surface rounded font-body-md font-semibold min-h-touch-target-min transition-colors shadow-sm"
        id="export-btn"
        type="button"
      >
        <span class="material-symbols-outlined text-[20px] text-primary">sim_card_download</span>
        <span>Download Shift CSV / Excel</span>
      </button>

      <!-- Supervisor Shift Sign-Off Primary Trigger -->
      <button
        class="w-full flex items-center justify-center gap-space-sm py-3.5 px-space-md bg-primary-container active:bg-inverse-primary text-on-primary-container rounded font-body-md font-bold min-h-touch-target-min transition-colors shadow-md"
        id="signoff-btn"
        type="button"
      >
        <span class="material-symbols-outlined text-[22px]">verified_user</span>
        <span>Supervisor Shift Sign-off ✓</span>
      </button>
    </section>
  </div>
  `;
}
