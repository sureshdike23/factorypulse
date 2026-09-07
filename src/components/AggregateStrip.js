/**
 * FactoryPulse V1 - Shift Telemetry Aggregate Strip Component
 * Calculates and renders real-time shift overview metrics
 */

export function renderAggregateStrip(records) {
  const loggedMachinesCount = new Set(records.map(r => r.machineId)).size;
  const totalTarget = records.reduce((acc, r) => acc + (r.targetQty || 0), 0);
  const totalProduced = records.reduce((acc, r) => acc + (r.producedQty || 0), 0);
  const totalRejected = records.reduce((acc, r) => acc + (r.rejectedQty || 0), 0);
  const totalDowntimeMins = records.reduce((acc, r) => acc + (r.downtimeMinutes || 0), 0);

  const achievementPct = totalTarget > 0 ? ((totalProduced / totalTarget) * 100).toFixed(1) : '0.0';
  const rejectionRatePct = totalProduced > 0 ? ((totalRejected / totalProduced) * 100).toFixed(2) : '0.00';

  const downtimeHours = Math.floor(totalDowntimeMins / 60);
  const downtimeRemainingMins = totalDowntimeMins % 60;
  const downtimeFormatted = downtimeHours > 0
    ? `${downtimeHours}h ${downtimeRemainingMins}m`
    : `${downtimeRemainingMins}m`;

  return `
  <section class="bg-surface-container-low rounded p-space-md shadow-md">
    <div class="flex items-center justify-between mb-space-xs">
      <div class="flex items-center gap-space-xs">
        <span class="w-2 h-2 bg-tertiary"></span>
        <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Shift Summary Overview</span>
      </div>
      <span class="text-mono-data-sm font-mono-data-sm text-tertiary font-bold">DATA UPDATED</span>
    </div>

    <div class="grid grid-cols-2 gap-space-sm pt-space-xs">
      <!-- Logged Machines -->
      <div class="bg-surface-container p-space-sm rounded">
        <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Logged Machines</div>
        <div class="flex items-baseline gap-1 mt-0.5">
          <span class="text-headline-md font-headline-md text-on-surface">${loggedMachinesCount}</span>
          <span class="text-body-sm font-body-sm text-on-surface-variant">units</span>
        </div>
      </div>

      <!-- Total Produced -->
      <div class="bg-surface-container p-space-sm rounded">
        <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Total Produced</div>
        <div class="flex items-baseline gap-1 mt-0.5">
          <span class="text-headline-md font-headline-md text-primary">${totalProduced.toLocaleString()}</span>
          <span class="text-body-sm font-body-sm text-on-surface-variant">pcs</span>
        </div>
      </div>

      <!-- Achievement % -->
      <div class="bg-surface-container p-space-sm rounded">
        <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Achievement (${totalTarget.toLocaleString()} pcs)</div>
        <div class="flex items-baseline gap-1 mt-0.5">
          <span class="text-headline-md font-headline-md text-tertiary">${achievementPct}%</span>
          <span class="text-body-sm font-body-sm text-tertiary">▲ on target</span>
        </div>
      </div>

      <!-- Total Rejections -->
      <div class="bg-surface-container p-space-sm rounded">
        <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Total Rejections</div>
        <div class="flex items-baseline gap-1 mt-0.5">
          <span class="text-headline-md font-headline-md text-error">${totalRejected}</span>
          <span class="text-body-sm font-body-sm text-error font-medium">(${rejectionRatePct}%)</span>
        </div>
      </div>

      <!-- Total Downtime -->
      <div class="bg-surface-container p-space-sm rounded col-span-2 flex items-center justify-between">
        <div class="text-label-caps font-label-caps text-on-surface-variant uppercase">Total Downtime</div>
        <div class="flex items-baseline gap-1">
          <span class="text-mono-data-md font-mono-data-md text-on-surface font-bold">${downtimeFormatted}</span>
          <span class="text-body-sm font-body-sm text-on-surface-variant">(${totalDowntimeMins} mins)</span>
        </div>
      </div>
    </div>
  </section>
  `;
}
