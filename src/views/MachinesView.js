/**
 * FactoryPulse V1 - MachinesView Component (Phase 3B-3)
 * Displays the 10 CNC machines directory directly from public.machines in Supabase
 */

export function renderMachinesView(state) {
  const machines = (state && state.machines && state.machines.length > 0) ? state.machines : [];

  return `
  <div class="flex flex-col w-full space-y-space-md max-w-3xl mx-auto">
    <div class="bg-surface-container-low rounded p-space-md shadow-md border border-outline-variant/30">
      <div class="flex items-center justify-between mb-space-sm">
        <div class="flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[24px] text-primary">precision_manufacturing</span>
          <h2 class="text-headline-sm font-headline-sm text-on-surface font-bold">Machine Directory</h2>
        </div>
        <span class="text-label-caps font-label-caps px-2 py-0.5 bg-surface-container-high text-tertiary font-bold rounded">
          ${machines.length} LIVE MACHINES
        </span>
      </div>
      <p class="text-body-sm font-body-sm text-on-surface-variant mb-space-md">
        Live machinery status for ${state?.factory?.name || 'Pune Precision Components'} read from Supabase public.machines.
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
        ${machines.map((m) => {
          const code = m.machine_code || m.name;
          const type = m.machine_type || m.type;
          const status = (m.status || 'RUNNING').toUpperCase();

          let statusBg = 'bg-tertiary-container/40 text-tertiary border border-tertiary/40';
          let dotColor = 'bg-tertiary';

          if (status === 'IDLE') {
            statusBg = 'bg-amber-950/40 text-amber-400 border border-amber-500/40';
            dotColor = 'bg-amber-400';
          } else if (status === 'BREAKDOWN') {
            statusBg = 'bg-error-container text-on-error-container border border-error/50 font-bold';
            dotColor = 'bg-error';
          }

          return `
          <div class="bg-surface-container p-space-sm rounded flex items-center justify-between border border-outline-variant/20">
            <div class="flex flex-col min-w-0 pr-2">
              <span class="text-body-md font-bold text-on-surface font-mono">${code}</span>
              <span class="text-body-sm text-on-surface-variant truncate">${type}</span>
            </div>
            <div class="flex items-center gap-1.5 px-2 py-1 ${statusBg} rounded-none flex-shrink-0">
              <span class="w-2 h-2 ${dotColor} rounded-none"></span>
              <span class="text-label-caps font-label-caps uppercase font-bold">${status}</span>
            </div>
          </div>
          `;
        }).join('')}
      </div>
    </div>
  </div>
  `;
}
