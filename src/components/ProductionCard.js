/**
 * FactoryPulse V1 - ProductionCard Component
 * Exact Stitch-approved visual styling for production record cards
 */

export function renderProductionCard(record) {
  const badgeHtml = record.isCritical
    ? `<span class="text-label-caps font-label-caps px-1.5 py-0.5 bg-error-container text-on-error-container font-bold rounded-none">HIGH REJECTION</span>`
    : `<span class="text-label-caps font-label-caps px-1.5 py-0.5 bg-tertiary-container/40 text-tertiary font-bold rounded-none">NORMAL</span>`;

  const rejContainerClass = record.isCritical
    ? 'bg-error-container/30 rounded py-0.5'
    : 'py-0.5';

  const rejLabelClass = record.isCritical
    ? 'text-error uppercase font-bold'
    : 'text-on-surface-variant uppercase font-bold';

  const rejValClass = record.isCritical
    ? 'text-error font-bold'
    : 'text-on-surface font-bold';

  const rejPctClass = record.isCritical
    ? 'text-error text-[10px] leading-tight font-extrabold'
    : 'text-tertiary text-[10px] leading-tight font-semibold';

  const downtimeClass = record.isCritical
    ? 'text-error font-medium'
    : 'text-on-surface-variant';

  return `
  <article class="bg-surface-container-low rounded p-space-md shadow-sm transition-all duration-150 active:scale-[0.99] log-item" data-search="${record.searchKeywords}">
    <!-- Card Header -->
    <div class="flex items-start justify-between gap-space-xs pb-space-xs">
      <div class="flex flex-col min-w-0">
        <div class="flex items-center gap-space-xs flex-wrap">
          <span class="text-headline-sm font-headline-sm text-on-surface font-bold">${record.machineId}</span>
          <span class="text-body-sm font-body-sm text-on-surface-variant">${record.machineType}</span>
          ${badgeHtml}
        </div>
        <div class="flex items-center gap-space-xs mt-0.5">
          <span class="text-label-caps font-label-caps text-on-surface-variant">${record.shift}</span>
          <span class="text-label-caps font-label-caps text-outline">•</span>
          <span class="text-mono-data-sm font-mono-data-sm text-on-surface-variant">${record.time}</span>
        </div>
      </div>
      <button aria-label="Open Record Details" class="text-on-surface-variant p-1 rounded active:bg-surface-bright flex-shrink-0" type="button">
        <span class="material-symbols-outlined text-[24px]">chevron_right</span>
      </button>
    </div>

    <!-- Job Identification -->
    <div class="bg-surface-container px-space-sm py-1.5 rounded my-space-xs flex items-center justify-between">
      <div class="flex items-center gap-space-xs min-w-0">
        <span class="text-label-caps font-label-caps text-primary font-bold">JOB</span>
        <span class="text-mono-data-md font-mono-data-md text-on-surface font-bold truncate">${record.jobNumber}</span>
      </div>
      <span class="text-body-sm font-body-sm text-on-surface-variant truncate ml-2 text-right">${record.partName}</span>
    </div>

    <!-- 4-Metric Grid -->
    <div class="grid grid-cols-4 gap-1 py-space-xs text-center bg-surface-container-lowest rounded p-1.5 my-space-xs">
      <div class="flex flex-col">
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Target</span>
        <span class="text-mono-data-md font-mono-data-md text-on-surface mt-0.5">${record.targetQty}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Produced</span>
        <span class="text-mono-data-md font-mono-data-md text-on-surface mt-0.5 font-bold">${record.producedQty}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-label-caps font-label-caps text-tertiary uppercase">Good</span>
        <span class="text-mono-data-md font-mono-data-md text-tertiary mt-0.5 font-bold">${record.goodQty}</span>
      </div>
      <div class="flex flex-col ${rejContainerClass}">
        <span class="text-label-caps font-label-caps ${rejLabelClass}">Rej</span>
        <span class="text-mono-data-md font-mono-data-md ${rejValClass} mt-0.5">${record.rejectedQty}</span>
        <span class="text-label-caps font-label-caps ${rejPctClass}">${record.rejectionRatePct}%</span>
      </div>
    </div>

    <!-- Operational Context & Sign-off -->
    <div class="flex items-center justify-between pt-space-xs text-body-sm font-body-sm">
      <div class="flex items-center gap-space-xs ${downtimeClass} min-w-0 truncate">
        <span class="material-symbols-outlined text-[18px]">timer</span>
        <span class="truncate">Downtime: ${record.downtimeMinutes}m (${record.downtimeReason})</span>
      </div>
      <div class="flex items-center gap-1 text-on-surface-variant flex-shrink-0 ml-2">
        <span class="text-label-caps font-label-caps">Supv: ${record.supervisor}</span>
        <span class="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
      </div>
    </div>
  </article>
  `;
}
