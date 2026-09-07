/**
 * FactoryPulse V1 - Application Entry Point
 */
import { store } from './state.js';
import { FACTORY_INFO, COMMON_PARTS } from './data/demoData.js';
import { renderHeader } from './components/Header.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderToast } from './components/Toast.js';
import { renderHistoryView } from './views/HistoryView.js';
import { renderEntryView } from './views/EntryView.js';
import { renderDashboardView } from './views/DashboardView.js';
import { renderMachinesView } from './views/MachinesView.js';
import { renderMoreView } from './views/MoreView.js';
import { renderLoginView } from './views/LoginView.js';
import { verifySupabaseConnection } from './services/supabaseVerifier.js';
import { insertProductionEntry } from './services/productionService.js';
import { fetchLiveAppData, normalizeProductionEntry } from './services/dataService.js';
import { signIn, signOut, getExistingSession } from './services/authService.js';

// Expose diagnostic and action tools globally for console-based testing
window.verifySupabaseConnection = verifySupabaseConnection;
window.insertProductionEntry = insertProductionEntry;
window.setTab = (tab) => store.setActiveTab(tab);
window.signIn = (email, password) => signIn({ email, password });
window.signOut = handleLogout;
window.authService = { signIn, signOut, getExistingSession };

function renderCurrentView(state) {
  switch (state.activeTab) {
    case 'dashboard':
      return renderDashboardView(state);
    case 'entry':
      return renderEntryView(state);
    case 'machines':
      return renderMachinesView(state);
    case 'more':
      return renderMoreView(state);
    case 'history':
    default:
      return renderHistoryView(state);
  }
}

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const state = store.getState();

  // 1. Initial startup loading state
  if (!state.authChecked && state.isLoading) {
    appContainer.innerHTML = `
      <div class="min-h-screen flex flex-col justify-center items-center px-space-md bg-surface text-on-surface">
        <span class="material-symbols-outlined text-[40px] text-primary animate-spin mb-3">sync</span>
        <div class="text-headline-sm font-bold">Connecting to FactoryPulse...</div>
        <div class="text-label-caps font-label-caps text-on-surface-variant uppercase mt-1">Verifying Secure Session</div>
      </div>
    `;
    return;
  }

  // 2. Unauthenticated state: Render ONLY the Login screen (do not expose app data)
  if (!state.session) {
    appContainer.innerHTML = `
      ${renderLoginView(state)}
      ${renderToast(state.toast)}
    `;
    attachLoginListeners();
    return;
  }

  // 3. Role Guard: Owner cannot view supervisor production entry form
  if (state.role === 'OWNER' && state.activeTab === 'entry') {
    store.setActiveTab('dashboard');
    return;
  }

  // 4. Authenticated Application Shell
  appContainer.innerHTML = `
    ${renderHeader(state)}
    <main class="flex flex-col relative w-full pt-24 pb-28 px-space-md bg-surface min-h-screen">
      ${renderCurrentView(state)}
      ${renderToast(state.toast)}
    </main>
    ${renderBottomNav(state.activeTab, state.role)}
  `;

  attachEventListeners();
}

function attachEventListeners() {
  const state = store.getState();

  // Navigation tab clicks
  document.querySelectorAll('.nav-tab-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const targetTab = btn.getAttribute('data-tab');
      if (targetTab && targetTab !== state.activeTab) {
        if (state.role === 'OWNER' && targetTab === 'entry') {
          store.showToast('Access Restricted', 'Production Entry is restricted to shop-floor supervisors.');
          return;
        }
        store.setActiveTab(targetTab);
      }
    });
  });

  // Header and Settings Logout buttons
  const headerLogoutBtn = document.getElementById('header-logout-btn');
  if (headerLogoutBtn) {
    headerLogoutBtn.addEventListener('click', handleLogout);
  }

  const settingsLogoutBtn = document.getElementById('settings-logout-btn');
  if (settingsLogoutBtn) {
    settingsLogoutBtn.addEventListener('click', handleLogout);
  }

  // Search input
  const searchInput = document.getElementById('log-search-input');
  if (searchInput) {
    // Restore cursor position if needed
    searchInput.addEventListener('input', (e) => {
      store.setSearchQuery(e.target.value);
      // Keep focus on input after store re-render
      setTimeout(() => {
        const updatedInput = document.getElementById('log-search-input');
        if (updatedInput) {
          updatedInput.focus();
          const valLen = updatedInput.value.length;
          updatedInput.setSelectionRange(valLen, valLen);
        }
      }, 0);
    });
  }

  // Clear search button
  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      store.setSearchQuery('');
      const updatedInput = document.getElementById('log-search-input');
      if (updatedInput) updatedInput.focus();
    });
  }

  // Export CSV button
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      store.showToast('Report Exported', 'Shift-A_05Sep2026_Report.csv generated');
    });
  }

  // Shift Sign-off button
  const signoffBtn = document.getElementById('signoff-btn');
  if (signoffBtn) {
    signoffBtn.addEventListener('click', () => {
      store.showToast('Shift Sign-off Complete', 'Batch verified by Supervisor S. Jadhav');
    });
  }

  // Close toast button
  const closeToastBtn = document.getElementById('close-toast-btn');
  if (closeToastBtn) {
    closeToastBtn.addEventListener('click', () => {
      store.hideToast();
    });
  }

  // Production Entry Form Event Handlers
  attachEntryFormListeners();
}

function attachEntryFormListeners() {
  const form = document.getElementById('production-entry-form');
  if (!form) return;

  const entryTarget = document.getElementById('entry-target');
  const entryProduced = document.getElementById('entry-produced');
  const entryRejected = document.getElementById('entry-rejected');
  const entryDowntime = document.getElementById('entry-downtime');
  const entryDowntimeReason = document.getElementById('entry-downtime-reason');
  const entryJobNumber = document.getElementById('entry-job-number');
  const entryPartName = document.getElementById('entry-part-name');
  const entryMachine = document.getElementById('entry-machine');
  const entryShift = document.getElementById('entry-shift');
  const entryNotes = document.getElementById('entry-notes');
  const entryPresetPart = document.getElementById('entry-preset-part');

  const liveGoodQty = document.getElementById('live-good-qty');
  const liveAchievementPct = document.getElementById('live-achievement-pct');
  const liveAchievementTag = document.getElementById('live-achievement-tag');
  const liveRejectionPct = document.getElementById('live-rejection-pct');
  const liveStatusBadge = document.getElementById('live-status-badge');
  const validationAlertBox = document.getElementById('validation-alert-box');
  const validationAlertText = document.getElementById('validation-alert-text');
  const submitBtn = document.getElementById('entry-submit-btn');
  const resetBtn = document.getElementById('entry-reset-btn');

  function calculateAndValidate() {
    const targetVal = parseFloat(entryTarget.value);
    const producedVal = parseFloat(entryProduced.value);
    const rejectedVal = parseFloat(entryRejected.value);
    const downtimeVal = parseFloat(entryDowntime.value);

    let errorMsg = '';

    if (isNaN(targetVal) || entryTarget.value.trim() === '') {
      errorMsg = 'Target Quantity is required.';
    } else if (targetVal <= 0) {
      errorMsg = 'Target Quantity must be greater than 0.';
    } else if (isNaN(producedVal) || entryProduced.value.trim() === '') {
      errorMsg = 'Produced Quantity is required.';
    } else if (producedVal < 0) {
      errorMsg = 'Produced Quantity cannot be negative.';
    } else if (isNaN(rejectedVal) || entryRejected.value.trim() === '') {
      errorMsg = 'Rejected Quantity is required.';
    } else if (rejectedVal < 0) {
      errorMsg = 'Rejected Quantity cannot be negative.';
    } else if (rejectedVal > producedVal) {
      errorMsg = `Rejected Quantity (${rejectedVal}) cannot exceed Produced Quantity (${producedVal}).`;
    } else if (isNaN(downtimeVal) || entryDowntime.value.trim() === '') {
      errorMsg = 'Downtime Minutes is required.';
    } else if (downtimeVal < 0) {
      errorMsg = 'Downtime Minutes cannot be negative.';
    } else if (!entryJobNumber.value.trim()) {
      errorMsg = 'Job / Work Order # is required.';
    } else if (!entryPartName.value.trim()) {
      errorMsg = 'Component / Part Description is required.';
    }

    // Live Calculations
    const goodQty = !isNaN(producedVal) && !isNaN(rejectedVal) ? producedVal - rejectedVal : 0;
    const achievementPct = !isNaN(producedVal) && !isNaN(targetVal) && targetVal > 0
      ? ((producedVal / targetVal) * 100).toFixed(1)
      : '0.0';
    const rejectionRatePct = !isNaN(producedVal) && !isNaN(rejectedVal) && producedVal > 0
      ? ((rejectedVal / producedVal) * 100).toFixed(1)
      : '0.0';

    const numRejRate = parseFloat(rejectionRatePct);
    const isCritical = numRejRate > 5.0;

    // Update DOM Metrics
    if (liveGoodQty) {
      liveGoodQty.textContent = isNaN(goodQty) ? '-' : goodQty.toLocaleString();
      liveGoodQty.className = goodQty < 0
        ? 'text-headline-md font-headline-md text-error font-bold mt-0.5'
        : 'text-headline-md font-headline-md text-tertiary font-bold mt-0.5';
    }

    if (liveAchievementPct) {
      liveAchievementPct.textContent = `${achievementPct}%`;
      const numAch = parseFloat(achievementPct);
      if (numAch >= 90.0) {
        liveAchievementPct.className = 'text-headline-md font-headline-md text-tertiary font-bold mt-0.5';
        if (liveAchievementTag) {
          liveAchievementTag.textContent = '▲ on target';
          liveAchievementTag.className = 'text-[10px] text-tertiary font-medium leading-tight';
        }
      } else {
        liveAchievementPct.className = 'text-headline-md font-headline-md text-on-surface font-bold mt-0.5';
        if (liveAchievementTag) {
          liveAchievementTag.textContent = 'below target';
          liveAchievementTag.className = 'text-[10px] text-on-surface-variant leading-tight';
        }
      }
    }

    if (liveRejectionPct) {
      liveRejectionPct.textContent = `${rejectionRatePct}%`;
      liveRejectionPct.className = isCritical
        ? 'text-headline-md font-headline-md text-error font-bold mt-0.5'
        : 'text-headline-md font-headline-md text-tertiary font-bold mt-0.5';
    }

    if (liveStatusBadge) {
      if (isCritical) {
        liveStatusBadge.className = 'text-label-caps font-label-caps px-2 py-0.5 bg-error-container text-on-error-container font-bold rounded-none';
        liveStatusBadge.textContent = 'HIGH REJECTION';
      } else {
        liveStatusBadge.className = 'text-label-caps font-label-caps px-2 py-0.5 bg-tertiary-container/40 text-tertiary font-bold rounded-none';
        liveStatusBadge.textContent = 'NORMAL';
      }
    }

    // Validation Alert Box & Submit Button
    if (validationAlertBox && validationAlertText) {
      if (errorMsg) {
        validationAlertBox.classList.remove('hidden');
        validationAlertBox.classList.add('flex');
        validationAlertText.textContent = errorMsg;
        if (submitBtn) submitBtn.disabled = true;
      } else {
        validationAlertBox.classList.add('hidden');
        validationAlertBox.classList.remove('flex');
        validationAlertText.textContent = '';
        if (submitBtn) submitBtn.disabled = false;
      }
    }

    return !errorMsg;
  }

  // Bind input listeners
  [entryTarget, entryProduced, entryRejected, entryDowntime, entryJobNumber, entryPartName].forEach((input) => {
    if (input) {
      input.addEventListener('input', calculateAndValidate);
      input.addEventListener('change', calculateAndValidate);
    }
  });

  // Steppers
  form.querySelectorAll('.btn-stepper').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const delta = parseInt(btn.getAttribute('data-delta'), 10) || 0;
      const inputEl = document.getElementById(targetId);
      if (!inputEl) return;
      const current = parseFloat(inputEl.value) || 0;
      const min = parseFloat(inputEl.min) || 0;
      inputEl.value = Math.max(min, current + delta);
      calculateAndValidate();
    });
  });

  // Downtime quick chips
  form.querySelectorAll('.btn-downtime-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mins = parseInt(btn.getAttribute('data-minutes'), 10) || 0;
      if (mins === 0) {
        entryDowntime.value = 0;
      } else {
        const current = parseFloat(entryDowntime.value) || 0;
        entryDowntime.value = current + mins;
      }
      calculateAndValidate();
    });
  });

  // Preset part auto-fill
  if (entryPresetPart) {
    entryPresetPart.addEventListener('change', () => {
      const idx = parseInt(entryPresetPart.value, 10);
      const part = COMMON_PARTS[idx];
      if (part) {
        if (entryJobNumber) entryJobNumber.value = part.jobNumber;
        if (entryPartName) entryPartName.value = part.partName;
        if (entryTarget) entryTarget.value = part.defaultTarget;
        calculateAndValidate();
      }
    });
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const defaultPart = COMMON_PARTS[0];
      if (entryMachine) entryMachine.selectedIndex = 0;
      if (entryShift) entryShift.value = 'Shift A';
      if (entryPresetPart) entryPresetPart.selectedIndex = 0;
      if (entryJobNumber) entryJobNumber.value = defaultPart.jobNumber;
      if (entryPartName) entryPartName.value = defaultPart.partName;
      if (entryTarget) entryTarget.value = defaultPart.defaultTarget;
      if (entryProduced) entryProduced.value = '0';
      if (entryRejected) entryRejected.value = '0';
      if (entryDowntime) entryDowntime.value = '0';
      if (entryDowntimeReason) entryDowntimeReason.selectedIndex = 0;
      if (entryNotes) entryNotes.value = '';
      calculateAndValidate();
    });
  }

  // Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isValid = calculateAndValidate();
    if (!isValid) return;

    const targetVal = parseFloat(entryTarget.value);
    const producedVal = parseFloat(entryProduced.value);
    const rejectedVal = parseFloat(entryRejected.value);
    const downtimeVal = parseFloat(entryDowntime.value);
    const machineIdVal = entryMachine.value;
    const selectedOpt = entryMachine.options[entryMachine.selectedIndex];
    const machineType = selectedOpt ? selectedOpt.getAttribute('data-type') || 'CNC Unit' : 'CNC Unit';
    const shiftVal = entryShift.value;
    const jobNumVal = entryJobNumber.value.trim();
    const partNameVal = entryPartName.value.trim();
    const downtimeReasonVal = entryDowntimeReason.value;
    const notesVal = entryNotes.value.trim();

    const goodQty = producedVal - rejectedVal;
    const achievementPct = targetVal > 0 ? parseFloat(((producedVal / targetVal) * 100).toFixed(1)) : 0;
    const rejectionRatePct = producedVal > 0 ? parseFloat(((rejectedVal / producedVal) * 100).toFixed(1)) : 0;
    const isCritical = rejectionRatePct > 5.0;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} IST`;

    // Disable submit button while saving
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="material-symbols-outlined text-[20px] animate-spin">sync</span><span>Saving to Database...</span>`;
    }

    try {
      const entryPayload = {
        date: FACTORY_INFO.demoDate,
        shift: shiftVal,
        machineId: machineIdVal,
        jobNumber: jobNumVal,
        partName: partNameVal,
        targetQty: targetVal,
        producedQty: producedVal,
        rejectedQty: rejectedVal,
        downtimeMinutes: downtimeVal,
        downtimeReason: downtimeReasonVal,
        notes: notesVal,
      };

      const result = await insertProductionEntry(entryPayload);

      if (!result.success) {
        throw result.error || new Error('Database insert failed');
      }

      const dbRow = result.data;
      const state = store.getState();
      const machineMap = new Map();
      (state.machines || []).forEach((m) => {
        machineMap.set(m.id, m);
        if (m.machine_code) machineMap.set(m.machine_code, m);
      });

      const newRecord = normalizeProductionEntry(dbRow, machineMap);

      // Update in-memory state so newly created record is immediately available
      store.addRecord(newRecord);

      // Show existing success toast
      store.showToast('Production Log Saved', `${newRecord.machineId} • Job ${newRecord.jobNumber} saved to database`);

      // Reset entry inputs for next submission while keeping supervisor on entry view
      if (entryProduced) entryProduced.value = '0';
      if (entryRejected) entryRejected.value = '0';
      if (entryDowntime) entryDowntime.value = '0';
      if (entryNotes) entryNotes.value = '';
      calculateAndValidate();

    } catch (err) {
      console.error('[FactoryPulse] Supabase INSERT error details:', err);
      // Keep form values intact and display clear error message
      if (validationAlertBox && validationAlertText) {
        validationAlertBox.classList.remove('hidden');
        validationAlertBox.classList.add('flex');
        validationAlertText.textContent = `Database Error: ${err.message || 'Failed to save production record to Supabase.'}`;
      }
      store.showToast('Database Error', 'Could not save record to database');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span class="material-symbols-outlined text-[20px]">save</span><span>Save Production Log</span>`;
      }
    }
  });

  // Run initial calculation & validation pass on mount
  calculateAndValidate();
}

/**
 * Attaches event listeners for the Login screen (Phase 4F).
 */
function attachLoginListeners() {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const togglePassBtn = document.getElementById('toggle-password-visibility-btn');
  const passIcon = document.getElementById('password-visibility-icon');
  const quickFillBtns = document.querySelectorAll('.btn-demo-quickfill');
  const closeToastBtn = document.getElementById('close-toast-btn');

  if (closeToastBtn) {
    closeToastBtn.addEventListener('click', () => {
      store.hideToast();
    });
  }

  // Toggle password visibility
  if (togglePassBtn && passwordInput && passIcon) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      passIcon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  }

  // Demo account quick-fill buttons
  quickFillBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email');
      if (email && emailInput) {
        emailInput.value = email;
        if (passwordInput) {
          passwordInput.focus();
        }
      }
    });
  });

  // Form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!email || !password) {
        store.setAuthError('Please enter both corporate email and password.');
        return;
      }

      store.setLoading(true);
      store.setAuthError(null);

      const result = await signIn({ email, password });

      if (!result.success) {
        store.setAuthError(result.error);
        return;
      }

      // Successful login
      store.setAuth(result);
      store.setActiveTab('dashboard');
      store.showToast(
        'Access Granted',
        `Authenticated as ${result.role} (${result.user.email})`
      );

      // Hydrate live data for user's assigned factory
      await loadLiveSupabaseData(result.factoryId);
    });
  }
}

/**
 * Handles user sign out across the application (Phase 4F).
 */
export async function handleLogout() {
  store.setLoading(true);
  try {
    await signOut();
  } catch (err) {
    console.error('[FactoryPulse] Logout error:', err);
  } finally {
    store.clearAuth();
    store.setActiveTab('dashboard');
    store.showToast('Signed Out', 'You have been safely disconnected from FactoryPulse.');
  }
}

// Subscribe to store updates
store.subscribe(() => {
  renderApp();
});

/**
 * Loads live data from Supabase and hydrates the store.
 */
export async function loadLiveSupabaseData(targetFactoryId = null) {
  const state = store.getState();
  if (!state.session) {
    console.log('[FactoryPulse] Skipping data load: No active user session.');
    return;
  }

  const factoryId = targetFactoryId || state.factoryId;
  store.setLoading(true);
  try {
    const result = await fetchLiveAppData(factoryId);
    if (result.success) {
      store.setLiveState({
        factory: result.factory,
        machines: result.machines,
        records: result.records,
      });
      console.log(`[FactoryPulse] Hydrated state with ${result.records.length} live records and ${result.machines.length} machines from Supabase.`);
    } else {
      console.error('[FactoryPulse] Failed to load live Supabase data:', result.error);
      store.setLoadError(result.error?.message || 'Failed to load live data from Supabase');
    }
  } catch (err) {
    console.error('[FactoryPulse] Exception loading live Supabase data:', err);
    store.setLoadError(err.message || 'Database communication error');
  }
}

window.reloadLiveSupabaseData = loadLiveSupabaseData;

// Initial boot
let booted = false;
async function safeBoot() {
  if (booted) return;
  booted = true;

  store.setLoading(true);
  renderApp();

  try {
    // Check for an existing authenticated session (Phase 4F)
    const existingSession = await getExistingSession();
    if (existingSession) {
      console.log(`[FactoryPulse Auth] Restored existing session for ${existingSession.user.email} (${existingSession.role})`);
      store.setAuth(existingSession);

      if (existingSession.role === 'OWNER' && store.getState().activeTab === 'entry') {
        store.setActiveTab('dashboard');
      }

      await loadLiveSupabaseData(existingSession.factoryId);
    } else {
      console.log('[FactoryPulse Auth] No active session found. Presenting Login screen.');
      store.clearAuth();
    }
  } catch (err) {
    console.error('[FactoryPulse Auth] Error during boot session check:', err);
    store.clearAuth();
  } finally {
    store.setLoading(false);
  }

  // Phase 3B-1: Run isolated read-only Supabase verification diagnostics (in console)
  if (typeof verifySupabaseConnection === 'function') {
    verifySupabaseConnection().catch((err) => {
      console.error('[FactoryPulse Supabase] Verification call error:', err);
    });
  }
}

document.addEventListener('DOMContentLoaded', safeBoot);

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  safeBoot();
}
