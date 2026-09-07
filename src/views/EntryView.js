/**
 * FactoryPulse V1 - Supervisor Production Entry View
 * Mobile-first production report logging with live telemetry calculations & validation
 */
import { FACTORY_INFO, MACHINES, COMMON_PARTS, DOWNTIME_REASONS } from '../data/demoData.js';

export function renderEntryView() {
  const defaultPart = COMMON_PARTS[0];

  return `
  <div class="flex flex-col w-full space-y-space-md max-w-3xl mx-auto pb-4">
    <!-- Form Title & Shift Context Header -->
    <section class="bg-surface-container-low rounded p-space-md shadow-md border border-outline-variant/30">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-space-xs">
          <span class="material-symbols-outlined text-[24px] text-primary">edit_note</span>
          <h2 class="text-headline-sm font-headline-sm text-on-surface font-bold">Log Shift Production</h2>
        </div>
        <span class="text-label-caps font-label-caps px-2 py-0.5 bg-primary-container/30 text-primary font-bold rounded">PHASE 2 ACTIVE</span>
      </div>
      <div class="flex items-center gap-space-xs mt-space-xs text-body-sm text-on-surface-variant">
        <span>${FACTORY_INFO.name}</span>
        <span>•</span>
        <span>Supervisor: <strong class="text-tertiary font-medium">${FACTORY_INFO.supervisor}</strong></span>
      </div>
    </section>

    <!-- Main Production Entry Form -->
    <form id="production-entry-form" class="flex flex-col space-y-space-md" novalidate>
      <!-- Field Group: Date & Shift -->
      <section class="bg-surface-container-low rounded p-space-md shadow-sm space-y-space-sm">
        <div class="text-label-caps font-label-caps text-on-surface-variant uppercase font-bold tracking-wider">1. Shift & Timing</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
          <!-- Date -->
          <div class="flex flex-col gap-1">
            <label for="entry-date" class="text-label-caps font-label-caps text-on-surface-variant">Report Date</label>
            <div class="relative">
              <input
                type="text"
                id="entry-date"
                name="date"
                value="${FACTORY_INFO.demoDate}"
                readonly
                class="w-full px-space-sm py-2.5 bg-surface-container text-on-surface text-body-md font-mono-data-md rounded border border-outline-variant/40 focus:outline-none focus:border-primary"
              />
              <span class="material-symbols-outlined text-[18px] text-on-surface-variant absolute right-3 top-3 pointer-events-none">calendar_today</span>
            </div>
          </div>

          <!-- Shift Selector -->
          <div class="flex flex-col gap-1">
            <label for="entry-shift" class="text-label-caps font-label-caps text-on-surface-variant">Operational Shift</label>
            <div class="relative">
              <select
                id="entry-shift"
                name="shift"
                class="w-full px-space-sm py-2.5 bg-surface-container text-on-surface text-body-md font-semibold rounded border border-outline-variant/40 focus:outline-none focus:border-primary appearance-none"
              >
                <option value="Shift A" selected>Shift A (06:00 - 14:00)</option>
                <option value="Shift B">Shift B (14:00 - 22:00)</option>
                <option value="Shift C">Shift C (22:00 - 06:00)</option>
              </select>
              <span class="material-symbols-outlined text-[18px] text-on-surface-variant absolute right-3 top-3 pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Field Group: Machine & Job Details -->
      <section class="bg-surface-container-low rounded p-space-md shadow-sm space-y-space-sm">
        <div class="text-label-caps font-label-caps text-on-surface-variant uppercase font-bold tracking-wider">2. Equipment & Part Specification</div>
        
        <!-- Machine Selection -->
        <div class="flex flex-col gap-1">
          <label for="entry-machine" class="text-label-caps font-label-caps text-on-surface-variant">Production Machine</label>
          <div class="relative">
            <select
              id="entry-machine"
              name="machineId"
              class="w-full px-space-sm py-2.5 bg-surface-container text-on-surface text-body-md font-semibold rounded border border-outline-variant/40 focus:outline-none focus:border-primary appearance-none"
            >
              ${MACHINES.map(m => `
                <option value="${m.id}" data-type="${m.type}">
                  ${m.id} — ${m.type} (${m.status})
                </option>
              `).join('')}
            </select>
            <span class="material-symbols-outlined text-[18px] text-on-surface-variant absolute right-3 top-3 pointer-events-none">expand_more</span>
          </div>
        </div>

        <!-- Quick Preset Part Auto-fill for rapid one-handed entry -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <label for="entry-preset-part" class="text-label-caps font-label-caps text-primary uppercase font-bold">Quick Part Preset (Tap to Auto-fill)</label>
            <span class="text-[11px] text-on-surface-variant">Sets Job, Name & Target</span>
          </div>
          <div class="relative">
            <select
              id="entry-preset-part"
              class="w-full px-space-sm py-2 bg-surface-container text-on-surface text-body-sm rounded border border-outline-variant/40 focus:outline-none focus:border-primary appearance-none"
            >
              ${COMMON_PARTS.map((p, idx) => `
                <option value="${idx}">
                  ${p.jobNumber}: ${p.partName} (Target: ${p.defaultTarget})
                </option>
              `).join('')}
            </select>
            <span class="material-symbols-outlined text-[18px] text-on-surface-variant absolute right-3 top-2.5 pointer-events-none">tune</span>
          </div>
        </div>

        <!-- Job Number & Part Name Inputs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
          <div class="flex flex-col gap-1">
            <label for="entry-job-number" class="text-label-caps font-label-caps text-on-surface-variant">Job / Work Order #</label>
            <input
              type="text"
              id="entry-job-number"
              name="jobNumber"
              value="${defaultPart.jobNumber}"
              required
              placeholder="e.g. PQR-301"
              class="w-full px-space-sm py-2.5 bg-surface-container text-on-surface text-body-md font-mono-data-md rounded border border-outline-variant/40 focus:outline-none focus:border-primary"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="entry-part-name" class="text-label-caps font-label-caps text-on-surface-variant">Component / Part Description</label>
            <input
              type="text"
              id="entry-part-name"
              name="partName"
              value="${defaultPart.partName}"
              required
              placeholder="e.g. Flange Rotor Coupling"
              class="w-full px-space-sm py-2.5 bg-surface-container text-on-surface text-body-md rounded border border-outline-variant/40 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </section>

      <!-- Field Group: Production Quantities & Live Steppers -->
      <section class="bg-surface-container-low rounded p-space-md shadow-sm space-y-space-md">
        <div class="flex items-center justify-between">
          <div class="text-label-caps font-label-caps text-on-surface-variant uppercase font-bold tracking-wider">3. Production Quantities</div>
          <span class="text-label-caps font-label-caps text-tertiary font-bold">ONE-HANDED STEPPERS</span>
        </div>

        <!-- 1. Target Quantity -->
        <div class="bg-surface-container p-space-sm rounded space-y-space-xs">
          <div class="flex items-center justify-between">
            <label for="entry-target" class="text-body-sm font-semibold text-on-surface">Target Quantity</label>
            <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Must be &gt; 0</span>
          </div>
          <div class="flex items-center gap-space-xs">
            <input
              type="number"
              id="entry-target"
              name="targetQty"
              min="1"
              step="1"
              value="${defaultPart.defaultTarget}"
              required
              class="flex-1 px-space-sm py-2.5 bg-surface-container-highest text-on-surface text-headline-sm font-mono-data-md font-bold rounded border border-outline-variant/40 focus:outline-none focus:border-primary text-center"
            />
            <div class="flex items-center gap-1 flex-shrink-0">
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-on-surface rounded font-mono-data-md font-bold" data-target="entry-target" data-delta="-50">-50</button>
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-on-surface rounded font-mono-data-md font-bold" data-target="entry-target" data-delta="-10">-10</button>
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-primary font-bold rounded font-mono-data-md" data-target="entry-target" data-delta="10">+10</button>
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-primary font-bold rounded font-mono-data-md" data-target="entry-target" data-delta="50">+50</button>
            </div>
          </div>
        </div>

        <!-- 2. Produced Quantity -->
        <div class="bg-surface-container p-space-sm rounded space-y-space-xs">
          <div class="flex items-center justify-between">
            <label for="entry-produced" class="text-body-sm font-semibold text-on-surface">Produced Quantity</label>
            <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Total Finished Output</span>
          </div>
          <div class="flex items-center gap-space-xs">
            <input
              type="number"
              id="entry-produced"
              name="producedQty"
              min="0"
              step="1"
              value="240"
              required
              class="flex-1 px-space-sm py-2.5 bg-surface-container-highest text-primary text-headline-sm font-mono-data-md font-bold rounded border border-outline-variant/40 focus:outline-none focus:border-primary text-center"
            />
            <div class="flex items-center gap-1 flex-shrink-0">
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-on-surface rounded font-mono-data-md font-bold" data-target="entry-produced" data-delta="-50">-50</button>
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-on-surface rounded font-mono-data-md font-bold" data-target="entry-produced" data-delta="-10">-10</button>
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-primary font-bold rounded font-mono-data-md" data-target="entry-produced" data-delta="10">+10</button>
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-primary font-bold rounded font-mono-data-md" data-target="entry-produced" data-delta="50">+50</button>
            </div>
          </div>
        </div>

        <!-- 3. Rejected Quantity -->
        <div class="bg-surface-container p-space-sm rounded space-y-space-xs">
          <div class="flex items-center justify-between">
            <label for="entry-rejected" class="text-body-sm font-semibold text-error">Rejected Quantity</label>
            <span class="text-label-caps font-label-caps text-on-surface-variant uppercase">Cannot exceed produced</span>
          </div>
          <div class="flex items-center gap-space-xs">
            <input
              type="number"
              id="entry-rejected"
              name="rejectedQty"
              min="0"
              step="1"
              value="38"
              required
              class="flex-1 px-space-sm py-2.5 bg-surface-container-highest text-error text-headline-sm font-mono-data-md font-bold rounded border border-outline-variant/40 focus:outline-none focus:border-error text-center"
            />
            <div class="flex items-center gap-1 flex-shrink-0">
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-on-surface rounded font-mono-data-md font-bold" data-target="entry-rejected" data-delta="-5">-5</button>
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-on-surface rounded font-mono-data-md font-bold" data-target="entry-rejected" data-delta="-1">-1</button>
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-error font-bold rounded font-mono-data-md" data-target="entry-rejected" data-delta="1">+1</button>
              <button type="button" class="btn-stepper min-h-touch-target-min min-w-[40px] px-2 py-1.5 bg-surface-container-high active:bg-surface-bright text-error font-bold rounded font-mono-data-md" data-target="entry-rejected" data-delta="5">+5</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Real-Time Calculated Metrics Display Card -->
      <section class="bg-surface-container-low rounded p-space-md shadow-md border border-outline-variant/40">
        <div class="flex items-center justify-between mb-space-xs">
          <div class="flex items-center gap-space-xs">
            <span class="w-2 h-2 bg-tertiary"></span>
            <span class="text-label-caps font-label-caps text-on-surface-variant uppercase font-bold">Live Entry Calculations</span>
          </div>
          <span id="live-status-badge" class="text-label-caps font-label-caps px-2 py-0.5 bg-error-container text-on-error-container font-bold rounded-none">
            HIGH REJECTION
          </span>
        </div>

        <div class="grid grid-cols-3 gap-2 text-center bg-surface-container-lowest rounded p-2.5 my-space-xs">
          <!-- Good Quantity -->
          <div class="flex flex-col bg-surface-container p-2 rounded">
            <span class="text-label-caps font-label-caps text-tertiary uppercase font-bold">Good Qty</span>
            <span id="live-good-qty" class="text-headline-md font-headline-md text-tertiary font-bold mt-0.5">202</span>
            <span class="text-[10px] text-on-surface-variant leading-tight">Produced - Rej</span>
          </div>

          <!-- Achievement % -->
          <div class="flex flex-col bg-surface-container p-2 rounded">
            <span class="text-label-caps font-label-caps text-on-surface-variant uppercase font-bold">Achievement</span>
            <span id="live-achievement-pct" class="text-headline-md font-headline-md text-on-surface font-bold mt-0.5">60.0%</span>
            <span id="live-achievement-tag" class="text-[10px] text-on-surface-variant leading-tight">of target</span>
          </div>

          <!-- Rejection Rate % -->
          <div class="flex flex-col bg-surface-container p-2 rounded" id="live-rejection-box">
            <span class="text-label-caps font-label-caps text-error uppercase font-bold">Rej Rate</span>
            <span id="live-rejection-pct" class="text-headline-md font-headline-md text-error font-bold mt-0.5">15.8%</span>
            <span class="text-[10px] text-error font-medium leading-tight">of produced</span>
          </div>
        </div>
      </section>

      <!-- Field Group: Downtime & Observations -->
      <section class="bg-surface-container-low rounded p-space-md shadow-sm space-y-space-sm">
        <div class="text-label-caps font-label-caps text-on-surface-variant uppercase font-bold tracking-wider">4. Operational Downtime & Notes</div>

        <!-- Downtime Minutes & Quick Chips -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <label for="entry-downtime" class="text-body-sm font-semibold text-on-surface">Downtime Minutes</label>
            <div class="flex items-center gap-1">
              <button type="button" class="btn-downtime-chip text-label-caps font-label-caps px-2 py-1 bg-surface-container active:bg-surface-bright text-on-surface rounded" data-minutes="0">0m</button>
              <button type="button" class="btn-downtime-chip text-label-caps font-label-caps px-2 py-1 bg-surface-container active:bg-surface-bright text-primary rounded" data-minutes="5">+5m</button>
              <button type="button" class="btn-downtime-chip text-label-caps font-label-caps px-2 py-1 bg-surface-container active:bg-surface-bright text-primary rounded" data-minutes="15">+15m</button>
              <button type="button" class="btn-downtime-chip text-label-caps font-label-caps px-2 py-1 bg-surface-container active:bg-surface-bright text-primary rounded" data-minutes="30">+30m</button>
            </div>
          </div>
          <input
            type="number"
            id="entry-downtime"
            name="downtimeMinutes"
            min="0"
            step="1"
            value="45"
            class="w-full px-space-sm py-2.5 bg-surface-container text-on-surface text-body-md font-mono-data-md rounded border border-outline-variant/40 focus:outline-none focus:border-primary"
          />
        </div>

        <!-- Downtime Reason -->
        <div class="flex flex-col gap-1">
          <label for="entry-downtime-reason" class="text-label-caps font-label-caps text-on-surface-variant">Primary Downtime Reason</label>
          <div class="relative">
            <select
              id="entry-downtime-reason"
              name="downtimeReason"
              class="w-full px-space-sm py-2.5 bg-surface-container text-on-surface text-body-md rounded border border-outline-variant/40 focus:outline-none focus:border-primary appearance-none"
            >
              ${DOWNTIME_REASONS.map((r) => `
                <option value="${r}" ${r === 'Tooling Wear' ? 'selected' : ''}>${r}</option>
              `).join('')}
            </select>
            <span class="material-symbols-outlined text-[18px] text-on-surface-variant absolute right-3 top-3 pointer-events-none">expand_more</span>
          </div>
        </div>

        <!-- Optional Notes -->
        <div class="flex flex-col gap-1">
          <label for="entry-notes" class="text-label-caps font-label-caps text-on-surface-variant">Supervisor Notes / Actions (Optional)</label>
          <textarea
            id="entry-notes"
            name="notes"
            rows="2"
            placeholder="e.g. Insert tip replaced at 11:30, offsets verified..."
            class="w-full px-space-sm py-2 bg-surface-container text-on-surface text-body-sm rounded border border-outline-variant/40 focus:outline-none focus:border-primary resize-none placeholder:text-outline"
          ></textarea>
        </div>
      </section>

      <!-- Live Validation Alert Box -->
      <div
        id="validation-alert-box"
        class="hidden items-center gap-space-xs p-space-sm bg-error-container/30 border border-error/50 rounded text-error text-body-sm font-semibold transition-all"
        role="alert"
      >
        <span class="material-symbols-outlined text-[20px] flex-shrink-0">error</span>
        <span id="validation-alert-text">Validation error</span>
      </div>

      <!-- Action Buttons: Submit & Reset -->
      <div class="flex flex-col gap-space-sm pt-space-xs">
        <button
          type="submit"
          id="entry-submit-btn"
          class="w-full flex items-center justify-center gap-space-sm py-3.5 px-space-md bg-primary-container active:bg-inverse-primary text-on-primary-container rounded font-body-md font-bold min-h-touch-target-min transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span class="material-symbols-outlined text-[22px]">check_circle</span>
          <span>Submit Shift Production Entry</span>
        </button>

        <button
          type="button"
          id="entry-reset-btn"
          class="w-full flex items-center justify-center gap-space-xs py-2.5 px-space-md bg-surface-container active:bg-surface-bright text-on-surface-variant hover:text-on-surface rounded font-body-sm font-semibold transition-colors"
        >
          <span class="material-symbols-outlined text-[18px]">restart_alt</span>
          <span>Reset Form Fields</span>
        </button>
      </div>
    </form>
  </div>
  `;
}

