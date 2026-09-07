/**
 * FactoryPulse V1 - Owner Dashboard View (Phase 3B-3)
 * High-density executive overview connected directly to live Supabase data.
 * Computes all plant KPIs dynamically from live public.production_entries and public.machines.
 */
import { calculateProductionTotals } from '../services/dataService.js';
import { formatCurrentLocalDate } from '../data/demoData.js';

export function renderDashboardView(state) {
  const { factory, machines, records, isLoading, loadError } = state;

  if (isLoading) {
    return `
    <div class="flex flex-col items-center justify-center p-space-2xl text-center bg-surface min-h-[60vh]">
      <span class="material-symbols-outlined text-[48px] text-primary animate-spin mb-space-sm">sync</span>
      <div class="text-headline-sm font-headline-sm text-on-surface font-bold">Loading Live Production Data...</div>
      <p class="text-body-sm font-body-sm text-on-surface-variant mt-1">Connecting to Supabase PostgreSQL database</p>
    </div>
    `;
  }

  if (loadError) {
    return `
    <div class="flex flex-col items-center justify-center p-space-2xl text-center bg-surface-container-low rounded border border-error/40 max-w-3xl mx-auto">
      <span class="material-symbols-outlined text-[48px] text-error mb-space-sm">error</span>
      <div class="text-headline-sm font-headline-sm text-on-surface font-bold">Database Connection Error</div>
      <p class="text-body-sm font-body-sm text-error mt-1">${loadError}</p>
      <button onclick="window.reloadLiveSupabaseData && window.reloadLiveSupabaseData()" class="mt-space-md px-space-md py-2 bg-primary-container text-on-primary-container font-bold rounded">
        Retry Live Sync
      </button>
    </div>
    `;
  }

  // Calculate live production aggregates from the returned rows
  const totals = calculateProductionTotals(records);

  // Group performance by machine
  const machinePerformance = new Map();
  records.forEach((r) => {
    const code = r.machineId;
    if (!machinePerformance.has(code)) {
      machinePerformance.set(code, {
        machineId: code,
        machineType: r.machineType,
        targetQty: 0,
        producedQty: 0,
        rejectedQty: 0,
        goodQty: 0,
        downtimeMins: 0,
        entriesCount: 0,
        latestJob: r.jobNumber,
      });
    }
    const m = machinePerformance.get(code);
    m.targetQty += (r.targetQty || 0);
    m.producedQty += (r.producedQty || 0);
    m.rejectedQty += (r.rejectedQty || 0);
    m.goodQty += (r.goodQty || 0);
    m.downtimeMins += (r.downtimeMinutes || 0);
    m.entriesCount += 1;
  });

  // Identify high rejection machines (rejection rate > 5%)
  const highRejectionMachines = Array.from(machinePerformance.values()).filter((m) => {
    const rate = m.producedQty > 0 ? (m.rejectedQty / m.producedQty) * 100 : 0;
    return rate > 5.0;
  });

  // Recent 5 entries
  const recentEntries = records.slice(0, 5);

  const downtimeHours = Math.floor(totals.totalDowntime / 60);
  const downtimeRemainingMins = totals.totalDowntime % 60;
  const downtimeFormatted = downtimeHours > 0
    ? `${downtimeHours}h ${downtimeRemainingMins}m`
    : `${downtimeRemainingMins}m`;

  return `
  <div class="flex flex-col w-full space-y-space-md max-w-5xl mx-auto pb-4">
    <!-- Header / Context Strip -->
    <section class="bg-surface-container-low rounded p-space-md shadow-md border border-outline-variant/30">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div>
          <div class="flex items-center gap-space-xs">
            <span class="w-2.5 h-2.5 ${state.role === 'SUPERVISOR' ? 'bg-tertiary' : 'bg-primary'}"></span>
            <h1 class="text-headline-sm font-headline-sm text-on-surface font-bold">
              ${state.role === 'SUPERVISOR' ? 'Supervisor Dashboard' : 'Owner Command Dashboard'}
            </h1>
          </div>
          <div class="flex items-center gap-space-xs mt-1 text-body-sm text-on-surface-variant">
            <span class="font-semibold text-tertiary">${factory.name || 'Pune Precision Components'}</span>
            <span>•</span>
            <span>${factory.location || 'Pune, Maharashtra'}</span>
            <span>•</span>
            <span class="font-mono text-on-surface font-medium">${formatCurrentLocalDate()}</span>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          ${
            state.role === 'SUPERVISOR'
              ? `
              <button
                onclick="window.setTab && window.setTab('entry')"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container hover:bg-blue-600 active:bg-blue-800 text-on-primary-container font-bold text-label-caps font-label-caps rounded transition-colors shadow-sm"
              >
                <span class="material-symbols-outlined text-[16px]">add_circle</span>
                <span>Log Production</span>
              </button>
              `
              : ''
          }
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-tertiary-container/30 text-tertiary text-label-caps font-label-caps font-bold rounded-none border border-tertiary/40">
            <span class="w-2 h-2 bg-tertiary animate-pulse rounded-none"></span>
            LIVE SUPABASE SYNC
          </span>
          <span class="text-mono-data-sm font-mono-data-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">
            ${records.length} Logs Persisted
          </span>
        </div>
      </div>
    </section>

    <!-- Shift Telemetry Aggregate Cards Grid -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-space-sm">
      <!-- Total Produced -->
      <div class="bg-surface-container-low p-space-md rounded shadow-sm border border-outline-variant/20 flex flex-col justify-between">
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Total Produced</span>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-display-lg-mobile lg:text-metric-display font-metric-display text-primary font-bold">${totals.totalProduced.toLocaleString()}</span>
          <span class="text-body-sm text-on-surface-variant font-medium">pcs</span>
        </div>
        <div class="text-label-caps font-label-caps text-on-surface-variant mt-2 pt-2 border-t border-outline-variant/20 flex justify-between">
          <span>Target: <strong class="text-on-surface">${totals.totalTarget.toLocaleString()}</strong></span>
          <span class="text-tertiary font-bold">${totals.achievementPct}% ▲</span>
        </div>
      </div>

      <!-- Good Quantity -->
      <div class="bg-surface-container-low p-space-md rounded shadow-sm border border-outline-variant/20 flex flex-col justify-between">
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Good Units</span>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-display-lg-mobile lg:text-metric-display font-metric-display text-tertiary font-bold">${totals.totalGood.toLocaleString()}</span>
          <span class="text-body-sm text-on-surface-variant font-medium">pcs</span>
        </div>
        <div class="text-label-caps font-label-caps text-on-surface-variant mt-2 pt-2 border-t border-outline-variant/20 flex justify-between">
          <span>Yield Rate</span>
          <span class="text-tertiary font-bold">${totals.totalProduced > 0 ? ((totals.totalGood / totals.totalProduced) * 100).toFixed(1) : '100'}%</span>
        </div>
      </div>

      <!-- Total Rejections -->
      <div class="bg-surface-container-low p-space-md rounded shadow-sm border border-outline-variant/20 flex flex-col justify-between">
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Total Rejections</span>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-display-lg-mobile lg:text-metric-display font-metric-display text-error font-bold">${totals.totalRejected.toLocaleString()}</span>
          <span class="text-body-sm text-error font-medium">pcs</span>
        </div>
        <div class="text-label-caps font-label-caps text-on-surface-variant mt-2 pt-2 border-t border-outline-variant/20 flex justify-between">
          <span>Rejection Rate</span>
          <span class="${totals.rejectionRatePct > 5.0 ? 'text-error font-bold' : 'text-tertiary font-semibold'}">${totals.rejectionRatePct}%</span>
        </div>
      </div>

      <!-- Total Downtime -->
      <div class="bg-surface-container-low p-space-md rounded shadow-sm border border-outline-variant/20 flex flex-col justify-between">
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Total Plant Downtime</span>
        <div class="flex items-baseline gap-1.5 mt-2">
          <span class="text-display-lg-mobile lg:text-metric-display font-metric-display text-on-surface font-bold">${downtimeFormatted}</span>
        </div>
        <div class="text-label-caps font-label-caps text-on-surface-variant mt-2 pt-2 border-t border-outline-variant/20 flex justify-between">
          <span>Cumulative Loss</span>
          <span class="font-mono text-on-surface-variant">${totals.totalDowntime} mins</span>
        </div>
      </div>
    </section>

    <!-- Critical Alerts: High Rejection & Downtime Machines -->
    ${
      highRejectionMachines.length > 0
        ? `
        <section class="bg-surface-container-low rounded p-space-md shadow-sm border-l-4 border-l-error border-y border-r border-outline-variant/30">
          <div class="flex items-center gap-space-xs mb-space-xs">
            <span class="material-symbols-outlined text-[22px] text-error">warning</span>
            <h3 class="text-body-md font-bold text-error uppercase tracking-wider">Operational Attention Required</h3>
          </div>
          <div class="space-y-space-xs mt-space-sm">
            ${highRejectionMachines.map((m) => {
              const rate = ((m.rejectedQty / m.producedQty) * 100).toFixed(1);
              return `
              <div class="bg-surface-container p-space-sm rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-space-sm">
                  <span class="text-headline-sm font-bold text-on-surface">${m.machineId}</span>
                  <span class="text-label-caps font-label-caps px-2 py-0.5 bg-error-container text-on-error-container font-bold rounded-none">HIGH REJECTION: ${rate}%</span>
                  <span class="text-body-sm text-on-surface-variant">${m.machineType}</span>
                </div>
                <div class="text-body-sm font-mono text-on-surface-variant">
                  Produced: <strong class="text-on-surface">${m.producedQty}</strong> | Rej: <strong class="text-error font-bold">${m.rejectedQty}</strong> | Downtime: <strong class="text-error">${m.downtimeMins}m</strong>
                </div>
              </div>
              `;
            }).join('')}
          </div>
        </section>
        `
        : ''
    }

    <!-- Live Machine Fleet Status (public.machines) -->
    <section class="bg-surface-container-low rounded p-space-md shadow-sm border border-outline-variant/30">
      <div class="flex items-center justify-between mb-space-sm">
        <div class="flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[22px] text-primary">precision_manufacturing</span>
          <h2 class="text-body-lg font-bold text-on-surface">Machine Fleet Status (Live from public.machines)</h2>
        </div>
        <span class="text-label-caps font-label-caps px-2 py-0.5 bg-surface-container text-on-surface-variant rounded">
          ${machines.length} Total Spindles
        </span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-xs">
        ${machines.map((m) => {
          const status = (m.status || 'RUNNING').toUpperCase();
          let badgeClass = 'bg-tertiary-container/40 text-tertiary border-tertiary/40';
          let dotColor = 'bg-tertiary';

          if (status === 'IDLE') {
            badgeClass = 'bg-amber-950/40 text-amber-400 border-amber-500/40';
            dotColor = 'bg-amber-400';
          } else if (status === 'BREAKDOWN') {
            badgeClass = 'bg-error-container text-on-error-container border-error/50 font-bold';
            dotColor = 'bg-error';
          }

          const perf = machinePerformance.get(m.machine_code || m.name);
          const producedSummary = perf ? `${perf.producedQty} pcs` : 'Idle';

          return `
          <div class="bg-surface-container p-2.5 rounded border border-outline-variant/20 flex flex-col justify-between">
            <div class="flex items-center justify-between">
              <span class="text-body-md font-bold text-on-surface">${m.machine_code || m.name}</span>
              <span class="w-2 h-2 ${dotColor} rounded-none"></span>
            </div>
            <div class="text-[11px] text-on-surface-variant truncate mt-0.5">${m.machine_type || m.type}</div>
            <div class="mt-2.5 pt-2 border-t border-outline-variant/20 flex items-center justify-between">
              <span class="text-label-caps font-label-caps px-1.5 py-0.5 border ${badgeClass} text-[10px] leading-none rounded-none font-bold">
                ${status}
              </span>
              <span class="text-[11px] font-mono text-on-surface-variant">${producedSummary}</span>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- Recent Production Entries Table (public.production_entries) -->
    <section class="bg-surface-container-low rounded p-space-md shadow-sm border border-outline-variant/30">
      <div class="flex items-center justify-between mb-space-sm">
        <div class="flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[22px] text-primary">history</span>
          <h2 class="text-body-lg font-bold text-on-surface">Recent Live Production Logs</h2>
        </div>
        <button onclick="window.setTab && window.setTab('history')" class="text-label-caps font-label-caps text-primary hover:underline uppercase font-bold">
          View All History →
        </button>
      </div>

      <div class="overflow-x-auto -mx-space-md px-space-md">
        <table class="w-full text-left text-body-sm">
          <thead>
            <tr class="border-b border-outline-variant/30 text-label-caps font-label-caps text-on-surface-variant uppercase">
              <th class="py-2 pr-3">Machine</th>
              <th class="py-2 px-3">Job / Part</th>
              <th class="py-2 px-3 text-right">Target</th>
              <th class="py-2 px-3 text-right">Produced</th>
              <th class="py-2 px-3 text-right">Good</th>
              <th class="py-2 px-3 text-right">Rej</th>
              <th class="py-2 px-3 text-right">Downtime</th>
              <th class="py-2 pl-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/20">
            ${recentEntries.map((r) => {
              const statusClass = r.isCritical
                ? 'bg-error-container text-on-error-container font-bold'
                : 'bg-tertiary-container/30 text-tertiary font-semibold';
              return `
              <tr class="hover:bg-surface-container/50 transition-colors">
                <td class="py-2.5 pr-3 font-bold text-on-surface font-mono">${r.machineId}</td>
                <td class="py-2.5 px-3">
                  <div class="font-mono text-xs font-bold text-primary">${r.jobNumber}</div>
                  <div class="text-[11px] text-on-surface-variant truncate max-w-[140px]">${r.partName}</div>
                </td>
                <td class="py-2.5 px-3 text-right font-mono">${r.targetQty}</td>
                <td class="py-2.5 px-3 text-right font-mono font-bold text-on-surface">${r.producedQty}</td>
                <td class="py-2.5 px-3 text-right font-mono text-tertiary font-bold">${r.goodQty}</td>
                <td class="py-2.5 px-3 text-right font-mono ${r.rejectedQty > 10 ? 'text-error font-bold' : 'text-on-surface-variant'}">${r.rejectedQty}</td>
                <td class="py-2.5 px-3 text-right font-mono text-on-surface-variant">${r.downtimeMinutes}m</td>
                <td class="py-2.5 pl-3 text-center">
                  <span class="text-[10px] font-mono px-1.5 py-0.5 rounded-none ${statusClass}">
                    ${r.statusBadge}
                  </span>
                </td>
              </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </section>
  </div>
  `;
}
